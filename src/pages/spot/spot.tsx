import { CONFIG } from "@/config-global";
import { SpotView } from "@/features/spot";

const metadata = { title: `Spot  - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <div>
        <title>{metadata.title}</title>
      </div>

      <SpotView />
    </>
  );
}
