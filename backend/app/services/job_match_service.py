import re
from datetime import datetime, timezone
from typing import List, Dict, Set, Tuple, Any
from app.schemas.resume import (
    ResumeData,
    JobMatchResponse,
    JobMatchCategories,
    JobMatchRecommendation,
)

# Canonical technology mapping (lowercased key -> standard display name)
SKILL_DICTIONARY: Dict[str, str] = {
    "react": "React",
    "react.js": "React",
    "reactjs": "React",
    "node": "Node.js",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "rest api": "REST API",
    "restful api": "REST API",
    "rest apis": "REST API",
    "python": "Python",
    "java": "Java",
    "c++": "C++",
    "c#": "C#",
    "sql": "SQL",
    "mongodb": "MongoDB",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "aws": "AWS",
    "docker": "Docker",
    "git": "Git",
    "express": "Express.js",
    "express.js": "Express.js",
    "tailwind": "TailwindCSS",
    "tailwindcss": "TailwindCSS",
    "tailwind css": "TailwindCSS",
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "html": "HTML",
    "html5": "HTML",
    "css": "CSS",
    "css3": "CSS",
    "graphql": "GraphQL",
    "kubernetes": "Kubernetes",
    "k8s": "Kubernetes",
    "ci/cd": "CI/CD",
    "cicd": "CI/CD",
    "redis": "Redis",
    "fastapi": "FastAPI",
    "django": "Django",
    "flask": "Flask",
    "vue": "Vue.js",
    "vue.js": "Vue.js",
    "angular": "Angular",
    "spring": "Spring Boot",
    "spring boot": "Spring Boot",
    "microservices": "Microservices",
    "redux": "Redux",
    "unit testing": "Unit Testing",
    "vitest": "Vitest",
    "jest": "Jest",
}

# Stop words to ignore during keyword extraction
STOP_WORDS = {
    "and", "the", "with", "for", "in", "on", "a", "an", "to", "of", "is", "or", "at",
    "by", "as", "from", "be", "are", "was", "were", "this", "that", "it", "an", "we",
    "you", "your", "our", "us", "role", "job", "description", "candidate", "must",
    "have", "work", "team", "experience", "years", "strong", "good", "ability", "ability",
    "building", "seeking", "looking", "responsibilities", "requirements", "preferred",
    "knowledge", "understanding", "will", "should", "plus", "bonus", "skills"
}


def normalize_text(text: str) -> str:
    """Case insensitive normalization while preserving key technical symbols (+, #, ., /, -)."""
    if not text:
        return ""
    text_lower = text.lower()
    return re.sub(r'\s+', ' ', text_lower).strip()


def extract_skills_from_text(text: str) -> Set[str]:
    """Detect skills explicitly present in text matching canonical dictionary."""
    normalized = normalize_text(text)
    detected: Set[str] = set()

    sorted_keys = sorted(SKILL_DICTIONARY.keys(), key=lambda k: len(k), reverse=True)

    for key in sorted_keys:
        escaped_key = re.escape(key)
        pattern = r'(?:\b|_)' + escaped_key + r'(?:\b|_)'
        if re.search(pattern, normalized):
            detected.add(SKILL_DICTIONARY[key])

    return detected


def extract_keywords_from_jd(jd_text: str) -> Set[str]:
    """Extract meaningful job description terms (technical skills, tools, domain terms)."""
    normalized = normalize_text(jd_text)
    words = re.findall(r'\b[a-zA-Z0-9+#\.\/]+\b', normalized)
    keywords: Set[str] = set()

    for word in words:
        if len(word) >= 2 and word not in STOP_WORDS and not word.isdigit():
            keywords.add(word)

    skills = extract_skills_from_text(jd_text)
    for skill in skills:
        keywords.add(skill.lower())

    return keywords


def extract_resume_full_text(resume: ResumeData) -> str:
    """Compile all fields of the resume into a single searchable text string."""
    parts = []
    if resume.target_role:
        parts.append(resume.target_role)
    if resume.summary:
        parts.append(resume.summary)

    p_info = resume.personal_info
    if p_info:
        for v in [p_info.full_name, p_info.location, p_info.linkedin, p_info.github, p_info.portfolio]:
            if v:
                parts.append(v)

    for exp in resume.experience:
        parts.append(exp.role)
        parts.append(exp.company)
        parts.append(exp.description)
        parts.extend(exp.bullets)

    for proj in resume.projects:
        parts.append(proj.name)
        parts.append(proj.description)
        parts.extend(proj.technologies)
        parts.extend(proj.bullets)

    for cat in resume.skills:
        parts.append(cat.category)
        parts.extend(cat.skills)

    for edu in resume.education:
        parts.append(edu.institution)
        parts.append(edu.degree)
        parts.append(edu.field_of_study)
        parts.append(edu.description)

    for cert in resume.certifications:
        parts.append(cert.name)
        parts.append(cert.issuer)

    for ach in resume.achievements:
        parts.append(ach.title)
        parts.append(ach.description)

    return " ".join(parts)


