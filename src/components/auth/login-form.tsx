"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FeedbackState = "idle" | "success" | "error";

type LoginFormProps = {
  urlErrorCode?: string;
  urlError?: string;
};

export function LoginForm({ urlErrorCode, urlError }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("idle");

  const allowedAdminEmails = (process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS ?? "brunokalebe@gmail.com")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const normalizedEmail = email.trim().toLowerCase();
  const isAllowedEmail = allowedAdminEmails.includes(normalizedEmail);
  const isEmailLikelyValid = email.includes("@") && email.includes(".");

  const urlErrorMessage =
    urlError === "unauthorized_email"
      ? "Este e-mail não está autorizado para acessar o painel."
      : urlErrorCode === "otp_expired"
        ? "O link mágico expirou ou já foi usado. Solicite um novo link."
        : null;

  async function handleSignIn() {
    setMessage(null);
    setFeedbackState("idle");

    if (!isAllowedEmail) {
      setFeedbackState("error");
      setMessage("Somente o e-mail autorizado pode acessar o painel.");
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
          shouldCreateUser: false
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
        {message || urlErrorMessage ? (
          <p className={feedbackState === "error" || urlErrorMessage ? "text-xs text-rose-600" : "text-xs text-emerald-700"}>
            {message ?? urlErrorMessage}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Acesso permitido apenas para: <strong>{allowedAdminEmails[0] ?? "email autorizado"}</strong>.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
