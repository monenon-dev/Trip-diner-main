import "../../styles/page/home/MenuSpread.css";

/**
 * 메뉴판(오픈북) 스타일 공통 래퍼
 * - sectionRef: Home.jsx에서 IntersectionObserver로 show 클래스를 붙일 대상
 * - left/right: 좌/우 페이지 콘텐츠
 * - leftLabel/rightLabel: 페이지 상단 작은 라벨(선택)
 * - size: lg | sm
 */
export default function MenuSpread({
  sectionRef,
  className = "",
  size = "lg",
  left,
  right,
  leftLabel,
  rightLabel,
}) {
  return (
    <section
      ref={sectionRef}
      className={`section-box menu-section menu-section--${size} ${className}`}
    >
      <div className={`menu-book menu-book--${size}`}>
        <div className="menu-pages">
          <div className="menu-page menu-page--left">
            {leftLabel && <div className="menu-page-label">{leftLabel}</div>}
            {left}
          </div>

          <div className="menu-page menu-page--right">
            {rightLabel && <div className="menu-page-label">{rightLabel}</div>}
            {right}
          </div>

          {/* 화면에 들어올 때 오른쪽 페이지를 덮고 있다가 왼쪽으로 넘어가는 장 */}
          <div className="menu-flip" aria-hidden="true">
            <div className="menu-flip-face menu-flip-face--front">
              <span className="menu-flip-mark">Trip · Diner</span>
              <span className="menu-flip-sub">MENU</span>
            </div>
            <div className="menu-flip-face menu-flip-face--back" />
          </div>
        </div>
      </div>
    </section>
  );
}
