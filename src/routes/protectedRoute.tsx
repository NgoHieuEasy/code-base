import { SplashScreen } from "@/components/loading";
import { useIsLoggedToken } from "@/zustand/useUserStore";
import { Navigate } from "react-router-dom";
import { paths } from "./paths";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const logged = useIsLoggedToken();

  if (!logged) {
    return (
      <div>
        <SplashScreen />
        <Navigate to={paths.root} replace />
      </div>
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;
