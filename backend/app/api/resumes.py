from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from app.middlewares.auth_middleware import get_current_user
from app.schemas.resume import (
    ResumeData,
    ResumeCreateRequest,
    ResumeUpdateRequest,
    ResumeSummary,
    ResumeDashboardResponse,
    ResumeImproveRequest,
    ResumeImproveResponse,
    ATSAnalysisResponse,
    JobMatchRequest,
    JobMatchResponse,
    DefendInitResponse,
    DefendAnswerRequest,
    DefendAnswerResponse,
)
from app.services.resume_service import (
    create_resume,
    get_user_resumes,
    get_resume_by_id,
    update_resume,
    delete_resume,
    duplicate_resume,
    get_dashboard_data,
    import_resume_file,
)
from app.services.ai_service import improve_resume_text
from app.services.ats_service import analyze_resume_ats
from app.services.job_match_service import analyze_job_match
from app.services.defend_service import initialize_defend_session, evaluate_defend_answer

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post("/import", response_model=ResumeData, status_code=status.HTTP_201_CREATED)
async def import_existing_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file selected for upload",
        )

    content = await file.read()
    if not content or len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty",
        )

    return await import_resume_file(user_id, content, file.filename)


@router.post("", response_model=ResumeData, status_code=status.HTTP_201_CREATED)
async def create_new_resume(
    request: ResumeCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    if not request.name or not request.name.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Resume name is required",
        )
    if not request.target_role or not request.target_role.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Target role is required",
        )
    return await create_resume(user_id, request)


@router.get("", response_model=List[ResumeSummary])
async def list_resumes(
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    return await get_user_resumes(user_id)


@router.get("/dashboard", response_model=ResumeDashboardResponse)
async def get_dashboard(
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    return await get_dashboard_data(user_id)


@router.get("/{resume_id}", response_model=ResumeData)
async def get_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    resume = await get_resume_by_id(resume_id, user_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied",
        )
    return resume


@router.put("/{resume_id}", response_model=ResumeData)
async def update_existing_resume(
    resume_id: str,
    request: ResumeUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    updated = await update_resume(resume_id, user_id, request)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied",
        )
    return updated


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    deleted = await delete_resume(resume_id, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied",
        )
    return None


@router.post("/{resume_id}/duplicate", response_model=ResumeData, status_code=status.HTTP_201_CREATED)
async def duplicate_existing_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    duplicated = await duplicate_resume(resume_id, user_id)
    if not duplicated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied",
        )
    return duplicated


@router.post("/{resume_id}/improve", response_model=ResumeImproveResponse)
async def improve_resume_content(
    resume_id: str,
    request: ResumeImproveRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    resume = await get_resume_by_id(resume_id, user_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied",
        )

    if not request.original_text or not request.original_text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Original text cannot be empty",
        )

    valid_sections = ["summary", "experience_bullet", "project_description", "achievement", "skills", "technical_skills", "general"]
    if request.section and request.section.lower() not in valid_sections:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid section '{request.section}'. Allowed sections: {', '.join(valid_sections)}",
        )

    try:
        return await improve_resume_text(request, target_role=resume.target_role)
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI improvement service encountered an error. Please try again.",
        )


@router.post("/{resume_id}/ats-analysis", response_model=ATSAnalysisResponse)
async def get_ats_analysis(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    # Security check: User ownership
    resume = await get_resume_by_id(resume_id, user_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied",
        )

    return analyze_resume_ats(resume)


@router.post("/{resume_id}/job-match", response_model=JobMatchResponse)
async def match_job_description(
    resume_id: str,
    request: JobMatchRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    # Security check: User ownership (returns 404 for non-existent or unowned resumes)
    resume = await get_resume_by_id(resume_id, user_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied",
        )

    if not request.job_description or not request.job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Job description cannot be empty or whitespace-only",
        )

    if len(request.job_description) > 20000:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Job description exceeds maximum allowable length of 20,000 characters",
        )

    return analyze_job_match(
        resume,
        request.job_description,
        job_title=request.job_title,
        company_name=request.company_name,
    )


@router.post("/{resume_id}/defend/init", response_model=DefendInitResponse)
async def init_defend_session(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    resume = await get_resume_by_id(resume_id, user_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied",
        )
    return initialize_defend_session(resume)


@router.post("/{resume_id}/defend/answer", response_model=DefendAnswerResponse)
async def submit_defend_answer(
    resume_id: str,
    request: DefendAnswerRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    resume = await get_resume_by_id(resume_id, user_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied",
        )

    if not request.user_answer or not request.user_answer.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="User answer cannot be empty",
        )

    return evaluate_defend_answer(resume_id, request)
