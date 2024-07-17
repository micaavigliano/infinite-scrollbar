import React, { useEffect, useRef, useState } from "react";

interface PexelsPhoto {
  id: number;
  urlToImage: string;
  alt: string;
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=nature&pageSize=10&page=${page}`,
          {
            headers: {
              "x-api-key": `1d164230787848c6bdcc1b080d077fba`,
            },
          }
        );

        if (!response.ok) {
          console.log(error);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setImages((prevImages) => [...prevImages, ...data.articles]);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
        console.log(`${data.per_page} items loaded`);
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
  }, [loading, page, error]);

  return (
    <div className="mx-36 w-4/5">
      <div
        aria-live="polite"
        ref={liveRegionRef}
        className="absolute top-full left-0"
      />
      <div className="flex flex-wrap justify-center">
        {images.map((image, index) => (
          <img
            src={image.urlToImage}
            alt={image.alt}
            //style={{ maxWidth: "100%", display: "block" }}
            className="w-1/2 block"
          />
        ))}
      </div>
      <div
        ref={loaderRef}
        style={{ height: "100px", backgroundColor: "lightgrey" }}
      >
        {loading && <div>Loading...</div>}
        <div id="load-more" style={{ height: "20px" }}>
          Load More
        </div>
      </div>
    </div>
  );
};

export default InfiniteScrollPexels;
