import React from 'react';
import Attach from './Attach';

export default interface Node {
  _key: string;
  name: string;
  father: string;
  sortList: string[];
  type?: string;
  fileType?: string;
  linkType?: string;
  shorted?: string;
  // 是否收起子节点
  contract?: boolean;
  hasCollect?: boolean;
  // 是否已歸檔
  isPack?: boolean;
  checked?: boolean;
  hour?: number;
  limitDay?: number;
  avatarUri?: string;
  icon?: string;
  color?: string;
  backgroundColor?: string;
  dotIcon?: string;
  showCheckbox?: boolean;
  showStatus?: boolean;
  disabled?: boolean;
  strikethrough?: boolean;
  updateTime?: number;
  url?: string;
  // 节点附件
  attach?: Attach[];
  // 备注
  note?: string;
  childNum?: number;
  // 图片
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  // start adornment
  startAdornment?: React.FC<{
    x: number;
    y: number;
    nodeKey: string;
  }>;
  startAdornmentWidth?: number;
  startAdornmentHeight?: number;
  startAdornmentContent?: any;
  // end adornment
  endAdornment?: React.FC<{
    x: number;
    y: number;
    nodeKey: string;
  }>;
  endAdornmentWidth?: number;
  endAdornmentHeight?: number;
  endAdornmentContent?: any;
  // 以下为计算属性
  x?: number;
  y?: number;
  last_child_y?: number;
  width?: number;
  height?: number;
  toLeft?: boolean;
  dots?: any[];
  rightDots?: any[];
  leftDots?: any[];
  texts?: string[];
}
