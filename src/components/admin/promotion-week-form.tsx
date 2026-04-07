"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { upsertPromotionWeekAction } from "@/actions/admin/promotion-actions";
import { MAX_PROMOTION_PRODUCTS_PER_WEEK } from "@/lib/constants";
import { promotionWeekSchema, type PromotionWeekInput } from "@/lib/validators/promotion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function PromotionWeekForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<PromotionWeekInput>({
    resolver: zodResolver(promotionWeekSchema),
    defaultValues: {
      pharmacyId: 1,
      weekStart: new Date().toISOString().slice(0, 10),
      weekEnd: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: "draft",
      products: [
        {
          name: "",
          shortDescription: "",
          imageUrl: "",
          normalPrice: 0,
          promotionalPrice: 0,
          displayOrder: 1,
          isHighlighted: false,
          status: "active"
        }
      ]
    }
  });

  const productsField = useFieldArray({ control: form.control, name: "products" });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Semana promocional</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit((values) => {
            startTransition(async () => {
              await upsertPromotionWeekAction(values);
            });
          })}
        >
          <Input type="number" placeholder="ID da farmácia" {...form.register("pharmacyId")} />
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" {...form.register("weekStart")} />
            <Input type="date" {...form.register("weekEnd")} />
          </div>
          <Select {...form.register("status")}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </Select>

          <div className="space-y-2">
            {productsField.fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Produto {index + 1}
                </p>
                <div className="grid gap-2">
                  <Input placeholder="Nome" {...form.register(`products.${index}.name`)} />
                  <Input placeholder="Descrição curta" {...form.register(`products.${index}.shortDescription`)} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" step="0.01" placeholder="Preço normal" {...form.register(`products.${index}.normalPrice`)} />
                    <Input type="number" step="0.01" placeholder="Preço promocional" {...form.register(`products.${index}.promotionalPrice`)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (productsField.fields.length < MAX_PROMOTION_PRODUCTS_PER_WEEK) {
                  productsField.append({
                    name: "",
                    shortDescription: "",
                    imageUrl: "",
                    normalPrice: 0,
                    promotionalPrice: 0,
                    displayOrder: productsField.fields.length + 1,
                    isHighlighted: false,
                    status: "active"
                  });
                }
              }}
            >
              Adicionar produto
            </Button>
            <Button type="submit" disabled={isPending}>Salvar semana</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
