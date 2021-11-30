import React from 'react';
import { TreeEditor, TreeEditorProps } from '../src';
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
    icon: 'https://cdn-icare.qingtime.cn/rooter.svg',

    checked: true,

    hour: 0.1,
    limitDay: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
  },
  '002': {
    _key: '002',
    name: '链接地址',
    father: '001',
    sortList: ['006', '007'],
    contract: false,
    checked: true,
    disabled: true,
    hour: 0.1,
    limitDay: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
    icon: 'https://cdn-icare.qingtime.cn/docFolder.svg',
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
    attach: [
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
    ],
  },
  '009': {
    _key: '009',
    name: '還原數據',
    father: '006',
    sortList: ['015'],
    checked: false,
    hour: 0.1,
    limitDay: 1610726400000,
    note:
      '这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注',
  },
  '010': {
    _key: '010',
    name: '文件类节点',
    father: '003',
    sortList: ['016', '017', '018', '019'],
    checked: true,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '011': {
    _key: '011',
    name: '链接类节点',
    father: '003',
    sortList: ['012', '013', '014'],
    contract: false,
    checked: true,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '012': {
    _key: '012',
    name: 'B站',
    type: 'link',
    url:
      'https://player.bilibili.com/player.html?aid=1149538&bvid=BV1Ex411T7Li&cid=1677748&page=1',
    linkType: 'bilibili',
    father: '011',
    sortList: [],
  },
  '013': {
    _key: '013',
    name: '网易云',
    type: 'link',
    url:
      'https://music.163.com/outchain/player?type=2&id=1472480890&auto=1&height=66',
    linkType: 'wangyiyun',
    father: '011',
    sortList: [],
  },
  '014': {
    _key: '014',
    name: '測試',
    father: '011',
    sortList: [],
    type: 'link',
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
  '016': {
    _key: '016',
    name: '图片无链接',
    type: 'file',
    father: '010',
    sortList: [],
  },
  '017': {
    _key: '017',
    name: '图片',
    type: 'file',
    fileType: 'image/*',
    url: 'https://z3.ax1x.com/2021/11/30/oleOVU.jpg',
    father: '010',
    sortList: [],
  },
  '018': {
    _key: '018',
    name: '音频',
    type: 'file',
    fileType: 'audio/*',
    url: 'https://cdn-icare.qingtime.cn/4F20E2E3.flac',
    father: '010',
    sortList: [],
  },
  '019': {
    _key: '019',
    name: '视频',
    type: 'file',
    fileType: 'video/*',
    url: 'https://cdn-icare.qingtime.cn/5B2C436C.mp4',
    father: '010',
    sortList: [],
  },
};

const meta: Meta = {
  title: 'TreeEditor',
  component: TreeEditor,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<TreeEditorProps> = args => {
  return <TreeEditor {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  nodes: nodes,
  startId: '001',
  // readonly: true,
  quickCommandKey: '/',
  quickCommands: ['fswd', 'fsht', 'fsnt', 'fsmd'],
  handlePasteFiles: (nodeKey: string, files: FileList) => {
    console.log('---handlePasteFiles---', nodeKey, files);
  },
  handleChangeNote: (nodeKey: string, text: string) => {
    console.log('---handleChangeNote---', nodeKey, text);
  },
  handleDeleteAttach: (nodeKey: string, index: number) => {
    console.log('---handleDeleteAttach---', nodeKey, index);
  },
  // handleClickNode: (node: CNode) => {
  //   console.log('---handleClickNode---', node);
  // },
  handleClickMoreButton: (node: CNode, targetEl: HTMLElement) => {
    console.log('---handleClickMoreButton---', node, targetEl);
  },
  handleClickAddButton: (node: CNode, targetEl: HTMLElement) => {
    console.log('---handleClickAddButton---', node, targetEl);
  },
  handleCommandChanged: (
    nodeKey: CNode,
    command: string,
    value: string,
    addMode: boolean
  ) => {
    console.log('---handleCommandChanged---', nodeKey, command, value, addMode);
  },
};
