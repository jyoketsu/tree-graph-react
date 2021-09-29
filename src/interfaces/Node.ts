import Attach from './Attach';

export default interface Node {
  _key: string;
  name: string;
  father: string;
  sortList: string[];
  type?: string;
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
  // 以下为计算属性
  x?: number;
  y?: number;
  last_child_y?: number;
  width?: number;
  toLeft?: boolean;
  dots?: any[];
  rightDots?: any[];
  leftDots?: any[];
}
