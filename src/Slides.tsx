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
import Node from './interfaces/Node';

const backgroundColor = '#f5f5f5';
const borderColor = '#eee';

export interface GetNodeUrlFunc {
  (node: Node): string;
}

export interface SlideProps {
  // 节点
  nodes: NodeMap;
  // 根节点id
  startId: string;
  getNodeUrl: GetNodeUrlFunc;
  themeColor?: string;
  bright?: boolean;
}

export const Slides = ({
  nodes,
  startId,
  getNodeUrl,
  themeColor = '#1CA8B3',
  bright = true,
}: SlideProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideList, setSlideList] = useState<SlideType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [playMode, setPlayMode] = useState(false);
  const [paperColor, setpaperColor] = useState(bright ? '#FFF' : '#434343');
  const [color, setcolor] = useState(bright ? '#434343' : '#FFF');
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.focus();
    }
  }, [containerRef?.current]);

  // 监听全屏事件
  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        // 监听到退出全屏，则退出放映模式
        if (!screenfull.isFullscreen) {
          setPlayMode(false);
        } else {
          setTimeout(() => {
            setPlayMode(true);
          }, 1000);
        }
      });
    }
  }, []);

  // 计算得到幻灯片数据
  useEffect(() => {
    const slideList = getSlideList(nodes, startId, getNodeUrl);
    setSlideList(slideList);
  }, [nodes, startId]);

  function prevPage() {
    if (currentPage - 1 >= 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }

  function nextPage() {
    if (currentPage + 1 < slideList.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    event.preventDefault();
    if (playMode) {
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        nextPage();
        break;
      case 'ArrowUp':
        prevPage();
        break;
      default:
        break;
    }
  }

  const handleChangeColor = () => {
    if (paperColor === '#434343') {
      setpaperColor('#FFF');
      setcolor('#434343');
    } else {
      setpaperColor('#434343');
      setcolor('#FFF');
    }
  };

  return (
    <div
      className="tree-graph-react-slides"
      tabIndex={-1}
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '40px 1fr',
        backgroundColor: backgroundColor,
        color: '#434343',
        outline: 'none',
      }}
      onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e)}
    >
      <div
        style={{
          padding: '0 15px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFF',
          borderBottom: `1px solid ${borderColor}`,
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontSize: '18px' }}>{nodes[startId]?.name}</span>
        <div style={{ flex: 1 }}></div>
        <div
          data-tip={
            paperColor === '#434343' ? '切换为亮色风格' : '切换为暗色风格'
          }
          style={{
            cursor: 'pointer',
            height: '29px',
            marginRight: '15px',
          }}
          onClick={handleChangeColor}
        >
          {paperColor === '#434343' ? (
            <Icon name="sun" fill="#434343" />
          ) : (
            <Icon name="moon" fill="#434343" />
          )}
        </div>
        <div
          data-tip="幻灯片放映"
          style={{
            cursor: 'pointer',
            height: '29px',
          }}
          onClick={() => {
            if (slideList.length) {
              if (screenfull.isEnabled) {
                screenfull.request();
              }
            }
          }}
        >
          <Icon name="play" fill="#434343" />
        </div>
        <ReactTooltip place="bottom" type="dark" effect="solid" />
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '230px 1fr',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRight: `1px solid ${borderColor}`,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#FFF',
            boxSizing: 'border-box',
            padding: '15px 0',
          }}
        >
          {slideList.map((slide, index) => (
            <SlidePreview
              key={index}
              slide={slide}
              themeColor={themeColor}
              isActive={index === currentPage}
              handleClick={() => setCurrentPage(index)}
              borderColor={borderColor}
              style={{ backgroundColor: paperColor, color }}
            />
          ))}
        </div>
        <div
          style={{
            position: 'relative',
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
                boxShadow: '0 0 15px 0 rgb(0 0 0 / 10%)',
              }}
            >
              <Slide
                slide={slideList[currentPage]}
                active={true}
                style={{ backgroundColor: paperColor, color }}
              />
            </div>
          ) : null}
          {!playMode ? (
            <div
              style={{
                width: '12vh',
                position: 'absolute',
                right: '50px',
                bottom: '40px',
                display: 'flex',
                justifyContent: 'space-between',
                zIndex: 999,
              }}
            >
              <div
                style={{
                  cursor: 'pointer',
                  filter: hoverPrev ? 'unset' : 'opacity(0.5)',
                }}
                onClick={prevPage}
                onMouseEnter={() => setHoverPrev(true)}
                onMouseLeave={() => setHoverPrev(false)}
              >
                <Icon name="prev" fill={color} width="5vh" height="5vh" />
              </div>
              <div
                style={{
                  cursor: 'pointer',
                  filter: hoverNext ? 'unset' : 'opacity(0.5)',
                }}
                onClick={nextPage}
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}
              >
                <Icon name="next" fill={color} width="5vh" height="5vh" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {playMode ? (
        <SlidePlay
          slideList={slideList}
          currentPage={currentPage}
          changePage={(pageNumber: number) => setCurrentPage(pageNumber)}
          color={color}
          style={{ backgroundColor: paperColor, color }}
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
  borderColor: string;
  style: React.CSSProperties;
}

function SlidePreview({
  slide,
  themeColor,
  isActive,
  handleClick,
  borderColor,
  style,
}: previewProps) {
  return (
    <div
      style={{
        width: '200px',
        height: '180px',
        overflow: 'hidden',
        border: `2px solid ${isActive ? themeColor : borderColor}`,
        boxShadow: isActive ? 'rgb(0 0 0 / 10%) 6px 6px 4px 0' : 'unset',
        flexShrink: 0,
        margin: '5px 0',
      }}
      onClick={() => handleClick()}
    >
      <Slide
        slide={slide}
        width={`${200 / 0.2}px`}
        height={`${180 / 0.2}px`}
        style={{
          transform: 'scale(0.2)',
          transformOrigin: 'top left',
          ...style,
        }}
        active={false}
        thumbnailMode={true}
      />
    </div>
  );
}
