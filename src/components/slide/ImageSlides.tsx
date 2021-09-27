import React, { useEffect, useRef, useState } from 'react';
import Attach from '../../interfaces/Attach';

interface Props {
  imageList: Attach[];
}

let interval: any; // 定时器变量
const ANIME_TIME = 800;

export default function ImageSlides({ imageList }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    if (containerRef?.current?.clientWidth) {
      containerRef.current.focus();
      setSlideWidth(containerRef.current.clientWidth);
      setSlideHeight(containerRef.current.clientHeight);
    }
  }, [containerRef?.current?.clientWidth]);

  useEffect(() => {
    setTransition(false);
    setCurrentPage(0);
  }, [imageList]);

  useEffect(() => {
    if (slideWidth) {
      setTranslateX(-slideWidth);
    }
  }, [currentPage, slideWidth]);

  useEffect(() => {
    if (imageList.length > 1 && buttonRef && buttonRef.current) {
      interval = setInterval(() => {
        buttonRef.current?.click();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [imageList.length, buttonRef]);

  const nextPage = (currentPage: number) => {
    if (transition) {
      return;
    }
    setTransition(true);
    setTranslateX((prevX: number) => prevX - slideWidth);
    setTimeout(() => {
      setTransition(false);
      setCurrentPage(prevPage => {
        if (currentPage + 1 < imageList.length) {
          return prevPage + 1;
        } else {
          return 0;
        }
      });
    }, ANIME_TIME);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'inherit',
        outline: 'none',
        overflow: 'hidden',
      }}
    >
      {slideWidth ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            transform: `translateX(${translateX}px)`,
            transition: transition
              ? `transform ${ANIME_TIME / 1000}s ease-in-out`
              : 'unset',
          }}
        >
          {currentPage - 1 >= 0 ? (
            <ImageSlide
              width={`${slideWidth}px`}
              height={`${slideHeight}px`}
              style={{ flexShrink: 0 }}
              image={imageList[currentPage - 1]}
            />
          ) : (
            <ImageSlide
              width={`${slideWidth}px`}
              height={`${slideHeight}px`}
              style={{ flexShrink: 0 }}
              image={imageList[imageList.length - 1]}
            />
          )}

          <ImageSlide
            width={`${slideWidth}px`}
            height={`${slideHeight}px`}
            style={{ flexShrink: 0 }}
            image={imageList[currentPage]}
          />

          {currentPage + 1 < imageList.length ? (
            <ImageSlide
              width={`${slideWidth}px`}
              height={`${slideHeight}px`}
              style={{ flexShrink: 0 }}
              image={imageList[currentPage + 1]}
            />
          ) : (
            <ImageSlide
              width={`${slideWidth}px`}
              height={`${slideHeight}px`}
              style={{ flexShrink: 0 }}
              image={imageList[0]}
            />
          )}
        </div>
      ) : null}
      <div
        style={{ display: 'none' }}
        ref={buttonRef}
        onClick={() => nextPage(currentPage)}
      ></div>
    </div>
  );
}

interface SlideProps {
  image: Attach;
  width: string;
  height: string;
  style?: object;
}

function ImageSlide({ image, width, height, style }: SlideProps) {
  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style,
      }}
    >
      <div
        style={{
          flex: 1,
          width: '100%',
          backgroundImage: `url(${image?.url})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></div>
      <span style={{ padding: '5px 0', color: '#A9A9A9' }}>{image?.name}</span>
    </div>
  );
}
