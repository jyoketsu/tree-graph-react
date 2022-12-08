import React, { useRef } from 'react';
import { MenuTree, MenuProps } from '../src';
import { Meta, Story } from '@storybook/react';
import CNode from '../src/interfaces/CNode';

const nodes = {
  '001': {
    _key: '001',
    name: '項目管理',
    father: '',
    sortList: ['002', '003', '004', '005'],
    contract: false,
    disabled: true,
    avatarUri: 'https://psnine.com/Upload/game/11387.png',
    // icon: 'https://cdn-icare.qingtime.cn/rooter.svg',
    icon: '😀',
    checked: true,
    hour: 0.1,
    limitDay: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
  },
  '002': {
    _key: '002',
    name: '链接地址是http://jyoketsu.com和http://psnine.com/psnid/jyoketsu3还有playstation.com',
    father: '001',
    sortList: ['006', '007'],
    contract: false,
    checked: true,
    disabled: true,
    hour: 0.1,
    limitDay: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
    icon: 'https://cdn-icare.qingtime.cn/docFolder.svg',
    type: 'link',
  },
  '003': {
    _key: '003',
    name: '項目狀態',
    father: '001',
    sortList: ['010', '011'],
    childNum: 100,
    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
    icon: 'https://cdn-icare.qingtime.cn/favFolder.svg',
  },
  '004': {
    _key: '004',
    name: '項目會議',
    father: '001',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '005': {
    _key: '005',
    name: '驗收',
    father: '001',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '006': {
    _key: '006',
    name: '階段壹',
    father: '002',
    contract: false,
    sortList: ['008', '009'],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '007': {
    _key: '007',
    name: '階段二',
    father: '002',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '008': {
    _key: '008',
    name: '備份json文件',
    father: '006',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '009': {
    _key: '009',
    name: '還原數據',
    father: '006',
    sortList: ['015'],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '010': {
    _key: '010',
    name: '4月計劃',
    father: '003',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '011': {
    _key: '011',
    name: '5月計劃',
    father: '003',
    sortList: ['012', '013', '014'],
    contract: false,

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '012': {
    _key: '012',
    name: '原型、界面設計',
    father: '011',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '013': {
    _key: '013',
    name: '開發',
    father: '011',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '014': {
    _key: '014',
    name: '測試',
    father: '011',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '015': {
    _key: '015',
    name: '還原數據-還原數據-還原數據-還原數據-還原數據-還原數據-還原數據',
    father: '009',
    sortList: [],
    checked: true,
    hour: 0.1,
    limitDay: 1610726400000,
  },
};

const meta: Meta = {
  title: 'Tree(Menu)',
  component: MenuTree,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<MenuProps> = (args) => {
  const treeRef = useRef(null);
  return (
    <div style={{ width: '350px' }}>
      {/* <button onClick={() => treeRef.current.rename()}>重命名</button> */}
      <MenuTree ref={treeRef} {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  nodes: nodes,
  startId: '001',
  showMoreButton: true,
  collapseMode: true,
  handleClickMoreButton: (node: any) =>
    console.log('---handleClickMoreButton---', node),
  handleClickIcon: (node: any) => console.log('---handleClickIcon---', node),
  storageData: ['name', 'icon'],
  defaultSelectedId: '001',
  // hideRoot: true,
  paddingLeft: 14,
  // tools: (nodeKey: string) => (
  //   <div
  //     onClick={(e) => {
  //       e.stopPropagation();
  //       alert(nodeKey);
  //     }}
  //   >
  //     {nodeKey}
  //   </div>
  // ),
  // startAdornment: (node: CNode) => <div>{node.name}</div>,
  // customActionButtons: () => <div>action</div>,
};
