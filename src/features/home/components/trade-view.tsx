import thump2 from "@/assets/images/home/thump_2.png";
import rocket from "@/assets/images/home/rocket-02.png";
import PrimaryButton from "@/shared/components/button/primary-button";

const TradeView = () => {
  const dataStatistic1 = [
    {
      value: "$3.32T",
      title: "Total Trading Volume",
    },
    {
      value: "$3.32T",
      title: "Total Trading Volume",
    },
  ];
  const dataStatistic2 = [
    {
      value: "$3.32T",
      title: "Total Trading Volume",
    },
    {
      value: "$3.32T",
      title: "Total Trading Volume",
    },
    {
      value: "$3.32T",
      title: "Total Trading Volume",
    },
  ];
  return (
    <div
      className="relative w-full h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${thump2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col gap-[40px] items-center sm:mx-[100px] mx-[24px]">
        <div className="text-center">
          <div className="2xl:text-displayLgBold text-center sm:text-displayMdBold text-displaySmBold">
            Decentralized perpetual contracts. Trade{" "}
            <span className="text-brand-500"> stocks</span>
          </div>
          <div className="2xl:text-displaySmBold sm:text-displaySmBold text-mdBold mt-2">
            Non-custodial trading built for all — whether you're new to crypto
            or a seasoned pro.
          </div>
        </div>

        <PrimaryButton
          text="Launch the app"
          sufixIcon={<img src={rocket} alt={rocket} />}
          className="max-w-[200px]"
        />

        <div className="flex flex-col items-center gap-4 w-full">
          {/* Hàng 1: 2 phần tử */}
          <div className="flex md:flex-row flex-col 2xl:gap-[100px] xl:gap-[50px] gap-[20px] justify-center w-full">
            {dataStatistic1.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-[4px] bg-gradient-to-b from-[#99999900] to-[#ffffff1e] p-5 2xl:w-[300px] md:w-[200px] w-full"
              >
                <div className="text-white 2xl:text-displayMdBold sm:text-displaySmBold text-mdBold">
                  {item?.value}
                </div>
                <div className="text-gray-500 text-center sm:text-[16px] text-xsBold">
                  {item?.title}
                </div>
              </div>
            ))}
          </div>

          {/* Hàng 2: 3 phần tử */}
          <div className="flex flex-col md:flex-row 2xl:gap-[100px] xl:gap-[50px] gap-[20px] justify-center w-full">
            {dataStatistic2.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-[4px] bg-gradient-to-b from-[#99999900] to-[#ffffff1e] p-5 2xl:w-[300px] md:w-[200px] w-full"
              >
                <div className="text-white 2xl:text-displayMdBold sm:text-displaySmBold text-mdBold">
                  {item?.value}
                </div>
                <div className="text-gray-500 text-center sm:text-[16px] text-xsBold">
                  {item?.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeView;
