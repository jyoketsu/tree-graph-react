export default interface DragInfo {
  dragNodeId?: string;
  dropNodeId?: string;
  placement: 'up' | 'down' | 'in';
}
