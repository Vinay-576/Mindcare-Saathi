import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, CalendarDays, Smile, Frown, Meh, Laugh, Angry } from "lucide-react";

type MoodKey = "excellent" | "good" | "okay" | "bad" | "verybad";

const MOODS: { key: MoodKey; label: string; emoji: string; color: string }[] = [
  { key: "excellent", label: "Excellent", emoji: "🌞", color: "bg-teal-600" },
  { key: "good", label: "Good", emoji: "🙂", color: "bg-emerald-600" },
  { key: "okay", label: "Okay", emoji: "😐", color: "bg-blue-600" },
  { key: "bad", label: "Bad", emoji: "😔", color: "bg-orange-600" },
  { key: "verybad", label: "Very bad", emoji: "🌧️", color: "bg-rose-600" },
];

interface Entry { date: string; mood: MoodKey }

const key = "saathi.moods";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  return x;
}

function formatYMD(d: Date) {
  return d.toISOString().slice(0, 10);
}

function computeStreak(entries: Entry[]): number {
  const set = new Set(entries.map((e) => e.date));
  let streak = 0;
  let cur = startOfDay(new Date());
  while (set.has(formatYMD(cur))) {
    streak += 1;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>(() => {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  });
  const todayKey = formatYMD(new Date());
  const today = entries.find((e) => e.date === todayKey);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(entries));
  }, [entries]);

  const streak = useMemo(() => computeStreak(entries), [entries]);

  const setMood = (m: MoodKey) => {
    setEntries((prev) => {
      const others = prev.filter((e) => e.date !== todayKey);
      return [...others, { date: todayKey, mood: m }].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const last14 = useMemo(() => {
    const map = new Map(entries.map((e) => [e.date, e.mood]));
    const days: { date: string; mood: MoodKey | null }[] = [];
    const d = startOfDay(new Date());
    for (let i = 13; i >= 0; i--) {
      const day = new Date(d);
      day.setDate(d.getDate() - i);
      const k = formatYMD(day);
      days.push({ date: k, mood: (map.get(k) as MoodKey) ?? null });
    }
    return days;
  }, [entries]);

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your wellness dashboard</h1>
          <p className="text-muted-foreground">Track how you feel and build a healthy streak.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border px-4 py-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-sm">Current streak</span>
          <span className="font-bold">{streak} day{streak === 1 ? "" : "s"}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {MOODS.map((m) => {
              const active = today?.mood === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setMood(m.key)}
                  className={`group relative rounded-2xl border p-4 text-left transition-all ${active ? `${m.color} text-white border-transparent` : "hover:border-foreground/20"}`}
                >
                  <div className="text-2xl mb-2">{m.emoji}</div>
                  <div className="font-semibold">{m.label}</div>
                  {active && (
                    <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-white/90" />
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">You can change this anytime today.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Last 14 days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 sm:[grid-template-columns:repeat(14,minmax(0,1fr))] gap-2">
            {last14.map((d) => {
              const mood = d.mood;
              const color =
                mood === "excellent" ? "bg-teal-500" :
                mood === "good" ? "bg-emerald-500" :
                mood === "okay" ? "bg-blue-500" :
                mood === "bad" ? "bg-orange-500" :
                mood === "verybad" ? "bg-rose-500" : "bg-muted";
              return (
                <div key={d.date} className="flex flex-col items-center text-xs text-muted-foreground">
                  <div className={`h-8 w-8 rounded-md border ${color}`} title={d.date} />
                  <span className="mt-1 hidden sm:block">{d.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
