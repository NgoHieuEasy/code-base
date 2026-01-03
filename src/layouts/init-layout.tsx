import { useEffect } from "react";
import type { JSX } from "react";
import AuthLayout from "./auth-layout";
import { MainLayout } from "./main-layout";

interface Props {
  type: string;
  children: React.ReactNode;
}

const LAYOUT = {
  AUTH: "AUTH-LAYOUT",
  MAIN: "MAIN-LAYOUT",
};

const InitLayout = ({ type, children }: Props) => {
  useEffect(() => {
    const interval = setInterval(() => {
      //   refreshToken();
    }, 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const layoutMap: Record<string, JSX.Element> = {
    [LAYOUT.AUTH]: <AuthLayout>{children}</AuthLayout>,
    [LAYOUT.MAIN]: <MainLayout>{children}</MainLayout>,
  };
  return <div className=" h-full">{layoutMap[type]}</div>;
};

export default InitLayout;
