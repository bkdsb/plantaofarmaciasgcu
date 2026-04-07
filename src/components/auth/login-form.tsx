"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSignIn() {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`
      }
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Enviamos um link de acesso para o seu email.");
    }
    setLoading(false);
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
        <Button className="w-full" disabled={loading || !email} onClick={handleSignIn}>
          Receber link mágico
        </Button>
        {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
