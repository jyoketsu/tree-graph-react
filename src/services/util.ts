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

function getShortedStr(str: string) {
  if (str.length <= 28) {
    return;
  } else {
    let shorted = '';
    let count = 0;
    for (let index = 0; index < str.length; index++) {
      if (count < 28) {
        const char = str[index];
        // 全角
        if (char.match(/[^\x00-\xff]/g)) {
          count++;
        } else {
          count += 0.5;
        }
        shorted += char;
      } else {
        break;
      }
    }
    if (count >= 28) {
      return `${shorted}...`;
    }
    return;
  }
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

function textWidthAll(fontSize: number, text: string) {
  const ele = document.createElement('span');
  ele.innerText = text;
  ele.style.fontSize = `${fontSize}px`;
  ele.style.fontFamily = '"Microsoft YaHei", sans-serif';
  document.body.appendChild(ele);
  const width = ele.offsetWidth;
  document.body.removeChild(ele);
  return width;
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
function getNodeWidth(
  node: Node,
  fontSize: number,
  showIcon: boolean,
  showAvatar: boolean,
  padding?: number
) {
  const str = node.shorted || node.name;
  // let full = getFullAngleNum(str);
  // const punctuation = getHalfAnglePunctuationNum(str);
  // const alphabet = getAlphabetNum(str);
  // const number = getNumberNum(str);
  // if (!str.length) {
  //   full = 1;
  // }
  // const width = textWidth(fontSize);
  const width = textWidthAll(fontSize, str);

  const paddingWidth = padding ? padding * 1.5 : 15;
  const extInfoWidth = getExtInfoWidth(node, showIcon, showAvatar);

  return (
    // width.fullAngleWidth * full +
    // width.halfAnglePunctuationWidth * punctuation +
    // width.alphabetWidth * alphabet +
    // width.numberWidth * number +
    (width || 100) + paddingWidth + extInfoWidth
  );
}

// 获取额外信息宽度
function getExtInfoWidth(node: Node, showIcon: boolean, showAvatar: boolean) {
  const iconWidth = showIcon && node.icon ? 22 : 0;
  const avatarWidth = showAvatar && node.avatarUri ? 22 : 0;
  const checkboxWidth = node.showCheckbox ? 18 : 0;
  const statusWidth = node.showStatus ? 22 : 0;
  const temp = [iconWidth, avatarWidth, checkboxWidth, statusWidth];
  let count = 0;
  for (let index = 0; index < temp.length; index++) {
    const element = temp[index];
    if (element) {
      count++;
    }
  }

  const marginWidth = count ? count * 1.5 : 0;
  return iconWidth + avatarWidth + checkboxWidth + statusWidth + marginWidth;
}

function nodeLocation(
  node: CNode,
  type: string,
  BLOCK_HEIGHT: number,
  showIcon: boolean,
  showAvatar: boolean,
  paddingLeft?: number
) {
  const startX = paddingLeft || 5;
  switch (type) {
    case 'icon':
      return {
        x: node.x + startX,
        y: node.y + (BLOCK_HEIGHT - 22) / 2,
      };
    case 'avatar':
      return {
        x: node.x + startX + (showIcon && node.icon ? 22 + 2 : 0),
        y: node.y + (BLOCK_HEIGHT - 22) / 2,
      };
    case 'checkbox':
      return {
        x:
          node.x +
          startX +
          (showIcon && node.icon ? 22 + 2 : 0) +
          (showAvatar && node.avatarUri ? 22 + 2 : 0),
        y: node.y + (BLOCK_HEIGHT - 18) / 2,
      };
    case 'status':
      return {
        x:
          node.x +
          startX +
          (showIcon && node.icon ? 22 + 2 : 0) +
          (showAvatar && node.avatarUri ? 22 + 2 : 0) +
          (node.showCheckbox ? 18 + 2 : 0),
        y: node.y + (BLOCK_HEIGHT - 22) / 2,
      };
    case 'text':
      const extWidth = getExtInfoWidth(node, showIcon, showAvatar);
      return {
        x: node.x + startX + extWidth + (extWidth ? 2 : 0),
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
    name: '',
    father: selectedId,
    sortList: [],
    checked: false,
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
    name: '',
    father: fatherNode._key,
    sortList: [],
    checked: false,
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

function changeSortList(
  nodeMap: NodeMap,
  selectedId: string,
  type: 'up' | 'down'
) {
  let nodes = { ...nodeMap };
  let selectedNode = nodes[selectedId];
  let fatherNode = nodes[selectedNode.father];
  let brotherKeys = fatherNode.sortList;
  const index = brotherKeys.indexOf(selectedId);
  if (type === 'up') {
    if (index === 0) {
      return null;
    }
    [brotherKeys[index - 1], brotherKeys[index]] = [
      brotherKeys[index],
      brotherKeys[index - 1],
    ];
  } else if (type === 'down') {
    if (index + 1 === brotherKeys.length) {
      return null;
    }
    [brotherKeys[index], brotherKeys[index + 1]] = [
      brotherKeys[index + 1],
      brotherKeys[index],
    ];
  }
  return {
    nodes,
    brotherKeys,
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
    text = '';
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

function pasteNode(
  map: NodeMap,
  pasteNodeKey: string,
  pasteType: 'copy' | 'cut',
  targetNodeKey: string
) {
  let nodeMap = { ...map };
  let pasteNode = nodeMap[pasteNodeKey];
  let targetNode = nodeMap[targetNodeKey];
  if (pasteType === 'cut') {
    if (pasteNodeKey === targetNodeKey) {
      return null;
    }
    // 從選中節點的父節點的children中刪除當前id
    let selectedNodeFather = nodeMap[pasteNode.father];
    if (!selectedNodeFather) {
      return;
    }
    let sortList = selectedNodeFather.sortList;
    sortList.splice(sortList.indexOf(pasteNode._key), 1);
    pasteNode.father = targetNodeKey;
    // 將當前id添加到目標節點children中
    targetNode.sortList.push(pasteNode._key);
    return nodeMap;
  } else if (pasteType === 'copy') {
    const suffix = guid(8, 16);
    const newNode = copyNode(pasteNode, suffix);
    // 將newNode的id添加到目標節點children中
    targetNode.sortList.push(newNode._key);
    return nodeMap;
  } else {
    return null;
  }

  function copyNode(node: Node, suffix: string) {
    let newNode = JSON.parse(JSON.stringify(node));
    newNode._key = `${newNode._key}-${suffix}`;
    const sortList = newNode.sortList;
    for (let index = 0; index < sortList.length; index++) {
      const childKey = sortList[index];
      if (nodeMap[childKey]) {
        let node = copyNode(nodeMap[childKey], suffix);
        newNode.sortList[index] = node._key;
      }
    }
    nodeMap[newNode._key] = newNode;
    return newNode;
  }
}

function dragSort(
  map: NodeMap,
  dragId: string,
  dropId: string,
  placement: 'in' | 'up' | 'down'
) {
  let nodeMap = { ...map };
  let selectedNode = nodeMap[dragId];
  let targetNode = nodeMap[dropId];
  if (!selectedNode || !targetNode) {
    return null;
  }
  switch (placement) {
    case 'in':
      // 從選中節點的父節點的children中刪除當前id
      let selectedNodeFather = nodeMap[selectedNode.father];
      if (!selectedNodeFather) {
        break;
      }
      let sortList = selectedNodeFather.sortList;
      sortList.splice(sortList.indexOf(selectedNode._key), 1);
      selectedNode.father = dropId;
      // 將當前id添加到目標節點children中
      targetNode.sortList.push(selectedNode._key);
      break;
    case 'up':
    case 'down':
      addSibling(placement);
      break;
    default:
      break;
  }
  return nodeMap;

  function addSibling(type: 'up' | 'down') {
    if (!selectedNode || !targetNode) {
      return;
    }
    if (selectedNode.father === targetNode.father) {
      // 從選中節點的父節點的children中刪除當前id
      let father = nodeMap[targetNode.father];
      if (!father) {
        return;
      }
      let sortList = father.sortList;
      sortList.splice(sortList.indexOf(selectedNode._key), 1);
      // 將當前id添加到目標節點的父節點children中
      sortList.splice(
        type === 'down'
          ? sortList.indexOf(dropId) + 1
          : sortList.indexOf(dropId),
        0,
        dragId
      );
    } else {
      // 從選中節點的父節點的children中刪除當前id
      let selectedNodeFather = nodeMap[selectedNode.father];
      if (!selectedNodeFather) {
        return;
      }
      let sortList = selectedNodeFather.sortList;
      sortList.splice(sortList.indexOf(selectedNode._key), 1);
      selectedNode.father = targetNode.father;
      // 將當前id添加到目標節點的父節點children中
      let targetFather = nodeMap[targetNode.father];
      if (!targetFather) {
        return;
      }
      let children2 = targetFather.sortList;
      children2.splice(
        type === 'down'
          ? children2.indexOf(dropId) + 1
          : children2.indexOf(dropId),
        0,
        dragId
      );
    }
  }
}

export {
  findNodeById,
  textWidth,
  textWidthAll,
  getNodeWidth,
  getShortedStr,
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
  dragSort,
  changeSortList,
  pasteNode,
  getFullAngleNum,
  getHalfAnglePunctuationNum,
  getAlphabetNum,
  getNumberNum,
  guid,
};
