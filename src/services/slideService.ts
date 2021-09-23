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
