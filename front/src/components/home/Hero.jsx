import { useEffect, useRef, useState } from "react";
import "../../styles/page/home/Hero.css";

// 영상이 끝나기 이 시간(초) 전에 텍스트를 보여줌
const TEXT_LEAD_TIME = 1.5;

export default function Hero({ heroRef }) {
  const [entered, setEntered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      videoRef.current?.pause();
      setEntered(true);
      return;
    }

    // 자동재생이 막혀 영상이 멈춰 있는 경우 대비
    const fallback = setTimeout(() => setEntered(true), 12000);
    return () => clearTimeout(fallback);
  }, []);

  const handleTimeUpdate = (e) => {
    const { currentTime, duration } = e.currentTarget;
    if (duration && currentTime >= duration - TEXT_LEAD_TIME) {
      setEntered(true);
    }
  };

  // 영상을 못 불러오거나 자동재생이 막혀도 텍스트는 보이게
  const showText = () => setEntered(true);

  const scrollToNext = () => {
    const next =
      document.querySelector("#home-sections") ||
      document.querySelector(".home-sections");

    if (!next) {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      return;
    }

    const OFFSET = 40;

    const y = next.getBoundingClientRect().top + window.pageYOffset - OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section className={`hero ${entered ? "entered" : ""}`}>
      <video
        ref={videoRef}
        className="hero-img"
        poster="/assets/images/hero-poster.jpg"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label="메인 배너"
        onTimeUpdate={handleTimeUpdate}
        onEnded={showText}
        onError={showText}
      >
        <source
          src="/assets/videos/hero.mp4"
          type="video/mp4"
          onError={showText}
        />
      </video>

      <div className="hero-content" ref={heroRef}>
        <h1 className="hero-title">
          보는 순간 설레는
          <br /> 여행 메뉴판
        </h1>

        <p className="hero-desc">
          당신의 취향을 맛보고 만드는 여행 코스
          <br /> Trip-Diner와 함께 특별한 여행을 시작하세요
        </p>

        <div className="hero-actions">
          <button className="hero-cta" type="button" onClick={scrollToNext}>
            메뉴 펼쳐보기
          </button>
        </div>
      </div>
    </section>
  );
}
