import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Mic, Star, CheckCircle, ArrowRight, Lock, Crown, Play, Pause,
  Square, RotateCcw, Sparkles, ChevronLeft, Trophy, Award, Target,
  BookOpen, Clock, AlertTriangle, Lightbulb, ListChecks, Quote,
  MousePointerClick, Loader2,
} from "lucide-react";

/* =========================================================================
   BACKEND CONTRACT
   These types describe the exact shape the API is expected to return.
   Nothing below this block should be treated as final/hardcoded content —
   MOCK_COURSE and MOCK_RECOMMENDATION exist only as local stand-ins for
   GET /api/communication/course and GET /api/communication/recommendation
   until the real endpoints exist. Every screen reads from `course` /
   `recommendation` state, never from the mock constants directly.
   ========================================================================= */

interface Reward {
  xp: number;
  coins: number;
  badge?: string;
}

interface LearningContent {
  objectives: string[];
  explanation: string;
  keyPoints: string[];
  realExample: string;
  commonMistakes: string[];
  proTips: string[];
}

interface ActivityOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Activity {
  type: "choose-best" | "arrange-steps" | "match" | "fill-blank" | "scenario";
  prompt: string;
  options: ActivityOption[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface FeedbackMetrics {
  confidence: number;
  fluency: number;
  clarity: number;
  grammar: number;
  pronunciation: number;
  mentorTip: string;
}

type LessonStatus = "completed" | "current" | "locked";

interface Lesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  status: LessonStatus;
  learning: LearningContent;
  activity: Activity;
  quiz: QuizQuestion[];
  reward: Reward;
}

type LevelStatus = "completed" | "current" | "locked";

interface Level {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  status: LevelStatus;
  lessons: Lesson[];
  assessment: QuizQuestion[];
  reward: Reward;
  isFinal?: boolean;
}

interface Course {
  id: string;
  title: string;
  tagline: string;
  levels: Level[];
}

interface Recommendation {
  levelId: string;
  lessonId: string;
  reason: string;
  estimatedMinutes: number;
  reward: Reward;
}

/* =========================================================================
   MOCK API LAYER — placeholder until real endpoints exist
   ========================================================================= */

function buildLesson(id: string, title: string, difficulty: Lesson["difficulty"], status: LessonStatus): Lesson {
  return {
    id,
    title,
    estimatedMinutes: 3,
    difficulty,
    status,
    learning: {
      objectives: [
        `Understand what makes "${title}" land well in a real interview`,
        "Recognize the structure behind a strong answer",
      ],
      explanation:
        "A strong answer here is short, specific, and confident — structure beats length every time.",
      keyPoints: ["Lead with the strongest point first", "Keep it under 60 seconds", "End with a clear takeaway"],
      realExample: "\"In my last project, I owned the deployment pipeline end-to-end and cut release time by 40%.\"",
      commonMistakes: ["Rambling without a clear structure", "Sounding rehearsed instead of natural"],
      proTips: ["Pause for one second before answering — it reads as confidence, not hesitation."],
    },
    activity: {
      type: "choose-best",
      prompt: "Which response best fits this moment?",
      options: [
        { id: "a", text: "A short, structured answer with one clear example", isCorrect: true },
        { id: "b", text: "A long answer covering everything at once", isCorrect: false },
        { id: "c", text: "A vague answer to stay safe", isCorrect: false },
      ],
    },
    quiz: [
      {
        id: `${id}-q1`,
        question: "What should you lead with in your answer?",
        options: ["Your strongest point", "A long disclaimer", "An apology"],
        correctIndex: 0,
      },
      {
        id: `${id}-q2`,
        question: "What's the ideal length for this kind of answer?",
        options: ["Under a minute", "5+ minutes", "As long as possible"],
        correctIndex: 0,
      },
      {
        id: `${id}-q3`,
        question: "What reads as confidence in your delivery?",
        options: ["A brief pause before answering", "Speaking as fast as possible", "Avoiding eye contact"],
        correctIndex: 0,
      },
    ],
    reward: { xp: 80, coins: 15 },
  };
}

function buildLevel(
  id: string,
  index: number,
  title: string,
  subtitle: string,
  lessonTitles: string[],
  status: LevelStatus,
  reward: Reward,
  isFinal?: boolean
): Level {
  const lessons = lessonTitles.map((t, i) =>
    buildLesson(`${id}-${i}`, t, i === 0 ? "Easy" : i < lessonTitles.length - 1 ? "Medium" : "Hard", status === "locked" ? "locked" : i === 0 ? "current" : "locked")
  );
  return {
    id,
    index,
    title,
    subtitle,
    status,
    lessons,
    reward,
    isFinal,
    assessment: [
      { id: `${id}-a1`, question: `Which best summarizes the goal of "${title}"?`, options: ["Communicating with clarity and confidence", "Memorizing scripts word for word", "Avoiding the question entirely"], correctIndex: 0 },
      { id: `${id}-a2`, question: "What matters most across these lessons?", options: ["Structure and confidence", "Speaking speed", "Volume"], correctIndex: 0 },
      { id: `${id}-a3`, question: "When should you apply these skills?", options: ["In real interview-style moments", "Only during practice", "Never"], correctIndex: 0 },
    ],
  };
}

const MOCK_COURSE: Course = {
  id: "communication-campaign",
  title: "Communication Campaign",
  tagline: "Become placement ready by clearing every communication level.",
  levels: [
    buildLevel("l1", 1, "Communication Foundations", "Build the basics every great communicator starts with.",
      ["Greeting & First Impression", "Voice & Tone", "Pronunciation", "Self Introduction (30 sec)", "Self Introduction (1 min)"],
      "current", { xp: 500, coins: 100, badge: "Foundation Explorer" }),
    buildLevel("l2", 2, "HR Interview Mastery", "Answer the questions every HR round opens with.",
      ["Tell Me About Yourself", "Strengths", "Weaknesses", "Career Goals", "Leadership"],
      "locked", { xp: 600, coins: 120, badge: "HR Challenger" }),
    buildLevel("l3", 3, "Group Discussion", "Hold your ground and steer the conversation.",
      ["Starting a GD", "Agree Professionally", "Disagree Respectfully", "Build Arguments", "Conclude Discussion"],
      "locked", { xp: 650, coins: 130, badge: "Discussion Strategist" }),
    buildLevel("l4", 4, "Technical Communication", "Explain complex ideas in simple, confident language.",
      ["Explain Your Project", "Explain OOP", "Explain DBMS", "Explain Operating Systems", "Explain Computer Networks"],
      "locked", { xp: 700, coins: 140, badge: "Technical Communicator" }),
    buildLevel("l5", 5, "Presentation Skills", "Command a room and hold attention with a story.",
      ["Storytelling", "Public Speaking", "PPT Presentation", "Demo Presentation", "Audience Questions"],
      "locked", { xp: 700, coins: 140, badge: "Stage Presence" }),
    buildLevel("l6", 6, "Workplace Communication", "Sound professional in every channel you use at work.",
      ["Professional Email", "Chat Etiquette", "Asking Questions", "Giving Updates", "Client Communication"],
      "locked", { xp: 750, coins: 150, badge: "Workplace Pro" }),
    buildLevel("l7", 7, "Final Interview Arena", "Every level you've cleared, tested at once.",
      ["Self Introduction", "HR Round", "Technical Explanation", "Group Discussion", "Presentation", "Behavioral Questions"],
      "locked", { xp: 1500, coins: 500, badge: "Communication Champion" }, true),
  ],
};

const MOCK_RECOMMENDATION: Recommendation = {
  levelId: "l1",
  lessonId: "l1-0",
  reason: "You hesitate during opening moments. This lesson sharpens your first impression before anything else.",
  estimatedMinutes: 8,
  reward: { xp: 150, coins: 20 },
};

function mockFetchCourse(): Promise<Course> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_COURSE), 500));
}

