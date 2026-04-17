"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Incorrect password. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-light px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-black tracking-tight text-primary">ESTAMPA</h1>
        <p className="mt-1 text-sm text-muted">Enter the site password to continue.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-primary">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-base text-primary placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-500">{error}</p>
          )}

          <Button type="submit" size="xl" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Checking…" : "Enter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
