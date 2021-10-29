import { getAncestor } from './util';
import Node from '../interfaces/Node';
import CNode from '../interfaces/CNode';
import NodeMap from '../interfaces/NodeMap';

export default function calculate(
  nodes: NodeMap,
  startId: string,
  INDENT: number,
  startX?: number,
  collapseMode?: boolean,
  expandedNodeKey?: string | null,
  hideRoot?: boolean
) {
  nodes = JSON.parse(JSON.stringify(nodes));
  const start_x = startX || 15;
  const start_y = 1;
  // 根节点
  const root = nodes[startId];
  if (!root) {
    console.error(`Can't find the root node`);
    return;
  }

  let nodeList: CNode[] = [];
  let ancestorList: string[] = [];
  if (collapseMode && expandedNodeKey && nodes[expandedNodeKey]) {
    ancestorList = getAncestor(nodes[expandedNodeKey], nodes, true);
  }

  location(nodes, root, start_x, start_y);
  // if (hideRoot) {
  //   root.x = 0;
  //   root.y = 0;
  //   nodeList.unshift(root as CNode);
  // }
  return nodeList;

  function location(nodes: NodeMap, node: Node, x: number, y: number) {
    let childX = x;
    let childY = y;
    let collapsed;
    const childrenIds = node.sortList || [];

    node.x = x;
    node.y = y;
    if (!(hideRoot && node._key === startId)) {
      childX = childX + INDENT;
    }

    if (collapseMode) {
      if (expandedNodeKey && ancestorList.includes(node._key)) {
        collapsed = node.contract;
      } else {
        collapsed = true;
      }
    } else {
      collapsed = node.contract;
    }

    if (!collapsed) {
      // 遍历子节点
      for (let index = 0; index < childrenIds.length; index++) {
        const element = nodes[childrenIds[index]];
        if (!element) {
          console.error(
            `Can't find the node with the id ${childrenIds[index]}`
          );
          continue;
        }
        childY += 1;
        childY = location(nodes, element, childX, childY);
      }
    }
    nodeList.push(node as CNode);
    return childY;
  }
}
