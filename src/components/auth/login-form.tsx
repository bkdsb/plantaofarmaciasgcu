"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const [captchaReady, setCaptchaReady] = useState(false);

  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const pendingEmailRef = useRef<string | null>(null);

  const allowedAdminEmails = (process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS ?? "brunokalebe@gmail.com")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const normalizedEmail = email.trim().toLowerCase();
  const isAllowedEmail = allowedAdminEmails.includes(normalizedEmail);
  const isEmailLikelyValid = email.includes("@") && email.includes(".");

  const urlErrorMessage =
    urlError === "unauthorized_email"
      ? "Este e-mail não está autorizado para acessar o painel."
      : urlError === "auth_callback_invalid_link"
        ? "Link inválido. Solicite um novo link mágico."
        : urlError === "auth_session_missing"
          ? "Não foi possível criar sessão com este link. Solicite outro."
          : urlError === "auth_callback_failed"
            ? "Falha ao validar o link mágico. Solicite outro."
      : urlErrorCode === "otp_expired"
        ? "O link mágico expirou ou já foi usado. Solicite um novo link."
        : null;

  const requestMagicLink = useCallback(async (emailToSend: string, captchaToken: string) => {
    const response = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailToSend,
        captchaToken
      })
    });

    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      throw new Error(payload?.error ?? "Falha ao enviar link mágico.");
    }
  }, []);

  useEffect(() => {
    if (!turnstileSiteKey) {
      return;
    }

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !window.turnstile || !captchaContainerRef.current || widgetIdRef.current) {
        return;
      }

      const widgetId = window.turnstile.render(captchaContainerRef.current, {
        sitekey: turnstileSiteKey,
        size: "invisible",
        callback: async (token) => {
          const emailToSend = pendingEmailRef.current;
          if (!emailToSend) {
            setLoading(false);
            return;
          }

          try {
            await requestMagicLink(emailToSend, token);
            setFeedbackState("success");
            setMessage("Link enviado. Verifique sua caixa de entrada e spam.");
          } catch (error) {
            setFeedbackState("error");
            setMessage(error instanceof Error ? error.message : "Falha ao enviar link mágico.");
          } finally {
            setLoading(false);
            pendingEmailRef.current = null;
            if (window.turnstile && widgetIdRef.current) {
              window.turnstile.reset(widgetIdRef.current);
            }
          }
        },
        "error-callback": () => {
          setFeedbackState("error");
          setMessage("Falha no captcha invisível. Tente novamente.");
          setLoading(false);
        },
        "expired-callback": () => {
          if (window.turnstile && widgetIdRef.current) {
            window.turnstile.reset(widgetIdRef.current);
          }
        }
      });

      widgetIdRef.current = widgetId;
      setCaptchaReady(true);
    };

    if (window.turnstile) {
      renderWidget();
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      renderWidget();
    };
    script.onerror = () => {
      setFeedbackState("error");
      setMessage("Não foi possível carregar captcha de proteção.");
    };
    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [requestMagicLink, turnstileSiteKey]);

  async function handleSignIn() {
    setMessage(null);
    setFeedbackState("idle");

    if (!isAllowedEmail) {
      setFeedbackState("error");
      setMessage("Somente o e-mail autorizado pode acessar o painel.");
      return;
    }

    if (!turnstileSiteKey) {
      setFeedbackState("error");
      setMessage("Captcha não configurado. Contate o administrador.");
      return;
    }

    if (!window.turnstile || !widgetIdRef.current || !captchaReady) {
      setFeedbackState("error");
      setMessage("Captcha ainda carregando. Tente novamente em alguns segundos.");
      return;
    }

    setLoading(true);
    pendingEmailRef.current = normalizedEmail;
    window.turnstile.execute(widgetIdRef.current);
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
        <div ref={captchaContainerRef} className="hidden" aria-hidden="true" />
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
