from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.recommendation import RecommendationResponse
from app.services.recommendation_service import get_user_recommendations
from app.middlewares.auth_middleware import get_current_user

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("", response_model=RecommendationResponse)
@router.get("/", response_model=RecommendationResponse)
async def get_recommendations(current_user: dict = Depends(get_current_user)):
    """
    Get personalized smart placement recommendations with 'WHY THIS' justifications.
    """
    try:
        user_id = current_user.get("id", "default-user")
        return await get_user_recommendations(user_id=user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to generate recommendations: {str(e)}",
        )
