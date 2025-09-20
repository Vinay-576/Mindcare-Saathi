import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import VoiceAssistant from "@/components/VoiceAssistant";

export default function Index() {
  return (
    <div className="bg-gradient-to-b from-background to-background">
      <section className="container py-12 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
              Confidential • Empathetic • India-first
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              AI-powered, confidential support for youth mental wellness
            </h1>
            <p className="text-lg text-muted-foreground">
              Saathi helps students and young adults navigate stress, stigma, and emotions with a warm, supportive companion. Speak or type in a private space and track your mood over time.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard">
                <Button size="lg">Open dashboard</Button>
              </Link>
              <a href="#assistant">
                <Button size="lg" variant="secondary">Start a confidential chat</Button>
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-teal-200/50 to-violet-200/50 blur-2xl dark:from-teal-900/30 dark:to-violet-900/30" />
            <VoiceAssistant />
          </div>
        </div>
      </section>
      <section id="assistant" className="container pb-20">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="mb-2">Designed for privacy and care</h2>
            <p>
              Your conversations stay on your device unless you choose to share. You can enable camera and mic for richer support and voice feedback, and turn them off anytime.
            </p>
            <ul>
              <li>Female voice guidance with gentle, natural tone</li>
              <li>Mic and camera controls with live preview</li>
              <li>Daily check-in notifications</li>
              <li>Dashboard to log how you feel from Excellent to Very Bad with streaks</li>
            </ul>
            <Link to="/dashboard">
              <Button className="mt-4">Go to dashboard</Button>
            </Link>
          </div>
          <div>
            <VoiceAssistant />
          </div>
        </div>
      </section>
    </div>
  );
}
