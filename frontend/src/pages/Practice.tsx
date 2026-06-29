import { useState } from "react";   
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, CheckCircle2, Circle } from "lucide-react";

export default function Practice() {
  const topics = ["Arrays", "Strings", "Linked Lists", "Stacks", "Queues", "Trees", "DBMS", "OOP", "System Design"];
  const langs = ["Python", "Java", "C++", "JavaScript"];
  const difficulties = ["Easy", "Medium", "Hard"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight mb-3">Practice Arena</h1>
          <p className="text-lg text-muted-foreground">Master data structures and algorithms with AI feedback.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select defaultValue="Python">
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {langs.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select defaultValue="Medium">
            <SelectTrigger className="w-[120px] bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {topics.map(topic => (
          <Badge 
            key={topic} 
            variant="outline" 
            className="bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/50 hover:text-primary text-white/80 cursor-pointer px-5 py-2 whitespace-nowrap transition-all rounded-xl text-sm font-medium"
          >
            {topic}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { title: "Two Sum", difficulty: "Easy", topic: "Arrays", status: "completed", accuracy: "100%" },
          { title: "Valid Parentheses", difficulty: "Easy", topic: "Stacks", status: "completed", accuracy: "95%" },
          { title: "LRU Cache", difficulty: "Medium", topic: "Linked Lists", status: "todo", accuracy: "-" },
          { title: "Course Schedule", difficulty: "Medium", topic: "Graphs", status: "todo", accuracy: "-" },
          { title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Arrays", status: "todo", accuracy: "-" },
          { title: "Merge K Sorted Lists", difficulty: "Hard", topic: "Linked Lists", status: "todo", accuracy: "-" },
        ].map((q, i) => (
          <Card key={i} className="glass-card p-5 border-white/5 hover:border-primary/40 transition-all duration-300 group flex items-center justify-between cursor-pointer hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              {q.status === 'completed' ? (
                <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground shrink-0" />
              )}
              <div>
                <h3 className="font-medium text-white text-base group-hover:text-primary transition-colors">{q.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                    q.difficulty === 'Easy' ? 'text-success border-success/20 bg-success/10' :
                    q.difficulty === 'Medium' ? 'text-orange-400 border-orange-400/20 bg-orange-400/10' :
                    'text-red-400 border-red-400/20 bg-red-400/10'
                  }`}>
                    {q.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-md">{q.topic}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {q.status === 'completed' && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground mb-0.5">Accuracy</p>
                  <p className="text-sm font-bold text-success">{q.accuracy}</p>
                </div>
              )}
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-muted-foreground transition-colors shadow-sm">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

