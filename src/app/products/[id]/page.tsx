import { shoes as staticShoes } from "@/data/shoes";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import ProductDetailContent from "@/components/ProductDetailContent";

export async function generateStaticParams() {
  const ids = staticShoes.map((s) => ({ id: s.id }));

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data } = await (supabase.from("products") as any).select("id");
        if (data) {
          for (const row of data) {
            if (!ids.some((i) => i.id === row.id)) ids.push({ id: row.id });
          }
        }
      }
    } catch {}
  }

  return ids;
}

export default async function ProductDetail(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const initialShoe = staticShoes.find((s) => s.id === id);
  return <ProductDetailContent shoeId={id} staticShoe={initialShoe} />;
}
