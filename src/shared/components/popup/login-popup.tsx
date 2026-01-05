// components/LoginPopup.tsx
import { useRouter } from "@/routes/hooks/use-router";
import { useUserStore } from "@/zustand/useUserStore";
import PrimaryButton from "../button/primary-button";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/utils/constants";

const LoginPopup = () => {
  const { isExpiredToken, setExpiredToken, clearUser } = useUserStore();
  const router = useRouter();
  const handleLogin = async () => {
    clearUser();
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    router.push("/sign-in");
    setExpiredToken(false);
  };

  if (!isExpiredToken) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
      <div
        className={`bg-black p-6 rounded-xl shadow-lg text-center w-full md:w-[400px]`}
      >
        <h2 className="text-xl font-semibold mb-4">Login again</h2>
        <p className="mb-4">Token expired login again!</p>

        <PrimaryButton onClick={handleLogin} text="Login" />
      </div>
    </div>
  );
};

export default LoginPopup;
