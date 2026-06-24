import { Command, Terminal, Sparkles } from "lucide-react";

const Index = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-[#000000] text-[#EDEDED] selection:bg-white/10 font-sans">
    <div className="w-full max-w-[540px] px-6 flex flex-col items-center text-center mt-12">
      
      {/* Premium Logo Wrapper */}
      <div className="relative flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-950 border border-white/10 shadow-2xl group">
        <div className="absolute inset-0 rounded-2xl bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors" />
        <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full opacity-50" />
        {/* Greta Logo from greta-favicon.svg */}
        <svg width="32" height="32" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
          <path d="M11.1807 0H23.6231V5.72528H12.4881C9.15183 5.72528 6.44725 8.47527 6.44725 11.8115C6.44725 15.098 9.11146 17.807 12.3979 17.807L17.6273 13.8398L12.2627 13.93V9.46699H23.6231V23.7576L17.6273 20.9626L14.6069 23.1265L12.0481 23.1589C5.61775 23.2403 0.361328 18.05 0.361328 11.6191V10.8194C0.361328 4.84402 5.20534 0 11.1807 0Z" fill="white"/>
          <path opacity="0.2" d="M0.644531 8.48535L14.6247 22.9491C14.6247 22.9491 11.2037 23.6001 8.40244 22.6663C5.45263 21.683 2.56121 19.0697 1.61344 17.0097C-0.486785 12.445 0.644531 8.48535 0.644531 8.48535Z" fill="white"/>
          <path d="M23.5767 16.5896L14.6056 23.0812C14.6056 23.0812 12.2485 23.1998 10.7459 23.0812C8.56258 22.9089 7.14844 22.0604 7.14844 22.0604L12.4868 17.7617L23.5767 9.4668V16.5896Z" fill="white" fillOpacity="0.8"/>
        </svg>
      </div>

      {/* Subtle status badge */}
      <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-[12px] font-medium text-zinc-400 mb-8 backdrop-blur-md transition-colors hover:bg-white/[0.04]">
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse"></span>
        Environment ready
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-[40px] leading-tight font-semibold tracking-[-0.02em] mb-5 text-white">
        Application initialized.
      </h1>

      {/* Subheading */}
      <p className="text-zinc-400 text-[15px] sm:text-base mb-12 max-w-[480px] mx-auto leading-relaxed font-light">
        The base foundation is ready. Agent modifications will appear here shortly. If your requested changes aren't visible after the first prompt, ask the Greta agent to fix it.
      </p>

      {/* Minimalist Instructions Box */}
      <div className="w-full text-left border border-white/[0.08] rounded-2xl bg-[#0A0A0A] p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="flex items-center gap-2.5 mb-6 text-zinc-500">
          <Terminal className="h-4 w-4" />
          <span className="text-xs uppercase tracking-widest font-semibold">Suggested commands</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-4 text-zinc-400 p-3 -mx-3 rounded-xl transition-all hover:bg-white/[0.03] group cursor-default">
            <div className="mt-0.5 p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.05] group-hover:bg-white/[0.08] group-hover:border-white/10 transition-colors shadow-sm">
              <Command className="h-4 w-4 text-zinc-300" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] leading-relaxed">
                Describe a new feature. E.g., <span className="text-zinc-100 font-medium">"Create a user dashboard"</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 text-zinc-400 p-3 -mx-3 rounded-xl transition-all hover:bg-white/[0.03] group cursor-default">
            <div className="mt-0.5 p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.05] group-hover:bg-white/[0.08] group-hover:border-white/10 transition-colors shadow-sm">
              <Sparkles className="h-4 w-4 text-zinc-300" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] leading-relaxed">
                Modify the design. E.g., <span className="text-zinc-100 font-medium">"Switch to dark mode"</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-16 text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-medium">
        Ready for production
      </div>
    </div>
  </div>
);

export default Index;
