import thump_7_1 from "@/assets/images/home/thump_7_1.png";
import thump_7_2 from "@/assets/images/home/thump_7_2.png";
import thump_7_3 from "@/assets/images/home/thump_7_3.png";
import thump_3_3 from "@/assets/images/home/thump_3_3.png";
import rocket from "@/assets/images/home/rocket-02.png";
import PrimaryButton from "@/shared/components/button/primary-button";

const TechView = () => {
  return (
    <div className="mb-[120px] relative flex flex-col items-center rounded-[4px] bg-gradient-to-b from-[#99999900] to-[#ffffff1e] py-[16px] px-[40px] w-full pt-[100px]">
      {" "}
      <div className=" text-brand-500 text-center 2xl:text-displayLgBold  sm:text-displayMdBold text-displaySmBold">
        Invisible orders.
        <span className="text-white"> Visible advantage.</span>
      </div>
      <div className="text-center 2xl:text-displaySmBold sm:text-displaySmBold text-mdBold mt-2">
        Hidden orders let you place limit orders that stay fully hidden from the
        public order book — size and direction are not shown.
      </div>
      <div className="absolute z-[0] w-full top-[300px] ">
        <img src={thump_3_3} alt="thump_3_3" className="w-full h-full" />
      </div>
      <div className="grid md:grid-cols-3 gap-[24px] items-stretch mt-[64px] z-[1]">
        <div className="relative w-full md:h-full h-[400px] md:hidden flex flex-col items-center gap-5">
          <div className="relative w-full h-full overflow-hidden border border-[#ffffff46] flex flex-col justify-end gap-5 rounded-[20px] bg-gradient-to-b from-[#99999900] to-[#696969] p-5">
            <div className="absolute w-full top-[-150px] left-0 flex justify-center">
              <img
                src={thump_7_3}
                alt="thump_7_3"
                className="w-[400px] h-full object-contain"
              />
            </div>

            <div className="text-white text-displaySmSemiBold text-center relative z-10">
              Multi-Chain Power
            </div>
          </div>

          <PrimaryButton
            text="Launch the app"
            sufixIcon={<img src={rocket} alt="rocket" />}
          />
        </div>

        {/* LEFT CARD */}
        <div className="border border-[#ffffff46] h-full flex flex-col gap-5 text-start justify-between rounded-[20px] bg-gradient-to-b from-[#99999900] to-[#696969] p-5">
          <div>
            <div className="text-white text-displaySmSemiBold">
              Secure by Design
            </div>
            <div className="text-gray-300 mt-2">
              Protect your assets with top-level encryotion and constart
              monitoring.
            </div>
          </div>

          <div className="w-full mt-5 flex justify-center">
            <img
              src={thump_7_2}
              alt="thump_7_2"
              className="w-[400px] h-full object-contain"
            />
          </div>
        </div>

        {/* CENTER CARD */}
        <div className="relative hidden w-full h-full md:flex flex-col items-center gap-5">
          <div className="relative w-full h-full overflow-hidden border border-[#ffffff46] flex flex-col justify-end gap-5 rounded-[20px] bg-gradient-to-b from-[#99999900] to-[#696969] p-5">
            <div className="absolute w-full top-[-150px] left-0 flex justify-center">
              <img
                src={thump_7_3}
                alt="thump_7_3"
                className="w-[400px] h-full object-contain"
              />
            </div>

            <div className="text-white text-displaySmSemiBold text-center relative z-10">
              Multi-Chain Power
            </div>
          </div>

          <PrimaryButton
            text="Launch the app"
            sufixIcon={<img src={rocket} alt="rocket" />}
          />
        </div>

        {/* RIGHT CARD */}
        <div className="border border-[#ffffff46] h-full flex flex-col gap-5 text-start justify-between rounded-[20px] bg-gradient-to-b from-[#99999900] to-[#696969] p-5">
          <div>
            <div className="text-white text-displaySmSemiBold">
              Secure by Design
            </div>
            <div className="text-gray-300 mt-2">
              Protect your assets with top-level encryotion and constart
              monitoring.
            </div>
          </div>

          <div className="w-full mt-5 flex justify-center">
            <img
              src={thump_7_1}
              alt="thump_7_1"
              className="w-[400px] h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechView;
