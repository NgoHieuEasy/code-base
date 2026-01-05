import { useRouter } from "@/routes/hooks/use-router";
import PrimaryButton from "@/shared/components/button/primary-button";

const Page404View = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  relative">
      {/* Background số 404 mờ to */}
      <div
        className="absolute font-bold text-gray-200  opacity-20 select-none
        text-[150px] sm:text-[250px] md:text-[400px] lg:text-[500px]"
      >
        404
      </div>

      {/* Nội dung chính */}
      <div className="relative flex flex-col items-center px-4 sm:px-6 md:px-8 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Page not found
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          Sorry! The page you’re looking for cannot be found
        </p>
        <PrimaryButton
          onClick={() => router.back()}
          text="Back"
          className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
        />
      </div>
    </div>
  );
};

export default Page404View;
