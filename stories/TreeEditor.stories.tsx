import React from 'react';
import { TreeEditor, TreeEditorProps } from '../src';
import { Meta, Story } from '@storybook/react';

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
    name:
      '链接地址是http://jyoketsu.com和http://psnine.com/psnid/jyoketsu3还有playstation.com',
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
  '009': {
    _key: '009',
    name: '還原數據',
    father: '006',
    sortList: ['015'],
    checked: false,
    hour: 0.1,
    limitDay: 1610726400000,
    note:
      '改编自十日草辅漫画原作的TV动画《国王排名》（王様ランキング）公布了第一弹PV，该作将于10月开播。动画由WIT STUDIO负责制作，八田洋介担任监督，MAYUKO负责音乐；参演声优有日向未南、村濑步、 梶裕贵、佐藤利奈等。片头曲为King Gnu的《BOY》。',
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
  handlePasteFiles: (nodeKey: string, files: FileList) => {
    console.log('---handlePasteFiles---', nodeKey, files);
  },
  handleChangeNote: (nodeKey: string, text: string) => {
    console.log('---handleChangeNote---', nodeKey, text);
  },
};
