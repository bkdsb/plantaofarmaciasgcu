"use client";

import { useState, useTransition } from "react";

import { enablePushNotificationsAction } from "@/actions/public/preferences-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registerServiceWorker } from "@/lib/notifications/sw";

export function PushOptinCard() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  async function handleEnable() {
    if (typeof window === "undefined" || !window.Notification) {
      setMessage("Este navegador não suporta notificações push.");
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

    startTransition(async () => {
      await enablePushNotificationsAction();
      setMessage("Notificações ativadas para este dispositivo.");
    });
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
