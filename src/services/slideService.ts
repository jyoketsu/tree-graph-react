import Attach from '../interfaces/Attach';
import Node from '../interfaces/Node';
import NodeMap from '../interfaces/NodeMap';
import SlideType from '../interfaces/SlideType';
import { GetNodeUrlFunc } from '../Slides';

export default function getSlideList(
  nodes: NodeMap,
  startId: string,
  getNodeUrlFunc: GetNodeUrlFunc
) {
  let slideList: SlideType[] = [];
  const node = nodes[startId];
  if (!node) {
    return slideList;
  }
  getSlide(node, getNodeUrlFunc);
  return slideList;

  function getSlide(node: Node, getNodeUrlFunc: GetNodeUrlFunc) {
    // 获取祖先
    const ancestor = getAncestor(node, nodes);
    // 图片附件
    let imageList: Attach[] = [];
    if (node.attach && node.attach.length) {
      for (let index = 0; index < node.attach.length; index++) {
        const attach = node.attach[index];
        if (attach.type.includes('image/')) {
          imageList.push(attach);
        }
      }
    }
    // 如果该节点为根节点或者有图片附件的非叶子节点，则单独有一张幻灯片
    if (node._key === startId || (imageList.length && node.sortList.length)) {
      slideList.push({
        title: node.name,
        paths: ancestor,
        imageList,
      });
    }

    const childrenIds = node.sortList;

    // 如果节点为文档，则获取文档地址，且单独有一张幻灯片
    if (node.type === 'doc' || node.type === 'file') {
      const url = getNodeUrlFunc(node);
      if (url) {
        slideList.push({
          title: node.name,
          paths: ancestor,
          url,
          icon: node.icon,
        });
      }
    } else {
      let subTitleList = [];
      for (let index = 0; index < childrenIds.length; index++) {
        const nodeKey = childrenIds[index];
        const node = nodes[nodeKey];
        if (node) {
          subTitleList.push({
            title: node.name,
            type: node.type,
            url: node.url,
          });
        }
      }
      if (subTitleList.length) {
        const slide = {
          title: node.name,
          paths: ancestor,
          subTitleList,
          type: node.type,
          url: node.url,
        };
        slideList.push(slide);
      }
    }

    for (let index = 0; index < childrenIds.length; index++) {
      const nodeKey = childrenIds[index];
      const node = nodes[nodeKey];
      if (node) {
        getSlide(node, getNodeUrlFunc);
      }
    }
  }
}

const getAncestor = (node: Node, nodeMap: NodeMap, includeSelf?: boolean) => {
  const getFather = (node: Node) => {
    const father = nodeMap[node.father];
    if (father) {
      ancestorList.unshift(father.name);
      getFather(father);
    }
  };

  let ancestorList: string[] = includeSelf ? [node.name] : [];
  getFather(node);
  return ancestorList;
};
