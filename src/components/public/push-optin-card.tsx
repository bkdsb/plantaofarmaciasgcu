"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { base64UrlToUint8Array, registerServiceWorker } from "@/lib/notifications/sw";

type PushOptinCardProps = {
  compact?: boolean;
};

export function PushOptinCard({ compact = false }: PushOptinCardProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  async function handleEnable() {
    if (typeof window === "undefined" || !window.Notification || !window.isSecureContext) {
      setMessage("Este navegador não suporta notificações push.");
      return;
    }

    const preflightResponse = await fetch("/api/push/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    if (preflightResponse.status === 401) {
      router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    if (!preflightResponse.ok) {
      setMessage("Não foi possível validar sua sessão.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setMessage("Permissão não concedida.");
      return;
    }

    const registration = await registerServiceWorker();
    if (!registration) {
      setMessage("Não foi possível registrar o service worker.");
      return;
    }

    const vapidPublicKey = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY;
    if (!vapidPublicKey) {
      setMessage("Configuração de push ausente. Contate o administrador.");
      return;
    }

    startTransition(async () => {
      try {
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: base64UrlToUint8Array(vapidPublicKey)
          });
        }

        const payload = subscription.toJSON();
        if (!payload.endpoint || !payload.keys?.p256dh || !payload.keys?.auth) {
          setMessage("Não foi possível ler a inscrição do navegador.");
          return;
        }

        const subscribeResponse = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: payload.endpoint,
            keys: {
              p256dh: payload.keys.p256dh,
              auth: payload.keys.auth
            }
          })
        });

        if (subscribeResponse.status === 401) {
          router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
          return;
        }

        if (!subscribeResponse.ok) {
          setMessage("Falha ao salvar inscrição de notificações.");
          return;
        }

        const preferenceResponse = await fetch("/api/push/preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isOptedInPush: true })
        });

        if (!preferenceResponse.ok) {
          setMessage("Inscrição salva, mas houve falha ao atualizar preferências.");
          return;
        }

        setMessage("Notificações ativadas para este dispositivo.");
      } catch {
        setMessage("Não foi possível ativar notificações agora.");
      }
    });
  }

  if (compact) {
    return (
      <div className="space-y-1">
        <Button className="w-full" disabled={isPending} onClick={handleEnable}>
          <Bell className="h-4 w-4" />
          {isPending ? "Ativando..." : "Ativar notificações"}
        </Button>
        {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notificações push</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Ative para receber aviso semanal do plantão e alerta da sua farmácia favorita.
        </p>
        <Button className="w-full" disabled={isPending} onClick={handleEnable}>
          Ativar notificações
        </Button>
        {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
