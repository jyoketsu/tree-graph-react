import { getNodeWidth, getShortedStr } from './util';
import Node from '../interfaces/Node';
import CNode from '../interfaces/CNode';
import NodeMap from '../interfaces/NodeMap';
import _ from 'lodash';

export default function calculate(
  nodes: NodeMap,
  startId: string,
  single: boolean | undefined,
  rowGap: number,
  BLOCK_HEIGHT: number,
  INDENT: number,
  FONT_SIZE: number,
  textMaxWidth: number,
  showIcon: boolean,
  showAvatar: boolean,
  avatarRadius: number,
  rootZoomRatio: number,
  secondZoomRatio: number,
  inputNodeKey?: string
  // showChildNum?: boolean
) {
  // nodes = JSON.parse(JSON.stringify(nodes));
  nodes = _.cloneDeep(nodes);
  // 根节点
  const root = nodes[startId];
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
  let rootHeight = (root.texts?.length || 1) * BLOCK_HEIGHT * rootZoomRatio;
  if (root.imageUrl && root.imageHeight) {
    rootHeight += root.imageHeight + 15 / 2;
  }
  root.height = rootHeight;

  let MAX_X = rootWidth;
  let MAX_Y = BLOCK_HEIGHT * 2;
  let MAX_END = rootWidth * 1.5;

  let MIN_X = 85;
  let MIN_END = 55;

  let nodeList: CNode[] = [];

  if (single) {
    location(nodes, root, 85, 55);
  } else {
    if (!root.contract) {
      let { rightStarts, leftStarts } = getStarts(nodes, root);

      let [x1, y1, x2, y2] = [rootWidth + INDENT * 2, 85, -INDENT * 2, 55];

      for (let index = 0; index < rightStarts.length; index++) {
        let node = rightStarts[index];
        if (!node) {
          break;
        }
        y1 = location(nodes, node, x1, y1);
        if (index + 1 !== rightStarts.length) {
          y1 += rowGap * secondZoomRatio;
          if (y1 > MAX_Y) {
            MAX_Y = y1;
          }
        }
      }

      for (let index = 0; index < leftStarts.length; index++) {
        let node = leftStarts[index];
        if (!node) {
          break;
        }
        y2 = location(nodes, node, x2, y2, true);
        if (index + 1 !== leftStarts.length) {
          y2 += rowGap * secondZoomRatio;
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
        if (element) {
          root.leftDots.push(element.y);
        }
      }
      for (let index = 0; index < rightStarts.length; index++) {
        const element = rightStarts[index];
        if (element) {
          root.rightDots.push(element.y);
        }
      }
    } else {
      root.x = 85;
      root.y = 55;
      delete root.rightDots;
      delete root.leftDots;
    }
    nodeList.push(root as CNode);
  }

  return {
    max_x: MAX_X,
    max_y: MAX_Y + 100,
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
      showAvatar,
      avatarRadius,
      // showChildNum || false,
      false,
      textMaxWidth,
      inputNodeKey
    );

    let blockHeight = BLOCK_HEIGHT;
    if (node._key === startId) {
      blockHeight = BLOCK_HEIGHT * rootZoomRatio;
    } else if (node.father === startId) {
      blockHeight = BLOCK_HEIGHT * secondZoomRatio;
    }

    let nodeHeight = (node.texts?.length || 1) * blockHeight;
    if (node.imageUrl && node.imageHeight) {
      nodeHeight += node.imageHeight + 15 / 2;
    }

    node.x = x;
    node.width = nodeWidth;
    node.height = nodeHeight;
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

    const diffX = node._key === startId ? INDENT * 2 : INDENT;
    if (!toLeft) {
      childX = x + nodeWidth + diffX;
      if (childX > MAX_X) {
        MAX_X = childX;
      }
      if (MAX_END < node.x + nodeWidth) {
        MAX_END = node.x + nodeWidth;
      }
    } else {
      childX = x - nodeWidth - diffX;
      if (childX < MIN_X) {
        MIN_X = childX;
      }
      if (MIN_END > node.x - nodeWidth) {
        MIN_END = node.x - nodeWidth;
      }
    }

    // if (node.texts && node.texts.length > 1) {
    //   let blockHeight = BLOCK_HEIGHT;
    //   if (node._key === startId) {
    //     blockHeight = BLOCK_HEIGHT * rootZoomRatio;
    //   } else if (node.father === startId) {
    //     blockHeight = BLOCK_HEIGHT * secondZoomRatio;
    //   }
    //   childY += (node.texts.length - 1) * blockHeight;
    // }

    if (!node.contract) {
      // 遍历子节点
      for (let index = 0; index < childrenIds.length; index++) {
        const element = nodes[childrenIds[index]];
        if (!element) {
          break;
        }
        childY = location(nodes, element, childX, childY, toLeft);
        node.dots.push(element.y);
        if (index + 1 !== childrenIds.length) {
          childY += rowGap;
          if (childY > MAX_Y) {
            MAX_Y = childY;
          }
        }
      }
    }

    if (!node.contract && childrenIds.length) {
      const firstChildY = nodes[childrenIds[0]]?.y;
      const lastChildY = nodes[childrenIds[childrenIds.length - 1]]?.y;
      // 在子节点的纵向居中
      const middleY =
        firstChildY && lastChildY
          ? (firstChildY + lastChildY) / 2
          : (y + childY) / 2;
      if (node.father === startId) {
        node.y =
          middleY + BLOCK_HEIGHT / 2 - (BLOCK_HEIGHT * secondZoomRatio) / 2;
      } else if (node._key === startId) {
        node.y =
          middleY +
          (BLOCK_HEIGHT * secondZoomRatio) / 2 -
          (BLOCK_HEIGHT * rootZoomRatio) / 2;
      } else {
        node.y = middleY;
      }
    } else {
      node.y = (y + childY) / 2;
    }

    nodeList.push(node as CNode);
    // if (node.texts && node.texts.length > 1) {
    //   childY += (node.texts.length - 1) * blockHeight;
    //   if (childY > MAX_Y) {
    //     MAX_Y = childY;
    //   }
    // }
    // // 节点有图片的情况;
    // if (node.imageUrl && node.imageHeight) {
    //   childY += node.imageHeight + 15 / 2;
    //   if (childY > MAX_Y) {
    //     MAX_Y = childY;
    //   }
    // }
    if (node.y + nodeHeight > childY) {
      childY = node.y + nodeHeight;
      if (childY > MAX_Y) {
        MAX_Y = childY;
      }
    }
    return childY;
  }
}
