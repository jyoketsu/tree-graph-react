import React, { useRef, useState } from 'react';
import Loading from './Loading';

interface Props {
  uri: string;
  id?: string;
}

export default function Webview({ uri, id }: Props) {
  const [loading, setloading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function handleOnload() {
    setloading(false);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <iframe
        id={id || 'web-view'}
        ref={iframeRef}
        name="frame-container"
        className="web-view"
        title={window.name}
        src={uri}
        frameBorder="0"
        width="100%"
        height="100%"
        allowFullScreen
        onLoad={handleOnload}
      ></iframe>
      {loading ? <Loading /> : null}
    </div>
  );
}
