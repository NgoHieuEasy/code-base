import { lazy, Suspense } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { paths } from "./paths";
import { SplashScreen } from "@/components/loading";

const NotFoundPage = lazy(() => import("@/pages/error/page404"));
const DemoPage = lazy(() => import("@/pages/demo/demo"));
const HomePage = lazy(() => import("@/pages/home/home"));
const SpotPage = lazy(() => import("@/pages/spot/spot"));
const FuturesPage = lazy(() => import("@/pages/futures/futures"));
const One001xPage = lazy(() => import("@/pages/one001x/one001x"));
const ReferralsPage = lazy(() => import("@/pages/referrals/referrals"));
const PortfolioPage = lazy(() => import("@/pages/portfolio/portfolio"));

// Lading
import InitLayout, { LAYOUT } from "@/layouts/init-layout";

export function Router() {
  const router = useRoutes([
    {
      path: "/",
      element: (
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      ),
      children: [
        {
          element: (
            // <ProtectedRoute>
            <InitLayout type={LAYOUT.MAIN}>
              <Outlet />
            </InitLayout>
            // </ProtectedRoute>
          ),
          children: [
            {
              path: paths.root,
              element: <HomePage />,
            },
            {
              path: `${paths.exchange.spot}/:id`,
              element: <SpotPage />,
            },
            {
              path: `${paths.exchange.futures}/:id`,
              element: <FuturesPage/>,
            },
            {
              path: `${paths.exchange.one001x}/:id`,
              element: <One001xPage />,
            },
            {
              path: paths.portfolio,
              element: <PortfolioPage />,
            },
            {
              path: paths.referrals,
              element: <ReferralsPage />,
            },
          ],
        },
      ],
    },

    // OUTSIDE LAYOUT
    {
      path: paths.page404,
      element: <NotFoundPage />,
    },
    {
      path: paths.demo,
      element: <DemoPage />,
    },
    { path: "*", element: <Navigate to={paths.page404} replace /> },
  ]);
  return router;
}
