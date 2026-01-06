// import { useTranslate } from "@/locales";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";
import { CalendarDays } from "lucide-react";
interface IDateProps {
  startTime: number;
  endTime: number;
  onStartTime: (value: number) => void;
  onEndTime: (value: number) => void;
  className?: string;
  classFromInput?: string;
  classToInput?: string;
  labelFrom?: string;
  labelTo?: string;
  day?: number;
}

export function DateRangePicker({
  startTime,
  endTime,
  onStartTime,
  onEndTime,
  className = "bg-white",
  day = 30,
}: IDateProps) {
  // const { t } = useTranslate("dashboard");

  const [fromDate, setFromDate] = useState<Date | null>(
    startTime ? new Date(startTime) : null
  );
  const [toDate, setToDate] = useState<Date | null>(
    endTime ? new Date(endTime) : null
  );
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setFromDate(startTime ? new Date(startTime) : null);
    setToDate(endTime ? new Date(endTime) : null);
  }, [startTime, endTime]);

  // 🧠 Chuyển timestamp hoặc Date/null thành chuỗi YYYY-MM-DD
  // const formatDate = (date: Date | number | null) => {
  //   if (!date) return "";
  //   const d = date instanceof Date ? date : new Date(date);
  //   return d.toISOString().split("T")[0];
  // };

  const formatDateV2 = (date: Date | number | null) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    // Format theo local
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const getFromMinDate = () => {
    return toDate
      ? new Date(new Date(toDate).setDate(toDate.getDate() - day))
      : new Date(new Date().setDate(new Date().getDate() - day));
  };

  const getFromMaxDate = () => toDate ?? new Date();

  const getToMinDate = () =>
    fromDate ?? new Date(new Date().setDate(new Date().getDate() - day));

  const getToMaxDate = () => {
    const today = new Date();
    if (fromDate) {
      const maxByDay = new Date(fromDate);
      maxByDay.setDate(fromDate.getDate() + day);
      return maxByDay > today ? today : maxByDay;
    }
    return today;
  };

  // const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newFromDate = e.target.value;
  //   setFromDate(newFromDate);
  //   validateDateRange(newFromDate, toDate);
  // };

  // const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newToDate = e.target.value;
  //   setToDate(newToDate);
  //   validateDateRange(fromDate, newToDate);
  // };

  // const validateDateRange = (from: string, to: string) => {
  //   const fromParts = from.split("-").map(Number); // [YYYY, MM, DD]
  //   const toParts = to.split("-").map(Number);

  //   const fromDateUTC = Date.UTC(
  //     fromParts[0],
  //     fromParts[1] - 1,
  //     fromParts[2],
  //     0,
  //     0,
  //     0,
  //     0
  //   );
  //   const toDateUTC = Date.UTC(
  //     toParts[0],
  //     toParts[1] - 1,
  //     toParts[2],
  //     23,
  //     59,
  //     59,
  //     999
  //   ); // end of day UTC

  //   if (toDateUTC < fromDateUTC) {
  //     setError(`${t("date_invalid")}`);
  //     return;
  //   }

  //   setError("");
  //   onStartTime(fromDateUTC); // trả về timestamp UTC bắt đầu ngày
  //   onEndTime(toDateUTC); // trả về timestamp UTC cuối ngày
  // };

  return (
    <div className="rounded-lg shadow-sm">
      <div
        className={`${className} flex  flex-row items-center justify-between gap-2 px-4 `}
      >
        <div className="relative">
          <DatePicker
            selected={fromDate}
            onChange={(date: Date | null) => {
              setFromDate(date);
              const myDate = new Date(String(date));

              onStartTime(myDate.getTime());
            }}
            dateFormat="dd-MM-yyyy"
            maxDate={getFromMaxDate()}
            minDate={getFromMinDate()}
            popperPlacement={"bottom-end"}
            className="border-none py-2 focus:outline-none"
            placeholderText="From"
            customInput={
              <div>
                <input
                  style={{
                    color: "#F3F3F3",
                  }}
                  className={`border-none w-[142px] rounded-md  focus:outline-none bg-transparent`}
                  value={formatDateV2(fromDate)}
                  readOnly
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer">
                  <CalendarDays color={"#F3F3F3"} />
                </span>
              </div>
            }
          />
        </div>

        <span className="mx-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 3.33203L10 7.9987L6 12.6654"
              stroke="#838384"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <div className="relative">
          <DatePicker
            selected={toDate}
            onChange={(date: Date | null) => {
              setToDate(date);

              const myDate = new Date(String(date));
              // set hour chuyển giờ thành 23h59p59s (cuối ngày)
              onEndTime(myDate.setHours(23, 59, 59, 999));

              // if (date) {
              //   const toDateUTC = Date.UTC(
              //     date.getFullYear(),
              //     date.getMonth(),
              //     date.getDate(),
              //     23,
              //     59,
              //     59,
              //     999
              //   );
              //   // onEndTime(toDateUTC);
              // }
            }}
            dateFormat="yyyy-MM-dd"
            minDate={getToMinDate()}
            maxDate={getToMaxDate()}
            popperPlacement="bottom-start"
            className="border-none text-black rounded-md py-2 focus:outline-none"
            placeholderText="To"
            customInput={
              <div>
                <input
                  style={{
                    color: "#F3F3F3",
                  }}
                  className={`border-none w-[142px]  rounded-md  focus:outline-none bg-transparent`}
                  value={formatDateV2(toDate)}
                  // value={new Date(Number(toDate)).toLocaleDateString('en-us')}
                  readOnly
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer">
                  <CalendarDays color={"#F3F3F3"} />
                </span>
              </div>
            }
          />
        </div>
      </div>

      {/* {error && <div className="text-red-500 text-sm ">{error}</div>} */}
    </div>
  );
}
