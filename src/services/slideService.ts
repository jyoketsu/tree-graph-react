import Attach from '../interfaces/Attach';
import Node from '../interfaces/Node';
import NodeMap from '../interfaces/NodeMap';
import SlideType from '../interfaces/SlideType';

export default function getSlideList(nodes: NodeMap, startId: string) {
  let slideList: SlideType[] = [];
  const node = nodes[startId];
  if (!node) {
    return slideList;
  }
  getSlide(node);
  return slideList;

  function getSlide(node: Node) {
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
    // 如果该节点为根节点或者有图片附件，则单独有一张幻灯片
    if (node._key === startId || imageList.length) {
      slideList.push({ title: node.name, subTitleList: [], imageList });
    }

    const childrenIds = node.sortList;
    let subTitleList = [];
    for (let index = 0; index < childrenIds.length; index++) {
      const nodeKey = childrenIds[index];
      const node = nodes[nodeKey];
      if (node) {
        subTitleList.push(node.name);
      }
    }
    const slide = {
      title: node.name,
      subTitleList,
    };
    slideList.push(slide);

    for (let index = 0; index < childrenIds.length; index++) {
      const nodeKey = childrenIds[index];
      const node = nodes[nodeKey];
      if (node) {
        getSlide(node);
      }
    }
  }
}
