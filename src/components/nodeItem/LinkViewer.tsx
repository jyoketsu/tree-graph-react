import React from 'react';
import { isMobile } from '../../services/util';

interface Props {
  linkType: string;
  url: string;
}

const mobile = isMobile();
const height = mobile ? '178px' : '500px';

export default function LinkViewer({ linkType, url }: Props) {
  return (
    <div
      style={{
        width: '100%',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <iframe
        src={url}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        width="100%"
        height={linkType === 'wangyiyun' ? '85px' : height}
        style={{ maxWidth: '540px' }}
      ></iframe>
    </div>
  );
}
