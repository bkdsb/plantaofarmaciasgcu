"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CheckCircle2, PlusCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { createPharmacyAction } from "@/actions/admin/pharmacy-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { pharmacySchema, type PharmacyInput } from "@/lib/validators/pharmacy";

type PharmacyFormProps = {
  defaultRotationOrder: number;
};

type Feedback = {
  tone: "success" | "error";
  message: string;
};

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-medium text-rose-600">{message}</p>;
}

export function PharmacyForm({ defaultRotationOrder }: PharmacyFormProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const form = useForm<PharmacyInput>({
    resolver: zodResolver(pharmacySchema),
    defaultValues: {
      name: "",
      slug: "",
      phone: "",
      whatsapp: "",
      address: "",
      neighborhood: "",
      city: "Guaraciaba",
      logoUrl: "",
      colorHex: "",
      mapUrl: "",
      rotationOrder: defaultRotationOrder,
      status: "active"
    }
  });

  const name = form.watch("name");

  return (
    <Card id="nova-farmacia" className="border-primary/20">
      <CardHeader className="space-y-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <Building2 className="h-3.5 w-3.5" />
          Cadastro
        </div>
        <CardTitle className="text-base">Nova farmácia</CardTitle>
        <p className="text-sm text-muted-foreground">
          Preencha os dados abaixo para incluir a farmácia no rodízio e na área pública.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            setFeedback(null);
            startTransition(async () => {
              try {
                await createPharmacyAction(values);
                setFeedback({ tone: "success", message: "Farmácia cadastrada com sucesso." });
                form.reset({
                  ...values,
                  name: "",
                  slug: "",
                  phone: "",
                  whatsapp: "",
                  address: "",
                  neighborhood: "",
                  logoUrl: "",
                  colorHex: "",
                  mapUrl: "",
                  rotationOrder: Number(values.rotationOrder) + 1
                });
              } catch (error) {
                setFeedback({
                  tone: "error",
                  message: error instanceof Error ? error.message : "Não foi possível cadastrar a farmácia."
                });
              }
            });
          })}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nome</label>
              <Input placeholder="Farmácia Central Vida" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-medium">Slug</label>
                <button
                  type="button"
                  className="text-xs font-semibold text-primary hover:underline"
                  onClick={() => form.setValue("slug", toSlug(name), { shouldValidate: true })}
                >
                  Gerar do nome
                </button>
              </div>
              <Input placeholder="farmacia-central-vida" {...form.register("slug")} />
              <FieldError message={form.formState.errors.slug?.message} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Telefone</label>
              <Input placeholder="(49) 3321-0000" {...form.register("phone")} />
              <FieldError message={form.formState.errors.phone?.message} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">WhatsApp</label>
              <Input placeholder="(49) 99999-0000" {...form.register("whatsapp")} />
              <FieldError message={form.formState.errors.whatsapp?.message} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">Endereço</label>
              <Input placeholder="Av. Principal, 1200" {...form.register("address")} />
              <FieldError message={form.formState.errors.address?.message} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Bairro</label>
              <Input placeholder="Centro" {...form.register("neighborhood")} />
              <FieldError message={form.formState.errors.neighborhood?.message} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Cidade</label>
              <Input placeholder="Guaraciaba" {...form.register("city")} />
              <FieldError message={form.formState.errors.city?.message} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">URL do logo (opcional)</label>
              <Input placeholder="https://..." {...form.register("logoUrl")} />
              <FieldError message={form.formState.errors.logoUrl?.message} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">URL do mapa (opcional)</label>
              <Input placeholder="https://maps..." {...form.register("mapUrl")} />
              <FieldError message={form.formState.errors.mapUrl?.message} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Cor (opcional)</label>
              <Input placeholder="#0EA5E9" {...form.register("colorHex")} />
              <FieldError message={form.formState.errors.colorHex?.message} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Ordem do rodízio</label>
              <Input type="number" min={1} {...form.register("rotationOrder")} />
              <FieldError message={form.formState.errors.rotationOrder?.message} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select {...form.register("status")}>
                <option value="active">Ativa</option>
                <option value="inactive">Inativa</option>
              </Select>
              <FieldError message={form.formState.errors.status?.message} />
            </div>
          </div>

          <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
            <PlusCircle className="h-4 w-4" />
            {isPending ? "Salvando..." : "Salvar farmácia"}
          </Button>
        </form>

        {feedback ? (
          <p className={feedback.tone === "success" ? "text-sm font-medium text-success" : "text-sm font-medium text-rose-600"}>
            {feedback.tone === "success" ? <CheckCircle2 className="mr-1 inline h-4 w-4" /> : null}
            {feedback.message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
