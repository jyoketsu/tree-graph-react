export default interface CNode {
  _key: string;
  name: string;
  father: string;
  sortList: string[];
  x: number;
  y: number;
  width: number;
  last_child_y?: number;
  // 是否收起子节点
  contract?: boolean;
  showAvatar?: boolean;
  showCheckbox?: boolean;
  showStatus?: boolean;
  checked?: boolean;
  hour?: number;
  limitDay?: number;
}
