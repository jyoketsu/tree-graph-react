import React from 'react';
import { Catalog, CatalogProps } from '../src';
import { Meta, Story } from '@storybook/react';

const itemInfoMap = {
  '001': <div>2020-12-12</div>,
  '002': <div>2020-12-13</div>,
  '003': <div>2020-12-14</div>,
  '004': <div>2020-12-14</div>,
  '005': <div>2020-12-14</div>,
  '006': <div>2020-12-14</div>,
  '007': <div>2020-12-14</div>,
  '008': <div>2020-12-14</div>,
  '009': <div>2020-12-14</div>,
  '010': <div>2020-12-14</div>,
  '011': <div>2020-12-14</div>,
  '012': <div>2020-12-14</div>,
  '013': <div>2020-12-14</div>,
  '014': <div>2020-12-14</div>,
  '015': <div>2020-12-14</div>,
};
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
    updateTime: 1607843051983,
    hour: 0.1,
    limitDay: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
  },
  '002': {
    _key: '002',
    name: '計劃進度',
    father: '001',
    sortList: ['006', '007'],
    contract: false,
    checked: true,
    disabled: true,
    hour: 0.1,
    limitDay: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
    icon: 'https://cdn-icare.qingtime.cn/docFolder.svg',
    updateTime: 1607843051983,
  },
  '003': {
    _key: '003',
    name: '項目狀態',
    father: '001',
    sortList: ['010', '011'],

    checked: false,
    updateTime: 1607843051983,
    hour: 0.1,
    limitDay: 1610726400000,
    icon: 'https://cdn-icare.qingtime.cn/favFolder.svg',
  },
  '004': {
    _key: '004',
    name: '項目會議',
    father: '001',
    sortList: [],
    updateTime: 1607843051983,
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
    updateTime: 1607843051983,
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
    updateTime: 1607843051983,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '007': {
    _key: '007',
    name: '階段二',
    father: '002',
    sortList: [],

    checked: false,
    updateTime: 1607843051983,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '008': {
    _key: '008',
    name: '備份json文件',
    father: '006',
    sortList: [],

    checked: false,
    updateTime: 1607843051983,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '009': {
    _key: '009',
    name: '還原數據',
    father: '006',
    sortList: ['015'],

    checked: false,
    updateTime: 1607843051983,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '010': {
    _key: '010',
    name: '4月計劃',
    father: '003',
    sortList: [],

    checked: true,
    updateTime: 1607843051983,
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
    updateTime: 1607843051983,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '012': {
    _key: '012',
    name: '原型、界面設計',
    father: '011',
    sortList: [],

    checked: true,
    updateTime: 1607843051983,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '013': {
    _key: '013',
    name: '開發',
    father: '011',
    sortList: [],

    checked: true,
    updateTime: 1607843051983,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '014': {
    _key: '014',
    name: '測試',
    father: '011',
    sortList: [],

    checked: true,
    updateTime: 1607843051983,
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
    updateTime: 1607843051983,
  },
};

const meta: Meta = {
  title: 'Catalog',
  component: Catalog,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<CatalogProps> = args => {
  return (
    <div>
      <Catalog {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  nodes: nodes,
  startId: '001',
  // info: <div>电子书信息</div>,
  itemInfoMap: itemInfoMap,
  handleClickNode: (node: any) => console.log('---handleClickNode---', node),
};
