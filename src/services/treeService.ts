import {
  getNodeWidth,
  getAncestor,
  rainbowColors,
  lightRainbowColors,
} from './util';
import Node from '../interfaces/Node';
import CNode from '../interfaces/CNode';
import NodeMap from '../interfaces/NodeMap';
import _ from 'lodash';

export default function calculate(
  nodes: NodeMap,
  startId: string,
  singleColumn: boolean | undefined,
  ITEM_HEIGHT: number,
  topBottomMargin: number,
  lineHeight: number,
  INDENT: number,
  FONT_SIZE: number,
  textMaxWidth: number,
  showIcon: boolean,
  showAvatar: boolean,
  avatarRadius: number,
  rootZoomRatio: number,
  secondZoomRatio: number,
  startX: number,
  startY: number,
  columnSpacing?: number,
  collapseMode?: boolean,
  expandedNodeKey?: string | null,
  inputNodeKey?: string,
  hideRoot?: boolean,
  rainbowColor?: boolean
  // showChildNum?: boolean
) {
  // nodes = JSON.parse(JSON.stringify(nodes));
  const BLOCK_HEIGHT = topBottomMargin * 2 + lineHeight;
  nodes = _.cloneDeep(nodes);
  const start_x = startX;
  const start_y = startY;
  let rainbowIndex = 0;
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
    // showChildNum || false,
    false,
    textMaxWidth,
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
      let rootHeight = (root.texts?.length || 1) * BLOCK_HEIGHT * rootZoomRatio;
      if (root.imageUrl && root.imageHeight) {
        rootHeight += root.imageHeight + 15 / 2;
      }
      root.height = rootHeight;

      const secondLevel = getStarts(nodes, root);

      for (let index = 0; index < secondLevel.length; index++) {
        const element = secondLevel[index];
        let diffY = rootHeight + ITEM_HEIGHT * 2;
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
      root.x = (second_end_x + second_start_x) / 2 - (root.width || 0) / 2;
    } else {
      root.x = (MAX_END - (root.width || 0)) / 2;
    }
    root.y = start_y;
    nodeList.push(root as CNode);
  } else {
    // 单列视图
    if (rainbowColor) {
      root.backgroundColor = '#CB1B45';
    }
    location(nodes, root, start_x, start_y, '#CB1B45');
  }

  // let nodeList = [];
  // const keys = Object.keys(nodes);
  // for (let index = 0; index < keys.length; index++) {
  //   const key = keys[index];
  //   nodeList.push(nodes[key] as CNode);
  // }

  return {
    max_x: MAX_X,
    max_y: MAX_Y + ITEM_HEIGHT + startY,
    max_end: MAX_END + startX,
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

  function location(
    nodes: NodeMap,
    node: Node,
    x: number,
    y: number,
    fatherRainbowColor?: string,
    backgroundColor?: string
  ) {
    let childX = x;
    let childY = y;
    let lastChildY = y;

    let collapsed;
    const childrenIds = node.sortList || [];

    if (!(hideRoot && node._key === startId)) {
      // const shorted = getShortedStr(node.name);
      // if (shorted) {
      //   node.shorted = shorted;
      // }
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
        // showChildNum || false,
        false,
        textMaxWidth,
        inputNodeKey
      );
      node.x = x;
      node.y = y;
      node.width = nodeWidth;

      childX = childX + INDENT;

      // 多行文字的情况
      if (node.texts && node.texts.length > 1) {
        let line_height = lineHeight;
        if (node._key === startId) {
          line_height = lineHeight * rootZoomRatio;
        } else if (node.father === startId) {
          line_height = lineHeight * secondZoomRatio;
        }
        childY += (node.texts.length - 1) * line_height;
        lastChildY += (node.texts.length - 1) * line_height;
      }
      // 节点有图片的情况
      if (node.imageUrl && node.imageHeight) {
        childY += node.imageHeight + 15 / 2;
        lastChildY += node.imageHeight + 15 / 2;
        if (childY > MAX_Y) {
          MAX_Y = childY;
        }
      }
      // 节点收缩的情况
      if (node.contract && node.sortList.length) {
        childY += 16 + 5;
      }

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

      if (hideRoot && node._key === startId) {
        collapsed = false;
      } else if (collapseMode) {
        if (expandedNodeKey && ancestorList.includes(node._key)) {
          collapsed = node.contract;
        } else {
          collapsed = true;
        }
      } else {
        collapsed = node.contract;
      }
    }

    if (rainbowColor) {
      if (node.father === startId) {
        node.backgroundColor = rainbowColors[rainbowIndex];
        if (rainbowIndex + 1 === rainbowColors.length) {
          rainbowIndex = 0;
        } else {
          rainbowIndex++;
        }
      }

      if (fatherRainbowColor) {
        node.pathColor = fatherRainbowColor;
      }
      if (backgroundColor) {
        node.backgroundColor = backgroundColor;
      }
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

        let diffY;
        if (index === 0) {
          if (node._key === startId) {
            diffY =
              ITEM_HEIGHT - BLOCK_HEIGHT * rootZoomRatio > 40
                ? ITEM_HEIGHT
                : BLOCK_HEIGHT * rootZoomRatio + 40;
          } else if (node.father === startId) {
            diffY =
              ITEM_HEIGHT - BLOCK_HEIGHT * secondZoomRatio > 8
                ? ITEM_HEIGHT
                : BLOCK_HEIGHT * rootZoomRatio + 8;
          } else {
            diffY = ITEM_HEIGHT;
          }
        } else {
          if (element._key === startId) {
            diffY =
              ITEM_HEIGHT - BLOCK_HEIGHT * rootZoomRatio > 40
                ? ITEM_HEIGHT
                : BLOCK_HEIGHT * rootZoomRatio + 40;
          } else if (element.father === startId) {
            diffY =
              ITEM_HEIGHT - BLOCK_HEIGHT * secondZoomRatio > 8
                ? ITEM_HEIGHT
                : BLOCK_HEIGHT * rootZoomRatio + 8;
          } else {
            diffY = ITEM_HEIGHT;
          }
        }

        childY += diffY + 5;
        lastChildY += diffY + 5;

        childY = location(
          nodes,
          element,
          childX,
          childY,
          rainbowColor && node.father === startId
            ? node.backgroundColor
            : fatherRainbowColor,
          rainbowColor && node.father === startId
            ? // @ts-ignore
              lightRainbowColors[node.backgroundColor]
            : backgroundColor
        );

        if (childY > MAX_Y) {
          MAX_Y = childY;
        }

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
