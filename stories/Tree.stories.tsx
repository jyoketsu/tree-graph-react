import React, { useRef } from 'react';
import { Tree, TreeProps } from '../src';
import { Meta, Story } from '@storybook/react';
import { ClickOutside } from '@jyoketsu/click-outside-react';

const nodes = {
  '001': {
    _key: '001',
    name: '項目管理',
    father: '',
    sortList: ['002', '003', '004', '005'],
    contract: false,
    dotIcon: 'https://cdn-icare.qingtime.cn/shareOut1.svg?v=1604893936765',
    avatarUri: 'https://psnine.com/Upload/game/11387.png',
    icon: 'https://cdn-icare.qingtime.cn/rooter.svg',
    checked: true,
    hour: 0.1,
    limitDay: -23,
    disabled: true,
  },
  '002': {
    _key: '002',
    name: '計劃進度',
    father: '001',
    sortList: ['006', '007'],
    contract: false,
    showCheckbox: true,
    showStatus: true,
    checked: true,
    hour: 0.1,
    limitDay: -23,
    icon: 'https://cdn-icare.qingtime.cn/docFolder.svg',
  },
  '003': {
    _key: '003',
    name: '項目狀態',
    father: '001',
    sortList: ['010', '011'],
    showCheckbox: true,
    showStatus: true,
    checked: false,
    color: '#fff',
    backgroundColor: '#90B44B',
    hour: 0.1,
    limitDay: 222,
    icon: 'https://cdn-icare.qingtime.cn/favFolder.svg',
  },
  '004': {
    _key: '004',
    name: '項目會議',
    father: '001',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 2,
  },
  '005': {
    _key: '005',
    name: '驗收',
    father: '001',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 2,
  },
  '006': {
    _key: '006',
    name: '階段壹',
    father: '002',
    contract: false,
    sortList: ['008', '009'],

    checked: false,

    hour: 0.1,
    limitDay: 2,
  },
  '007': {
    _key: '007',
    name: '階段二',
    father: '002',
    sortList: [],
    color: '#8D742A',
    checked: false,

    hour: 0.1,
    limitDay: 2,
  },
  '008': {
    _key: '008',
    name: '備份json文件',
    father: '006',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 2,
  },
  '009': {
    _key: '009',
    name: '還原數據',
    father: '006',
    sortList: ['015'],

    checked: false,

    hour: 11,
    limitDay: 2,
  },
  '010': {
    _key: '010',
    name: '4月計劃',
    father: '003',
    sortList: [],

    checked: false,
    showCheckbox: true,
    showStatus: true,
    hour: 0.1,
    limitDay: -2,
  },
  '011': {
    _key: '011',
    name: '5月計劃',
    father: '003',
    sortList: ['012', '013', '014'],
    contract: false,
    strikethrough: true,
    checked: true,
    hour: 0.1,
    limitDay: 2,
  },
  '012': {
    _key: '012',
    name: '原型、界面設計',
    father: '011',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 2,
  },
  '013': {
    _key: '013',
    name: '開發',
    father: '011',
    sortList: [],
    color: '#fff',
    backgroundColor: '#66BAB7',
    checked: true,

    hour: 0.1,
    limitDay: 2,
  },
  '014': {
    _key: '014',
    name: '測試',
    father: '011',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 2,
  },
  '015': {
    _key: '015',
    name: '還原數據還原數據還原數據還原數據還原數據還原數據還原數據還原數據還原數據',
    father: '009',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 2,
  },
};

