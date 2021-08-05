import { getNodeWidth, getShortedStr, getAncestor } from './util';
import Node from '../interfaces/Node';
import CNode from '../interfaces/CNode';
import NodeMap from '../interfaces/NodeMap';

export default function calculate(
  nodes: NodeMap,
  startId: string,
  singleColumn: boolean | undefined,
  ITEM_HEIGHT: number,
  BLOCK_HEIGHT: number,
  INDENT: number,
  FONT_SIZE: number,
  showIcon: boolean,
  showAvatar: boolean,
  avatarRadius: number,
  rootZoomRatio: number,
  secondZoomRatio: number,
  startX?: number,
  startY?: number,
  columnSpacing?: number,
  collapseMode?: boolean,
  expandedNodeKey?: string | null,
  inputNodeKey?: string
) {
  nodes = JSON.parse(JSON.stringify(nodes));
  const start_x = startX || 15;
  const start_y = startY || 15;
  // 根节点
  const root = nodes[startId];
  if (!root) {
    console.error(`Can't find the root node`);
    return;
  }
  const rootWidth = getNodeWidth(
    root,
    FONT_SIZE * rootZoomRatio,
    showIcon,
    showAvatar,
    avatarRadius,
    undefined,
    inputNodeKey
  );
  root.width = rootWidth;
  // 是否是单列：参数单列或者根节点只有一个子节点为单列
  const isSingle =
    singleColumn || (root.sortList && root.sortList.length === 1);

  let MAX_X = rootWidth;
  let MAX_Y = start_y + ITEM_HEIGHT * rootZoomRatio * 2;
  let MAX_END = rootWidth;

  let second_start_x;
  let second_end_x;
  let SECOND_START_NODE_ID: string | undefined;
  let SECOND_END_NODE_ID: string | undefined;

  let nodeList: CNode[] = [];

  let ancestorList: string[] = [];
  if (collapseMode && expandedNodeKey && nodes[expandedNodeKey]) {
    ancestorList = getAncestor(nodes[expandedNodeKey], nodes, true);
  }

  // 多列视图
  if (!isSingle) {
    if (!root.contract) {
      const secondLevel = getStarts(nodes, root);

      for (let index = 0; index < secondLevel.length; index++) {
        const element = secondLevel[index];

        const diffY =
          ITEM_HEIGHT - BLOCK_HEIGHT * rootZoomRatio > 40
            ? ITEM_HEIGHT
            : BLOCK_HEIGHT * rootZoomRatio + 40;
        if (index === 0) {
          SECOND_START_NODE_ID = element?._key;
          location(nodes, element, start_x, start_y + diffY);
        } else {
          if (index + 1 === secondLevel.length) {
            SECOND_END_NODE_ID = element?._key;
          }
          location(
            nodes,
            element,
            MAX_END + (columnSpacing ? columnSpacing : 55 * secondZoomRatio),
            start_y + diffY
          );
        }
      }
    }

    if (MAX_END === rootWidth) {
      MAX_END = MAX_END * 2;
    }

    // 根节点坐标
    if (second_start_x && second_end_x) {
      root.x = (second_end_x + second_start_x) / 2 - root.width / 2;
    } else {
      root.x = (MAX_END - root.width) / 2;
    }
    root.y = start_y;
    nodeList.push(root as CNode);
  } else {
    // 单列视图
    location(nodes, root, start_x, start_y);
  }

  // let nodeList = [];
  // const keys = Object.keys(nodes);
  // for (let index = 0; index < keys.length; index++) {
  //   const key = keys[index];
  //   nodeList.push(nodes[key] as CNode);
  // }

  return {
    max_x: MAX_X,
    max_y: MAX_Y + ITEM_HEIGHT,
    max_end: MAX_END,
    second_start_x: second_start_x,
    second_end_x: second_end_x,
    isSingle: isSingle,
    nodes: nodeList,
  };

  function getStarts(nodes: NodeMap, root: Node) {
    const secondLevel = [];
    const childrenIds = root.sortList || [];
    for (let index = 0; index < childrenIds.length; index++) {
      const element = nodes[childrenIds[index]];
      if (element) {
        secondLevel.push(element);
      } else {
        console.error(`Can't find the node with the id ${childrenIds[index]}`);
      }
    }
    return secondLevel;
  }

  function location(nodes: NodeMap, node: Node, x: number, y: number) {
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
      showAvatar,
      avatarRadius,
      undefined,
      inputNodeKey
    );
    node.x = x;
    node.y = y;
    node.width = nodeWidth;
    const childrenIds = node.sortList || [];
    let childX = x + INDENT;
    let childY = y;
    let lastChildY = y;
    if (childX > MAX_X) {
      MAX_X = childX;
    }
    if (MAX_END < node.x + nodeWidth) {
      MAX_END = node.x + nodeWidth;
    }

    if (node._key === SECOND_START_NODE_ID) {
      second_start_x = node.x + nodeWidth / 2;
    }
    if (node._key === SECOND_END_NODE_ID) {
      second_end_x = node.x + nodeWidth / 2;
    }

    let collapsed;
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

        const diffY =
          index === 0
            ? node._key === startId
              ? ITEM_HEIGHT - BLOCK_HEIGHT * rootZoomRatio > 40
                ? ITEM_HEIGHT
                : BLOCK_HEIGHT * rootZoomRatio + 40
              : node.father === startId
              ? ITEM_HEIGHT - BLOCK_HEIGHT * secondZoomRatio > 8
                ? ITEM_HEIGHT
                : BLOCK_HEIGHT * rootZoomRatio + 8
              : ITEM_HEIGHT
            : element._key === startId
            ? ITEM_HEIGHT - BLOCK_HEIGHT * rootZoomRatio > 40
              ? ITEM_HEIGHT
              : BLOCK_HEIGHT * rootZoomRatio + 40
            : element.father === startId
            ? ITEM_HEIGHT - BLOCK_HEIGHT * secondZoomRatio > 8
              ? ITEM_HEIGHT
              : BLOCK_HEIGHT * rootZoomRatio + 8
            : ITEM_HEIGHT;

        childY += diffY + 5;
        lastChildY += diffY + 5;

        if (childY > MAX_Y) {
          MAX_Y = childY;
        }

        childY = location(nodes, element, childX, childY);

        // 非最后一个子节点
        if (index + 1 !== childrenIds.length) {
          lastChildY = childY;
        }
      }
    }

    node.last_child_y = lastChildY;
    nodeList.push(node as CNode);
    return childY;
  }
}
