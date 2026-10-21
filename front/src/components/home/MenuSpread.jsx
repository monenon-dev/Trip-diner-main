import { useContext } from "react";
import { createPortal } from "react-dom";
import "../../styles/page/home/MenuSpread.css";
import { BookSlotContext } from "./MenuBook";

/**
 * 메뉴판(오픈북) 스타일 공통 래퍼
 * - sectionRef: Home.jsx에서 IntersectionObserver로 show 클래스를 붙일 대상
 * - left/right: 좌/우 페이지 콘텐츠
 * - leftLabel/rightLabel: 페이지 상단 작은 라벨(선택)
 * - size: lg | sm
 *
 * MenuBook 안에서 쓰이면(데스크톱) 섹션 박스 대신 책의 해당 페이지 자리로 portal 함
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
  const bookSlot = useContext(BookSlotContext);

  if (bookSlot) {
    if (!bookSlot.left || !bookSlot.right) return null;
    return (
      <>
        {createPortal(
          <div className={`mbk-content ${className}`}>
            {leftLabel && <div className="menu-page-label">{leftLabel}</div>}
            {left}
          </div>,
          bookSlot.left
        )}
        {createPortal(
          <div className={`mbk-content ${className}`}>
            {rightLabel && <div className="menu-page-label">{rightLabel}</div>}
            {right}
          </div>,
          bookSlot.right
        )}
      </>
    );
  }

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
        </div>
      </div>
    </section>
  );
}
