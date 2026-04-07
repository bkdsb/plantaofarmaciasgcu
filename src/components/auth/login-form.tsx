"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FeedbackState = "idle" | "success" | "error";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("idle");

  const isEmailLikelyValid = email.includes("@") && email.includes(".");

  async function handleSignIn() {
    setMessage(null);
    setFeedbackState("idle");

    try {
      setLoading(true);
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`
        }
      });

      if (error) {
        setFeedbackState("error");
        setMessage(error.message);
        return;
      }

      setFeedbackState("success");
      setMessage("Link enviado. Verifique sua caixa de entrada e spam.");
    } catch (error) {
      setFeedbackState("error");
      setMessage(error instanceof Error ? error.message : "Falha inesperada ao enviar link mágico.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto mt-12 max-w-md">
      <CardHeader>
        <CardTitle>Acessar painel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button className="w-full" disabled={loading || !isEmailLikelyValid} onClick={handleSignIn}>
          {loading ? "Enviando..." : "Receber link mágico"}
        </Button>
        {message ? (
          <p className={feedbackState === "error" ? "text-xs text-rose-600" : "text-xs text-emerald-700"}>{message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Use o mesmo e-mail que terá acesso de superadmin.</p>
        )}
      </CardContent>
    </Card>
  );
}
