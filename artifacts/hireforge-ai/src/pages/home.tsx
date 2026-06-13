import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, BarChart2, Briefcase, Github, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 selection:text-primary">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-lg tracking-tight text-primary">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-primary text-xs">H</span>
            </div>
            HireForge AI
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-32 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8">
              <Zap className="h-3 w-3" /> HireForge OS 2.0 is now live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-8 leading-[1.1]">
              The command center for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                serious career professionals.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Gain an unfair advantage in the talent market. Dense information architecture, AI-powered intelligence, and a workflow built for speed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                  Deploy Workspace <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base border-border/50 hover:bg-muted">
                  Explore Features
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-6 py-24 border-t border-border/40">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Uncompromising Intelligence</h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Built for depth, not just breadth. Every tool in the suite is designed to extract maximum signal from noise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Github,
                title: "Deep GitHub Analysis",
                desc: "Beyond just commit counts. We analyze code quality, tech stack breadth, and developer archetypes."
              },
              {
                icon: Terminal,
                title: "Resume Parsing Engine",
                desc: "Structured data extraction that actually works. Maps skills, timelines, and missing capabilities instantly."
              },
              {
                icon: Briefcase,
                title: "Pipeline Telemetry",
                desc: "Track roles with terminal-like efficiency. Kanban boards meet spreadsheet density."
              },
              {
                icon: BarChart2,
                title: "Actionable Reporting",
                desc: "Generate executive-ready candidate briefs with a single click. No fluff, just signal."
              },
              {
                icon: ShieldCheck,
                title: "Enterprise Grade",
                desc: "Dark mode default. Keyboard shortcuts. Sub-100ms interactions. Built for the power user."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12 bg-card">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-primary mb-4 md:mb-0">
            <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-primary text-[10px]">H</span>
            </div>
            HireForge AI
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} HireForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
