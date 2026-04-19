import { SectionsManager } from "./SectionsManager";
import prisma from "@/lib/db";

export default async function SectionsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "settings" }
  });

  return (
    <div>
      <SectionsManager initialData={settings} />
    </div>
  );
}
