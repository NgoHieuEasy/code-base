import HeaderDesktop from "@/shared/components/nav/header-desktop";
import HeaderMobile from "@/shared/components/nav/header-mobile";
import { TABLET_SCREEN } from "@/shared/utils/constants";
import { useMediaQuery } from "react-responsive";

interface Props {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  const isDesktop = useMediaQuery({
    query: `(min-width: ${TABLET_SCREEN}px)`,
  });
  return (
    <div className="">
      {isDesktop ? (
        <DesktopScreen childrenDK={<>{children}</>} />
      ) : (
        <MobileScreen childrenMB={<>{children}</>} />
      )}
    </div>
  );
};

interface PropsDK {
  childrenDK: React.ReactNode;
}

const DesktopScreen = ({ childrenDK }: PropsDK) => {
  return (
    <div className="h-screen w-screen ">
      <div className="flex h-full w-full bg-neutrals-100 dark:bg-dark-primary ">
        <div className="flex-1">
          <header className="fixed bg-card-primary  left-0 right-0 z-10 overflow-hidden h-[60px]">
            <HeaderDesktop />
          </header>

          <main className="flex-1 mt-[60px] overflow-y-auto  scrollbar-hide">
            {childrenDK}
          </main>
        </div>
      </div>
    </div>
  );
};

interface PropsMB {
  childrenMB: React.ReactNode;
}

const MobileScreen = ({ childrenMB }: PropsMB) => {
  return (
    <div className=" min-h-screen relative overflow-hidden">
      <HeaderMobile />

      <main className="mt-4 pb-[60px]">{childrenMB}</main>
    </div>
  );
};

export default MobileScreen;
