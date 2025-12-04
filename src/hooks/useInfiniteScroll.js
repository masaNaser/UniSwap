import { useEffect, useRef } from 'react';

const useInfiniteScroll = (callback, hasMore, loading) => {
  const observerRef = useRef();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px', // ✅ يبدأ التحميل قبل 100px من النهاية
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        callback();
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