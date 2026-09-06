import { apiRequest } from "../lib/api";

export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  current: boolean;
  gpa: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  github_url: string;
  live_url: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
  credential_id?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization?: string;
  result?: string;
  date: string;
  description: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
  bullets: string[];
}

export interface ResumeData {
  id: string;
  user_id: string;
  name: string;
  target_role: string;
  experience_level: string;
  template: string;
  personal_info: PersonalInfo;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  languages: LanguageItem[];
  links: LinkItem[];
  custom_sections: CustomSectionItem[];
  completion_percentage: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface ResumeCreateRequest {
  name: string;
  target_role: string;
  experience_level?: string;
  template?: string;
}

export interface ResumeUpdateRequest {
  name?: string;
  target_role?: string;
  experience_level?: string;
  template?: string;
  personal_info?: Partial<PersonalInfo>;
  summary?: string;
  education?: EducationItem[];
  experience?: ExperienceItem[];
  skills?: SkillCategory[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  achievements?: AchievementItem[];
  languages?: LanguageItem[];
  links?: LinkItem[];
  custom_sections?: CustomSectionItem[];
}

export interface ResumeSummary {
  id: string;
  user_id: string;
  name: string;
  target_role: string;
  experience_level: string;
  template: string;
  completion_percentage: number;
  version: number;
  updated_at: string;
  created_at: string;
}

export interface ResumeDashboardResponse {
  total_resumes: number;
  average_completion: number;
  average_ats_score?: number | null;
  average_defensibility?: number | null;
  resumes: ResumeSummary[];
}

export async function getResumes(): Promise<ResumeSummary[]> {
  return apiRequest<ResumeSummary[]>("/api/resumes");
}

export async function getResumeDashboard(): Promise<ResumeDashboardResponse> {
  return apiRequest<ResumeDashboardResponse>("/api/resumes/dashboard");
}

export async function getResume(id: string): Promise<ResumeData> {
  return apiRequest<ResumeData>(`/api/resumes/${id}`);
}

export async function createResume(data: ResumeCreateRequest): Promise<ResumeData> {
  return apiRequest<ResumeData>("/api/resumes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function importResume(file: File): Promise<ResumeData> {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest<ResumeData>("/api/resumes/import", {
    method: "POST",
    body: formData,
  });
}


export async function updateResume(id: string, data: ResumeUpdateRequest): Promise<ResumeData> {
  return apiRequest<ResumeData>(`/api/resumes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteResume(id: string): Promise<void> {
  return apiRequest<void>(`/api/resumes/${id}`, {
    method: "DELETE",
  });
}

export async function duplicateResume(id: string): Promise<ResumeData> {
  return apiRequest<ResumeData>(`/api/resumes/${id}/duplicate`, {
    method: "POST",
  });
}

export interface ResumeImproveRequest {
  section: string;
  original_text: string;
  improvement_goal?: string;
}

export interface ResumeImproveResponse {
  original_text: string;
  improved_text: string;
  explanation: string;
  detected_changes: string[];
  warnings: string[];
}

export async function improveResume(
  id: string,
  data: ResumeImproveRequest
): Promise<ResumeImproveResponse> {
  return apiRequest<ResumeImproveResponse>(`/api/resumes/${id}/improve`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface ATSCategoryScores {
  keyword_optimization: number;
  section_completeness: number;
  skills_alignment: number;
  experience_quality: number;
  formatting: number;
}

export interface ATSIssueItem {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  section: string;
}

export interface ATSRecommendationItem {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  section: string;
  action: string;
}

export interface ATSAnalysisResponse {
  resume_id: string;
  overall_score: number;
  categories: ATSCategoryScores;
  strengths: string[];
  issues: ATSIssueItem[];
  recommendations: ATSRecommendationItem[];
  analyzed_at: string;
}

export async function analyzeATS(id: string): Promise<ATSAnalysisResponse> {
  return apiRequest<ATSAnalysisResponse>(`/api/resumes/${id}/ats-analysis`, {
    method: "POST",
  });
}

export interface JobMatchRequest {
  job_description: string;
}

export interface JobMatchCategories {
  skills_match: number;
  keyword_match: number;
  experience_alignment: number;
  project_domain_alignment: number;
  education_certification_alignment: number;
}

export interface JobMatchRecommendation {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  section: string;
  action: string;
}

export interface JobMatchResponse {
  resume_id: string;
  overall_match_score: number;
  categories: JobMatchCategories;
  matched_skills: string[];
  missing_skills: string[];
  matched_keywords: string[];
  missing_keywords: string[];
  strengths: string[];
  gaps: string[];
  recommendations: JobMatchRecommendation[];
  analyzed_at: string;
}

export async function matchJobDescription(
  id: string,
  jobDescription: string
): Promise<JobMatchResponse> {
  return apiRequest<JobMatchResponse>(`/api/resumes/${id}/job-match`, {
    method: "POST",
    body: JSON.stringify({ job_description: jobDescription }),
  });
}

export interface DefendClaimItem {
  id: string;
  section: string;
  claim_text: string;
  risk_level: "high" | "medium" | "low";
  risk_reason: string;
}

export interface DefendInitResponse {
  session_id: string;
  resume_id: string;
  total_claims: number;
  claims: DefendClaimItem[];
  first_claim_id?: string | null;
  first_question?: string | null;
}

export interface DefendAnswerRequest {
  session_id: string;
  claim_id: string;
  user_answer: string;
  is_followup?: boolean;
}

export interface DefendClaimEvaluation {
  claim_id: string;
  claim_text: string;
  user_answer: string;
  rating: "strong" | "needs_prep" | "defenseless";
  score: number;
  feedback: string;
  strengths: string[];
  gaps: string[];
}

export interface DefendFinalReport {
  resume_id: string;
  overall_defensibility_score: number;
  strong_claims: string[];
  claims_needing_prep: string[];
  defenseless_claims: string[];
  suggested_prep_topics: string[];
  analyzed_at: string;
}

export interface DefendAnswerResponse {
  session_id: string;
  claim_evaluation: DefendClaimEvaluation;
  needs_followup: boolean;
  followup_question?: string | null;
  next_claim_id?: string | null;
  next_question?: string | null;
  is_complete: boolean;
  final_report?: DefendFinalReport | null;
}

export async function initDefendSession(id: string): Promise<DefendInitResponse> {
  return apiRequest<DefendInitResponse>(`/api/resumes/${id}/defend/init`, {
    method: "POST",
  });
}

export async function submitDefendAnswer(
  id: string,
  data: DefendAnswerRequest
): Promise<DefendAnswerResponse> {
  return apiRequest<DefendAnswerResponse>(`/api/resumes/${id}/defend/answer`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}


