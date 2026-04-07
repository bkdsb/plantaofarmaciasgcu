/*
  Tipagem parcial para queries. Em produção, idealmente gerar via:
  npx supabase gen types typescript --project-id <id> --schema public > src/types/database.generated.ts
*/

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: Record<string, unknown>;
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, string>;
  };
}
