import Node from '../interfaces/Node';
import CNode from '../interfaces/CNode';
import NodeMap from '../interfaces/NodeMap';

function findNodeById(nodes: CNode[], id: string) {
  return nodes.find((node: CNode) => node._key === id);
}

// 生成标识符
function guid(len: number, radix: number) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
    ''
  );
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

function textWidth(fontSize: number) {
  const ele = document.createElement('span');
  ele.innerText = '傑';
  ele.style.fontSize = `${fontSize}px`;
  ele.style.fontFamily = '"Microsoft YaHei", sans-serif';
  document.body.appendChild(ele);
  const kanjiWidth = ele.offsetWidth;
  ele.innerText = '；';
  const fullAngleWidth = ele.offsetWidth;
  ele.innerText = ';';
  const halfAnglePunctuationWidth = ele.offsetWidth;
  ele.innerText = 'a';
  const alphabetWidth = ele.offsetWidth;
  ele.innerText = '8';
  const numberWidth = ele.offsetWidth;
  document.body.removeChild(ele);
  return {
    kanjiWidth: kanjiWidth,
    fullAngleWidth: fullAngleWidth,
    halfAnglePunctuationWidth: halfAnglePunctuationWidth,
    alphabetWidth: alphabetWidth,
    numberWidth: numberWidth,
  };
}

// 获取全角字符数
function getFullAngleNum(str: string) {
  const res = str.match(/[^\x00-\xff]/g);
  return res ? res.length : 0;
}

// 获取半角标点字符数
function getHalfAnglePunctuationNum(str: string) {
  const res = str.match(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/g);
  return res ? res.length : 0;
}

// 获取半角字母数
function getAlphabetNum(str: string) {
  const res = str.match(/[a-zA-Z]/g);
  return res ? res.length : 0;
}

// 获取半角数字数
function getNumberNum(str: string) {
  const res = str.match(/[0-9]/g);
  return res ? res.length : 0;
}

// 获取节点宽度
function getNodeWidth(node: Node, fontSize: number, padding?: number) {
  const str = node.name;
  let full = getFullAngleNum(str);
  const punctuation = getHalfAnglePunctuationNum(str);
  const alphabet = getAlphabetNum(str);
  const number = getNumberNum(str);
  if (!str.length) {
    full = 6;
  }
  const width = textWidth(fontSize);

  const paddingWidth = padding ? padding * 1.5 : 15;
  const extInfoWidth = getExtInfoWidth(node);

  return (
    width.fullAngleWidth * full +
    width.halfAnglePunctuationWidth * punctuation +
    width.alphabetWidth * alphabet +
    width.numberWidth * number +
    paddingWidth +
    extInfoWidth
  );
}

// 获取额外信息宽度
function getExtInfoWidth(node: Node) {
  const avatarWidth = node.showAvatar ? 22 : 0;
  const checkboxWidth = node.showCheckbox ? 18 : 0;
  const statusWidth = node.showStatus ? 22 : 0;
  const temp = [avatarWidth, checkboxWidth, statusWidth];
  let count = 0;
  for (let index = 0; index < temp.length; index++) {
    const element = temp[index];
    if (element) {
      count++;
    }
  }

  const marginWidth = count ? count * 1.5 : 0;
  return avatarWidth + checkboxWidth + statusWidth + marginWidth;
}

function nodeLocation(node: CNode, type: string, BLOCK_HEIGHT: number) {
  switch (type) {
    case 'avatar':
      return {
        x: node.x + 5,
        y: node.y + (BLOCK_HEIGHT - 22) / 2,
      };
    case 'checkbox':
      return {
        x: node.x + 5 + (node.showAvatar ? 22 + 2 : 0),
        y: node.y + (BLOCK_HEIGHT - 18) / 2,
      };
    case 'status':
      return {
        x:
          node.x +
          5 +
          (node.showAvatar ? 22 + 2 : 0) +
          (node.showCheckbox ? 18 + 2 : 0),
        y: node.y + (BLOCK_HEIGHT - 22) / 2,
      };
    case 'text':
      const extWidth = getExtInfoWidth(node);
      return {
        x: node.x + 5 + extWidth + (extWidth ? 2 : 0),
        y: node.y + BLOCK_HEIGHT / 2 + 1,
      };
    default:
      return null;
  }
}

