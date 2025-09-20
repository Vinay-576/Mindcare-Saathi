import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function SignUp() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-3xl font-extrabold tracking-tight">Create account</h1>
      <p className="text-muted-foreground mb-6">Join Saathi to start your journey.</p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email || !password || !name) {
            toast({ title: "Missing fields", description: "Please fill all fields." });
            return;
          }
          toast({ title: "Sign up", description: "Demo only — account creation coming soon." });
        }}
      >
        <div>
          <label className="text-sm" htmlFor="name">Full name</label>
          <Input id="name" placeholder="Your name" value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm" htmlFor="email">Email</label>
          <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm" htmlFor="password">Password</label>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">Create account</Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">Have an account? <Link to="/signin" className="underline">Sign in</Link></p>
    </div>
  );
}
