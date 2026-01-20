import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// كل مرة يتغيّر الرابط (pathname)، الصفحة ترجع تلقائيًا لفوق
// لما كنا ندخل ع البروفايل كان ينزل لتحت عشان هيك ضفنا هالكمبوننت
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}