function addChildNode(nodeMap: NodeMap, selectedId: string) {
  let nodes = { ...nodeMap };
  const childNode: Node = {
    _key: guid(8, 16),
    name: '未命名节点',
    father: selectedId,
    sortList: [],
    showAvatar: false,
    showCheckbox: false,
    checked: false,
    showStatus: false,
    hour: 0,
    limitDay: 0,
  };
  const selectedNode = nodes[selectedId];
  selectedNode.sortList.push(childNode._key);
  nodes[childNode._key] = childNode;
  return {
    nodes: nodes,
    addedNode: childNode,
  };
}

// 向后新增同辈节点
function addNextNode(nodeMap: NodeMap, selectedId: string) {
  let nodes = { ...nodeMap };
  let selectedNode = nodes[selectedId];
  let fatherNode = nodes[selectedNode.father];
  const nextNode: Node = {
    _key: guid(8, 16),
    name: '未命名节点',
    father: fatherNode._key,
    sortList: [],
    showAvatar: false,
    showCheckbox: false,
    checked: false,
    showStatus: false,
    hour: 0,
    limitDay: 0,
  };
  let brotherKeys = fatherNode.sortList;
  brotherKeys.splice(brotherKeys.indexOf(selectedId) + 1, 0, nextNode._key);
  fatherNode.sortList = brotherKeys;
  nodes[nextNode._key] = nextNode;
  return {
    nodes: nodes,
    addedNode: nextNode,
  };
}

function deleteNode(nodeMap: NodeMap, selectedId: string) {
  let nodes = { ...nodeMap };
  let selectedNode = nodes[selectedId];
  let fatherNode = nodes[selectedNode.father];
  let brotherKeys = fatherNode.sortList;
  brotherKeys.splice(brotherKeys.indexOf(selectedId), 1);
  fatherNode.sortList = brotherKeys;

  deleteNodeById(selectedNode);

  function deleteNodeById(node: Node) {
    let sortList = node.sortList;
    for (let index = 0; index < sortList.length; index++) {
      let childKey = sortList[index];
      let child = nodes[childKey];
      deleteNodeById(child);
    }
    delete nodes[node._key];
  }

  return nodes;
}

function dot(nodeMap: NodeMap, nodeId: string) {
  let nodes = { ...nodeMap };
  const keys = Object.keys(nodes);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const element = nodes[key];
    delete element.width;
    delete element.x;
    delete element.y;
  }
  let selectedNode = nodes[nodeId];
  if (selectedNode) {
    selectedNode.contract = selectedNode.contract ? false : true;
  }
  return nodes;
}

function checkNode(nodeMap: NodeMap, nodeId: string) {
  let nodes = { ...nodeMap };
  let node = nodes[nodeId];
  if (node) {
    node.checked = !node.checked;
  }
  return nodes;
}

function changeNodeText(nodeMap: NodeMap, id: string, text: string) {
  let nodes = { ...nodeMap };
  let node = nodes[id];
  if (!text) {
    text = '未命名节点';
  }
  node.name = text;
  return nodes;
}

function editNode(c_nodes: Node[], nodeId: string, prop: any) {
  const index = c_nodes.findIndex((node: Node) => node._key === nodeId);
  c_nodes[index] = { ...c_nodes[index], ...prop };
  return c_nodes;
}

function save(c_nodes: Node[]) {
  let nodes = JSON.parse(JSON.stringify(c_nodes));
  for (let index = 0; index < nodes.length; index++) {
    let element = nodes[index];
    delete element.width;
    delete element.x;
    delete element.y;
    delete element.toLeft;
    delete element.dots;
    delete element.leftDots;
    delete element.rightDots;
  }
  return nodes;
}

