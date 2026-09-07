import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, X, CheckCircle2 } from "lucide-react";

interface DemoVideoProps {
  posterUrl?: string;
  videoUrl?: string;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const DemoVideo: React.FC<DemoVideoProps> = ({
  posterUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
  videoUrl,
  isOpenModal = false,
  onCloseModal,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const demoFeatures = [
    { title: "1. Real-Time IDE & Practice", desc: "Monaco IDE with multi-language starter templates, test runners & hidden test cases." },
    { title: "2. Aptitude & DI Engine", desc: "Quant formulas, logical reasoning puzzles & speed shortcut hints." },
    { title: "3. Spoken & Peer GD Lab", desc: "AI speech cadence, filler detection, STAR behavioral assistant & live GD rooms." },
    { title: "4. ATS Resume Intelligence", desc: "Live match scoring against tier-1 job descriptions & one-click AI enhancements." },
    { title: "5. 7-Stage Placement Roadmap", desc: "Personalized milestone tracker linking all 8 core preparation suites." },
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const content = (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-purple-500/30 bg-card overflow-hidden shadow-2xl transition-all font-sans">
      {/* Top Video Header Bar */}
      <div className="px-5 py-3.5 bg-secondary/80 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-semibold text-muted-foreground ml-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            PlaceMentor AI — Product Demonstration
          </span>
        </div>

        {isOpenModal && (
          <button
            onClick={onCloseModal}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden group">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            className="w-full h-full object-cover"
            playsInline
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          /* Feature Showcase Fallback when no MP4 file is mounted */
          <div className="relative w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/40 text-slate-100">
            {/* Background Poster Overlay */}
            {!isPlaying && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none transition-opacity"
                style={{ backgroundImage: `url(${posterUrl})` }}
              />
            )}

            {/* Live Interactive Tab Demo Display */}
            <div className="relative z-10 space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/40 bg-purple-500/20 text-purple-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Interactive Walkthrough Demo
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-display">
                {demoFeatures[activeTab].title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {demoFeatures[activeTab].desc}
              </p>
            </div>

            {/* Play Overlay Button */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <button
                  onClick={togglePlay}
                  aria-label="Play product video"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-purple-500 transition-all border-2 border-white/20"
                >
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1 fill-white" />
                </button>
              </div>
            )}

            {/* Interactive Module Timeline Selector */}
            <div className="relative z-10 grid grid-cols-5 gap-1.5 pt-4 border-t border-white/10">
              {demoFeatures.map((feat, idx) => (
                <button
                  key={feat.title}
                  onClick={() => {
                    setActiveTab(idx);
                    setIsPlaying(true);
                  }}
                  className={`p-2 rounded-xl text-[10px] sm:text-xs font-bold text-left transition-all border ${
                    activeTab === idx
                      ? "border-purple-500 bg-purple-500/20 text-white shadow-md"
                      : "border-white/10 bg-black/40 text-slate-400 hover:text-slate-200 hover:bg-black/60"
                  }`}
                >
                  <div className="truncate">{feat.title.split(" ")[1]}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Control Bar & Feature Checklist */}
      <div className="p-4 sm:p-5 bg-card border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl border border-border bg-secondary text-muted-foreground hover:text-foreground transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
            100% Real Application Workflow
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground flex-wrap justify-center">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> No Fake Simulations
          </span>
          <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Direct Backend Connected
          </span>
        </div>
      </div>
    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
        <div className="w-full max-w-4xl relative">{content}</div>
      </div>
    );
  }

  return content;
};
