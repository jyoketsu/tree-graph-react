import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onClickOutside: Function;
  children: React.ReactNode;
  style?: any;
}
export default function ClickOutside({
  style,
  onClickOutside,
  children,
}: Props) {
  const [isTouch, setisTouch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function handle(e: MouseEvent | TouchEvent) {
    if (e.type === 'touchend') setisTouch(true);
    if (e.type === 'click' && isTouch) return;

    const el: any = containerRef.current;
    if (el && !el.contains(e.target)) onClickOutside(e);
  }

  useEffect(() => {
    document.addEventListener('touchend', handle, true);
    document.addEventListener('click', handle, true);
    document.addEventListener('contextmenu', handle, true);

    return () => {
      document.removeEventListener('touchend', handle, true);
      document.removeEventListener('click', handle, true);
      document.removeEventListener('contextmenu', handle, true);
    };
  }, []);

  return (
    <div ref={containerRef} style={style || {}}>
      {children}
    </div>
  );
}
