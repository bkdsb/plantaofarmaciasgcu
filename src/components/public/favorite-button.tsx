"use client";

import { useTransition } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleFavoritePharmacyAction } from "@/actions/public/preferences-actions";
import { ensureClientSession } from "@/lib/auth/client-session";

type FavoriteButtonProps = {
  pharmacyId: number;
  isFavorite: boolean;
};

export function FavoriteButton({ pharmacyId, isFavorite }: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      className="w-full"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          try {
            await ensureClientSession();
            await toggleFavoritePharmacyAction(pharmacyId, !isFavorite);
          } catch {
            // Evita crash no cliente caso sessão anônima esteja desabilitada.
          }
        });
      }}
    >
      <Heart className="h-4 w-4" />
      {isFavorite ? "Favorita" : "Favoritar"}
    </Button>
  );
}
