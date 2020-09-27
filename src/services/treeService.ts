import { getNodeWidth } from './util';
import Node from '../interfaces/Node';
import CNode from '../interfaces/CNode';
import NodeMap from '../interfaces/NodeMap';

export default function calculate(
  nodes: NodeMap,
  startId: string,
  singleColumn: boolean | undefined,
  ITEM_HEIGHT: number,
  INDENT: number,
  FONT_SIZE: number
) {
  nodes = JSON.parse(JSON.stringify(nodes));
  // 根节点
  const root = nodes[startId];
  if (!root) {
    console.error(`Can't find the root node`);
  }
  const rootWidth = getNodeWidth(root, FONT_SIZE);
  root.width = rootWidth;
  // 是否是单列：参数单列或者根节点只有一个子节点为单列
  const isSingle =
    singleColumn || (root.sortList && root.sortList.length === 1);

  let MAX_X = rootWidth;
  let MAX_Y = ITEM_HEIGHT;
  let MAX_END = rootWidth;

  let second_start_x;
  let second_end_x;
  let SECOND_START_NODE_ID: string | undefined;
  let SECOND_END_NODE_ID: string | undefined;

  // 多列视图
  if (!isSingle) {
    if (!root.contract) {
      const secondLevel = getStarts(nodes, root);

      for (let index = 0; index < secondLevel.length; index++) {
        const element = secondLevel[index];

        if (index === 0) {
          SECOND_START_NODE_ID = element?._key;
          location(nodes, element, 10, ITEM_HEIGHT * 1.5);
        } else {
          if (index + 1 === secondLevel.length) {
            SECOND_END_NODE_ID = element?._key;
          }
          location(nodes, element, MAX_END + 55, ITEM_HEIGHT * 1.5);
        }
      }
    }

    if (MAX_END === rootWidth) {
      MAX_END = MAX_END * 2;
    }

    // 根节点坐标
    root.x = (MAX_END - root.width) / 2;
    root.y = 1;
  } else {
    // 单列视图
    location(nodes, root, 10, 10);
  }

  let nodeList = [];
  const keys = Object.keys(nodes);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    nodeList.push(nodes[key] as CNode);
  }

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
    const nodeWidth = getNodeWidth(node, FONT_SIZE);
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

    if (!node.contract) {
      // 遍历子节点
      for (let index = 0; index < childrenIds.length; index++) {
        const element = nodes[childrenIds[index]];
        if (!element) {
          console.error(
            `Can't find the node with the id ${childrenIds[index]}`
          );
          continue;
        }

        if (index === 0) {
          childY += ITEM_HEIGHT * 1.3;
          lastChildY += ITEM_HEIGHT * 1.3;
        } else {
          childY += ITEM_HEIGHT;
          lastChildY += ITEM_HEIGHT;
        }
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
    return childY;
  }
}
