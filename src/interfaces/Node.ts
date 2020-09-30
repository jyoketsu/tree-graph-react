export default interface Node {
  _key: string;
  name: string;
  father: string;
  sortList: string[];
  // 是否收起子节点
  contract?: boolean;
  showAvatar?: boolean;
  showCheckbox?: boolean;
  showStatus?: boolean;
  checked?: boolean;
  hour?: number;
  limitDay?: number;
  avatarUri?:string;
  // 以下为计算属性
  x?: number;
  y?: number;
  last_child_y?: number;
  width?: number;
}