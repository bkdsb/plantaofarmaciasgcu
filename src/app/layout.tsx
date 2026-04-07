import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Plantão Farmácias GCU",
  description: "Sistema web para gestão de plantão rotativo de farmácias e promoções semanais"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
