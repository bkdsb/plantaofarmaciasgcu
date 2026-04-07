"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { saveNotificationPreferencesAction } from "@/actions/public/preferences-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  notificationPreferenceSchema,
  type NotificationPreferenceInput
} from "@/lib/validators/preferences";

type PreferencesFormProps = {
  defaultValues: NotificationPreferenceInput;
};

export function PreferencesForm({ defaultValues }: PreferencesFormProps) {
  const [isPending, startTransition] = useTransition();
  const { register, watch, setValue, handleSubmit } = useForm<NotificationPreferenceInput>({
    resolver: zodResolver(notificationPreferenceSchema),
    defaultValues
  });

  const receiveGeneralWeekly = watch("receiveGeneralWeekly");
  const receiveFavorites = watch("receiveFavorites");
  const receiveFavoriteReminder = watch("receiveFavoriteReminder");

  const onSubmit = (values: NotificationPreferenceInput) => {
    startTransition(async () => {
      await saveNotificationPreferencesAction(values);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Receber notificação geral semanal</p>
              <p className="text-xs text-muted-foreground">Farmácia de plantão da semana atual</p>
            </div>
            <Switch
              checked={receiveGeneralWeekly}
              onCheckedChange={(next) => setValue("receiveGeneralWeekly", next)}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Receber notificação de favorita</p>
              <p className="text-xs text-muted-foreground">Quando a sua favorita iniciar plantão</p>
            </div>
            <Switch checked={receiveFavorites} onCheckedChange={(next) => setValue("receiveFavorites", next)} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Aviso antecipado</p>
              <p className="text-xs text-muted-foreground">Exemplo: 1 dia antes da favorita</p>
            </div>
            <Switch
              checked={receiveFavoriteReminder}
              onCheckedChange={(next) => setValue("receiveFavoriteReminder", next)}
            />
          </div>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Dias de antecedência</span>
            <Input type="number" min={0} max={7} {...register("reminderDaysBefore", { valueAsNumber: true })} />
          </label>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isPending}>
        Salvar preferências
      </Button>
    </form>
  );
}
