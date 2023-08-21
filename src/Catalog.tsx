import React, { useState, useEffect, ReactElement } from 'react';
import NodeMap from './interfaces/NodeMap';
import CNode from './interfaces/CNode';
import CatalogItem from './components/catalog/CatalogItem';
import calculate from './services/treeService';
import { dot } from './services/util';

interface ItemInfoMap {
  [_key: string]: ReactElement;
}

export interface CatalogProps {
  // 节点
  nodes: NodeMap;
  // 根节点id
  startId: string;
  // 菜单背景色
  backgroundColor?: string;
  // 字体颜色
  color?: string;
  hoverColor?: string;
  // 节点元素高度
  itemHeight?: number;
  topBottomMargin?: number;
  lineHeight?: number;
  // 节点字体大小
  titleFontSize?: number;
  fontSize?: number;
  // 缩进
  indent?: number;
  // 头像宽度
  avatarWidth?: number;
  handleClickNode?: Function;
  info?: ReactElement;
  itemInfoMap?: ItemInfoMap;
  hideTitle?: boolean;
}
export const Catalog = ({
  nodes,
  startId,
  backgroundColor,
  color,
  hoverColor,
  itemHeight,
  topBottomMargin = 5,
  lineHeight = 20,
  titleFontSize,
  fontSize,
  indent,
  handleClickNode,
  info,
  itemInfoMap,
  hideTitle,
}: CatalogProps) => {
  const ITEM_HEIGHT = itemHeight || 32;
  const BLOCK_HEIGHT = topBottomMargin * 2 + lineHeight;
  const FONT_SIZE = fontSize || 14;
  const INDENT = indent || 18;
  const [nodeMap, setNodeMap] = useState(nodes);
  const [cnodes, setcnodes] = useState<CNode[]>([]);

  // 参数nodes发生改变，重设nodeMap
  useEffect(() => {
    setNodeMap(nodes);
  }, [nodes]);

  // nodeMap发生改变，根据nodeMap计算渲染所需数据
  useEffect(() => {
    console.log('根据nodeMap计算渲染所需数据');
    if (!nodeMap[startId]) {
      return;
    }
    const cal = calculate(
      nodeMap,
      startId,
      true,
      ITEM_HEIGHT,
      topBottomMargin,
      lineHeight,
      INDENT,
      FONT_SIZE,
      3000,
      false,
      false,
      11,
      1,
      1,
      0,
      0
    );

    if (cal) {
      cal.nodes.sort((a, b) => a.y - b.y);
      setcnodes(cal.nodes);
    }
  }, [nodeMap, startId]);

  // 单击节点
  function clickNode(node: CNode) {
    if (handleClickNode) {
      handleClickNode(node);
    }
  }

  // 展开/收起节点
  function handleExpand(node: CNode) {
    let nodes = dot(nodeMap, node._key);
    setNodeMap(nodes);
  }

  return (
    <div
      className="catalog-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: backgroundColor || 'unset',
      }}
    >
      {!hideTitle ? (
        <div
          style={{
            fontSize: `${titleFontSize || 24}px`,
            width: '100%',
            textAlign: 'center',
            margin: '25px 0',
          }}
        >
          {nodeMap[startId].name}
        </div>
      ) : null}
      {info ? <div style={{ width: '100%' }}>{info}</div> : null}
      {cnodes.map((node, index) =>
        node._key !== startId ? (
          <CatalogItem
            key={`${index}_${node._key}`}
            node={node}
            indent={INDENT}
            BLOCK_HEIGHT={BLOCK_HEIGHT}
            FONT_SIZE={FONT_SIZE}
            fontWeight={node.father === startId ? 'bolder' : undefined}
            color={color || '#595959'}
            hoverColor={hoverColor || '#8c8c8c'}
            handleClickNode={clickNode}
            handleClickExpand={() => handleExpand(node)}
            info={itemInfoMap ? itemInfoMap[node._key] : undefined}
          />
        ) : null
      )}
    </div>
  );
};
