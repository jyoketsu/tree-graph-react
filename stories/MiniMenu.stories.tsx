import React, { useRef } from 'react';
import { MiniMenu, MiniMenuProps } from '../src';
import { Meta, Story } from '@storybook/react';

const nodes = {
  '001': {
    _key: '001',
    name: '項目管理',
    father: '',
    sortList: ['002', '003', '004', '005'],
    contract: false,
    avatarUri: 'https://psnine.com/Upload/game/11387.png',
    icon: 'https://cdn-icare.qingtime.cn/rooter.svg',
    checked: true,
    hour: 0.1,
    limitDay: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
  },
  '002': {
    _key: '002',
    name: '計劃進度',
    father: '001',
    sortList: ['006', '007', '016', '017', '018', '019'],
    contract: false,
    checked: true,
    hour: 0.1,
    limitDay: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
    // icon: 'https://cdn-icare.qingtime.cn/docFolder.svg',
    icon: '😀',
  },
  '003': {
    _key: '003',
    name: '項目狀態',
    father: '001',
    sortList: ['010', '011'],
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
    icon: 'https://cdn-icare.qingtime.cn/编组 27.png0.1111110010000101001011000001011011011010110100111111607668436820?v=1607668438818',
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
    name: '階段壹-階段壹-階段壹-階段壹-階段壹',
    father: '002',
    contract: false,
    sortList: ['008', '009'],
    // icon: 'https://cdn-icare.qingtime.cn/rooter.svg',
    icon: '😍',
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
    name: '還原數據-還原數據',
    father: '009',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '016': {
    _key: '016',
    name: '階段二',
    father: '002',
    sortList: [],
    checked: false,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '017': {
    _key: '017',
    name: '階段二',
    father: '002',
    sortList: [],
    checked: false,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '018': {
    _key: '018',
    name: '階段二',
    father: '002',
    sortList: [],
    checked: false,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '019': {
    _key: '019',
    name: '階段二',
    father: '002',
    sortList: [],
    checked: false,
    hour: 0.1,
    limitDay: 1610726400000,
  },
};

const meta: Meta = {
  title: 'Mini Menu',
  component: MiniMenu,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<MiniMenuProps> = (args) => {
  const treeRef = useRef(null);
  return (
    <div>
      <MiniMenu {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  nodes: nodes,
  startId: '001',
  // dropdownNodeKeyList: ['001', '002', '003'],
  normalFirstLevel: false,
  handleClickNode: (node: any) => console.log('---handleClickNode---', node),
  handleClickExpand: (node: any) =>
    console.log('---handleClickExpand---', node),
  // handleMouseEnter: () => console.log('---handleMouseEnter---'),
  // handleMouseLeave: () => console.log('---handleMouseLeave---'),
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
};
