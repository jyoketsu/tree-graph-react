import { getNodeWidth, getShortedStr } from './util';
import Node from '../interfaces/Node';
import CNode from '../interfaces/CNode';
import NodeMap from '../interfaces/NodeMap';

export default function calculate(
  nodes: NodeMap,
  startId: string,
  single: boolean | undefined,
  ITEM_HEIGHT: number,
  INDENT: number,
  FONT_SIZE: number,
  showIcon: boolean,
  showAvatar: boolean,
  rootZoomRatio: number,
  secondZoomRatio: number
) {
  nodes = JSON.parse(JSON.stringify(nodes));
  // 根节点
  const root = nodes[startId];
  const rootWidth = getNodeWidth(
    root,
    FONT_SIZE * rootZoomRatio,
    showIcon,
    showAvatar
  );
  root.width = rootWidth;

  let MAX_X = rootWidth;
  let MAX_Y = ITEM_HEIGHT;
  let MAX_END = rootWidth * 1.5;

  let MIN_X = 10;
  let MIN_END = 10;

  let nodeList: CNode[] = [];

  if (single) {
    location(nodes, root, 10, 10);
  } else {
    if (!root.contract) {
      let { rightStarts, leftStarts } = getStarts(nodes, root);

      let [x1, y1, x2, y2] = [
        10 + rootWidth + INDENT * 2,
        10,
        -10 - INDENT * 2,
        10,
      ];

      for (let index = 0; index < rightStarts.length; index++) {
        let node = rightStarts[index];
        y1 = location(nodes, node, x1, y1);
        if (index + 1 !== rightStarts.length) {
          y1 += ITEM_HEIGHT * 1.3;
          if (y1 > MAX_Y) {
            MAX_Y = y1;
          }
        }
      }

      for (let index = 0; index < leftStarts.length; index++) {
        let node = leftStarts[index];
        y2 = location(nodes, node, x2, y2, true);
        if (index + 1 !== leftStarts.length) {
          y2 += ITEM_HEIGHT * 1.3;
          if (y2 > MAX_Y) {
            MAX_Y = y2;
          }
        }
      }

      const diff = Math.abs(MIN_END);
      const nodeKeys = Object.keys(nodes);
      for (let index = 0; index < nodeKeys.length; index++) {
        let node = nodes[nodeKeys[index]];
        node.x = node.x ? node.x + diff : 0;
      }
      MAX_X = MAX_X + Math.abs(MIN_X);
      MAX_END = MAX_END + Math.abs(MIN_END);
      root.x = Math.abs(MIN_END);
      root.y = MAX_Y / 2;
      root.rightDots = [];
      root.leftDots = [];
      for (let index = 0; index < leftStarts.length; index++) {
        const element = leftStarts[index];
        root.leftDots.push(element.y);
      }
      for (let index = 0; index < rightStarts.length; index++) {
        const element = rightStarts[index];
        root.rightDots.push(element.y);
      }
    } else {
      root.x = 10;
      root.y = 10;
      delete root.rightDots;
      delete root.leftDots;
    }
    nodeList.push(root as CNode);
  }

  return {
    max_x: MAX_X,
    max_y: MAX_Y + ITEM_HEIGHT,
    max_end: MAX_END,
    nodes: nodeList,
  };

  function getStarts(nodes: NodeMap, root: Node) {
    let rightStarts = [];
    let leftStarts = [];
    const childrenIds = root.sortList || [];
    for (let index = 0; index < childrenIds.length; index++) {
      const element = nodes[childrenIds[index]];
      if (index % 2 === 0) {
        rightStarts.push(element);
      } else {
        leftStarts.push(element);
      }
    }
    return {
      rightStarts: rightStarts,
      leftStarts: leftStarts,
    };
  }

  function location(
    nodes: NodeMap,
    node: Node,
    x: number,
    y: number,
    toLeft?: boolean
  ) {
    const shorted = getShortedStr(node.name);
    if (shorted) {
      node.shorted = shorted;
    }
    const nodeWidth = getNodeWidth(
      node,
      node._key === startId
        ? FONT_SIZE * rootZoomRatio
        : node.father === startId
        ? FONT_SIZE * secondZoomRatio
        : FONT_SIZE,
      showIcon,
      showAvatar
    );
    node.x = x;
    node.width = nodeWidth;
    if (toLeft) {
      node.toLeft = true;
      node.x = node.x - nodeWidth;
    } else {
      delete node.toLeft;
    }
    node.dots = [];
    const childrenIds = node.sortList;

    let childY = y;

    let childX;

    if (!toLeft) {
      childX = x + nodeWidth + INDENT * 2;
      if (childX > MAX_X) {
        MAX_X = childX;
      }
      if (MAX_END < node.x + nodeWidth) {
        MAX_END = node.x + nodeWidth;
      }
    } else {
      childX = x - nodeWidth - INDENT * 2;
      if (childX < MIN_X) {
        MIN_X = childX;
      }
      if (MIN_END > node.x - nodeWidth) {
        MIN_END = node.x - nodeWidth;
      }
    }

    if (!node.contract) {
      // 遍历子节点
      for (let index = 0; index < childrenIds.length; index++) {
        const element = nodes[childrenIds[index]];
        childY = location(nodes, element, childX, childY, toLeft);
        node.dots.push(element.y);
        if (index + 1 !== childrenIds.length) {
          childY += ITEM_HEIGHT * 1.3;
          if (childY > MAX_Y) {
            MAX_Y = childY;
          }
        }
      }
    }
    node.y = (y + childY) / 2;
    nodeList.push(node as CNode);
    return childY;
  }
}
