"use client";

import { useTransition } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleFavoritePharmacyAction } from "@/actions/public/preferences-actions";

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
          await toggleFavoritePharmacyAction(pharmacyId, !isFavorite);
        });
      }}
    >
      <Heart className="h-4 w-4" />
      {isFavorite ? "Favorita" : "Favoritar"}
    </Button>
  );
}
