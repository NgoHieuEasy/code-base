import thump3_1 from "@/assets/images/home/thump_3_1.png";
import thump3_2 from "@/assets/images/home/thump_3_2.png";
import thump3_3 from "@/assets/images/home/thump_3_3.png";

const OrderView = () => {
  return (
    <div className="relative flex flex-col items-center rounded-[4px] bg-gradient-to-b from-[#99999900] to-[#ffffff1e] py-[16px] px-[40px] w-full pt-[100px]">
      {" "}
      <div className=" text-brand-500 text-center 2xl:text-displayLgBold  sm:text-displayMdBold text-displaySmBold">
        Invisible orders.
        <span className="text-white"> Visible advantage.</span>
      </div>
      <div className="text-center 2xl:text-displaySmBold sm:text-displaySmBold text-mdBold mt-2">
        Hidden orders let you place limit orders that stay fully hidden from the
        public order book — size and direction are not shown.
      </div>
      <div className="mt-[64px] flex md:flex-row flex-col items-center gap-[20px] z-[1]">
        <div className="border border-brand-500 p-[24px] text-center rounded-[20px]">
          <div className="text-displaySmMedium">
            AD Invisible orders. Visible advantage.
          </div>
          <div className="text-mdRegular mt-[24px]">
            Hidden orders let you place limit orders that stay fully hidden from
            the public order book — size and direction are not shown.
          </div>
          <div className="flex justify-center">
            <img src={thump3_1} alt="thump3_1" className="w-[500px] h-full" />
          </div>
        </div>
        <div className="border border-brand-500 p-[24px] text-center rounded-[20px]">
          <div className="text-displaySmMedium">
            AD Invisible orders. Visible advantage.
          </div>
          <div className="text-mdRegular mt-[24px]">
            Hidden orders let you place limit orders that stay fully hidden from
            the public order book — size and direction are not shown.
          </div>
          <div className="flex justify-center">
            <img src={thump3_2} alt="thump3_1" className="w-[500px] h-full" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-[-100px] w-full z-[0]">
        <img src={thump3_3} alt="thump3_3" className="w-full" />
      </div>
    </div>
  );
};

export default OrderView;
