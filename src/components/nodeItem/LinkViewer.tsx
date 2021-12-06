import React from 'react';
import { isMobile } from '../../services/util';

interface Props {
  url: string;
  linkType?: string;
  name?: string;
  note?: string;
  icon?: string;
  onClick?: Function;
}

const mobile = isMobile();
const height = mobile ? '178px' : '500px';

export default function LinkViewer({
  url,
  linkType,
  name,
  note,
  icon,
  onClick,
}: Props) {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        cursor: 'pointer',
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
    >
      {linkType ? (
        <iframe
          src={url}
          scrolling="no"
          frameBorder="0"
          allowFullScreen
          width="100%"
          height={linkType === 'wangyiyun' ? '85px' : height}
          style={{ maxWidth: '540px' }}
        ></iframe>
      ) : (
        <div
          className="normal-link"
          style={{
            width: '100%',
            padding: '16px',
            border: '1px solid #DCDCDC',
            boxSizing: 'border-box',
            borderRadius: '4px',
          }}
          onClick={() => {
            if (onClick) {
              onClick();
            }
          }}
        >
          <div
            style={{
              fontSize: '16px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              color: '#595853',
              fontWeight: 700,
            }}
          >
            {name}
          </div>
          {note ? (
            <div style={{ color: '#878683', fontSize: '12px' }}>{note}</div>
          ) : null}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <i
              style={{
                width: '14px',
                height: '14px',
                marginRight: '5px',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url("${icon}")`,
              }}
            ></i>
            <span style={{ fontSize: '12px', lineHeight: '12px' }}>{url}</span>
          </div>
        </div>
      )}
    </div>
  );
}
