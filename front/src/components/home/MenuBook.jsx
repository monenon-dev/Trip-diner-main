import {
  Children,
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "../../styles/page/home/MenuBook.css";

// MenuSpread가 이 값을 받으면 자기 왼쪽/오른쪽 내용을 해당 페이지 자리로 portal 함
export const BookSlotContext = createContext(null);

// 스크롤 진행도(0~1) 중 이 구간까지는 닫힌 표지만 보여줌
const CLOSED_UNTIL = 0.06;

/**
 * 스크롤하면 넘어가는 메뉴판 한 권
 * - 처음엔 닫힌 표지 → 열리면 children[0] 펼침 → 페이지가 넘어가며 children[1], [2] ...
 * - children: MenuSpread를 렌더하는 섹션 컴포넌트들
 *
 * 장(leaf) 구성: 오른쪽 절반에 쌓여 있다가 책등을 축으로 왼쪽으로 넘어감
 *   leaf 0 = 표지      (앞: 표지,                  뒤: 펼침0 왼쪽)
 *   leaf j = 종이 한 장 (앞: 펼침 j-1 오른쪽,       뒤: 펼침 j 왼쪽)
 *   바닥판            (마지막 펼침 오른쪽)
 */
export default function MenuBook({ children }) {
  const spreads = Children.toArray(children);
  const count = spreads.length;

  const rootRef = useRef(null);
  const slotRefs = useRef({});
  const [ready, setReady] = useState(false);
  // 0 = 닫힘, k = k번째 펼침(1부터)
  const [step, setStep] = useState(0);

  useLayoutEffect(() => setReady(true), []);

  useEffect(() => {
    const onScroll = () => {
      const el = rootRef.current;
      if (!el) return;
      const scrollable = el.offsetHeight - window.innerHeight;
      const progress = Math.min(
        1,
        Math.max(0, -el.getBoundingClientRect().top / scrollable)
      );
      const next =
        progress < CLOSED_UNTIL
          ? 0
          : Math.min(
              count,
              1 + Math.floor((progress - CLOSED_UNTIL) / ((1 - CLOSED_UNTIL) / count))
            );
      setStep(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count]);

  // 페이지 높이는 화면 높이에 맞춰 고정이라, 내용이 넘치면 그만큼 축소해서 맞춤
  const fitPages = useCallback(() => {
    Object.values(slotRefs.current).forEach((slot) => {
      const content = slot?.firstElementChild;
      if (!content) return;
      content.style.zoom = 1;
      const natural = content.offsetHeight;
      const avail = slot.clientHeight;
      content.style.zoom = natural > avail ? avail / natural : 1;
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = rootRef.current;
    fitPages();
    document.fonts?.ready.then(fitPages);

    // 사진이 늦게 로드되면 높이가 바뀜 (load는 버블링되지 않아 capture로 받음)
    root.addEventListener("load", fitPages, true);
    window.addEventListener("resize", fitPages);
    return () => {
      root.removeEventListener("load", fitPages, true);
      window.removeEventListener("resize", fitPages);
    };
  }, [ready, fitPages]);

  const slot = (key) => (el) => {
    slotRefs.current[key] = el;
  };

  const paper = (key, side, pageNo, active) => (
    <div className={`mbk-paper mbk-paper--${side}`} inert={!active}>
      <div className="mbk-fit" ref={slot(key)} />
      <span className="mbk-pno">{pageNo}</span>
    </div>
  );

  // 지금 펼쳐진 k번째 펼침의 면만 클릭/포커스 가능하게
  const active = (k) => step === k + 1;

  const leaves = [];
  for (let j = 0; j < count; j++) {
    const flipped = step > j;
    leaves.push(
      <div
        key={j}
        className={`mbk-leaf ${j === 0 ? "mbk-leaf--cover" : ""} ${
          flipped ? "is-flipped" : ""
        }`}
        style={{ "--z": `${count - j}px` }}
      >
        <div className="mbk-face mbk-face--front">
          {j === 0 ? (
            <Cover />
          ) : (
            paper(`r${j - 1}`, "right", (j - 1) * 2 + 2, active(j - 1))
          )}
        </div>
        <div className="mbk-face mbk-face--back">
          {j === 0 && <div className="mbk-board mbk-board--left" />}
          {paper(`l${j}`, "left", j * 2 + 1, active(j))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="mbk"
      style={{ "--mbk-spreads": count }}
    >
      <div className="mbk-stage">
        <div className={`mbk-book ${step > 0 ? "is-open" : ""}`}>
          <div className="mbk-base">
            <div className="mbk-board mbk-board--right" />
            {paper(`r${count - 1}`, "right", count * 2, active(count - 1))}
          </div>
          {leaves}
        </div>
      </div>

      {ready &&
        spreads.map((child, k) => (
          <BookSlotContext.Provider
            key={k}
            value={{
              left: slotRefs.current[`l${k}`],
              right: slotRefs.current[`r${k}`],
            }}
          >
            {child}
          </BookSlotContext.Provider>
        ))}
    </div>
  );
}

function Cover() {
  return (
    <div className="mbk-cover">
      <div className="mbk-cover-inner">
        <svg className="mbk-cover-emblem" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M17 6v14a4 4 0 0 0 4 4v18M13 6v10M21 6v10M13 16a4 4 0 0 0 8 0" />
          <path d="M33 42V6c-4 3-6 9-6 15h6" />
        </svg>
        <p className="mbk-cover-title">Trip · Diner</p>
        <div className="mbk-cover-rule" aria-hidden="true">
          <span />◆<span />
        </div>
        <p className="mbk-cover-sub">MENU</p>
        <p className="mbk-cover-foot">보는 순간 설레는 여행 메뉴판</p>
      </div>
    </div>
  );
}
