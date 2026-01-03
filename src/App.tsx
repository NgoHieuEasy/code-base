import { useTranslation } from "react-i18next";
import "./i18n";

function App() {
  const { t } = useTranslation();

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>

      <div style={{ padding: "50px 20px", textAlign: "center" }}>
        <h1>{t("homepage.welcome_title")}</h1>
        <h1>{t("homepage.login")}</h1>
        <div className="text-red-500 bg-red-50">hdshdh</div>
      </div>
    </div>
  );
}

export default App;
