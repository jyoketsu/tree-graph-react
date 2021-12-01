import Node from './Node';

export default interface CNode extends Node {
  // 以下为计算属性
  x: number;
  y: number;
  width: number;
  last_child_y: number;
  toLeft?: boolean;
  dots?: any[];
  rightDots?: any[];
  leftDots?: any[];
}
