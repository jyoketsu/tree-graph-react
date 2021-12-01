import React from 'react';

interface Props {
  fileType: string;
  url: string;
}

export default function FileViewer({ fileType, url }: Props) {
  let content = null;
  if (fileType.includes('image/')) {
    content = <ImageViewer url={url} />;
  } else if (fileType.includes('audio/')) {
    content = <MusicPlayer url={url} />;
  } else if (fileType.includes('video/')) {
    content = <VideoPlayer url={url} />;
  }
  return (
    <div
      style={{
        width: '100%',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {content}
    </div>
  );
}

function ImageViewer({ url }: { url: string }) {
  return (
    <img alt="图片预览" src={url} width="100%" style={{ maxWidth: '540px' }} />
  );
}

function MusicPlayer({ url }: { url: string }) {
  return (
    <audio controls src={url}>
      Your browser does not support the
      <code>audio</code> element.
    </audio>
  );
}

function VideoPlayer({ url }: { url: string }) {
  return (
    <video src={url} controls width="100%" style={{ maxWidth: '540px' }} />
  );
}
