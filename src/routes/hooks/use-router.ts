import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

export function useRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);
  /* eslint-disable */
  const router = useMemo(
    () => ({
      back: () => navigate(-1),
      forward: () => navigate(1),
      refresh: () => navigate(0),
      push: (href: string) => navigate(href),
      replace: (href: string) => navigate(href, { replace: true }),
      replaceParams: (href: string, state?: any) =>
        navigate(href, { replace: false, state }),
    }),
    [navigate]
  );

  return router;
}
