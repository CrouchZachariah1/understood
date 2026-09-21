import { prisma } from "@/lib/db";
import { ThemeControls } from "@/components/admin/ThemeControls";

export default async function ThemesPage() {
  const themes = await prisma.theme.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-4xl">Themes</h1>
      <p className="mt-2 text-sm opacity-70">Switch the whole storefront season. Preview before you publish.</p>
      <ThemeControls themes={themes} />
    </div>
  );
}