function mockFetchRecommendation(): Promise<Recommendation> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_RECOMMENDATION), 500));
}

function mockFetchAIFeedback(): Promise<FeedbackMetrics> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          confidence: 88,
          fluency: 84,
          clarity: 91,
          grammar: 86,
          pronunciation: 89,
          mentorTip: "Great confidence. Slow down slightly while answering.",
        }),
      600
    )
  );
}

/* =========================================================================
   VIEW STATE
   ========================================================================= */

type View = "campaign" | "level" | "lesson" | "levelAssessment" | "champion";
type LessonStage = "learn" | "activity" | "practice" | "feedback" | "quiz" | "complete";

function fmtTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const btnBase = "flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200";
const btnPrimary = "bg-accent text-accent-foreground hover:brightness-110 shadow-lg shadow-accent/20";
const btnGhost = "bg-white/5 border border-white/10 text-white hover:bg-white/10";

/* =========================================================================
   COMPONENT (single, default export, no other components defined)
   ========================================================================= */

export default function Communication() {
  const [course, setCourse] = useState<Course | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);

  const [view, setView] = useState<View>("campaign");
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [lessonStage, setLessonStage] = useState<LessonStage>("learn");

  const [profile, setProfile] = useState({ xp: 2140, coins: 480, level: 6, badges: 3 });

  // activity state
  const [activitySelected, setActivitySelected] = useState<string | null>(null);
  const [activitySubmitted, setActivitySubmitted] = useState(false);

  // practice / recording state
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  // AI feedback state
  const [feedback, setFeedback] = useState<FeedbackMetrics | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // quiz / assessment state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    mockFetchCourse().then((c) => {
      setCourse(c);
      setLoadingCourse(false);
    });
    mockFetchRecommendation().then(setRecommendation);
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const activeLevel = course?.levels.find((l) => l.id === activeLevelId) || null;
  const activeLesson = activeLevel?.lessons.find((ls) => ls.id === activeLessonId) || null;

  /* ----------------------------- navigation ----------------------------- */

  function resetLessonState() {
    setLessonStage("learn");
    setActivitySelected(null);
    setActivitySubmitted(false);
    setSeconds(0);
    setHasRecording(false);
    setIsRecording(false);
    setFeedback(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
  }

  function openLevel(id: string) {
    const level = course?.levels.find((l) => l.id === id);
    if (!level || level.status === "locked") return;
    setActiveLevelId(id);
    setView("level");
  }

  function startLesson(lessonId: string) {
    const lesson = activeLevel?.lessons.find((ls) => ls.id === lessonId);
    if (!lesson || lesson.status === "locked") return;
    setActiveLessonId(lessonId);
    resetLessonState();
    setView("lesson");
  }

  function startRecommended() {
    if (!recommendation || !course) return;
    setActiveLevelId(recommendation.levelId);
    setActiveLessonId(recommendation.lessonId);
    resetLessonState();
    setView("lesson");
  }

  function submitActivity() {
    setActivitySubmitted(true);
  }

  function goToPractice() {
    setLessonStage("practice");
  }

  function finishRecording() {
    setIsRecording(false);
    setHasRecording(true);
  }

  function reRecord() {
    setSeconds(0);
    setHasRecording(false);
    setIsRecording(false);
  }

  function requestFeedback() {
    setLessonStage("feedback");
    setLoadingFeedback(true);
    mockFetchAIFeedback().then((f) => {
      setFeedback(f);
      setLoadingFeedback(false);
    });
  }

  function submitQuiz() {
    setQuizSubmitted(true);
  }

  function completeLesson() {
    if (!course || !activeLevel || !activeLesson) return;
    const idx = activeLevel.lessons.findIndex((ls) => ls.id === activeLesson.id);
    const isLastLesson = idx === activeLevel.lessons.length - 1;

    setCourse((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        levels: prev.levels.map((lvl) => {
          if (lvl.id !== activeLevel.id) return lvl;
          const updatedLessons = lvl.lessons.map((ls, i) => {
            if (i === idx) return { ...ls, status: "completed" as LessonStatus };
            if (i === idx + 1) return { ...ls, status: "current" as LessonStatus };
            return ls;
          });
          return { ...lvl, lessons: updatedLessons };
        }),
      };
    });

    setProfile((p) => ({ ...p, xp: p.xp + activeLesson.reward.xp, coins: p.coins + activeLesson.reward.coins }));
    setLessonStage("complete");

    if (isLastLesson) {
      // level's lessons are all done — level assessment becomes available from the level screen
    }
  }

  function goNextLesson() {
    if (!activeLevel || !activeLesson) return;
    const idx = activeLevel.lessons.findIndex((ls) => ls.id === activeLesson.id);
    const next = activeLevel.lessons[idx + 1];
    if (next && next.status !== "locked") {
      startLesson(next.id);
    } else if (next) {
      // edge case: next lesson just unlocked in state but local var stale — re-derive
      setView("level");
    } else {
      setView("level");
    }
  }

  function openLevelAssessment() {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setView("levelAssessment");
  }

  function passLevelAssessment() {
    if (!course || !activeLevel) return;
    setCourse((prev) => {
      if (!prev) return prev;
      const levelIdx = prev.levels.findIndex((l) => l.id === activeLevel.id);
      return {
        ...prev,
        levels: prev.levels.map((lvl, i) => {
          if (i === levelIdx) return { ...lvl, status: "completed" as LevelStatus };
          if (i === levelIdx + 1 && lvl.status === "locked") return { ...lvl, status: "current" as LevelStatus };
          return lvl;
        }),
      };
    });
    setProfile((p) => ({ ...p, xp: p.xp + activeLevel.reward.xp, coins: p.coins + activeLevel.reward.coins, badges: p.badges + 1 }));

    if (activeLevel.isFinal) {
      setView("champion");
    } else {
      setView("level");
    }
  }

  function backToCampaign() {
    setView("campaign");
    setActiveLevelId(null);
    setActiveLessonId(null);
  }

  function backToLevel() {
    setView("level");
  }

  const completedLevels = course?.levels.filter((l) => l.status === "completed").length ?? 0;
  const currentLevelNumber = Math.min(completedLevels + 1, 7);
  const recLevel = course?.levels.find((l) => l.id === recommendation?.levelId);
  const recLesson = recLevel?.lessons.find((l) => l.id === recommendation?.lessonId);

  /* ----------------------------------------------------------------- */
  /*  Loading state — backend not yet returned course data               */
  /* ----------------------------------------------------------------- */

  if (loadingCourse || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading your campaign...</p>
      </div>
    );
  }

  /* ----------------------------------------------------------------- */
  /*  View: Campaign                                                    */
  /* ----------------------------------------------------------------- */

  if (view === "campaign") {
    return (
      <div className="space-y-10">
        <div className="relative">
          <div className="absolute -top-10 left-1/4 w-72 h-72 bg-primary/20 blur-[100px] -z-10 rounded-full" />
          <div className="absolute -top-10 right-1/4 w-72 h-72 bg-accent/20 blur-[100px] -z-10 rounded-full" />
          <h1 className="text-4xl font-display font-bold text-white tracking-tight mb-2">{course.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{course.tagline}</p>

          <div className="max-w-md">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/90 font-medium">Campaign Progress</span>
              <span className="font-bold text-white">Level {currentLevelNumber} / {course.levels.length}</span>
            </div>
            <Progress value={(completedLevels / course.levels.length) * 100} className="h-2.5 bg-white/5 [&>div]:bg-accent rounded-full" />
          </div>
        </div>

        {/* personalized AI recommendation */}
        {recommendation && recLevel && recLesson && (
          <Card className="glass-card p-6 border-white/5 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-56 h-56 bg-primary/20 blur-[80px] -z-0 rounded-full" />
            <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-accent/20 blur-[80px] -z-0 rounded-full" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-accent" />
                <p className="text-xs uppercase tracking-wide text-accent font-semibold">Recommended Lesson</p>
              </div>
              <p className="text-xs text-muted-foreground mb-5">Based on your latest practice and interview performance</p>

              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{recLevel.title}</p>
                  <h3 className="text-xl font-display font-bold text-white mb-3">{recLesson.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {recommendation.estimatedMinutes} mins</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400" /> +{recommendation.reward.xp} XP</span>
                  </div>
                </div>
                <button onClick={startRecommended} className={`${btnBase} ${btnPrimary}`}>
                  <ArrowRight className="w-4 h-4" /> Continue Training
                </button>
              </div>

              <div className="mt-5 pt-5 border-t border-white/10 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-sm text-white/80 leading-relaxed">{recommendation.reason}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {course.levels.map((lvl) => {
            const isLocked = lvl.status === "locked";
            const isCompleted = lvl.status === "completed";
            const completedLessons = lvl.lessons.filter((l) => l.status === "completed").length;
            return (
              <Card
                key={lvl.id}
                onClick={!isLocked ? () => openLevel(lvl.id) : undefined}
                className={`p-6 relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isLocked
                    ? "border-white/5 opacity-50 backdrop-blur-sm"
                    : lvl.isFinal
                    ? "border-amber-400/40 bg-gradient-to-br from-amber-400/10 via-white/5 to-transparent hover:-translate-y-1 cursor-pointer"
                    : "glass-card border-white/5 hover:border-accent/40 hover:-translate-y-1 cursor-pointer"
                }`}
              >
                {!isLocked && (
                  <div className={`absolute -top-10 -right-10 w-40 h-40 ${lvl.isFinal ? "bg-amber-400/20" : "bg-accent/15"} blur-[60px] rounded-full`} />
                )}
                <div className="relative flex items-center justify-between gap-6 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-lg shrink-0 ${
                        isCompleted
                          ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30"
                          : lvl.isFinal
                          ? "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                          : isLocked
                          ? "bg-white/5 text-muted-foreground border border-white/10"
                          : "bg-accent/15 text-accent border border-accent/30"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : isLocked ? <Lock className="w-5 h-5" /> : lvl.isFinal ? <Crown className="w-6 h-6" /> : lvl.index}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Level {lvl.index}</p>
                      <h3 className="font-display font-bold text-white text-lg">{lvl.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isLocked ? "Complete previous level to unlock." : `${completedLessons} / ${lvl.lessons.length} lessons \u00b7 +${lvl.reward.xp} XP`}
                      </p>
                    </div>
                  </div>
                  {isCompleted ? (
                    <span className="text-xs font-medium text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Cleared
                    </span>
                  ) : isLocked ? (
                    <span className="text-xs font-medium text-muted-foreground bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </span>
                  ) : (
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------- */
  /*  View: Level (lesson list + assessment unlock)                      */
  /* ----------------------------------------------------------------- */

  if (view === "level" && activeLevel) {
    const allLessonsDone = activeLevel.lessons.every((l) => l.status === "completed");
    return (
      <div className="space-y-8">
        <button onClick={backToCampaign} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Campaign
        </button>

        <div>
          <p className="text-xs uppercase tracking-wide text-accent font-semibold mb-2">Level {activeLevel.index}</p>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight mb-2 flex items-center gap-3">
            {activeLevel.isFinal && <Crown className="w-7 h-7 text-amber-300" />} {activeLevel.title}
          </h1>
          <p className="text-muted-foreground">{activeLevel.subtitle}</p>
        </div>

        <div className="space-y-3">
          {activeLevel.lessons.map((ls, i) => {
            const isLocked = ls.status === "locked";
            const isCompleted = ls.status === "completed";
            return (
              <Card
                key={ls.id}
                onClick={!isLocked ? () => startLesson(ls.id) : undefined}
                className={`glass-card p-4 border-white/5 flex items-center justify-between gap-4 transition-all duration-300 ${
                  isLocked ? "opacity-50 backdrop-blur-sm" : "hover:border-accent/40 cursor-pointer hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 ${
                      isCompleted ? "bg-emerald-400/10 text-emerald-300" : isLocked ? "bg-white/5 text-muted-foreground" : "bg-accent/10 text-accent"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{ls.title}</p>
                    {isLocked ? (
                      <p className="text-xs text-muted-foreground mt-0.5">Complete previous lesson to unlock.</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-0.5">{ls.estimatedMinutes} min &middot; {ls.difficulty}</p>
                    )}
                  </div>
                </div>
                {!isLocked && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
              </Card>
            );
          })}
        </div>

        <Card
          className={`p-6 border-2 rounded-2xl relative overflow-hidden ${
            activeLevel.status === "completed" ? "border-emerald-400/40" : allLessonsDone ? "border-accent/40" : "border-white/10 opacity-70"
          } bg-gradient-to-br ${activeLevel.isFinal ? "from-amber-400/10" : "from-accent/10"} via-white/5 to-transparent`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Trophy className={`w-6 h-6 ${activeLevel.status === "completed" ? "text-emerald-300" : "text-muted-foreground"}`} />
              <div>
                <p className="font-semibold text-white">{activeLevel.isFinal ? "Final Assessment" : "Level Assessment"}</p>
                <p className="text-sm text-muted-foreground">
                  +{activeLevel.reward.xp} XP &middot; +{activeLevel.reward.coins} Coins &middot; {activeLevel.reward.badge}
                </p>
              </div>
            </div>
            {activeLevel.status === "completed" ? (
              <span className="text-xs font-medium text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Cleared
              </span>
            ) : allLessonsDone ? (
              <button onClick={openLevelAssessment} className={`${btnBase} ${btnPrimary}`}>
                <ArrowRight className="w-4 h-4" /> Start Assessment
              </button>
            ) : (
              <span className="text-xs font-medium text-muted-foreground bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Complete all lessons
              </span>
            )}
          </div>
        </Card>
      </div>
    );
  }

  /* ----------------------------------------------------------------- */
  /*  View: Lesson flow (Learn -> Activity -> Practice -> Feedback ->    */
  /*  Quiz -> Complete)                                                  */
  /* ----------------------------------------------------------------- */

  if (view === "lesson" && activeLevel && activeLesson) {
    const stages: LessonStage[] = ["learn", "activity", "practice", "feedback", "quiz", "complete"];
    const stageIdx = stages.indexOf(lessonStage);
    const correctOption = activeLesson.activity.options.find((o) => o.isCorrect);
    const activityCorrect = activitySelected === correctOption?.id;
    const quizAllAnswered = activeLesson.quiz.every((q) => quizAnswers[q.id] !== undefined);
    const quizScore = activeLesson.quiz.filter((q) => quizAnswers[q.id] === q.correctIndex).length;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={backToLevel} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> {activeLevel.title}
        </button>

        <div className="flex items-center gap-1.5">
          {stages.map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${i <= stageIdx ? "bg-accent" : "bg-white/10"}`} />
          ))}
        </div>

        {/* ---------------- LEARN ---------------- */}
        {lessonStage === "learn" && (
          <Card className="glass-card p-8 border-white/5 relative overflow-hidden">
            <div className="absolute -top-10 right-0 w-56 h-56 bg-primary/20 blur-[80px] -z-0 rounded-full" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-accent" />
                <p className="text-xs uppercase tracking-wide text-accent font-semibold">Learn</p>
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-3">{activeLesson.title}</h2>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeLesson.estimatedMinutes} min read</span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">{activeLesson.difficulty}</span>
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold text-white/70 mb-2 flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5" /> Learning Objectives</p>
                <ul className="space-y-1.5">
                  {activeLesson.learning.objectives.map((o, i) => (
                    <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                      <span className="text-accent mt-1">&bull;</span> {o}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm text-white/80 leading-relaxed mb-6">{activeLesson.learning.explanation}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs font-semibold text-white/70 mb-2">Key Points</p>
                  <ul className="space-y-1.5">
                    {activeLesson.learning.keyPoints.map((k, i) => (
                      <li key={i} className="text-xs text-white/70 flex items-start gap-1.5">
                        <CheckCircle className="w-3 h-3 text-emerald-300 shrink-0 mt-0.5" /> {k}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs font-semibold text-white/70 mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 text-amber-300" /> Common Mistakes</p>
                  <ul className="space-y-1.5">
                    {activeLesson.learning.commonMistakes.map((m, i) => (
                      <li key={i} className="text-xs text-white/70">&bull; {m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl bg-accent/5 border border-accent/20 p-4 mb-4 flex items-start gap-2.5">
                <Quote className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-sm text-white/85 leading-relaxed italic">{activeLesson.learning.realExample}</p>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-8 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
                <p className="text-sm text-white/80 leading-relaxed">{activeLesson.learning.proTips[0]}</p>
              </div>

              <button onClick={() => setLessonStage("activity")} className={`${btnBase} ${btnPrimary} w-full`}>
                <ArrowRight className="w-4 h-4" /> Ready?
              </button>
            </div>
          </Card>
        )}

        {/* ---------------- ACTIVITY ---------------- */}
        {lessonStage === "activity" && (
          <Card className="glass-card p-8 border-white/5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
              <MousePointerClick className="w-4 h-4 text-accent" />
              <p className="text-xs uppercase tracking-wide text-accent font-semibold">Activity</p>
            </div>
            <h2 className="text-xl font-display font-bold text-white mb-6">{activeLesson.activity.prompt}</h2>

            <div className="space-y-3 mb-6">
              {activeLesson.activity.options.map((opt) => {
                const isSelected = activitySelected === opt.id;
                const showResult = activitySubmitted;
                const isRight = showResult && opt.isCorrect;
                const isWrongSelected = showResult && isSelected && !opt.isCorrect;
                return (
                  <button
                    key={opt.id}
                    disabled={activitySubmitted}
                    onClick={() => setActivitySelected(opt.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      isRight
                        ? "border-emerald-400/50 bg-emerald-400/10 text-white"
                        : isWrongSelected
                        ? "border-rose-400/50 bg-rose-400/10 text-white"
                        : isSelected
                        ? "border-accent bg-accent/10 text-white"
                        : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {!activitySubmitted ? (
              <button
                onClick={submitActivity}
                disabled={!activitySelected}
                className={`${btnBase} ${btnPrimary} w-full ${!activitySelected ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <CheckCircle className="w-4 h-4" /> Submit
              </button>
            ) : (
              <div className="space-y-4">
                <p className={`text-sm font-medium ${activityCorrect ? "text-emerald-300" : "text-rose-300"}`}>
                  {activityCorrect ? "Nice work — that's the strongest response." : "Not quite — the highlighted option works best."}
                </p>
                <button onClick={goToPractice} className={`${btnBase} ${btnPrimary} w-full`}>
                  <ArrowRight className="w-4 h-4" /> Continue to Practice
                </button>
              </div>
            )}
          </Card>
        )}

        {/* ---------------- PRACTICE ---------------- */}
        {lessonStage === "practice" && (
          <Card className="glass-card p-8 border-white/5 relative overflow-hidden text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[80px] -z-0 rounded-full" />
            <div className="relative">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Practice</p>
              <h2 className="text-2xl font-display font-bold text-white mb-8">{activeLesson.title}</h2>

              <div
                className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-6 ${
                  isRecording
                    ? "border-rose-400/60 bg-rose-400/10 animate-pulse"
                    : hasRecording
                    ? "border-emerald-400/60 bg-emerald-400/10"
                    : "border-accent/40 bg-accent/10"
                }`}
              >
                <Mic className={`w-10 h-10 ${isRecording ? "text-rose-300" : hasRecording ? "text-emerald-300" : "text-accent"}`} />
              </div>

              <p className="text-3xl font-mono font-bold text-white mb-8">{fmtTime(seconds)}</p>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                {!isRecording && !hasRecording && (
                  <button onClick={() => setIsRecording(true)} className={`${btnBase} ${btnPrimary}`}>
                    <Mic className="w-4 h-4" /> Record Voice
                  </button>
                )}
                {isRecording && (
                  <>
                    <button onClick={() => setIsRecording(false)} className={`${btnBase} ${btnGhost}`}>
                      <Pause className="w-4 h-4" /> Pause
                    </button>
                    <button onClick={finishRecording} className={`${btnBase} ${btnGhost}`}>
                      <Square className="w-4 h-4" /> Stop
                    </button>
                  </>
                )}
                {hasRecording && (
                  <>
                    <button onClick={() => {}} className={`${btnBase} ${btnGhost}`}>
                      <Play className="w-4 h-4" /> Replay
                    </button>
                    <button onClick={reRecord} className={`${btnBase} ${btnGhost}`}>
                      <RotateCcw className="w-4 h-4" /> Re-record
                    </button>
                    <button onClick={requestFeedback} className={`${btnBase} ${btnPrimary}`}>
                      <ArrowRight className="w-4 h-4" /> Continue
                    </button>
                  </>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* ---------------- AI FEEDBACK ---------------- */}
        {lessonStage === "feedback" && (
          <Card className="glass-card p-8 border-white/5 relative overflow-hidden">
            <div className="absolute -top-10 right-0 w-56 h-56 bg-accent/20 blur-[80px] -z-0 rounded-full" />
            <div className="relative">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">AI Feedback</p>
              <h2 className="text-2xl font-display font-bold text-white mb-8">{activeLesson.title}</h2>

              {loadingFeedback || !feedback ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="w-6 h-6 text-accent animate-spin" />
                  <p className="text-sm text-muted-foreground">Analyzing your recording...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-5 mb-8">
                    {[
                      { label: "Confidence", val: feedback.confidence },
                      { label: "Fluency", val: feedback.fluency },
                      { label: "Clarity", val: feedback.clarity },
                      { label: "Grammar", val: feedback.grammar },
                      { label: "Pronunciation", val: feedback.pronunciation },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/90 font-medium flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-yellow-400" /> {s.label}
                          </span>
                          <span className="font-bold text-white">{s.val}%</span>
                        </div>
                        <Progress value={s.val} className="h-2 bg-white/5 [&>div]:bg-accent rounded-full" />
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-start gap-3 mb-8">
                    <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-white/90 leading-relaxed">
                      <span className="font-semibold">AI Mentor Tip — </span>
                      {feedback.mentorTip}
                    </p>
                  </div>

                  <button onClick={() => setLessonStage("quiz")} className={`${btnBase} ${btnPrimary} w-full`}>
                    <ArrowRight className="w-4 h-4" /> Take Checkpoint Quiz
                  </button>
                </>
              )}
            </div>
          </Card>
        )}

        {/* ---------------- CHECKPOINT QUIZ ---------------- */}
        {lessonStage === "quiz" && (
          <Card className="glass-card p-8 border-white/5 relative overflow-hidden">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Checkpoint Quiz</p>
            <h2 className="text-xl font-display font-bold text-white mb-6">Quick check before you move on</h2>

            <div className="space-y-6 mb-8">
              {activeLesson.quiz.map((q, qi) => (
                <div key={q.id}>
                  <p className="text-sm font-medium text-white mb-3">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const selected = quizAnswers[q.id] === oi;
                      const showResult = quizSubmitted;
                      const isRight = showResult && oi === q.correctIndex;
                      const isWrongSelected = showResult && selected && oi !== q.correctIndex;
                      return (
                        <button
                          key={oi}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers((a) => ({ ...a, [q.id]: oi }))}
                          className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                            isRight
                              ? "border-emerald-400/50 bg-emerald-400/10 text-white"
                              : isWrongSelected
                              ? "border-rose-400/50 bg-rose-400/10 text-white"
                              : selected
                              ? "border-accent bg-accent/10 text-white"
                              : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={submitQuiz}
                disabled={!quizAllAnswered}
                className={`${btnBase} ${btnPrimary} w-full ${!quizAllAnswered ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <CheckCircle className="w-4 h-4" /> Submit Answers
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-medium text-white/90">
                  You scored {quizScore} / {activeLesson.quiz.length}
                </p>
                <button onClick={completeLesson} className={`${btnBase} ${btnPrimary} w-full`}>
                  <ArrowRight className="w-4 h-4" /> Continue
                </button>
              </div>
            )}
          </Card>
        )}

        {/* ---------------- LESSON COMPLETE ---------------- */}
        {lessonStage === "complete" && (
          <Card className="glass-card p-10 border-white/5 relative overflow-hidden text-center">
            <div className="absolute inset-0 -z-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/20" />
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-300" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">Mission Complete</h2>
              <p className="text-muted-foreground mb-6">{activeLesson.title} &middot; Lesson Cleared</p>
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-300">+{activeLesson.reward.xp}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-300">+{activeLesson.reward.coins}</p>
                  <p className="text-xs text-muted-foreground">Coins</p>
                </div>
              </div>
              <p className="text-sm text-emerald-300 mb-8 flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Next lesson unlocked
              </p>
              <button onClick={goNextLesson} className={`${btnBase} ${btnPrimary} w-full`}>
                <ArrowRight className="w-4 h-4" /> Next Lesson
              </button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  /* ----------------------------------------------------------------- */
  /*  View: Level Assessment                                             */
  /* ----------------------------------------------------------------- */

  if (view === "levelAssessment" && activeLevel) {
    const allAnswered = activeLevel.assessment.every((q) => quizAnswers[q.id] !== undefined);
    const score = activeLevel.assessment.filter((q) => quizAnswers[q.id] === q.correctIndex).length;
    const passed = quizSubmitted && score >= Math.ceil(activeLevel.assessment.length * 0.6);

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={backToLevel} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> {activeLevel.title}
        </button>

        <Card className="glass-card p-8 border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-accent" />
            <p className="text-xs uppercase tracking-wide text-accent font-semibold">
              {activeLevel.isFinal ? "Final Assessment" : "Level Assessment"}
            </p>
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-6">{activeLevel.title}</h2>

          <div className="space-y-6 mb-8">
            {activeLevel.assessment.map((q, qi) => (
              <div key={q.id}>
                <p className="text-sm font-medium text-white mb-3">{qi + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const selected = quizAnswers[q.id] === oi;
                    const showResult = quizSubmitted;
                    const isRight = showResult && oi === q.correctIndex;
                    const isWrongSelected = showResult && selected && oi !== q.correctIndex;
                    return (
                      <button
                        key={oi}
                        disabled={quizSubmitted}
                        onClick={() => setQuizAnswers((a) => ({ ...a, [q.id]: oi }))}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                          isRight
                            ? "border-emerald-400/50 bg-emerald-400/10 text-white"
                            : isWrongSelected
                            ? "border-rose-400/50 bg-rose-400/10 text-white"
                            : selected
                            ? "border-accent bg-accent/10 text-white"
                            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={submitQuiz}
              disabled={!allAnswered}
              className={`${btnBase} ${btnPrimary} w-full ${!allAnswered ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <CheckCircle className="w-4 h-4" /> Submit Assessment
            </button>
          ) : passed ? (
            <div className="space-y-4">
              <p className="text-sm font-medium text-emerald-300">
                Passed &middot; {score} / {activeLevel.assessment.length} correct
              </p>
              <button onClick={passLevelAssessment} className={`${btnBase} ${btnPrimary} w-full`}>
                <ArrowRight className="w-4 h-4" /> {activeLevel.isFinal ? "Claim Championship" : "Unlock Next Level"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-rose-300">
                Not quite &middot; {score} / {activeLevel.assessment.length} correct. Review the level and try again.
              </p>
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                className={`${btnBase} ${btnGhost} w-full`}
              >
                <RotateCcw className="w-4 h-4" /> Retry Assessment
              </button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  /* ----------------------------------------------------------------- */
  /*  View: Champion (after Final Interview Arena)                       */
  /* ----------------------------------------------------------------- */

  if (view === "champion") {
    const ratings = [
      { label: "Confidence", val: 91 },
      { label: "Fluency", val: 88 },
      { label: "Grammar", val: 90 },
      { label: "Pronunciation", val: 87 },
      { label: "Clarity", val: 92 },
    ];
    const overall = Math.round(ratings.reduce((a, r) => a + r.val, 0) / ratings.length);
    const finalLevel = course.levels.find((l) => l.isFinal);

    return (
      <div className="max-w-xl mx-auto">
        <Card className="glass-card p-10 border-2 border-amber-400/40 relative overflow-hidden text-center">
          <div className="absolute inset-0 -z-0 bg-gradient-to-br from-amber-400/15 via-transparent to-primary/20" />
          <div className="relative">
            <Trophy className="w-14 h-14 text-amber-300 mx-auto mb-4" />
            <h2 className="text-3xl font-display font-bold text-white mb-1">Communication Champion</h2>
            <p className="text-muted-foreground mb-8">You cleared the Final Interview Arena.</p>

            <div className="flex items-center justify-center gap-8 mb-8">
              <div>
                <p className="text-4xl font-bold text-white">{overall}%</p>
                <p className="text-xs text-muted-foreground">Overall Score</p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <p className="text-4xl font-bold text-accent">{profile.level + 1}</p>
                <p className="text-xs text-muted-foreground">Communication Level</p>
              </div>
            </div>

            <div className="space-y-3 mb-8 text-left">
              {ratings.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-white/90 font-medium">{r.label}</span>
                    <span className="font-bold text-white">{r.val}%</span>
                  </div>
                  <Progress value={r.val} className="h-2 bg-white/5 [&>div]:bg-amber-400 rounded-full" />
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-start gap-3 mb-8 text-left">
              <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-white/90 leading-relaxed">
                You consistently lead with confidence. Keep slowing down slightly on technical answers to stay crisp under pressure.
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="text-center">
                <p className="text-xl font-bold text-amber-300 flex items-center gap-1.5 justify-center">
                  <Award className="w-5 h-5" /> {finalLevel?.reward.badge ?? "Legendary Badge"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-yellow-300">+{finalLevel?.reward.xp ?? 1500} XP</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-amber-200">+{finalLevel?.reward.coins ?? 500} Coins</p>
              </div>
            </div>

            <button onClick={backToCampaign} className={`${btnBase} ${btnPrimary} w-full`}>
              <ChevronLeft className="w-4 h-4" /> Back to Campaign
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}