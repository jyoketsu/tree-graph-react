import React, { useEffect, useRef, useState } from 'react';
import SlideType from '../../interfaces/SlideType';
import Slide from './Slide';

interface ChangePageFunc {
  (pageNumber: number): void;
}

interface Props {
  slideList: SlideType[];
  currentPage: number;
  changePage: ChangePageFunc;
}

const ANIME_TIME = 800;

export default function SlidePlay({
  slideList,
  currentPage,
  changePage,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    if (
      containerRef &&
      containerRef.current &&
      containerRef.current.clientWidth
    ) {
      containerRef.current.focus();
      setSlideWidth(containerRef.current.clientWidth);
      setSlideHeight(containerRef.current.clientHeight);
      setTranslateX(-containerRef.current.clientWidth * currentPage);
    }
  }, [containerRef?.current?.clientWidth]);

  function handleKeyDown(event: React.KeyboardEvent) {
    event.preventDefault();
    switch (event.key) {
      case 'ArrowRight':
        if (transition) {
          break;
        }
        if (currentPage + 1 < slideList.length) {
          setTransition(true);
          setTranslateX((prevX: number) => prevX - slideWidth);
          setTimeout(() => {
            setTransition(false);
            changePage(currentPage + 1);
          }, ANIME_TIME);
        }
        break;
      case 'ArrowLeft':
        if (transition) {
          break;
        }
        if (currentPage - 1 >= 0) {
          setTransition(true);
          setTranslateX((prevX: number) => prevX + slideWidth);
          setTimeout(() => {
            setTransition(false);
            changePage(currentPage - 1);
          }, ANIME_TIME);
        }
        break;
      default:
        break;
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'inherit',
        outline: 'none',
        overflow: 'hidden',
      }}
      tabIndex={-1}
      onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e)}
    >
      <div
        style={{
          display: 'flex',
          transform: `translateX(${translateX}px)`,
          transition: transition
            ? `transform ${ANIME_TIME / 1000}s ease-in-out`
            : 'unset',
        }}
      >
        {slideList.map((slide, index) => (
          <Slide
            key={index}
            width={`${slideWidth}px`}
            height={`${slideHeight}px`}
            style={{ flexShrink: 0 }}
            slide={slide}
            active={index === currentPage}
          />
        ))}
      </div>
    </div>
  );
}
