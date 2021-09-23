import React, { useState, useEffect } from 'react';
import './slides.css';
import Slide from './components/slide/Slide';
import NodeMap from './interfaces/NodeMap';
import SlideType from './interfaces/SlideType';
import getSlideList from './services/slideService';

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
  const [slideList, setSlideList] = useState<SlideType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const slideList = getSlideList(nodes, startId);
    setSlideList(slideList);
  }, [nodes, startId]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '230px 1fr',
        backgroundColor: '#f5f5f5',
        color: '#424242',
      }}
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
      />
    </div>
  );
}
