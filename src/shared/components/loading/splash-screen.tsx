import { motion } from "framer-motion";
import Logo from "/logo.svg";

export function SplashScreen() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <motion.img
        alt="Logo"
        src={Logo}
        className="w-20 h-20"
        animate={{ y: [0, -20, 0] }}
        transition={{
          ease: "easeInOut",
          repeat: Infinity,
          duration: 1,
        }}
      />
    </div>
  );
}
