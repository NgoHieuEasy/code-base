import { CONFIG } from "@/config-global";
import HomeView from "@/features/home/home-view";

const metadata = { title: `Home- ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <div>
        <title>{metadata.title}</title>
      </div>

      <HomeView />
    </>
  );
}
