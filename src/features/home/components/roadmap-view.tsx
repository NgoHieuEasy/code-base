import logo_roadmap from "@/assets/images/home/logo_roadmap.png";
import thump_6 from "@/assets/images/home/thump_6.png";
import { useRef, useState } from "react";

const RoadmapView = () => {
  return (
    <div className="mt-[164px]">
      <div className="flex items-center gap-3 w-full justify-center">
        <img
          src={logo_roadmap}
          alt="logo_roadmap"
          className="w-auto h-[40px]"
        />
        <div className="2xl:text-displayLgBold  sm:text-displayMdBold text-displaySmBold">
          Roadmap
        </div>
      </div>
      <div className="text-mdRegular mt-[24px] text-center px-8">
        Hidden orders let you place limit orders that stay fully hidden from the
        public order book — size and direction are not shown.
      </div>

      <div className="6xl:block relative hidden">
        <div className="">
          <img src={thump_6} alt="thump_6" className="w-full h-full" />
        </div>

        <div className="absolute left-[331px] bottom-[440px] border border-[#ffffff46]  flex flex-col gap-5 text-start justify-center rounded-[20px] bg-gradient-to-b from-[#99999900] to-[#4177ff9f] p-5 w-[300px] ">
          <div className="text-white text-displaySmSemiBold">Q2 2025</div>
          <div className="text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa
            mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.
          </div>
        </div>
        <div className="absolute left-[499px] top-[173px] border border-[#ffffff46]  flex flex-col gap-5 text-start justify-center rounded-[20px] bg-gradient-to-b from-[#99999900] to-[#4177ff9f] p-5 w-[300px] ">
          <div className="text-white text-displaySmSemiBold">Q2 2025</div>
          <div className="text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa
            mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.
          </div>
        </div>
        <div className="absolute right-[496px] top-[173px] border border-[#ffffff46]  flex flex-col gap-5 text-start justify-center rounded-[20px] bg-gradient-to-b from-[#99999900] to-[#4177ff9f] p-5 w-[300px] ">
          <div className="text-white text-displaySmSemiBold">Q2 2025</div>
          <div className="text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa
            mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.
          </div>
        </div>
        <div className="absolute right-[330px] bottom-[440px] border border-[#ffffff46]  flex flex-col gap-5 text-start justify-center rounded-[20px] bg-gradient-to-b from-[#99999900] to-[#4177ff9f] p-5 w-[300px] ">
          <div className="text-white text-displaySmSemiBold">Q2 2025</div>
          <div className="text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa
            mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.
          </div>
        </div>
      </div>

      <SlideLoop />
    </div>
  );
};

export default RoadmapView;

const items = [
  {
    title: "Q2 2025",
    desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.",
  },
  {
    title: "Q3 2025",
    desc: "Aliquam in hendrerit urna. Pellentesque sit amet sapien.",
  },
  {
    title: "Q4 2025",
    desc: "Sed ut perspiciatis unde omnis iste natus error sit.",
  },
  {
    title: "Q1 2026",
    desc: "Nemo enim ipsam voluptatem quia voluptas sit.",
  },
];

function SlideLoop() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  const ITEM_WIDTH = 300;
  const GAP = 20; // gap-5 = 20px
  const STEP = ITEM_WIDTH + GAP;
  const maxIndex = items.length - 1;

  const goTo = (i: number) => {
    if (!trackRef.current) return;

    const newIndex = Math.max(0, Math.min(i, maxIndex));
    setIndex(newIndex);

    trackRef.current.style.transform = `translateX(-${newIndex * STEP}px)`;
  };

  return (
    <div className="w-full 6xl:hidden block mt-10 sm:ps-8 ps-[10px]">
      <div className="relative overflow-hidden">
        {/* Track */}
        <div
          ref={trackRef}
          className="flex gap-5 transition-transform duration-500 ease-out"
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-[#ffffff46] flex flex-col gap-5 justify-center
                         rounded-[20px] bg-gradient-to-b from-[#99999900] to-[#4177ff9f]
                         p-5 w-[300px] shrink-0"
            >
              <div className="text-white text-displaySmSemiBold">
                {item.title}
              </div>
              <div className="text-gray-300">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <button
          onClick={() => goTo(index - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2
                     bg-black/50 text-white px-3 py-2 rounded-full"
        >
          ‹
        </button>

        <button
          onClick={() => goTo(index + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2
                     bg-black/50 text-white px-3 py-2 rounded-full"
        >
          ›
        </button>
      </div>
    </div>
  );
}
