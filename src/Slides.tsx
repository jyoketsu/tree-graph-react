import React, { useState, useEffect, useRef } from 'react';
import './slides.css';
import Slide from './components/slide/Slide';
import NodeMap from './interfaces/NodeMap';
import SlideType from './interfaces/SlideType';
import getSlideList from './services/slideService';
import Icon from './components/icon';
import ReactTooltip from 'react-tooltip';
import SlidePlay from './components/slide/SlidePlay';
import screenfull from 'screenfull';

export interface SlideProps {
  // 节点
  nodes: NodeMap;
  // 根节点id
  startId: string;
  themeColor: string;
}

export const Slides = ({
  nodes,
  startId,
  themeColor = '#1CA8B3',
}: SlideProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideList, setSlideList] = useState<SlideType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [playMode, setPlayMode] = useState(false);

  useEffect(() => {
    if (containerRef && containerRef.current) {
      containerRef.current.focus();
    }
  }, [containerRef]);

  // 监听全屏事件
  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        // 监听到退出全屏，则退出放映模式
        if (!screenfull.isFullscreen) {
          setPlayMode(false);
        }
      });
    }
  }, []);

  // 计算得到幻灯片数据
  useEffect(() => {
    const slideList = getSlideList(nodes, startId);
    setSlideList(slideList);
  }, [nodes, startId]);

  function handleKeyDown(event: React.KeyboardEvent) {
    event.preventDefault();
    if (playMode) {
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        if (currentPage + 1 < slideList.length) {
          setCurrentPage(prevPage => prevPage + 1);
        }
        break;
      case 'ArrowUp':
        if (currentPage - 1 >= 0) {
          setCurrentPage(prevPage => prevPage - 1);
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
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '230px 1fr',
        backgroundColor: '#f5f5f5',
        color: '#424242',
        outline: 'none',
      }}
      tabIndex={-1}
      onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e)}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRight: '1px solid #e0e0e0',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#FFF',
        }}
      >
        {slideList.map((slide, index) => (
          <SlidePreview
            key={index}
            slide={slide}
            themeColor={themeColor}
            isActive={index === currentPage}
            handleClick={() => setCurrentPage(index)}
          />
        ))}
      </div>
      <div
        style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          padding: '35px 45px',
          overflow: 'hidden',
        }}
      >
        {slideList.length ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#FFF',
              boxShadow: '0 0 15px 0 rgb(0 0 0 / 10%)',
            }}
          >
            <Slide slide={slideList[currentPage]} />
          </div>
        ) : null}
      </div>
      <div
        data-tip="幻灯片放映"
        style={{
          position: 'absolute',
          right: '65px',
          bottom: '45px',
          cursor: 'pointer',
        }}
        onClick={() => {
          if (slideList.length) {
            setPlayMode(true);
            if (screenfull.isEnabled) {
              screenfull.request();
            }
          }
        }}
      >
        <Icon name="play" />
      </div>
      <ReactTooltip place="top" type="dark" effect="solid" />
      {playMode ? (
        <SlidePlay
          slideList={slideList}
          currentPage={currentPage}
          changePage={(pageNumber: number) => setCurrentPage(pageNumber)}
        />
      ) : null}
    </div>
  );
};

interface previewProps {
  slide: SlideType;
  themeColor: string;
  isActive: boolean;
  handleClick: Function;
}

function SlidePreview({
  slide,
  themeColor,
  isActive,
  handleClick,
}: previewProps) {
  return (
    <div
      style={{
        width: '200px',
        height: '180px',
        overflow: 'hidden',
        border: `1px solid ${isActive ? themeColor : '#e0e0e0'}`,
        flexShrink: 0,
        margin: '5px 0',
      }}
      onClick={() => handleClick()}
    >
      <Slide
        slide={slide}
        width={`${200 / 0.4}px`}
        height={`${180 / 0.4}px`}
        style={{
          transform: 'scale(0.4)',
          transformOrigin: 'top left',
        }}
        isPreview={true}
      />
    </div>
  );
}
