import React, { useRef } from 'react';
import { Mind, MindProps } from '../src';
import { Meta, Story } from '@storybook/react';

const nodes = {
  '001': {
    _key: '001',
    name: '項目管理',
    father: '',
    sortList: ['002', '003', '004', '005'],
    contract: false,
    icon: 'https://static-resource.np.community.playstation.net/avatar/SCEI/I0078.png',
    checked: true,
    hour: 0.1,
    showCheckbox: true,
    showStatus: true,
    limitDay: new Date(new Date()).getTime(),
    // disabled: true,
  },
  '002': {
    _key: '002',
    name: '链接地址是http://www.jyoketsu.com和psnine.com/gene还有playstation.com',
    father: '001',
    sortList: ['006', '007'],
    contract: false,
    showCheckbox: true,
    showStatus: true,
    checked: true,
    isPack: true,
    hour: 0.1,
    limitDay: 1610812800111,
    // disabled: true,
    avatarUri: 'https://psnine.com/Upload/game/10992.png',
    // icon: 'https://cdn-icare.qingtime.cn/docFolder.svg',
    icon: '😀',
    dotIcon: 'https://cdn-icare.qingtime.cn/shareOut1.svg?v=1604893936765',
    imageUrl: 'https://cdn-notes.qingtime.cn/856C1527.jpg',
    imageWidth: 200,
    imageHeight: 200,
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
    limitDay: 1616515200000,
    icon: 'https://cdn-icare.qingtime.cn/favFolder.svg',
    avatarUri: 'https://psnine.com/Upload/game/11333.png',
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
    imageUrl: 'https://psnine.com/Upload/game/11882.png',
    imageWidth: 100,
    imageHeight: 100,
    startAdornment: ({ x, y, nodeKey }) => (
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        width="18"
        height="18"
        x={x}
        y={y}
        onClick={() => alert(nodeKey)}
      >
        <path
          d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z"
          fill="#2196F3"
        ></path>
        <path
          d="M469.333333 469.333333h85.333334v234.666667h-85.333334z"
          fill="#FFFFFF"
        ></path>
        <path
          d="M512 352m-53.333333 0a53.333333 53.333333 0 1 0 106.666666 0 53.333333 53.333333 0 1 0-106.666666 0Z"
          fill="#FFFFFF"
        ></path>
      </svg>
    ),
    startAdornmentWidth: 18,
    startAdornmentHeight: 18,
    endAdornment: ({ x, y, nodeKey }) => (
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        width="18"
        height="18"
        x={x}
        y={y}
        onClick={() => alert(nodeKey)}
      >
        <rect x={0} y={0} width="1024" height="1024" fillOpacity={0} />
        <path
          d="M886.624 297.376l-191.968-191.968c-2.944-2.944-6.432-5.312-10.336-6.912C680.48 96.864 676.288 96 672 96L224 96C171.072 96 128 139.072 128 192l0 640c0 52.928 43.072 96 96 96l576 0c52.928 0 96-43.072 96-96L896 320C896 311.52 892.64 303.36 886.624 297.376zM704 205.248 818.752 320 704 320 704 205.248zM800 864 224 864c-17.632 0-32-14.336-32-32L192 192c0-17.632 14.368-32 32-32l416 0 0 192c0 17.664 14.304 32 32 32l160 0 0 448C832 849.664 817.664 864 800 864z"
          fill="#5D646F"
          p-id="7882"
        ></path>
        <path
          d="M288 352l192 0c17.664 0 32-14.336 32-32s-14.336-32-32-32L288 288c-17.664 0-32 14.336-32 32S270.336 352 288 352z"
          fill="#5D646F"
          p-id="7883"
        ></path>
        <path
          d="M608 480 288 480c-17.664 0-32 14.336-32 32s14.336 32 32 32l320 0c17.696 0 32-14.336 32-32S625.696 480 608 480z"
          fill="#5D646F"
          p-id="7884"
        ></path>
        <path
          d="M608 672 288 672c-17.664 0-32 14.304-32 32s14.336 32 32 32l320 0c17.696 0 32-14.304 32-32S625.696 672 608 672z"
          fill="#5D646F"
          p-id="7885"
        ></path>
      </svg>
    ),
    endAdornmentWidth: 18,
    endAdornmentHeight: 18,
  },
  '007': {
    hasCollect: true,
    _key: '007',
    name: '階段二',
    father: '002',
    sortList: [],
    color: '#8D742A',
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
    hour: 11,
    limitDay: 1610726400000,
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
    limitDay: 1610726400000,
    imageUrl: 'https://cdn-notes.qingtime.cn/2F858B64.jpg',
    imageWidth: 120,
    imageHeight: 120,
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
    limitDay: 1610726400000,
    bold: true,
    italic: true,
    textDecoration: 'underline',
    color: 'red',
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
    color: '#fff',
    backgroundColor: '#66BAB7',
    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '014': {
    _key: '014',
    name: '#md請輸入正文',
    father: '011',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '015': {
    _key: '015',
    name: '還原數據還原數據還原數據還原數據還原數據還原數據還原數據還原數據還原數據',
    father: '009',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
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
    limitDay: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
  },
  '002': {
    _key: '002',
    name: '計劃進度',
    father: '001',
    sortList: ['006', '007'],
    contract: false,

    checked: true,

    hour: 0.1,
    limitDay: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
  },
  '003': {
    _key: '003',
    name: '項目狀態',
    father: '001',
    sortList: ['010', '011'],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
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
    name: '還原數據-還原數據',
    father: '009',
    sortList: [],
    checked: true,
    hour: 0.1,
    limitDay: 1610726400000,
  },
};

const meta: Meta = {
  title: 'Mind',
  component: Mind,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<MindProps> = (args) => {
  const treeRef = useRef<any>(null);
  return (
    <div>
      <button
        onClick={() => alert(JSON.stringify(treeRef.current.saveNodes()))}
      >
        Save
      </button>
      <button onClick={() => treeRef.current.addNext()}>Add silbing</button>
      <button onClick={() => treeRef.current.addChild()}>Add child</button>
      <button onClick={() => treeRef.current.deleteNode()}>Delete</button>
      <button draggable>Drag this node to the tree</button>
      {/* <button onClick={() => alert(treeRef.current.getSelectedId())}>
        获取选中节点
      </button> */}
      <button onClick={() => treeRef.current.exportImage('svg')}>
        Export svg
      </button>
      <button onClick={() => treeRef.current.exportImage('png')}>
        Export png
      </button>
      <button onClick={() => treeRef.current.exportImage('pdf')}>
        Export pdf
      </button>
      <Mind ref={treeRef} {...args} />
    </div>
  );
};

export const MultiCol = Template.bind({});
MultiCol.args = {
  nodes: nodes,
  startId: '001',
  singleColumn: false,
  defaultSelectedId: '003',
  showPreviewButton: true,
  showAddButton: true,
  showMoreButton: true,
  moreButtonWidth: 18,
  columnSpacing: 65,
  showAvatar: true,
  showCheckbox: true,
  showStatus: true,
  showChildNum: true,
  // disabled: true,
  // nodeColor: 'red',
  // paddingLeft: 1000,
  // paddingTop: 1000,
  handleClickDot: (node: any) => console.log('---handleClickDot---', node),
  handleClickMoreButton: (node: any, clientX: number, clientY: number) =>
    console.log('---handleClickMoreButton---', node, clientX, clientY),
  handleClickPreviewButton: (node: any) =>
    console.log('---handleClickPreviewButton---', node),
  handleClickAddButton: (node: any, clientX: number, clientY: number) =>
    console.log('---handleClickAddButton---', node, clientX, clientY),
  handleShiftUpDown: (id: string, sortList: string[], type: 'up' | 'down') =>
    console.log('---handleShiftUpDown---', id, sortList, type),
  handleDrag: (dragInfo: any) => console.log('---handleDrag----', dragInfo),
  handlePaste: (pasteNodeKey: string, pasteType: string, selectedId: string) =>
    console.log('---handlePaste---', pasteNodeKey, pasteType, selectedId),
  handleClickAvatar: (node: any) =>
    console.log('---handleClickAvatar---', node),
  handleClickStatus: (node: any) =>
    console.log('---handleClickStatus---', node),
  dragEndFromOutside: (node: any) =>
    console.log('---dragEndFromOutside---', node),
  handleMouseEnterAvatar: (node: any) =>
    console.log('---handleMouseEnterAvatar---', node),
  handleMouseLeaveAvatar: (node: any) =>
    console.log('---handleMouseLeaveAvatar---', node),
  // handleFileChange: (nodeKey: string, files: FileList) =>
  //   console.log('---handleFileChange---', nodeKey, files),
  handlePasteText: (text: string) => console.log('---handlePasteText---', text),
};

export const MultiColDark = Template.bind({});
MultiColDark.args = {
  nodes: nodes,
  startId: '001',
  pathColor: '#FFF',
  backgroundColor: '#434343',
  hoverBorderColor: '#FFE4E1',
  selectedBorderColor: '#FF0000',
  showPreviewButton: true,
  showAddButton: true,
  showMoreButton: true,
  showChildNum: true,
};

export const SingleCol = Template.bind({});
SingleCol.args = {
  nodes: nodes,
  startId: '001',
  singleColumn: true,
  showChildNum: true,
  // paddingLeft: 1000,
  // paddingTop: 1000,
};
