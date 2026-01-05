import Footer from "./components/footer";
import InvisibleView from "./components/invisible-view";
import OrderView from "./components/order-view";
// import RoadmapView from "./components/roadmap-view";
import TechView from "./components/tech-view";
import ThumpView from "./components/thump-view";
import TradeView from "./components/trade-view";

const HomeView = () => {
  return (
    <div>
      <ThumpView />
      <TradeView />
      <InvisibleView />
      <OrderView />
      {/* <RoadmapView /> */}
      <TechView />
      <Footer />
    </div>
  );
};

export default HomeView;
