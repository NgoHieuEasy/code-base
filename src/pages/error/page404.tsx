import { CONFIG } from "@/config-global";
import Page404View from "@/features/error/page404-view";

const metadata = { title: `404 - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <div>
        <title>{metadata.title}</title>
      </div>

      <Page404View />
    </>
  );
}
