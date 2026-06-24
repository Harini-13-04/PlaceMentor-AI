import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Shield, MapPin, Link as LinkIcon, Github, Linkedin } from "lucide-react";

export default function Profile() {
  const skills = ["React", "TypeScript", "Python", "System Design", "AWS", "Node.js", "MongoDB", "GraphQL"];
  
  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Banner & Header */}
      <div className="relative rounded-3xl overflow-hidden glass-card border-white/5">
        <div className="h-48 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 relative">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm mix-blend-overlay"></div>
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 mb-4">
            <img 
              src="https://i.pravatar.cc/300?u=12" 
              alt="Profile" 
              className="w-32 h-32 rounded-2xl border-4 border-background shadow-xl object-cover bg-background relative z-10"
            />
            <div className="flex-1 pb-2">
              <h1 className="text-4xl font-display font-bold text-white mb-1">Alex Chen</h1>
              <p className="text-muted-foreground text-lg">Full Stack Developer Student</p>
            </div>
            <div className="flex gap-3 pb-2 pt-4 md:pt-0">
              <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors">
                <Github className="w-5 h-5" />
              </button>
              <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-[#0A66C2]/20 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mt-4">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/50" /> San Francisco, CA</div>
            <div className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-white/50" /> alexchen.dev</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card className="glass-card p-6 border-white/5">
            <h3 className="font-display font-semibold text-lg text-white mb-5">Level & XP</h3>
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Current Level</p>
                <p className="text-3xl font-display font-bold text-primary">Lvl 12</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">4,500 <span className="text-muted-foreground">/ 5,000 XP</span></p>
              </div>
            </div>
            <Progress value={90} className="h-2.5 bg-white/5 [&>div]:bg-primary rounded-full" />
          </Card>

          <Card className="glass-card p-6 border-white/5">
            <h3 className="font-display font-semibold text-lg text-white mb-5">Top Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <Badge key={s} variant="secondary" className="bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors text-white/90 font-medium border border-white/10 px-3 py-1.5 rounded-lg text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="glass-card p-6 border-white/5">
            <h3 className="font-display font-semibold text-lg text-white mb-5">Badges</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
                { icon: Shield, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
                { icon: Star, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
              ].map((b, i) => (
                <div key={i} className={`aspect-square rounded-2xl ${b.bg} border ${b.border} flex items-center justify-center hover:scale-105 transition-transform cursor-pointer`} title="Achievement unlocked">
                  <b.icon className={`w-8 h-8 ${b.color}`} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card p-6 border-white/5">
            <h3 className="font-display font-semibold text-lg text-white mb-4">About Me</h3>
            <p className="text-muted-foreground leading-relaxed text-base">
              Passionate computer science student with a focus on building scalable web applications. 
              Currently actively preparing for software engineering roles. I love participating in hackathons 
              and contributing to open-source projects. Always looking to learn new technologies and improve my problem-solving skills.
            </p>
          </Card>

          <Card className="glass-card p-8 border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display font-semibold text-lg text-white">Activity Grid</h3>
                <p className="text-sm text-muted-foreground mt-1">45 contributions in the last month</p>
              </div>
              <span className="text-sm bg-orange-500/10 text-orange-500 border border-orange-500/20 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> 12 Day Streak
              </span>
            </div>
            
            {/* Simple Grid Representation */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {Array.from({ length: 24 }).map((_, col) => (
                <div key={col} className="flex flex-col gap-2">
                  {Array.from({ length: 7 }).map((_, row) => {
                    const isActive = Math.random() > 0.5;
                    const intensity = Math.floor(Math.random() * 4);
                    let colorClass = "bg-white/5";
                    if (isActive) {
                      if (intensity === 0) colorClass = "bg-success/30";
                      else if (intensity === 1) colorClass = "bg-success/50";
                      else if (intensity === 2) colorClass = "bg-success/80";
                      else colorClass = "bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]";
                    }
                    return (
                      <div key={row} className={`w-3.5 h-3.5 rounded-[3px] ${colorClass} hover:ring-2 hover:ring-white/50 transition-all cursor-pointer`} />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1.5">
                <div className="w-3.5 h-3.5 rounded-[3px] bg-white/5" />
                <div className="w-3.5 h-3.5 rounded-[3px] bg-success/30" />
                <div className="w-3.5 h-3.5 rounded-[3px] bg-success/50" />
                <div className="w-3.5 h-3.5 rounded-[3px] bg-success/80" />
                <div className="w-3.5 h-3.5 rounded-[3px] bg-success" />
              </div>
              <span>More</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Missing import added here for standalone usage visualization
import { Flame } from "lucide-react";
