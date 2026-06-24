import { Card } from "@/components/ui/card";
import { Mic, Star, CheckCircle, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Communication() {
  const modules = [
    "Self Introduction", "Tell Me About Yourself", "Strengths & Weaknesses",
    "Why Should We Hire You", "Career Goals", "Elevator Pitch", "Group Discussion"
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight mb-3">Communication Lab</h1>
        <p className="text-lg text-muted-foreground">Master your interviews with real-time AI speech and sentiment analysis.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-2xl font-display font-semibold text-white">Practice Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod, i) => (
              <Card key={i} className="glass-card p-6 border-white/5 hover:border-accent/40 transition-all duration-300 cursor-pointer group hover:-translate-y-1">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <Mic className="w-6 h-6" />
                  </div>
                  {i < 2 && <span className="text-xs font-medium text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-md">Completed</span>}
                </div>
                <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-accent transition-colors">{mod}</h3>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">Est. 2-3 mins</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-display font-semibold text-white">Latest AI Feedback</h2>
          <Card className="glass-card p-6 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] -z-10 rounded-full"></div>
            
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-1">Module</p>
              <h3 className="font-semibold text-white text-lg">"Tell Me About Yourself"</h3>
            </div>
            
            <div className="space-y-6">
              {[
                { label: "Confidence", val: 92, color: "bg-success" },
                { label: "Grammar", val: 88, color: "bg-primary" },
                { label: "Clarity", val: 85, color: "bg-accent" },
                { label: "Professionalism", val: 95, color: "bg-blue-400" }
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/90 font-medium">{stat.label}</span>
                    <span className="font-bold text-white">{stat.val}%</span>
                  </div>
                  <Progress value={stat.val} className={`h-2 bg-white/5 [&>div]:${stat.color} rounded-full`} />
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" /> Key Strengths
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5"/> 
                  <span className="leading-relaxed">Good structured response covering past, present, and future.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5"/> 
                  <span className="leading-relaxed">Excellent pacing and tone variation kept the listener engaged.</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
