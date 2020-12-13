export default interface Node {
  _key: string;
  name: string;
  father: string;
  sortList: string[];
  shorted?: string;
  // 是否收起子节点
  contract?: boolean;
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
  // 以下为计算属性
  x?: number;
  y?: number;
  last_child_y?: number;
  width?: number;
}
