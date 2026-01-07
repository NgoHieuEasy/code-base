import "./i18n";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes";
import LoginPopup from "./shared/components/popup/login-popup";
import { SocketProvider } from "./shared/hooks/context/SocketContext";
import { SocketManager } from "./shared/hooks/services/SocketManager";

function App() {
  // const { setUser, loading } = useUserStore();
  // const { user } = useUser();

  // useEffect(() => {
  //   if (!loading && user) {
  //     setUser(user);
  //   } else {
  //     setUser(null);
  //   }
  // }, [user, loading]);

  return (
    <BrowserRouter>
      <SocketProvider
        publicUrl={import.meta.env.VITE_WS_PUBLIC_URL}
        privateUrl={import.meta.env.VITE_WS_PRIVATE_URL}
      >
        <SocketManager />
        <Router />
        <LoginPopup />
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
