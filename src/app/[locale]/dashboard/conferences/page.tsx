import { ConferencesManager } from "./ConferencesManager";
import { getConferences } from "@/data/conferences";

export default async function ConferencesPage() {
  const conferences = await getConferences();

  return (
    <div>
      <ConferencesManager initialData={conferences} />
    </div>
  );
}
