import { ReactNode } from "react";
import { Sidebar } from "./sidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-auto bg-card/50 border-l border-border/50 rounded-tl-2xl shadow-[-4px_0_24px_rgba(0,0,0,0.2)]">
          {children}
        </div>
      </main>
    </div>
  );
}
