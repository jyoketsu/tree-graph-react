import React from 'react';
import SlideType from '../../interfaces/SlideType';
import ImageSlides from './ImageSlides';

interface props {
  slide: SlideType;
  width?: string;
  height?: string;
  style?: object;
  isPreview?: boolean;
}
export default function Slide({
  slide,
  width = '100%',
  height = '100%',
  style,
  isPreview,
}: props) {
  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        padding: '25px 45px',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {/* 标题 */}
      <span style={{ fontSize: '48px', textAlign: 'center' }}>
        {slide.title}
      </span>
      {/* 子标题列表 */}
      {slide.subTitleList.length ? (
        <ul>
          {slide.subTitleList.map((title: string, index: number) => (
            <li key={index} style={{ fontSize: '18px' }}>
              {title}
            </li>
          ))}
        </ul>
      ) : null}
      {/* 图片附件 */}
      {slide.imageList?.length ? (
        <div style={{ flex: 1 }}>
          <ImageSlides
            imageList={isPreview ? [slide.imageList[0]] : slide.imageList}
          />
        </div>
      ) : null}
    </div>
  );
}
