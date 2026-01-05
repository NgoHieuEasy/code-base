const InvisibleView = () => {
  return (
    <div className="pt-[100px] sm:px-[64px]">
      {" "}
      <div className="flex flex-col items-center rounded-[4px] bg-gradient-to-b from-[#99999900] to-[#ffffff1e] w-full px-[32px] sm:pb-[50px] pb-[100px]">
        <div className=" text-brand-500 text-center 2xl:text-displayLgBold  sm:text-displayMdBold text-displaySmBold">
          Invisible orders.
          <span className="text-white"> Visible advantage.</span>
        </div>
        <div className="text-center 2xl:text-displaySmBold sm:text-displaySmBold text-mdBold mt-2">
          Hidden orders let you place limit orders that stay fully hidden from
          the public order book — size and direction are not shown.
        </div>
        <div className="flex md:flex-row flex-col items-center mt-[64px] ">
          <div className="md:h-[300px] p-[40px] flex flex-col gap-[20px] text-displaySmSemiBold bg-gradient-to-r from-[#2E3134] to-[#060C0D] rounded-tl-[20px] rounded-bl-[20px]">
            <div className="text-brand-500">01.</div>
            <div className="text-[16px] sm:text-[20px]">
              Service for Any Level of Expertise.
            </div>
          </div>
          <div className="md:h-[400px] p-[40px] flex flex-col gap-[20px] text-displaySmSemiBold md:bg-gradient-to-b bg-gradient-to-l from-[#007afd7e] via-[#141B220A] to-[#17202900] rounded-tl-[20px] rounded-tr-[20px]">
            <div className="text-brand-500">01.</div>
            <div className="text-[16px] sm:text-[20px]">
              Service for Any Level of Expertise.
            </div>
          </div>
          <div className="md:h-[300px] p-[40px] flex flex-col gap-[20px] text-displaySmSemiBold md:bg-gradient-to-l bg-gradient-to-r from-[#2E3134] to-[#060C0D] md:rounded-tr-[20px] rounded-tl-[20px] md:rounded-br-[20px] rounded-bl-[20px]">
            <div className="text-brand-500">01.</div>
            <div className="text-[16px] sm:text-[20px]">
              Service for Any Level of Expertise.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvisibleView;
