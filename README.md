# Tree graph for React / React 树状思维导图组件

```
████████╗██████╗ ███████╗███████╗     ██████╗ ██████╗  █████╗ ██████╗ ██╗  ██╗
╚══██╔══╝██╔══██╗██╔════╝██╔════╝    ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██║  ██║
   ██║   ██████╔╝█████╗  █████╗█████╗██║  ███╗██████╔╝███████║██████╔╝███████║
   ██║   ██╔══██╗██╔══╝  ██╔══╝╚════╝██║   ██║██╔══██╗██╔══██║██╔═══╝ ██╔══██║
   ██║   ██║  ██║███████╗███████╗    ╚██████╔╝██║  ██║██║  ██║██║     ██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝

```

## [live demo](https://jyoketsu.github.io/tree-graph-react/)

## Installation

```bash
yarn add tree-graph-react
```

or

```
npm i tree-graph-react
```

---

## Screenshot

### Tree(MutiCol)

[![fVyxH0.png](https://z3.ax1x.com/2021/08/05/fVyxH0.png)](https://imgtu.com/i/fVyxH0)

### Tree(MutiCol Dark)

[![fV6SEV.png](https://z3.ax1x.com/2021/08/05/fV6SEV.png)](https://imgtu.com/i/fV6SEV)

### Tree(SingleCol)

[![fV6pNT.png](https://z3.ax1x.com/2021/08/05/fV6pNT.png)](https://imgtu.com/i/fV6pNT)

### Mind(MutiCol))

[![fV694U.png](https://z3.ax1x.com/2021/08/05/fV694U.png)](https://imgtu.com/i/fV694U)

### Mind(SingleCol))

[![fV6PCF.png](https://z3.ax1x.com/2021/08/05/fV6PCF.png)](https://imgtu.com/i/fV6PCF)

### Menu

[![fV6cV0.png](https://z3.ax1x.com/2021/08/05/fV6cV0.png)](https://imgtu.com/i/fV6cV0)

### Mini Menu

[![fV6ybq.png](https://z3.ax1x.com/2021/08/05/fV6ybq.png)](https://imgtu.com/i/fV6ybq)

### Catalog

[![fV6gaV.png](https://z3.ax1x.com/2021/08/05/fV6gaV.png)](https://imgtu.com/i/fV6gaV)

### Slides

[![5iN4X9.png](https://z3.ax1x.com/2021/10/09/5iN4X9.png)](https://imgtu.com/i/5iN4X9)

### TreeEditor（Outline text editor）

[![I87KLd.png](https://z3.ax1x.com/2021/11/08/I87KLd.png)](https://imgtu.com/i/I87KLd)

## Use case

[![fVgoAx.png](https://z3.ax1x.com/2021/08/05/fVgoAx.png)](https://imgtu.com/i/fVgoAx)
[![fVg5H1.png](https://z3.ax1x.com/2021/08/05/fVg5H1.png)](https://imgtu.com/i/fVg5H1)
[![IGS9VU.png](https://z3.ax1x.com/2021/11/08/IGS9VU.png)](https://imgtu.com/i/IGS9VU)

## Usage

```jsx
import { Tree, MenuTree, MiniMenu, Catalog, Mind } from 'tree-graph-react';
import 'tree-graph-react/dist/tree-graph-react.cjs.development.css';

const nodes = {
  '001': {
    _key: '001',
    name: '项目管理',
    father: '',
    sortList: ['002', '003', '004', '005'],
    contract: false,

    avatarUri: 'https://psnine.com/Upload/game/11387.png',
    icon: 'https://cdn-icare.qingtime.cn/rooter.svg',
    checked: true,
    hour: 0.1,
    limitDay: 1610726400000,
  },
  '002': {
    _key: '002',
    name: '计划进度',
    father: '001',
    sortList: ['006', '007'],
    contract: false,
    checked: true,
    hour: 0.1,
    limitDay: 1610726400000,
    icon: 'https://cdn-icare.qingtime.cn/docFolder.svg',
  },
  '003': {
    _key: '003',
    name: '项目状态',
    father: '001',
    sortList: ['010', '011'],
    checked: false,
    hour: 0.1,
    limitDay: 1610726400000,
    icon: 'https://cdn-icare.qingtime.cn/favFolder.svg',
  },
  '004': {
    _key: '004',
    name: '项目会议',
    father: '001',
    sortList: [],
    checked: false,
    hour: 0.1,
    limitDay: 1610726400000,
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
    sortList: ['008', '009'],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '007': {
    _key: '007',
    name: '阶段二',
    father: '002',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '008': {
    _key: '008',
    name: '备份json文件',
    father: '006',
    sortList: [],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '009': {
    _key: '009',
    name: '还原数据',
    father: '006',
    sortList: ['015'],

    checked: false,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '010': {
    _key: '010',
    name: '4月计划',
    father: '003',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
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

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '014': {
    _key: '014',
    name: '测试',
    father: '011',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
  '015': {
    _key: '015',
    name: '还原数据-还原数据',
    father: '009',
    sortList: [],

    checked: true,

    hour: 0.1,
    limitDay: 1610726400000,
  },
};

const MyComp = () => <Tree nodes={nodes} startId="001" />;
```

## operate

| 操作                | 按键             |
| ------------------- | ---------------- |
| 编辑节点名          | DoubleClick      |
| 新增子节点          | Tab              |
| 新增兄弟节点        | Enter            |
| 删除节点            | Delete           |
| 向上移动节点        | shift + ↑        |
| 向下移动节点        | shift + ↓        |
| 複制节点            | Command/Ctrl + C |
| 剪切节点            | Command/Ctrl + X |
| 粘贴节点            | Command/Ctrl + V |
| 保存树（file 模式） | Command/Ctrl + S |

<br/>

## Functions

| 方法名        | 说明                        |
| ------------- | --------------------------- |
| addNext       | 添加节点                    |
| addChild      | 添加子节点                  |
| deleteNode    | 删除节点                    |
| rename        | 重命名                      |
| getSelectedId | 获取选中节点的 id           |
| renameById    | 根据 id 修改名字（id,text） |

<br/>

## Props

| 属性                     | 说明                                                 | 类型     | 是否必须 | 默认值  |
| ------------------------ | ---------------------------------------------------- | -------- | -------- | ------- |
| nodes                    | 节点                                                 | Object   | 是       | -       |
| uncontrolled             | 是否为非受控组件                                     | Boolean  | 否       | true    |
| startId                  | 根节点 id                                            | String   | 是       | -       |
| defaultSelectedId        | 选中的节点 id                                        | String   | 是       | -       |
| ref                      | 通过 ref 调用组件内部方法                            | -        | 否       | -       |
| singleColumn             | 是否是单列视图                                       | Boolean  | 否       | false   |
| itemHeight               | 节点元素高度                                         | Number   | 否       | 50      |
| blockHeight              | 节点块高度                                           | Number   | 否       | 30      |
| fontSize                 | 节点字体大小                                         | Number   | 否       | 14      |
| fontWeight               | 节点字体粗细                                         | Number   | 否       | -       |
| indent                   | 缩进                                                 | Number   | 否       | 25      |
| columnSpacing            | 列间距                                               | Number   | 否       | 55      |
| avatarWidth              | 头像宽度                                             | Number   | 否       | 22      |
| pathWidth                | 线条宽度                                             | Number   | 否       | 1       |
| avatarRadius             | 头像宽度                                             | Number   | 否       | 11      |
| backgroundColor          | 背景色                                               | Number   | 否       | unset   |
| color                    | 字体颜色                                             | Number   | 否       | #595959 |
| hoverBorderColor         | 移上节点边框颜色                                     | Number   | 否       | #bed2fc |
| selectedBorderColor      | 选中节点边框颜色                                     | Number   | 否       | #35a6f8 |
| selectedBackgroundColor  | 选中节点背景色                                       | Number   | 否       | #e8e8e8 |
| lineRadius               | 线条圆角半径                                         | Number   | 否       | 4       |
| checkBoxWidth            | 勾选框宽度                                           | Number   | 否       | 18      |
| disableShortcut          | 是否禁用快捷键                                       | Number   | 否       | -       |
| disabled                 | 是否只读                                             | Number   | 否       | -       |
| showPreviewButton        | 是否显示节点预览按钮                                 | boolean  | 否       | -       |
| showAddButton            | 是否显示节点新增节点按钮                             | boolean  | 否       | -       |
| showMoreButton           | 是否显示节点更多按钮                                 | boolean  | 否       | -       |
| moreButtonWidth          | 节点操作按钮宽度                                     | boolean  | 否       | -       |
| showIcon                 | 是否显示图标                                         | boolean  | 否       | true    |
| showAvatar               | 是否显示头像                                         | Boolean  |
| avatarUri                | 头像地址                                             | String   |
| handleClickNode          | 点击节点事件,参数：node                              | Function | 否       | -       |
| handleDbClickNode        | 双击节点事件,参数：node                              | Function | 否       | -       |
| handleClickExpand        | 点击收起/展开事件,参数：node                         | Function | 否       | -       |
| handleCheck              | 点击勾选框事件,参数：node                            | Function | 否       | -       |
| handleClickAvatar        | 点击头像事件,参数：node                              | Function | 否       | -       |
| handleClickStatus        | 点击状态事件,参数：node                              | Function | 否       | -       |
| handleChangeNodeText     | 更改节点名事件,参数：nodeId, text                    | Function | 否       | -       |
| handleAddNext            | 向后添加兄弟节点事件,参数：selectedNode              | Function | 否       | -       |
| handleAddChild           | 添加子节点事件,参数：selectedNode                    | Function | 否       | -       |
| handleDeleteNode         | 删除节点事件,参数：selectedId,selectedNodes          | Function | 否       | -       |
| handleClickPreviewButton | 点击更多按钮,参数：clickNode                         | Function | 否       | -       |
| handleClickAddButton     | 点击更多按钮,参数：clickNode                         | Function | 否       | -       |
| handleClickMoreButton    | 点击更多按钮,参数：clickNode                         | Function | 否       | -       |
| handleClickDot           | 点击圆点                                             | Function | 否       | -       |
| handleShiftUpDown        | 向上/向下移动节点，参数 id, sortList, type           | Function | 否       | -       |
| handleSave               | 保存树                                               | Function | 否       | -       |
| handleDrag               | 拖拽节点,参数：dragInfo                              | Function | 否       | -       |
| handlePaste              | 複制节点：参数：pasteNodeKey,pasteType,targetNodeKey | Function | 否       | -       |
| hideHour                 | 隐藏任务小时数                                       | boolean  | 否       | -       |
| dragEndFromOutside       | 从外部拖入树节点,参数：node                          | Function | 否       | -       |
| handleMouseEnterAvatar   | 鼠标移入头像 ,参数：node                             | Function | 否       | -       |
| handleMouseLeaveAvatar   | 鼠标移出头像,参数：node                              | Function | 否       | -       |
| handleChange             | 树数据变更                                           | Function | 否｜-｜  |
| showDeleteConform        | 显示删除提示（非受控模式）                           | Function | 否｜-｜  |
| handleMutiSelect         | 框选节点，参数：selectedNodes                        | Function | 否｜-｜  |

```javascript
interface DragInfo {
  dragNodeId: string;
  dropNodeId: string;
  placement: 'up' | 'down' | 'in';
}
```

## Menu Props

| 属性         | 说明                                             | 类型    | 是否必须 | 默认值 |
| ------------ | ------------------------------------------------ | ------- | -------- | ------ |
| collapseMode | 是否是折叠模式（每次仅打开一级，其他的自动折叠） | boolean | 否       | false  |

## MiniMenu Props

| 属性                    | 说明                         | 类型     | 是否必须 | 默认值  |
| ----------------------- | ---------------------------- | -------- | -------- | ------- |
| nodes                   | 节点                         | Object   | 是       | -       |
| startId                 | 根节点 id                    | String   | 是       | -       |
| width                   | 菜单宽度                     | string   | 否       | 48      |
| backgroundColor         | 菜单背景色                   | string   | 否       | #333333 |
| selectedBackgroundColor | 选中的菜单背景色             | string   | 否       | #00CDD3 |
| color                   | 选中的菜单背景色             | string   | 否       | #CDD0D2 |
| itemHeight              | 节点元素高度                 | Number   | 否       | 48      |
| fontSize                | 节点字体大小                 | Number   | 否       | 14      |
| columnSpacing           | 列间距                       | Number   | 否       | 1       |
| borderRadius            | border-radius                | Number   | 否       | 0       |
| normalFirstLevel        | 首页是否正常宽度             | boolean  | 否       | false   |
| handleClickNode         | 点击节点事件,参数：node      | Function | 否       | -       |
| handleClickExpand       | 点击收起/展开事件,参数：node | Function | 否       | -       |
| handleMouseEnter        | 鼠标移入事件                 | Function | 否       | -       |
| handleMouseLeave        | 鼠标移开事件                 | Function | 否       | -       |

## Catalog Props

| 属性            | 说明                    | 类型                                           | 是否必须 | 默认值  |
| --------------- | ----------------------- | ---------------------------------------------- | -------- | ------- |
| nodes           | 节点                    | Object                                         | 是       | -       |
| startId         | 根节点 id               | String                                         | 是       | -       |
| backgroundColor | 菜单背景色              | string                                         | 否       | -       |
| color           | 字体颜色                | string                                         | 否       | #595959 |
| hoverColor      | 字体颜色（hover）       | string                                         | 否       | #8c8c8c |
| itemHeight      | 节点元素高度            | Number                                         | 否       | 48      |
| blockHeight     | 节点块高度              | Number                                         | 否       | 30      |
| fontSize        | 节点字体大小            | Number                                         | 否       | 14      |
| titleFontSize   | 标题节点字体大小        | Number                                         | 否       | 24      |
| handleClickNode | 点击节点事件,参数：node | Function                                       | 否       | -       |
| indent          | 缩进                    | Number                                         | 否       | 25      |
| info            | 目录描述信息            | ReactElement                                   | 否       | -       |
| itemInfoMap     | 目录项目描述信息        | `ItemInfoMap { [_key: string]: ReactElement;}` | 否       | -       |

## TreeEditor Props

| 属性                       | 说明                                                       | 类型     | 是否必须 | 默认值 |
| -------------------------- | ---------------------------------------------------------- | -------- | -------- | ------ |
| handlePasteFiles           | 粘贴附件                                                   | Function | 是       | -      |
| handleDeleteAttach         | 删除附件                                                   | Function | 是       | -      |
| handleAddNote              | 添加备注                                                   | Function | 否       | -      |
| handleChangeNote           | 更改备注                                                   | Function | 否       | -      |
| handleDeleteNote           | 删除备注                                                   | Function | 否       | -      |
| handleSwitchToBrotherChild | 空白结点按 Tab，将当前结点转换为哥哥结点的最后一个子结点。 | Function | 否       | -      |

## Node Props

| 属性            | 说明                        | 类型      |
| --------------- | --------------------------- | --------- |
| \_key           | 节点 id                     | String    |
| name            | 节点文本                    | String    |
| father          | 父节点 id                   | String    |
| sortList        | 子节点 id                   | Array     |
| contract        | 是否收起子节点              | Boolean   |
| checked         | 是否勾选                    | Boolean   |
| avatarUri       | 头像图片地址                | String    |
| icon            | 图标图片地址                | String    |
| dotIcon         | 圆点图标图片地址            | String    |
| color           | 节点字体颜色                | String    |
| backgroundColor | 节点背景色                  | String    |
| showCheckbox    | 是否显示勾选框              | Boolean   |
| showStatus      | 是否显示节点状态            | Boolean   |
| strikethrough   | 是否显示删除线｜ Boolean ｜ |
| hour            | 节点（任务）工时            | Number    |
| limitDay        | 节点（任务）剩余天数        | timestamp |
| disabled        | 是否禁用｜ Boolean ｜       |
