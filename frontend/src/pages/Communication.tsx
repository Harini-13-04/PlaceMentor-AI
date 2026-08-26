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
   BACKEND CONTRACT & TYPES
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
   MOCK API LAYER
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
        "Spot the common filler patterns and replace them with crisp structures",
        "Deliver a 60-second response with natural pace and confidence",
      ],
      explanation:
        "Interviewers evaluate structure, clarity, and authenticity within the first 30 seconds. Strong communication isn't about memorizing scripts; it's about leading with your core impact, backing it up with concise evidence, and concluding with forward momentum.",
      keyPoints: [
        "Lead with the punchline: Give the bottom-line result or perspective first.",
        "Use the STAR framework (Situation, Task, Action, Result) for behavioral prompts.",
        "Control your cadence: 130–150 words per minute keeps listeners engaged.",
      ],
      realExample:
        '"In my previous project, our team needed to reduce API response latency by 40%. I profiled our database queries, added Redis caching for frequent endpoints, and brought p95 latency down from 620ms to 180ms across 100k daily requests."',
      commonMistakes: [
        "Rambling chronologically without highlighting your specific personal impact.",
        "Overusing fillers like 'basically', 'kind of', 'like' when pausing to think.",
        "Giving generic answers that could apply to any candidate.",
      ],
      proTips: [
        "Take a 2-second breath before answering rather than jumping into filler phrases immediately.",
      ],
    },
    activity: {
      type: "choose-best",
      prompt: `Which response best demonstrates the "${title}" approach in an interview?`,
      options: [
        {
          id: "opt-1",
          text: "I did a lot of things on the project, mainly coding and helping out wherever my team needed assistance with bugs.",
          isCorrect: false,
        },
        {
          id: "opt-2",
          text: "I led the backend integration, structuring our REST endpoints and caching layer to cut load times by 35% before launch.",
          isCorrect: true,
        },
        {
          id: "opt-3",
          text: "The project was really difficult because our requirements kept changing every single sprint, but we eventually finished.",
          isCorrect: false,
        },
      ],
    },
    quiz: [
      {
        id: `${id}-q1`,
        question: "What is the most impactful way to open your answer in an interview?",
        options: [
          "State your bottom-line impact or thesis immediately",
          "Apologize for being nervous to build rapport",
          "Recount the backstory starting from years ago",
        ],
        correctIndex: 0,
      },
      {
        id: `${id}-q2`,
        question: "What should you do when you need a few seconds to gather your thoughts?",
        options: [
          "Fill the silence with continuous 'um's and 'like's",
          "Take a calm breath and pause deliberately for 2 seconds",
          "Start speaking rapidly hoping thoughts materialize",
        ],
        correctIndex: 1,
      },
    ],
    reward: { xp: 100, coins: 20 },
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
  isFinal = false
): Level {
  const lessons = lessonTitles.map((t, i) =>
    buildLesson(`${id}-${i}`, t, i === 0 ? "Easy" : i < 3 ? "Medium" : "Hard", i === 0 && status === "current" ? "current" : "locked")
  );
  return {
    id,
    index,
    title,
    subtitle,
    status,
    lessons,
    assessment: [
      {
        id: `${id}-a1`,
        question: `When executing ${title} in a high-stakes setting, what is priority #1?`,
        options: ["Speaking as fast as possible", "Structured clarity and impact", "Using complex jargon"],
        correctIndex: 1,
      },
      {
        id: `${id}-a2`,
        question: "How do you handle an unexpected follow-up question?",
        options: ["Pivot immediately to a memorized answer", "Acknowledge the question, pause to structure, and answer directly", "Change the topic entirely"],
        correctIndex: 1,
      },
    ],
    reward,
    isFinal,
  };
}

const MOCK_COURSE: Course = {
  id: "comm-101",
  title: "Interview Communication Training",
  tagline: "Master voice clarity, structural storytelling, and high-impact responses for technical and HR rounds.",
  levels: [
    buildLevel("l1", 1, "Voice & Foundation", "Vocal projection, cadence, and eliminating fillers.",
      ["Pacing & Breaths", "Eliminating Fillers", "Pitch & Confidence", "Active Listening", "Opening Strong"],
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
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_COURSE), 400));
}