function dragEnd(c_nodes: CNode[], blockHeight: number, x: number, y: number) {
  let minDiff;
  let node;
  for (let index = 0; index < c_nodes.length; index++) {
    const element = c_nodes[index];
    if (!element) {
      return;
    }
    const diff = Math.abs(x - element.x) + Math.abs(y - element.y);
    if (minDiff === undefined) {
      minDiff = diff;
      node = element;
    } else if (diff < minDiff) {
      minDiff = diff;
      node = element;
    }
  }
  if (!node) {
    return;
  }
  const diffX = x - node.x;
  const diffY = y - node.y;
  let position;
  if (Math.abs(diffX) < node.width && Math.abs(diffY) < blockHeight) {
    position = 'inside';
  } else if (diffX < 0 && diffY < 0) {
    position = 'top-left';
  } else if (diffX < 0 && diffY > 0) {
    position = 'bottom-left';
  } else if (diffX > 0 && diffY < 0) {
    position = 'top-right';
  } else {
    position = 'bottom-right';
  }
  return {
    targetNode: node,
    targetPosition: position,
  };
}

function dragSort(
  nodes: CNode[],
  selectedId: string,
  targetNodeId: string,
  position: string,
  arrange: string
) {
  let selectedNode = findNodeById(nodes, selectedId);
  let targetNode = findNodeById(nodes, targetNodeId);
  if (!selectedNode || !targetNode) {
    return nodes;
  }
  switch (position) {
    case 'inside':
      // 从选中节点的父节点的children中删除当前id
      let selectedNodeFather = findNodeById(nodes, selectedNode.father);
      if (!selectedNodeFather) {
        break;
      }
      let sortList = selectedNodeFather.sortList;
      sortList.splice(sortList.indexOf(selectedNode._key), 1);
      selectedNode.father = targetNodeId;
      // 将当前id添加到目标节点children中
      targetNode.sortList.push(selectedNode._key);
      break;
    case 'top-left':
      if (arrange === 'vertical') {
        addSibling('before');
      } else {
        addSibling('before');
      }
      break;
    case 'top-right':
      if (arrange === 'vertical') {
        addSibling('before');
      } else {
        addSibling('next');
      }
      break;
    case 'bottom-left':
      if (arrange === 'vertical') {
        addSibling('next');
      } else {
        addSibling('before');
      }
      break;
    case 'bottom-right':
      if (arrange === 'vertical') {
        addSibling('next');
      } else {
        addSibling('next');
      }
      break;
    default:
      break;
  }
  return nodes;
  function addSibling(type: string) {
    if (!selectedNode || !targetNode) {
      return;
    }
    if (selectedNode.father === targetNode.father) {
      // 从选中节点的父节点的children中删除当前id
      let father = findNodeById(nodes, targetNode.father);
      if (!father) {
        return;
      }
      let sortList = father.sortList;
      sortList.splice(sortList.indexOf(selectedNode._key), 1);
      // 将当前id添加到目标节点的父节点children中
      sortList.splice(
        type === 'next'
          ? sortList.indexOf(targetNodeId) + 1
          : sortList.indexOf(targetNodeId),
        0,
        selectedId
      );
    } else {
      // 从选中节点的父节点的children中删除当前id
      let selectedNodeFather = findNodeById(nodes, selectedNode.father);
      if (!selectedNodeFather) {
        return;
      }
      let sortList = selectedNodeFather.sortList;
      sortList.splice(sortList.indexOf(selectedNode._key), 1);
      selectedNode.father = targetNode.father;
      // 将当前id添加到目标节点的父节点children中
      let targetFather = findNodeById(nodes, targetNode.father);
      if (!targetFather) {
        return;
      }
      let children2 = targetFather.sortList;
      children2.splice(
        type === 'next'
          ? children2.indexOf(targetNodeId) + 1
          : children2.indexOf(targetNodeId),
        0,
        selectedId
      );
    }
  }
}

export {
  findNodeById,
  textWidth,
  getNodeWidth,
  getExtInfoWidth,
  nodeLocation,
  changeNodeText,
  addChildNode,
  addNextNode,
  deleteNode,
  dot,
  checkNode,
  editNode,
  save,
  dragEnd,
  dragSort,
};
