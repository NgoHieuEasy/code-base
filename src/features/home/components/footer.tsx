import footer from "@/assets/images/home/footer.png";
import logo_footer from "@/assets/images/home/logo_footer.png";
import f1 from "@/assets/images/home/f1.png";
import f2 from "@/assets/images/home/f2.png";
import f3 from "@/assets/images/home/f3.png";
import f4 from "@/assets/images/home/f4.png";
import f5 from "@/assets/images/home/f5.png";
const Footer = () => {
  return (
    <div
      className="relative w-full h-full"
      style={{
        backgroundImage: `url(${footer})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex sm:flex-row flex-col items-center justify-evenly gap-5 w-full pt-[100px] px-8">
        <div className="flex flex-col justify-center items-center  gap-5">
          <div className="text-displaySmMedium text-center">
            Trade smarter. <span className="text-brand-500">Earn more.</span>
          </div>
          <div className="">
            <img
              src={logo_footer}
              alt="logo_footer"
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="text-displaySmMedium lg:flex hidden flex-col gap-4">
          <div className="grid grid-cols-4 text-center">
            <div className="">About Us</div>
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
          </div>
          <div className="grid grid-cols-4 text-center">
            <div className=""></div>
            <div className=""></div>
            <div className="">Terms of Service</div>
            <div className=""></div>
          </div>
          <div className="grid grid-cols-4 text-center">
            <div className=""></div>
            <div className="">Contact</div>
            <div className=""></div>
            <div className=""></div>
          </div>
          <div className="grid grid-cols-4 text-center">
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
            <div className="">Privacy Policy</div>
          </div>

          <div className=""></div>
        </div>
        <div className="flex flex-col gap-5 sm:max-w-[320px] w-full sm:items-start items-center">
          <div className="md:text-displayMdMedium text-displaySmMedium sm:text-start text-center">
            Stay updated join our mailing list.
          </div>
          <div className="flex sm:flex-row flex-col items-center sm:w-[300px] w-full sm:rounded-[12px] overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/50 outline-none  bg-[#0B1220] border border-white/20 w-full rounded-tl-[12px] rounded-bl-[12px] sm:rounded-tr-none rounded-tr-[12px] sm:rounded-br-none rounded-br-[12px]"
            />

            <button className="sm:w-auto w-full px-6 py-3 bg-gradient-to-b from-[#1E90FF] to-[#0066CC] text-white font-medium sm:rounded-[0px] rounded-[12px] sm:mt-0 mt-2">
              Send
            </button>
          </div>

          <div className="flex items-center gap-5 sm:justify-start justify-center">
            <div className="">
              <img src={f1} alt="f1" />
            </div>
            <div className="">
              <img src={f2} alt="f2" />
            </div>
            <div className="">
              <img src={f3} alt="f3" />
            </div>
            <div className="">
              <img src={f4} alt="f4" />
            </div>
            <div className="">
              <img src={f5} alt="f5" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center ">
        <div className="sm:w-[600px] w-full text-displaySmMedium mt-8 lg:hidden flex gap-5 sm:px-3 px-8">
          <div className="w-full flex flex-col gap-5">
            <div className="text-mdRegular">About Us</div>
            <div className="text-mdRegular">Terms of Service</div>
          </div>
          <div className="w-full flex flex-col gap-5">
            {" "}
            <div className="text-mdRegular">Contact</div>
            <div className="text-mdRegular">Privacy Policy</div>
          </div>
        </div>
      </div>
      <div className="text-[#D5D7DA] text-mdRegular text-center mt-8 pb-5">
        © 2025 402PE{" "}
      </div>
    </div>
  );
};

export default Footer;
