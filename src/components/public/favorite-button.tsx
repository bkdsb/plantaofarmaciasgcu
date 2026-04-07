"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleFavoritePharmacyAction } from "@/actions/public/preferences-actions";
import { createClient } from "@/lib/supabase/client";

type FavoriteButtonProps = {
  pharmacyId: number;
  isFavorite: boolean;
};

export function FavoriteButton({ pharmacyId, isFavorite }: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      className="w-full"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const supabase = createClient();
          const {
            data: { user }
          } = await supabase.auth.getUser();

          if (!user) {
            router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
            return;
          }

          try {
            await toggleFavoritePharmacyAction(pharmacyId, !isFavorite);
          } catch {
            // Evita quebrar a UX pública por erro transitório de rede/ação.
          }
        });
      }}
    >
      <Heart className="h-4 w-4" />
      {isFavorite ? "Favorita" : "Favoritar"}
    </Button>
  );
}
