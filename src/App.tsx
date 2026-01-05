import "./i18n";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes";
import LoginPopup from "./shared/components/popup/login-popup";

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
      <Router />
      <LoginPopup />
    </BrowserRouter>
  );
}

export default App;
