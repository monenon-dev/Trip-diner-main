import React, { useEffect, useRef, useState } from "react";
import "../../styles/page/home/HomeLayout.css";
import { Footer, Hero, Section1, Section2, Section3 } from ".";
import MenuBook from "./MenuBook";

// 이 폭 이상에서는 스크롤로 넘기는 메뉴판 한 권, 그보다 좁으면 섹션을 세로로 쌓음
const BOOK_QUERY = "(min-width: 981px)";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export default function Home() {
  const sectionsRef = useRef([]);
  const heroRef = useRef(null);
  const isBook = useMediaQuery(BOOK_QUERY);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle("show", e.isIntersecting);
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    sectionsRef.current.forEach((sec) => sec && observer.observe(sec));
    return () => observer.disconnect();
  }, [isBook]);

  useEffect(() => {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle("show", e.isIntersecting);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    heroRef.current && heroObserver.observe(heroRef.current);
    return () => heroObserver.disconnect();
  }, []);

  return (
    <div className="home-wrapper">
      <Hero heroRef={heroRef} />

      <main id="home-sections" className="home-sections">
        {isBook ? (
          <MenuBook>
            <Section1 />
            <Section2 />
            <Section3 />
          </MenuBook>
        ) : (
          <>
            <Section1 sectionRef={(el) => (sectionsRef.current[0] = el)} />
            <Section2 sectionRef={(el) => (sectionsRef.current[1] = el)} />
            <Section3 sectionRef={(el) => (sectionsRef.current[2] = el)} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
