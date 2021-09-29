import React from 'react';
import SlideType from '../../interfaces/SlideType';
import ImageSlides from './ImageSlides';

interface props {
  slide: SlideType;
  active?: boolean;
  thumbnailMode?: boolean;
}
export default function Title({ slide, active, thumbnailMode }: props) {
  const showImage = slide.imageList?.length;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '25px 45px',
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 500,
      }}
    >
      <div
        style={{
          width: showImage ? '50%' : thumbnailMode ? 'unset' : '100%',
          maxWidth: '60vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: showImage || thumbnailMode ? 'center' : 'flex-start',
        }}
      >
        {/* 标题 */}
        {slide.type === 'link' && slide.url ? (
          <a
            href={slide.url}
            target="_blank"
            style={{ fontSize: '8vh', color: '#1CA8B3' }}
          >
            {slide.title}
          </a>
        ) : (
          <span style={{ fontSize: '8vh' }}>{slide.title}</span>
        )}

        {/* 子标题列表 */}
        {slide.subTitleList?.length ? (
          <ul>
            {slide.subTitleList.map((title: string, index: number) => (
              <li key={index} style={{ fontSize: '4vh' }}>
                {title}
              </li>
            ))}
          </ul>
        ) : null}
        {/* 预览模式图标 */}
        {thumbnailMode && slide.icon ? (
          <i
            style={{
              width: '50vh',
              height: '50vh',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundImage: `url(${slide.icon})`,
              marginTop: '5vh',
            }}
          ></i>
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
