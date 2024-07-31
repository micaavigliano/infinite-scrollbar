import React, { useEffect, useRef, useState } from "react";

interface PexelsPhoto {
  id: number;
  url: string;
  title: string;
}

const InfiniteScroll: React.FC = () => {
  const [images, setImages] = useState<PexelsPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);
  const firstNewImageRef = useRef<HTMLImageElement | null>(null);
  const prevImageCountRef = useRef(0);
  // const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadingMessage("Loading...");
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        setTimeout(() => {
          console.log(data);
          setImages((prevImages) => [...prevImages, ...data]);
          setPage((prevPage) => prevPage + 1);
          setLoading(false);
          prevImageCountRef.current = images.length;

          setLoadingMessage(`${data.length} items loaded`);
        }, 1000);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError(true);
        setLoading(false);

        setLoadingMessage("Error fetching images.");
      }
    };

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        fetchData();
      }
    });

    observer.current.observe(document.querySelector("#load-more")!);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, page, images.length]);

  useEffect(() => {
    if (images.length > prevImageCountRef.current && firstNewImageRef.current) {
      firstNewImageRef.current.focus();
    }
  }, [images]);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  return (
    <div
      className="w-3/5 h-[70vh] overflow-y-scroll scroll-smoot mt-6"
      role="feed"
      aria-busy={loading ? true : false}
    >
      <div className="absolute top-full left-0">{loadingMessage}</div>
      <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold mb-4">
        Image Gallery
      </h1>

      <div className="flex flex-wrap justify-center">
        {images.map((image, index) => (
          <img
            key={image.id}
            src={image.url}
            alt={image.title}
            className="max-w-1/5 block m-2"
            loading="lazy"
            width={200}
            height={200}
            tabIndex={0}
            ref={index === prevImageCountRef.current ? firstNewImageRef : null}
          />
        ))}
      </div>
      <section className="bg-gray-200">
        <div
          id="load-more"
          className={`transition-opacity duration-500 ${
            loading || error ? "opacity-100" : "opacity-0"
          }`}
          style={{ height: "20px" }}
        >
          {error ? (
            <p aria-live="assertive" aria-atomic="true">
              No more images to load
            </p>
          ) : (
            <p>Load More</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default InfiniteScroll;
