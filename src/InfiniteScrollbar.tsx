import React, { useEffect, useRef, useState } from "react";

interface PexelsPhoto {
  id: number;
  url: string;
  title: string;
}

const InfiniteScrollPexels: React.FC = () => {
  const [images, setImages] = useState<PexelsPhoto[]>([]);
  const [data, setData] = useState<PexelsPhoto[]>([]);
  const [page, setPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const firstNewImageRef = useRef<HTMLImageElement | null>(null);
  const prevImageCountRef = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`
        );

        if (!response.ok) {
          console.log(error);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setImages((prevImages) => [...prevImages, ...data]);
        setData(data);
        setPage((prevPage) => prevPage + 10);
        setLoading(false);
        prevImageCountRef.current = images.length;
        console.log(`${data.length} items loaded`);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError(true);
      }
    };

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
  }, [loading, page, error, images.length]);

  useEffect(() => {
    if (firstNewImageRef.current) {
      firstNewImageRef.current.focus();
    }
  }, [images]);

  return (
    <main className="mx-36 w-4/5">
      <div
        aria-live="polite"
        aria-atomic="true"
        ref={liveRegionRef}
        className="absolute top-full left-0"
      />
      <p>{data.length} loaded</p>
      <div className="flex flex-wrap justify-center">
        {images.map((image, index) => (
          <img
            key={image.id}
            src={image.url}
            alt={image.title}
            className="max-w-1/5 block m-2"
            loading="lazy"
            width={500}
            height={500}
            tabIndex={-1}
            ref={index === prevImageCountRef.current ? firstNewImageRef : null}
          />
        ))}
      </div>
      <div
        ref={loaderRef}
        style={{ height: "100px", backgroundColor: "lightgrey" }}
      >
        {loading && (
          <div aria-live="polite" aria-atomic="true">
            {loading && !error && <p> Loading</p>}
          </div>
        )}
        <div id="load-more" style={{ height: "20px" }}>
          {error ? <p>no more images to load</p> : <p>Load More</p>}
        </div>
      </div>
    </main>
  );
};

export default InfiniteScrollPexels;
