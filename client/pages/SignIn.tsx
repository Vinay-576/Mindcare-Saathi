import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function SignIn() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-3xl font-extrabold tracking-tight">Sign in</h1>
      <p className="text-muted-foreground mb-6">Welcome back to Saathi.</p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email || !password) {
            toast({ title: "Missing fields", description: "Please enter email and password." });
            return;
          }
          toast({ title: "Sign in", description: "Demo only — authentication coming soon." });
        }}
      >
        <div>
          <label className="text-sm" htmlFor="email">Email</label>
          <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm" htmlFor="password">Password</label>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">No account? <Link to="/signup" className="underline">Sign up</Link></p>
    </div>
  );
}