def analyze_job_match(
    resume: ResumeData,
    job_description: str,
    job_title: str | None = None,
    company_name: str | None = None,
) -> JobMatchResponse:
    """
    Deterministic Job Description Matching Engine (0-100 score).
    Weighted Categories:
    - Skills Match: 35
    - Keyword Match: 25
    - Experience / Role Alignment: 20
    - Project / Domain Alignment: 10
    - Education / Certification Alignment: 10
    Total = 100
    """
    jd_clean = normalize_text(job_description)
    resume_full_text = extract_resume_full_text(resume)
    resume_clean = normalize_text(resume_full_text)

    # ------------------------------------------------------------------------
    # 1. SKILLS MATCH (0-35 points)
    # ------------------------------------------------------------------------
    jd_skills = extract_skills_from_text(job_description)
    resume_skills = extract_skills_from_text(resume_full_text)

    matched_skills_set = jd_skills.intersection(resume_skills)
    missing_skills_set = jd_skills.difference(matched_skills_set)

    matched_skills = sorted(list(matched_skills_set))
    missing_skills = sorted(list(missing_skills_set))

    if len(jd_skills) > 0:
        skills_ratio = len(matched_skills) / len(jd_skills)
        skills_score = round(skills_ratio * 35)
    else:
        skills_score = 25

    skills_score = max(0, min(35, skills_score))

    # ------------------------------------------------------------------------
    # 2. KEYWORD MATCH (0-25 points)
    # ------------------------------------------------------------------------
    jd_keywords = extract_keywords_from_jd(job_description)
    matched_keywords_set: Set[str] = set()

    for kw in jd_keywords:
        pattern = r'(?:\b|_)' + re.escape(kw) + r'(?:\b|_)'
        if re.search(pattern, resume_clean):
            matched_keywords_set.add(kw)

    missing_keywords_set = jd_keywords.difference(matched_keywords_set)

    matched_keywords = sorted(list(matched_keywords_set))[:15]
    missing_keywords = sorted(list(missing_keywords_set))[:15]

    if len(jd_keywords) > 0:
        kw_ratio = len(matched_keywords_set) / len(jd_keywords)
        keyword_score = round(kw_ratio * 25)
    else:
        keyword_score = 15

    keyword_score = max(0, min(25, keyword_score))

    # ------------------------------------------------------------------------
    # 3. EXPERIENCE / ROLE ALIGNMENT (0-20 points)
    # ------------------------------------------------------------------------
    exp_score = 10
    target_role_clean = normalize_text(resume.target_role)

    role_terms = ["frontend", "backend", "fullstack", "full stack", "software engineer", "developer", "data scientist", "web developer", "intern"]
    matching_role_term = False
    for term in role_terms:
        if term in jd_clean:
            if term in target_role_clean or term in resume_clean:
                matching_role_term = True
                break

    if matching_role_term:
        exp_score += 5

    if resume.experience and len(resume.experience) > 0:
        exp_score += 5
    elif resume.summary and len(resume.summary) > 40:
        exp_score += 3

    exp_score = max(0, min(20, exp_score))

    if matching_role_term:
        experience_alignment_note = f"Your target role '{resume.target_role}' and experience demonstrate alignment with the position."
    elif resume.experience and len(resume.experience) > 0:
        experience_alignment_note = f"Your experience demonstrates technical contributions, though explicit alignment for '{job_title or 'this role'}' can be highlighted further."
    else:
        experience_alignment_note = "Your resume has limited evidence of explicit work experience alignment for this role."

    # ------------------------------------------------------------------------
    # 4. PROJECT / DOMAIN ALIGNMENT (0-10 points)
    # ------------------------------------------------------------------------
    project_score = 4
    relevant_projects: List[str] = []

    if resume.projects and len(resume.projects) > 0:
        project_skills_count = 0
        for proj in resume.projects:
            proj_text = f"{proj.name} {proj.description} {' '.join(proj.technologies)} {' '.join(proj.bullets)}"
            proj_detected = extract_skills_from_text(proj_text)
            if proj_detected.intersection(jd_skills) or any(kw in normalize_text(proj_text) for kw in jd_keywords if len(kw) > 4):
                project_skills_count += 1
                if proj.name:
                    relevant_projects.append(proj.name)

        if project_skills_count > 0:
            project_score += 6
        else:
            project_score += 3
    elif len(resume.experience) > 0:
        project_score += 4

    project_score = max(0, min(10, project_score))

    if relevant_projects:
        project_relevance_note = f"Relevant projects found in resume: {', '.join(relevant_projects[:3])}."
    elif resume.projects and len(resume.projects) > 0:
        project_relevance_note = "Projects are present in your resume, but tech stack alignment with this specific job description is partial."
    else:
        project_relevance_note = "No specific projects matching the target job tech stack were found in your resume."

    # ------------------------------------------------------------------------
    # 5. EDUCATION / CERTIFICATION ALIGNMENT (0-10 points)
    # ------------------------------------------------------------------------
    edu_score = 6
    degree_keywords = ["bachelor", "master", "degree", "computer science", "b.tech", "b.e", "m.tech", "bs", "ms"]
    jd_requires_degree = any(dk in jd_clean for dk in degree_keywords)

    if resume.education and len(resume.education) > 0:
        edu_score += 3
        if jd_requires_degree:
            edu_score += 1

    cert_keywords = ["certified", "certification", "aws certified", "pmp", "scrum"]
    jd_requires_cert = any(ck in jd_clean for ck in cert_keywords)
    if resume.certifications and len(resume.certifications) > 0:
        if jd_requires_cert:
            edu_score += 1

    edu_score = max(0, min(10, edu_score))

    if resume.education and len(resume.education) > 0:
        if jd_requires_degree:
            education_certification_note = "Bachelor's degree or educational requirement is supported by your resume."
        else:
            education_certification_note = "Education history is included in your resume."
    else:
        education_certification_note = "Education details were not found in the resume."

    if jd_requires_cert:
        if resume.certifications and len(resume.certifications) > 0:
            education_certification_note += " Relevant certifications are present."
        else:
            education_certification_note += " Relevant certification was not found in the resume."

    # ------------------------------------------------------------------------
    # OVERALL MATCH SCORE & STRENGTHS / GAPS / RECOMMENDATIONS
    # ------------------------------------------------------------------------
    overall_score = skills_score + keyword_score + exp_score + project_score + edu_score
    overall_score = max(0, min(100, overall_score))

    strengths: List[str] = []
    gaps: List[str] = []
    recommendations: List[JobMatchRecommendation] = []

    if len(matched_skills) > 0:
        strengths.append(f"Explicit skill matches found: {', '.join(matched_skills[:4])}")
    if matching_role_term:
        strengths.append(f"Resume target role '{resume.target_role}' aligns well with the job description")
    if project_score >= 8:
        strengths.append("Projects demonstrate relevant hands-on technology stack alignment")
    if len(matched_keywords) >= 5:
        strengths.append("High contextual keyword overlap between resume and target role")
    if len(strengths) == 0:
        strengths.append("Resume contains core foundational section structure")

    if len(missing_skills) > 0:
        gaps.append(f"Required skills not demonstrated in resume: {', '.join(missing_skills[:3])}")
        recommendations.append(JobMatchRecommendation(
            id="rec-match-skl-01",
            title="Address Potential Skill Gaps",
            description=f"Potential skill gap: Skill not found in resume: {', '.join(missing_skills[:3])}. Only address if you genuinely have this experience.",
            severity="high" if len(missing_skills) >= 3 else "medium",
            section="skills",
            action="Fix in Resume"
        ))

    if len(missing_keywords) > 3:
        recommendations.append(JobMatchRecommendation(
            id="rec-match-kw-01",
            title="Consider Relevant Industry Terminology",
            description=f"Keyword not found in resume: {', '.join(missing_keywords[:4])}. Add only if you genuinely have this skill or experience.",
            severity="medium",
            section="summary",
            action="Fix in Resume"
        ))

    if not matching_role_term and resume.target_role:
        gaps.append(f"Target role title '{resume.target_role}' is not explicitly aligned with job description phrasing")
        recommendations.append(JobMatchRecommendation(
            id="rec-match-role-01",
            title="Refine Summary Role Phrasing",
            description="Not demonstrated in the current resume. Consider updating your summary intro to highlight alignment with target role phrasing where applicable.",
            severity="medium",
            section="summary",
            action="Fix in Resume"
        ))

    if jd_requires_cert and not resume.certifications:
        gaps.append("Certification requirement is not demonstrated in the current resume.")
        recommendations.append(JobMatchRecommendation(
            id="rec-match-cert-01",
            title="Certification Requirements",
            description="Certification requirement is not demonstrated in the current resume. Only add certifications if genuinely earned.",
            severity="low",
            section="certifications",
            action="Fix in Resume"
        ))

    categories = JobMatchCategories(
        skills_match=skills_score,
        keyword_match=keyword_score,
        experience_alignment=exp_score,
        project_domain_alignment=project_score,
        education_certification_alignment=edu_score,
    )

    return JobMatchResponse(
        resume_id=resume.id,
        resume_name=resume.name,
        job_title=job_title,
        company_name=company_name,
        overall_match_score=overall_score,
        categories=categories,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        matched_keywords=matched_keywords,
        missing_keywords=missing_keywords,
        experience_alignment_note=experience_alignment_note,
        project_relevance_note=project_relevance_note,
        education_certification_note=education_certification_note,
        relevant_projects=relevant_projects,
        strengths=strengths,
        gaps=gaps,
        recommendations=recommendations,
        analyzed_at=datetime.now(timezone.utc).isoformat(),
    )
