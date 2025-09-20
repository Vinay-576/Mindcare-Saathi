import VoiceAssistant from "@/components/VoiceAssistant";

export default function AIPage() {
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">AI</h1>
      <p className="text-muted-foreground max-w-2xl">A confidential, empathetic companion with female voice guidance. Use your mic or camera if you wish. You’re in control.</p>
      <VoiceAssistant />
    </div>
  );
}
