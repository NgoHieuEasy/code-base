import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import "./i18n";

function App() {
  const { t } = useTranslation();

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header xuất hiện ở trên cùng của mọi trang */}
      <Header />

      <div style={{ padding: "50px 20px", textAlign: "center" }}>
        <h1>{t("homepage.welcome_title")}</h1>
        <h1>{t("homepage.login")}</h1>
      </div>
    </div>
  );
}

export default App;
