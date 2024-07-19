import React, { useEffect, useRef, useState } from "react";

interface PexelsPhoto {
  id: number;
  urlToImage: string;
  description: string;
}

//const PEXELS_API_URL = "https://api.pexels.com/v1/search?query=nature";

const InfiniteScrollPexels: React.FC = () => {
  const [images, setImages] = useState<PexelsPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const apikey = process.env.REACT_APP_API_KEY;
  const firstNewImageRef = useRef<HTMLImageElement | null>(null);
  const prevImageCountRef = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=nature&pageSize=10&page=${page}`,
          {
            headers: {
              "x-api-key": `${apikey}`,
            },
            mode: "no-cors",
          }
        );

        if (!response.ok) {
          console.log(error);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setImages((prevImages) => [...prevImages, ...data.articles]);
        prevImageCountRef.current = images.length;
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
        console.log(`${data.articles.length} items loaded`);
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
  }, [loading, page, error, apikey, images.length]);

  useEffect(() => {
    if (firstNewImageRef.current) {
      firstNewImageRef.current.focus();
    }
  }, [images]);

  return (
    <main className="mx-36 w-4/5">
      <div
        aria-live="polite"
        ref={liveRegionRef}
        className="absolute top-full left-0"
      />
      <div className="flex flex-wrap justify-center">
        {images.map((image, index) => (
          <img
            src={image.urlToImage}
            alt={image.description}
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
