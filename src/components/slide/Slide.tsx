import React from 'react';
import SlideType from '../../interfaces/SlideType';
import Title from './Title';
import Webview from '../common/Webview';

interface props {
  slide: SlideType;
  width?: string;
  height?: string;
  style?: object;
  active?: boolean;
  thumbnailMode?: boolean;
}
export default function Slide({
  slide,
  width = '100%',
  height = '100%',
  style,
  active,
  thumbnailMode,
}: props) {
  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {slide.url && slide.type !== 'link' && !thumbnailMode ? (
        <Webview uri={slide.url} />
      ) : (
        <Title slide={slide} active={active} thumbnailMode={thumbnailMode} />
      )}
      {!active ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        ></div>
      ) : null}
    </div>
  );
}