function mockFetchRecommendation(): Promise<Recommendation> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_RECOMMENDATION), 400));
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
          mentorTip: "Strong confidence. Maintain a slight pause between key points to allow critical numbers to land.",
        }),
      550
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

const btnBase = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-150";
const btnPrimary = "bg-teal-600 hover:bg-teal-700 text-white shadow-sm";
const btnGhost = "bg-secondary border border-border text-foreground hover:bg-secondary/80";
const btnSecondary = "bg-card border border-border text-foreground hover:bg-secondary";

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
  }

  function goNextLesson() {
    if (!activeLevel || !activeLesson) return;
    const idx = activeLevel.lessons.findIndex((ls) => ls.id === activeLesson.id);
    const next = activeLevel.lessons[idx + 1];
    if (next && next.status !== "locked") {
      startLesson(next.id);
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

  if (loadingCourse || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading communication modules...</p>
      </div>
    );
  }

  /* ----------------------------------------------------------------- */
  /*  View: Campaign                                                    */
  /* ----------------------------------------------------------------- */

  if (view === "campaign") {
    return (
      <div className="space-y-6 text-foreground font-sans max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-1">{course.title}</h1>
          <p className="text-sm text-muted-foreground mb-4">{course.tagline}</p>

          <div className="max-w-md">
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-muted-foreground">Campaign Progress</span>
              <span className="font-bold text-foreground font-mono">Level {currentLevelNumber} / {course.levels.length}</span>
            </div>
            <Progress value={(completedLevels / course.levels.length) * 100} className="h-2 bg-secondary [&>div]:bg-teal-600 rounded-full border border-border" />
          </div>
        </div>

        {/* personalized AI recommendation */}
        {recommendation && recLevel && recLesson && (
          <div className="p-5 border border-border bg-card relative overflow-hidden rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <p className="text-xs uppercase tracking-wide text-teal-600 dark:text-teal-400 font-bold">Recommended Focus</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">{recLevel.title}</p>
                <h3 className="text-lg font-bold text-foreground mb-2">{recLesson.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {recommendation.estimatedMinutes} mins</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" /> +{recommendation.reward.xp} XP</span>
                </div>
              </div>
              <button onClick={startRecommended} className={`${btnBase} ${btnPrimary}`}>
                <ArrowRight className="w-4 h-4" /> Continue Training
              </button>
            </div>

            <div className="pt-3 border-t border-border flex items-start gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{recommendation.reason}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {course.levels.map((lvl) => {
            const isLocked = lvl.status === "locked";
            const isCompleted = lvl.status === "completed";
            const completedLessons = lvl.lessons.filter((l) => l.status === "completed").length;
            return (
              <div
                key={lvl.id}
                onClick={!isLocked ? () => openLevel(lvl.id) : undefined}
                className={`p-4 rounded-xl border transition-all duration-150 ${
                  isLocked
                    ? "border-border opacity-50 bg-card"
                    : lvl.isFinal
                    ? "border-amber-500/40 bg-card hover:border-amber-500 hover:bg-secondary/40 cursor-pointer"
                    : "border-border bg-card hover:border-teal-500/50 hover:bg-secondary/40 cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                        isCompleted
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : lvl.isFinal
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          : isLocked
                          ? "bg-secondary text-muted-foreground border border-border"
                          : "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : isLocked ? <Lock className="w-4 h-4" /> : lvl.isFinal ? <Crown className="w-4 h-4" /> : lvl.index}
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Level {lvl.index}</p>
                      <h3 className="font-bold text-foreground text-sm">{lvl.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isLocked ? "Complete previous level to unlock." : `${completedLessons} / ${lvl.lessons.length} lessons \u00b7 +${lvl.reward.xp} XP`}
                      </p>
                    </div>
                  </div>
                  {isCompleted ? (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Cleared
                    </span>
                  ) : isLocked ? (
                    <span className="text-xs font-medium text-muted-foreground bg-secondary border border-border px-2.5 py-1 rounded flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
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
      <div className="space-y-6 text-foreground font-sans max-w-3xl mx-auto">
        <button onClick={backToCampaign} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
          <ChevronLeft className="w-4 h-4" /> Back to Campaign
        </button>

        <div>
          <p className="text-xs uppercase tracking-wide text-teal-600 dark:text-teal-400 font-bold mb-1">Level {activeLevel.index}</p>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1 flex items-center gap-2">
            {activeLevel.isFinal && <Crown className="w-6 h-6 text-amber-500" />} {activeLevel.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{activeLevel.subtitle}</p>
        </div>

        <div className="space-y-2.5">
          {activeLevel.lessons.map((ls, i) => {
            const isLocked = ls.status === "locked";
            const isCompleted = ls.status === "completed";
            return (
              <div
                key={ls.id}
                onClick={!isLocked ? () => startLesson(ls.id) : undefined}
                className={`p-3.5 rounded-lg border bg-card flex items-center justify-between gap-4 transition-all ${
                  isLocked ? "opacity-50 border-border" : "border-border hover:border-teal-500/50 hover:bg-secondary/40 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCompleted ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : isLocked ? "bg-secondary text-muted-foreground" : "bg-teal-500/15 text-teal-600 dark:text-teal-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : isLocked ? <Lock className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{ls.title}</p>
                    {isLocked ? (
                      <p className="text-xs text-muted-foreground mt-0.5">Complete previous lesson to unlock.</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-0.5">{ls.estimatedMinutes} min &middot; {ls.difficulty}</p>
                    )}
                  </div>
                </div>
                {!isLocked && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            );
          })}
        </div>

        <div
          className={`p-5 border rounded-xl relative overflow-hidden bg-card ${
            activeLevel.status === "completed" ? "border-emerald-500/40" : allLessonsDone ? "border-teal-500/40" : "border-border opacity-70"
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Trophy className={`w-6 h-6 ${activeLevel.status === "completed" ? "text-emerald-500" : "text-muted-foreground"}`} />
              <div>
                <p className="font-bold text-foreground text-sm">{activeLevel.isFinal ? "Final Assessment" : "Level Assessment"}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  +{activeLevel.reward.xp} XP &middot; +{activeLevel.reward.coins} Coins &middot; {activeLevel.reward.badge}
                </p>
              </div>
            </div>
            {activeLevel.status === "completed" ? (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Cleared
              </span>
            ) : allLessonsDone ? (
              <button onClick={openLevelAssessment} className={`${btnBase} ${btnPrimary}`}>
                <ArrowRight className="w-4 h-4" /> Start Assessment
              </button>
            ) : (
              <span className="text-xs font-medium text-muted-foreground bg-secondary border border-border px-3 py-1.5 rounded flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Complete all lessons
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------- */
  /*  View: Lesson Flow                                                 */
  /* ----------------------------------------------------------------- */

  if (view === "lesson" && activeLevel && activeLesson) {
    const stages: LessonStage[] = ["learn", "activity", "practice", "feedback", "quiz", "complete"];
    const stageIdx = stages.indexOf(lessonStage);
    const correctOption = activeLesson.activity.options.find((o) => o.isCorrect);
    const activityCorrect = activitySelected === correctOption?.id;
    const quizAllAnswered = activeLesson.quiz.every((q) => quizAnswers[q.id] !== undefined);
    const quizScore = activeLesson.quiz.filter((q) => quizAnswers[q.id] === q.correctIndex).length;

    return (
      <div className="max-w-2xl mx-auto space-y-5 text-foreground font-sans">
        <button onClick={backToLevel} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
          <ChevronLeft className="w-4 h-4" /> {activeLevel.title}
        </button>

        <div className="flex items-center gap-1.5">
          {stages.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= stageIdx ? "bg-teal-600 dark:bg-teal-500" : "bg-secondary border border-border"}`} />
          ))}
        </div>

        {/* ---------------- LEARN ---------------- */}
        {lessonStage === "learn" && (
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <p className="text-xs uppercase tracking-wide text-teal-600 dark:text-teal-400 font-bold">Concept Briefing</p>
            </div>
            <h2 className="text-xl font-bold text-foreground">{activeLesson.title}</h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeLesson.estimatedMinutes} min read</span>
              <span className="px-2 py-0.5 rounded bg-secondary border border-border font-medium">{activeLesson.difficulty}</span>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5 text-teal-500" /> Learning Objectives</p>
              <ul className="space-y-1 pl-1">
                {activeLesson.learning.objectives.map((o, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                    <span className="text-teal-600 dark:text-teal-400 mt-0.5">&bull;</span> {o}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-foreground leading-relaxed pt-2">{activeLesson.learning.explanation}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg bg-secondary/50 border border-border p-3.5 space-y-2">
                <p className="text-xs font-semibold text-foreground">Key Points</p>
                <ul className="space-y-1">
                  {activeLesson.learning.keyPoints.map((k, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5 leading-relaxed">
                      <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" /> {k}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-secondary/50 border border-border p-3.5 space-y-2">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 text-amber-500" /> Common Mistakes</p>
                <ul className="space-y-1">
                  {activeLesson.learning.commonMistakes.map((m, i) => (
                    <li key={i} className="text-xs text-muted-foreground leading-relaxed">&bull; {m}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg bg-teal-500/10 border border-teal-500/30 p-3.5 flex items-start gap-2.5 text-xs text-foreground">
              <Quote className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed italic">{activeLesson.learning.realExample}</p>
            </div>

            <div className="rounded-lg bg-secondary/60 border border-border p-3.5 flex items-start gap-2.5 text-xs text-muted-foreground">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{activeLesson.learning.proTips[0]}</p>
            </div>

            <button onClick={() => setLessonStage("activity")} className={`${btnBase} ${btnPrimary} w-full mt-4`}>
              <ArrowRight className="w-4 h-4" /> Ready for Scenario Check
            </button>
          </div>
        )}

        {/* ---------------- ACTIVITY ---------------- */}
        {lessonStage === "activity" && (
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <p className="text-xs uppercase tracking-wide text-teal-600 dark:text-teal-400 font-bold">Scenario Practice</p>
            </div>
            <h2 className="text-lg font-bold text-foreground">{activeLesson.activity.prompt}</h2>

            <div className="space-y-2.5 pt-2">
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
                    className={`w-full text-left px-4 py-3 rounded-lg border text-xs leading-relaxed transition-all ${
                      isRight
                        ? "border-emerald-500/50 bg-emerald-500/10 text-foreground font-medium"
                        : isWrongSelected
                        ? "border-rose-500/50 bg-rose-500/10 text-foreground font-medium"
                        : isSelected
                        ? "border-teal-500 bg-teal-500/10 text-foreground font-medium"
                        : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
                <CheckCircle className="w-4 h-4" /> Submit Selection
              </button>
            ) : (
              <div className="space-y-3 pt-2">
                <p className={`text-xs font-semibold ${activityCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {activityCorrect ? "Accurate choice — this directly answers the interviewer's intent." : "Review the optimal option highlighted in green."}
                </p>
                <button onClick={goToPractice} className={`${btnBase} ${btnPrimary} w-full`}>
                  <ArrowRight className="w-4 h-4" /> Proceed to Voice Practice
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- PRACTICE / VOICE ---------------- */}
        {lessonStage === "practice" && (
          <div className="p-8 rounded-xl border border-border bg-card shadow-sm text-center space-y-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-semibold">Speaking Studio</p>
              <h2 className="text-xl font-bold text-foreground">{activeLesson.title}</h2>
            </div>

            <div
              className={`mx-auto w-28 h-28 rounded-full flex items-center justify-center border-2 transition-all ${
                isRecording
                  ? "border-rose-500/60 bg-rose-500/10 animate-pulse"
                  : hasRecording
                  ? "border-emerald-500/60 bg-emerald-500/10"
                  : "border-teal-500/40 bg-teal-500/10"
              }`}
            >
              <Mic className={`w-8 h-8 ${isRecording ? "text-rose-500" : hasRecording ? "text-emerald-500" : "text-teal-600 dark:text-teal-400"}`} />
            </div>

            <p className="text-2xl font-mono font-bold text-foreground">{fmtTime(seconds)}</p>

            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              {!isRecording && !hasRecording && (
                <button onClick={() => setIsRecording(true)} className={`${btnBase} ${btnPrimary}`}>
                  <Mic className="w-4 h-4" /> Record Response
                </button>
              )}
              {isRecording && (
                <>
                  <button onClick={() => setIsRecording(false)} className={`${btnBase} ${btnGhost}`}>
                    <Pause className="w-4 h-4" /> Pause
                  </button>
                  <button onClick={finishRecording} className={`${btnBase} ${btnGhost}`}>
                    <Square className="w-4 h-4" /> Stop & Review
                  </button>
                </>
              )}
              {hasRecording && (
                <>
                  <button onClick={reRecord} className={`${btnBase} ${btnGhost}`}>
                    <RotateCcw className="w-4 h-4" /> Re-record
                  </button>
                  <button onClick={requestFeedback} className={`${btnBase} ${btnPrimary}`}>
                    <ArrowRight className="w-4 h-4" /> Generate AI Analysis
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ---------------- AI FEEDBACK ---------------- */}
        {lessonStage === "feedback" && (
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">AI Voice Diagnostics</p>
              <h2 className="text-xl font-bold text-foreground">{activeLesson.title}</h2>
            </div>

            {loadingFeedback || !feedback ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 className="w-6 h-6 text-teal-600 dark:text-teal-400 animate-spin" />
                <p className="text-xs text-muted-foreground">Evaluating speech metrics & cadence...</p>
              </div>
            ) : (
              <>
                <div className="space-y-3.5">
                  {[
                    { label: "Confidence", val: feedback.confidence },
                    { label: "Fluency", val: feedback.fluency },
                    { label: "Clarity", val: feedback.clarity },
                    { label: "Grammar", val: feedback.grammar },
                    { label: "Pronunciation", val: feedback.pronunciation },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-foreground flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500" /> {s.label}
                        </span>
                        <span className="font-bold text-foreground font-mono">{s.val}%</span>
                      </div>
                      <Progress value={s.val} className="h-1.5 bg-secondary [&>div]:bg-teal-600 rounded-full" />
                    </div>
                  ))}
                </div>

                <div className="rounded-lg bg-teal-500/10 border border-teal-500/30 p-3.5 flex items-start gap-2.5 text-xs text-foreground">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <span className="font-bold">Mentor Feedback: </span>
                    {feedback.mentorTip}
                  </p>
                </div>

                <button onClick={() => setLessonStage("quiz")} className={`${btnBase} ${btnPrimary} w-full`}>
                  <ArrowRight className="w-4 h-4" /> Proceed to Checkpoint Quiz
                </button>
              </>
            )}
          </div>
        )}

        {/* ---------------- CHECKPOINT QUIZ ---------------- */}
        {lessonStage === "quiz" && (
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Checkpoint Quiz</p>
              <h2 className="text-lg font-bold text-foreground">Verify core principles</h2>
            </div>

            <div className="space-y-4">
              {activeLesson.quiz.map((q, qi) => (
                <div key={q.id} className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">{qi + 1}. {q.question}</p>
                  <div className="space-y-1.5">
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
                          className={`w-full text-left px-3.5 py-2 rounded-md border text-xs transition-all ${
                            isRight
                              ? "border-emerald-500/50 bg-emerald-500/10 text-foreground font-medium"
                              : isWrongSelected
                              ? "border-rose-500/50 bg-rose-500/10 text-foreground font-medium"
                              : selected
                              ? "border-teal-500 bg-teal-500/10 text-foreground font-medium"
                              : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
                className={`${btnBase} ${btnPrimary} w-full mt-2 ${!quizAllAnswered ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <CheckCircle className="w-4 h-4" /> Submit Answers
              </button>
            ) : (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-foreground font-mono">
                  Score: {quizScore} / {activeLesson.quiz.length} correct
                </p>
                <button onClick={completeLesson} className={`${btnBase} ${btnPrimary} w-full`}>
                  <ArrowRight className="w-4 h-4" /> Complete Lesson
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- LESSON COMPLETE ---------------- */}
        {lessonStage === "complete" && (
          <div className="p-8 rounded-xl border border-border bg-card shadow-sm text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Lesson Completed</h2>
            <p className="text-xs text-muted-foreground">{activeLesson.title}</p>
            <div className="flex items-center justify-center gap-6 font-mono">
              <div>
                <p className="text-xl font-bold text-amber-500">+{activeLesson.reward.xp}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-sans">XP</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-xl font-bold text-amber-500">+{activeLesson.reward.coins}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-sans">Coins</p>
              </div>
            </div>
            <button onClick={goNextLesson} className={`${btnBase} ${btnPrimary} w-full mt-4`}>
              <ArrowRight className="w-4 h-4" /> Next Lesson
            </button>
          </div>
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
      <div className="max-w-2xl mx-auto space-y-5 text-foreground font-sans">
        <button onClick={backToLevel} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
          <ChevronLeft className="w-4 h-4" /> {activeLevel.title}
        </button>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <p className="text-xs uppercase tracking-wide text-teal-600 dark:text-teal-400 font-bold">
              {activeLevel.isFinal ? "Final Assessment" : "Level Assessment"}
            </p>
          </div>
          <h2 className="text-xl font-bold text-foreground">{activeLevel.title}</h2>

          <div className="space-y-4">
            {activeLevel.assessment.map((q, qi) => (
              <div key={q.id} className="space-y-2">
                <p className="text-xs font-semibold text-foreground">{qi + 1}. {q.question}</p>
                <div className="space-y-1.5">
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
                        className={`w-full text-left px-3.5 py-2 rounded-md border text-xs transition-all ${
                          isRight
                            ? "border-emerald-500/50 bg-emerald-500/10 text-foreground font-medium"
                            : isWrongSelected
                            ? "border-rose-500/50 bg-rose-500/10 text-foreground font-medium"
                            : selected
                            ? "border-teal-500 bg-teal-500/10 text-foreground font-medium"
                            : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
              className={`${btnBase} ${btnPrimary} w-full mt-2 ${!allAnswered ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <CheckCircle className="w-4 h-4" /> Submit Assessment
            </button>
          ) : passed ? (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Passed &middot; {score} / {activeLevel.assessment.length} correct
              </p>
              <button onClick={passLevelAssessment} className={`${btnBase} ${btnPrimary} w-full`}>
                <ArrowRight className="w-4 h-4" /> {activeLevel.isFinal ? "Complete Arena" : "Unlock Next Level"}
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                Score: {score} / {activeLevel.assessment.length} correct. Review concepts and retry.
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
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------- */
  /*  View: Champion                                                    */
  /* ----------------------------------------------------------------- */

  if (view === "champion") {
    const finalLevel = course.levels.find((l) => l.isFinal);
    return (
      <div className="max-w-lg mx-auto text-foreground font-sans">
        <div className="p-8 rounded-xl border border-border bg-card shadow-sm text-center space-y-5">
          <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Communication Arena Cleared</h2>
          <p className="text-xs text-muted-foreground">You completed all interview communication modules.</p>

          <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/30 text-xs text-foreground text-left leading-relaxed">
            <p className="font-semibold mb-1">Placement Readiness Milestone:</p>
            You consistently lead with structured answers, clear metrics, and minimal fillers.
          </div>

          <button onClick={backToCampaign} className={`${btnBase} ${btnPrimary} w-full`}>
            <ChevronLeft className="w-4 h-4" /> Return to Campaign Overview
          </button>
        </div>
      </div>
    );
  }

  return null;
}