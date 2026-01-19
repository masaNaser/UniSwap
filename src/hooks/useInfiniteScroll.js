import { useEffect, useRef } from 'react';

const useInfiniteScroll = (callback, hasMore, loading) => {
  const observerRef = useRef();

  useEffect(() => {
    const options = {
      root: null, // نراقب الشاشة كاملة
      rootMargin: '100px', // نبدأ المراقبة قبل الوصول للنهاية ب100 بكسل
      threshold: 0.1, // نعتبر العنصر مرئياً إذا كان 10% منه ظاهر
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        callback(); // استدعاء الدالة لتحميل المزيد من البيانات
      }
    }, options);

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [callback, hasMore, loading]);

  return observerRef;
};

export default useInfiniteScroll;