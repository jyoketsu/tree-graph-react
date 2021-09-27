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

export interface GetNodeUrlFunc {
  (node: Node): string;
}

export interface SlideProps {
  // 节点
  nodes: NodeMap;
  // 根节点id
  startId: string;
  themeColor?: string;
  getNodeUrl: GetNodeUrlFunc;
}

export const Slides = ({
  nodes,
  startId,
  themeColor = '#1CA8B3',
  getNodeUrl,
}: SlideProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideList, setSlideList] = useState<SlideType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [playMode, setPlayMode] = useState(false);
  const [paperColor, setpaperColor] = useState('#434343');
  const [color, setcolor] = useState('#FFF');
  const [backgroundColor, setbackgroundColor] = useState('#656765');
  const [borderColor, setborderColor] = useState('#1C1C1C');

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

  const handleChangeColor = () => {
    if (paperColor === '#434343') {
      setpaperColor('#FFF');
      setcolor('#434343');
      setbackgroundColor('#f5f5f5');
      setborderColor('#eee');
    } else {
      setpaperColor('#434343');
      setcolor('#FFF');
      setbackgroundColor('#656765');
      setborderColor('#1C1C1C');
    }
  };

  return (
    <div
      tabIndex={-1}
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '40px 1fr',
        backgroundColor: backgroundColor,
        color: color,
        outline: 'none',
      }}
      onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e)}
    >
      <div
        style={{
          padding: '0 15px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: paperColor,
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
            <Icon name="sun" fill={color} />
          ) : (
            <Icon name="moon" fill={color} />
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
          <Icon name="play" fill={color} />
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
            backgroundColor: paperColor,
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
        </div>
      </div>
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
  borderColor: string;
}

function SlidePreview({
  slide,
  themeColor,
  isActive,
  handleClick,
  borderColor,
}: previewProps) {
  return (
    <div
      style={{
        width: '200px',
        height: '180px',
        overflow: 'hidden',
        border: `1px solid ${isActive ? themeColor : borderColor}`,
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
        }}
        active={false}
      />
    </div>
  );
}
