import React from 'react';
import SlideType from '../../interfaces/SlideType';

interface props {
  slide: SlideType;
  width?: string;
  height?: string;
  style?: object;
}
export default function Slide({
  slide,
  width = '100%',
  height = '100%',
  style,
}: props) {
  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        padding: '25px 45px',
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
    >
      <div>
        <h1>{slide.title}</h1>
        <ul>
          {slide.subTitleList.map((title: string, index: number) => (
            <li key={index}>{title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
