import React from 'react';
import SlideType from '../../interfaces/SlideType';
import ImageSlides from './ImageSlides';

interface props {
  slide: SlideType;
  active?: boolean;
}
export default function Title({ slide, active }: props) {
  const showImage = slide.imageList?.length;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '25px 45px',
        display: 'flex',
      }}
    >
      <div
        style={{
          width: showImage ? '50%' : '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: showImage ? 'center' : 'flex-start',
        }}
      >
        {/* 标题 */}
        <span style={{ fontSize: '48px' }}>{slide.title}</span>
        {/* 子标题列表 */}
        {slide.subTitleList?.length ? (
          <ul>
            {slide.subTitleList.map((title: string, index: number) => (
              <li key={index} style={{ fontSize: '18px' }}>
                {title}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {/* 图片附件 */}
      {slide.imageList?.length ? (
        <div style={{ width: '50%' }}>
          <ImageSlides
            imageList={!active ? [slide.imageList[0]] : slide.imageList}
          />
        </div>
      ) : null}
    </div>
  );
}
