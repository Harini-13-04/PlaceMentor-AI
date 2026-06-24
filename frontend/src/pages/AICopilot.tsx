import { Card } from "@/components/ui/card";
import { FileText, Building2, BrainCircuit, Map, ArrowRight } from "lucide-react";

export default function AICopilot() {
  const tools = [
    {
      title: "Resume Intelligence",
      desc: "Get an instant ATS score and AI-driven suggestions to optimize your resume for specific roles and keywords.",
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      borderHover: "hover:border-blue-400/50",
      action: "Scan Resume"
    },
    {
      title: "Dream Company Copilot",
      desc: "Select a target company (e.g., Google, Stripe) to get company-specific interview prep and behavioral questions.",
      icon: Building2,
      color: "text-primary",
      bg: "bg-primary/10",
      borderHover: "hover:border-primary/50",
      action: "Select Target"
    },
    {
      title: "Interview Pattern Intelligence",
      desc: "Analyze recent interview experiences across platforms to predict the most likely topics you'll face today.",
      icon: BrainCircuit,
      color: "text-accent",
      bg: "bg-accent/10",
      borderHover: "hover:border-accent/50",
      action: "View Patterns"
    },
    {
      title: "Personalized Roadmap",
      desc: "A dynamically adjusting learning path based on your strengths, weaknesses, and target roles.",
      icon: Map,
      color: "text-success",
      bg: "bg-success/10",
      borderHover: "hover:border-success/50",
      action: "View Roadmap"
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col items-center text-center mb-12 mt-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-6">
          <BrainCircuit className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">AI Copilot</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Your personal AI career strategist. Unlock predictive insights and hyper-personalized preparation for your dream role.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, i) => (
          <Card key={i} className={`glass-card p-8 border-white/5 ${tool.borderHover} transition-all duration-300 flex flex-col items-start group hover:-translate-y-1`}>
            <div className={`w-14 h-14 rounded-2xl ${tool.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <tool.icon className={`w-7 h-7 ${tool.color}`} />
            </div>
            <h3 className="text-xl font-display font-semibold text-white mb-3">{tool.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-8 flex-1">{tool.desc}</p>
            <button className={`flex items-center gap-2 text-sm font-semibold text-white group-hover:${tool.color} transition-colors px-4 py-2 rounded-lg bg-white/5 group-hover:bg-white/10 w-full justify-center mt-auto`}>
              {tool.action} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
