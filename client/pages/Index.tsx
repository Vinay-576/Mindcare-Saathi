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
              Saathi helps students and young adults navigate stress, stigma,
              and emotions with a warm, supportive companion. Speak or type in a
              private space and track your mood over time.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard">
                <Button size="lg">Open dashboard</Button>
              </Link>
              <Link to="/ai">
                <Button size="lg" variant="secondary">
                  Start a confidential chat
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-teal-200/50 to-violet-200/50 blur-2xl dark:from-teal-900/30 dark:to-violet-900/30" />
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <div className="text-sm text-muted-foreground">Preview</div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gradient-to-br from-teal-200 to-teal-100 dark:from-teal-900/40 dark:to-teal-800/20 p-6">
                  <div className="text-xs font-medium text-teal-700 dark:text-teal-300">
                    Privacy
                  </div>
                  <div className="mt-1 text-sm">
                    End-to-end control, mic/camera off by default
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-violet-200 to-violet-100 dark:from-violet-900/40 dark:to-violet-800/20 p-6">
                  <div className="text-xs font-medium text-violet-700 dark:text-violet-300">
                    Voice
                  </div>
                  <div className="mt-1 text-sm">
                    Gentle female voice guidance
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-emerald-200 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/20 p-6">
                  <div className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    Streaks
                  </div>
                  <div className="mt-1 text-sm">Build healthy daily habits</div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900/40 dark:to-sky-800/20 p-6">
                  <div className="text-xs font-medium text-sky-700 dark:text-sky-300">
                    Notifications
                  </div>
                  <div className="mt-1 text-sm">Gentle daily check-ins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="assistant" className="container pb-20">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="mb-2">Designed for privacy and care</h2>
            <p>
              Your conversations stay on your device unless you choose to share.
              You can enable camera and mic for richer support and voice
              feedback, and turn them off anytime.
            </p>
            <ul>
              <li>Female voice guidance with gentle, natural tone</li>
              <li>Mic and camera controls with live preview</li>
              <li>Daily check-in notifications</li>
              <li>
                Dashboard to log how you feel from Excellent to Very Bad with
                streaks
              </li>
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
