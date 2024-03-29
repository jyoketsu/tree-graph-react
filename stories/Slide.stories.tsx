import React from 'react';
import { Slides, SlideProps } from '../src';
import { Meta, Story } from '@storybook/react';
import CNode from '../src/interfaces/CNode';

const nodes = {
  '001': {
    _key: '001',
    name: '项目管理',
    father: '',
    sortList: ['002', '003', '004', '005'],
    contract: false,
    icon:
      'https://static-resource.np.community.playstation.net/avatar/SCEI/I0078.png',
    checked: true,
    hour: 0.1,
    showCheckbox: true,
    showStatus: true,
    limitDay: new Date(new Date()).getTime(),
    // disabled: true,
    attach: [
      {
        url: 'https://z3.ax1x.com/2021/09/26/4yruQg.jpg',
        type: 'image/jpeg',
        name: '4By5a6',
      },
      {
        url: 'https://z3.ax1x.com/2021/09/26/4yrKyQ.jpg',
        type: 'image/jpeg',
        name: '4BygxJ',
      },
      {
        url: 'https://z3.ax1x.com/2021/09/26/4yreW8.jpg',
        type: 'image/jpeg',
        name: '4Byfq1',
      },
    ],
  },
  '002': {
    _key: '002',
    name: '计划进度',
    father: '001',
    sortList: ['006', '007'],
    contract: false,
    showCheckbox: true,
    showStatus: true,
    checked: true,
    hour: 0.1,
    limitDay: 1610812800111,
    hasCollect: true,
    isPack: true,
    // disabled: true,
    avatarUri: 'https://psnine.com/Upload/game/10992.png',
    icon: 'https://cdn-icare.qingtime.cn/docFolder.svg',
    dotIcon: 'https://cdn-icare.qingtime.cn/shareOut1.svg?v=1604893936765',
    attach: [
      {
        url: 'https://z3.ax1x.com/2021/09/26/4yrMLj.jpg',
        type: 'image/jpeg',
        name: '4By5a6',
      },
      {
        url: 'https://z3.ax1x.com/2021/09/26/4yrles.jpg',
        type: 'image/jpeg',
        name: '4BygxJ',
      },
      {
        url: 'https://z3.ax1x.com/2021/09/26/4yrnSS.jpg',
        type: 'image/jpeg',
        name: '4Byfq1',
      },
      {
        url: 'https://z3.ax1x.com/2021/09/26/4yrKyQ.jpg',
        type: 'image/jpeg',
        name: '4By5a6',
      },
    ],
  },
  '003': {
    _key: '003',
    name: '项目状态',
    father: '001',
    sortList: ['010', '011'],
    showCheckbox: true,
    showStatus: true,
    checked: false,
    color: '#fff',
    backgroundColor: '#90B44B',
    hour: 0.1,
    limitDay: 1616515200000,
    icon: 'https://cdn-icare.qingtime.cn/favFolder.svg',
    avatarUri: 'https://psnine.com/Upload/game/11333.png',
  },
  '004': {
    _key: '004',
    name: '项目会议',
    father: '001',
    sortList: [],
    showStatus: true,
    checked: false,
    limitDay: null,
    hour: null,
    attach: [
      {
        url: 'https://z3.ax1x.com/2021/09/26/4yrnSS.jpg',
        type: 'image/jpeg',
        name: '4Byfq1',
      },
    ],
  },
  '005': {
    _key: '005',
    name: '验收',
    father: '001',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '006': {
    _key: '006',
    name: '阶段壹',
    father: '002',
    contract: false,
    sortList: ['008', '009', '016'],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '007': {
    _key: '007',
    name: '阶段二',
    father: '002',
    sortList: [],
    color: '#8D742A',
    checked: false,
    type: 'doc',
    icon: 'https://mindcute.com/icon/logo.svg',
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '008': {
    _key: '008',
    name: 'psnine.com',
    father: '006',
    sortList: [],
    type: 'link',
    icon: 'https://mindcute.com/icon/logo.svg',
    url: 'https://psnine.com/',
  },
  '009': {
    _key: '009',
    name: '还原数据',
    father: '006',
    sortList: ['015'],

    checked: false,

    hour: 11,
    limitDay: 1610726400000,
  },
  '010': {
    _key: '010',
    name: '4月计划',
    father: '003',
    sortList: [],

    checked: false,
    showCheckbox: true,
    showStatus: true,
    hour: 0.1,
    limitDay: 1610640000333,
  },
  '011': {
    _key: '011',
    name: '5月计划',
    father: '003',
    sortList: ['012', '013', '014'],
    contract: false,
    checked: true,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '012': {
    _key: '012',
    name: '原型、界面设计',
    father: '011',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '013': {
    _key: '013',
    name: '开发',
    father: '011',
    sortList: [],
    color: '#fff',
    backgroundColor: '#66BAB7',
    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '014': {
    _key: '014',
    name: '#md请输入正文',
    father: '011',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '015': {
    _key: '015',
    name:
      '还原数据还原数据还原数据还原数据还原数据还原数据还原数据还原数据还原数据',
    father: '009',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '016': {
    _key: '016',
    name: 'JOJO的奇妙冒险 石之海 片头曲',
    father: '006',
    sortList: [],
    type: 'link',
    linkType: 'bilibili',
    url:
      'https://player.bilibili.com/player.html?aid=464470996&bvid=BV16L411M7ck&cid=450926275&page=1&high_quality=1',
  },
};

const meta: Meta = {
  title: 'Slide',
  component: Slides,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<SlideProps> = args => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <Slides {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  nodes: nodes,
  startId: '001',
  getNodeUrl: (node: CNode) => {
    return node.url;
  },
};