const nodes2 = {
  '001': {
    _key: '001',
    name: '項目管理',
    father: '',
    sortList: ['002', '003', '004', '005'],
    contract: false,

    avatarUri: 'https://psnine.com/Upload/game/11387.png',

    checked: true,

    hour: 0.1,
    limitDay: -23,
  },
  '002': {
    _key: '002',
    name: '計劃進度',
    father: '001',
    sortList: ['006', '007'],
    contract: false,

    checked: true,

    hour: 0.1,
    limitDay: -23,
  },
  '003': {
    _key: '003',
    name: '項目狀態',
    father: '001',
    sortList: ['010', '011'],

    checked: false,

    hour: 0.1,
    limitDay: 2,
  },
  '004': {
    _key: '004',
    name: '項目會議',
    father: '001',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 2,
  },
  '005': {
    _key: '005',
    name: '驗收',
    father: '001',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 2,
  },
  '006': {
    _key: '006',
    name: '階段壹',
    father: '002',
    contract: false,
    sortList: ['008', '009'],

    checked: false,

    hour: 0.1,
    limitDay: 2,
  },
  '007': {
    _key: '007',
    name: '階段二',
    father: '002',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 2,
  },
  '008': {
    _key: '008',
    name: '備份json文件',
    father: '006',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 2,
  },
  '009': {
    _key: '009',
    name: '還原數據',
    father: '006',
    sortList: ['015'],

    checked: false,

    hour: 0.1,
    limitDay: 2,
  },
  '010': {
    _key: '010',
    name: '4月計劃',
    father: '003',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 2,
  },
  '011': {
    _key: '011',
    name: '5月計劃',
    father: '003',
    sortList: ['012', '013', '014'],
    contract: false,

    checked: true,

    hour: 0.1,
    limitDay: 2,
  },
  '012': {
    _key: '012',
    name: '原型、界面設計',
    father: '011',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 2,
  },
  '013': {
    _key: '013',
    name: '開發',
    father: '011',
    sortList: [],
    checked: true,
    hour: 0.1,
    limitDay: 2,
  },
  '014': {
    _key: '014',
    name: '測試',
    father: '011',
    sortList: [],
    checked: true,
    hour: 0.1,
    limitDay: 2,
  },
  '015': {
    _key: '015',
    name: '還原數據-還原數據',
    father: '009',
    sortList: [],
    checked: true,
    hour: 0.1,
    limitDay: 2,
  },
};

const meta: Meta = {
  title: 'Tree',
  component: Tree,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<TreeProps> = args => {
  const treeRef = useRef(null);
  return (
    <div>
      <button
        onClick={() => alert(JSON.stringify(treeRef.current.saveNodes()))}
      >
        保存
      </button>
      <button onClick={() => treeRef.current.addNext()}>添加节点</button>
      <button onClick={() => treeRef.current.addChild()}>添加子节点</button>
      <button onClick={() => treeRef.current.deleteNode()}>删除节点</button>
      <Tree
        ref={treeRef}
        {...args}
        nodeOptions={
          <ClickOutside onClickOutside={() => treeRef.current.closeOptions()}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#FFF',
              }}
            >
              <button onClick={() => treeRef.current.rename()}>重命名</button>
              <button onClick={() => treeRef.current.addNext()}>
                添加节点
              </button>
              <button onClick={() => treeRef.current.addChild()}>
                添加子节点
              </button>
              <button onClick={() => treeRef.current.deleteNode()}>
                删除节点
              </button>
            </div>
          </ClickOutside>
        }
      />
    </div>
  );
};

export const MultiCol = Template.bind({});
MultiCol.args = {
  nodes: nodes,
  startId: '001',
  singleColumn: false,
  // uncontrolled: false,
  // selectedId: '004',
  defaultSelectedId: '003',
  showMoreButton: true,
  showAvatar: true,
  showCheckbox: true,
  showStatus: true,
  // disabled: true,
  handleClickDot: (node: any) => console.log('---handleClickDot---', node),
  handleClickMoreButton: (node: any) =>
    console.log('---handleClickMoreButton---', node),
  handleShiftUpDown: (id: string, sortList: string[], type: 'up' | 'down') =>
    console.log('---handleShiftUpDown---', id, sortList, type),
  handleDrag: (dragInfo: any) => console.log('---handleDrag----', dragInfo),
  handlePaste: (pasteNodeKey: string, pasteType: string, selectedId: string) =>
    console.log('---handlePaste---', pasteNodeKey, pasteType, selectedId),
  handleClickAvatar: (node: any) =>
    console.log('---handleClickAvatar---', node),
  handleClickStatus: (node: any) =>
    console.log('---handleClickStatus---', node),
};

export const SingleCol = Template.bind({});
SingleCol.args = {
  nodes: nodes,
  startId: '001',
  singleColumn: true,
};

export const TreeMenu = Template.bind({});
TreeMenu.args = {
  nodes: nodes2,
  startId: '001',
  singleColumn: true,
};
