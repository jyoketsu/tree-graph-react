import React, { useRef } from 'react';
import { Tree, TreeProps } from '../src';
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
    childNum: 1000,
  },
  '002': {
    _key: '002',
    name: '链接地址是http://www.jyoketsu.com?key=123和psnine.com/gene还有playstation.com',
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
    // icon: 'https://cdn-icare.qingtime.cn/docFolder.svg',
    icon: '😀',
    dotIcon: 'https://cdn-icare.qingtime.cn/shareOut1.svg?v=1604893936765',
    childNum: 1000,
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
    childNum: 1,
  },
  '004': {
    _key: '004',
    name: '項目會議',
    father: '001',
    sortList: [],
    showStatus: true,
    checked: false,
    limitDay: null,
    hour: null,
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
    childNum: 22,
  },
  '007': {
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
    icon: '😀',
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
    limitDay: 1610640000333,
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
    childNum: 3,
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
  title: 'Tree',
  component: Tree,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<TreeProps> = (args) => {
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
      <button draggable>拖拽这个节点到树</button>
      {/* <button onClick={() => alert(treeRef.current.getSelectedId())}>
        获取选中节点
      </button> */}
      <Tree ref={treeRef} {...args} />
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
  showPreviewButton: true,
  showAddButton: true,
  showMoreButton: true,
  moreButtonWidth: 18,
  columnSpacing: 65,
  showAvatar: true,
  showCheckbox: true,
  showChildNum: true,
  showStatus: true,
  // disabled: true,
  // itemHeight: 60,
  // blockHeight: 40,
  // fontSize: 18,
  // pathWidth: 3,
  // pathColor: '#535953',
  // fontWeight: 800,
  quickCommandKey: '/',
  handleClickNode: (node: any) => console.log('---handleClickNode---', node),
  handleClickDot: (node: any) => console.log('---handleClickDot---', node),
  handleClickMoreButton: (node: any, element: any) =>
    console.log('---handleClickMoreButton---', node, element),
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
  handleClickStatus: (node: any, element: any) =>
    console.log('---handleClickStatus---', node, element),
  dragEndFromOutside: (node: any) =>
    console.log('---dragEndFromOutside---', node),
  handleMouseEnterAvatar: (node: any) =>
    console.log('---handleMouseEnterAvatar---', node),
  handleMouseLeaveAvatar: (node: any) =>
    console.log('---handleMouseLeaveAvatar---', node),
  handleChange: () => console.log('---handleChange---'),
  handleFileChange: (nodeKey: string, files: FileList) =>
    console.log('---handleFileChange---', nodeKey, files),
  handleQuickCommandOpen: (el: any) =>
    console.log('---handleQuickCommandOpen---', el),
  handlePasteText: (text: string) => console.log('---handlePasteText---', text),
};

export const MultiColDark = Template.bind({});
MultiColDark.args = {
  nodes: nodes,
  startId: '001',
  pathColor: '#FFF',
  backgroundColor: '#434343',
  // color: '#FFF',
  hoverBorderColor: '#FFE4E1',
  selectedBorderColor: '#FF0000',
  showPreviewButton: true,
  showAddButton: true,
  showMoreButton: true,
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
