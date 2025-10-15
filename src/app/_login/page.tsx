"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/`
              : undefined,
        },
      });
      if (error) setErr(error.message);
      else setSent(true);
    } catch (e: any) {
      setErr(e?.message || "Något gick fel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-[#d7def0] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0f1528] border border-[#1f2a46] rounded-2xl p-6">
        <h1 className="text-xl font-semibold mb-3">Logga in till Tintel</h1>
        <p className="text-sm opacity-70 mb-6">
          Skriv din e-post så skickar vi en magisk länk. Endast inbjudna konton.
        </p>

        {sent ? (
          <div className="text-sm">
            Kolla din e-post (<span className="opacity-70">{email}</span>) för
            en inloggningslänk.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="namn@företag.se"
              className="bg-[#0b1326] border border-[#1f2a46] rounded-xl px-3 py-2 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl px-3 py-2 border border-[#2a3550] bg-[#121938] disabled:opacity-60"
            >
              {loading ? "Skickar…" : "Skicka magisk länk"}
            </button>
            {err && <div className="text-red-400 text-sm">{err}</div>}
          </form>
        )}
      </div>
    </div>
  );
}
