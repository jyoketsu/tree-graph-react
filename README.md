# Tree graph for React / React Tree Diagram Component

```
████████╗██████╗ ███████╗███████╗     ██████╗ ██████╗  █████╗ ██████╗ ██╗  ██╗
╚══██╔══╝██╔══██╗██╔════╝██╔════╝    ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██║  ██║
   ██║   ██████╔╝█████╗  █████╗█████╗██║  ███╗██████╔╝███████║██████╔╝███████║
   ██║   ██╔══██╗██╔══╝  ██╔══╝╚════╝██║   ██║██╔══██╗██╔══██║██╔═══╝ ██╔══██║
   ██║   ██║  ██║███████╗███████╗    ╚██████╔╝██║  ██║██║  ██║██║     ██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝

```

## Dev

```bash
yarn start
yarn storybook

## PS: Storybook must run under Node 16.
nvm install 16 --lts
nvm use 16
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

| Operation                | Shortcut         |
| ------------------------ | ---------------- |
| Edit Node Name           | DoubleClick      |
| Add Child Node           | Tab              |
| Add Sibling Node         | Enter            |
| Delete Node              | Delete           |
| Move Selected Node       | Arrow keys       |
| Move Node Up             | Shift + ↑        |
| Move Node Down           | Shift + ↓        |
| Copy Node                | Command/Ctrl + C |
| Cut Node                 | Command/Ctrl + X |
| Paste Node               | Command/Ctrl + V |
| Save Tree (file mode)    | Command/Ctrl + S |
| Add Note (TreeEditor)    | Shift + Enter    |
| Indent Left (TreeEditor) | Shift + Tab      |

<br/>

## Functions

| Method Name      | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| addNext          | Add a new node as a sibling to the currently selected node |
| addChild         | Add a new node as a child to the currently selected node   |
| deleteNode       | Delete the currently selected node                         |
| saveNodes        | Get the data of all nodes in the tree                      |
| rename           | Rename the currently selected node                         |
| getSelectedId    | Get the ID of the currently selected node                  |
| getSelectedIds   | Get the IDs of the currently selected nodes                |
| renameById       | Update the name of a node with a given ID                  |
| updateNodeById   | Update the data of a node with a given ID                  |
| updateNodesByIds | Update the data of nodes with given IDs                    |
| exportImage      | Export image (type: 'svg', 'png' , 'pdf')                  |

<br/>

## Props

| Property                 | Description                                                                                | Type     | Required | Default |
| ------------------------ | ------------------------------------------------------------------------------------------ | -------- | -------- | ------- |
| nodes                    | The nodes of the tree                                                                      | Object   | Yes      | -       |
| uncontrolled             | Whether it is an uncontrolled component                                                    | Boolean  | No       | true    |
| startId                  | The ID of the root node                                                                    | String   | Yes      | -       |
| defaultSelectedId        | The ID of the initially selected node                                                      | String   | Yes      | -       |
| ref                      | Reference to call internal methods of the component                                        | -        | No       | -       |
| singleColumn             | Whether to display the tree in a single column                                             | Boolean  | No       | false   |
| itemHeight               | Height of the node element                                                                 | Number   | No       | 50      |
| topBottomMargin          | Node Text Vertical Margins                                                                 | Number   | No       | 5       |
| lineHeight               | Node Text Line Height                                                                      | Number   | No       | 20      |
| fontSize                 | Font size of the nodes                                                                     | Number   | No       | 14      |
| fontWeight               | Font weight of the nodes                                                                   | Number   | No       | -       |
| indent                   | Indentation                                                                                | Number   | No       | 25      |
| columnSpacing            | Spacing between columns                                                                    | Number   | No       | 55      |
| avatarWidth              | Width of the avatar                                                                        | Number   | No       | 22      |
| pathWidth                | Width of the connecting lines                                                              | Number   | No       | 1       |
| pathColor                | Color of the connecting lines                                                              | Number   | No       | -       |
| nodeColor                | Color of the node                                                                          | Number   | No       | -       |
| paddingLeft              | Padding left                                                                               | Number   | No       | 50      |
| paddingTop               | Padding top                                                                                | Number   | No       | 50      |
| avatarRadius             | Avatar border radius                                                                       | Number   | No       | 11      |
| backgroundColor          | Background color                                                                           | Number   | No       | unset   |
| color                    | Font color                                                                                 | Number   | No       | #595959 |
| hoverBorderColor         | Border color when hovering over a node                                                     | Number   | No       | #bed2fc |
| selectedBorderColor      | Border color of the selected node                                                          | Number   | No       | #35a6f8 |
| selectedBackgroundColor  | Background color of the selected node                                                      | Number   | No       | #e8e8e8 |
| lineRadius               | Radius of the connecting lines                                                             | Number   | No       | 4       |
| checkBoxWidth            | Width of the checkbox                                                                      | Number   | No       | 18      |
| disableShortcut          | Whether to disable keyboard shortcuts                                                      | Number   | No       | -       |
| disabled                 | Whether the tree is read-only                                                              | Number   | No       | -       |
| showPreviewButton        | Whether to show the node preview button                                                    | boolean  | No       | -       |
| showAddButton            | Whether to show the "add node" button                                                      | boolean  | No       | -       |
| showMoreButton           | Whether to show the "more" button                                                          | boolean  | No       | -       |
| moreButtonWidth          | Width of the node's action buttons                                                         | boolean  | No       | -       |
| showIcon                 | Whether to show the icons                                                                  | boolean  | No       | true    |
| showAvatar               | Whether to show the avatars                                                                | Boolean  | -        |         |
| avatarUri                | Avatar URL                                                                                 | String   | -        |         |
| handleClickNode          | Click event for nodes (parameters: node)                                                   | Function | No       | -       |
| handleDbClickNode        | Double click event for nodes (parameters: node)                                            | Function | No       | -       |
| handleClickExpand        | Click event for expand/collapse (parameters: node)                                         | Function | No       | -       |
| handleCheck              | Click event for checkboxes (parameters: node)                                              | Function | No       | -       |
| handleClickAvatar        | Click event for avatars (parameters: node)                                                 | Function | No       | -       |
| handleClickStatus        | Click event for status (parameters: node)                                                  | Function | No       | -       |
| handleChangeNodeText     | Event for changing node name (parameters: nodeId, text)                                    | Function | No       | -       |
| handleAddNext            | Event for adding a sibling node (parameters: selectedNode)                                 | Function | No       | -       |
| handleAddChild           | Event for adding a child node (parameters: selectedNode)                                   | Function | No       | -       |
| handleDeleteNode         | Event for deleting nodes (parameters: selectedId, selectedNodes)                           | Function | No       | -       |
| handleClickPreviewButton | Click event for the preview button (parameters: clickNode)                                 | Function | No       | -       |
| handleClickAddButton     | Click event for the "add node" button (parameters: clickNode)                              | Function | No       | -       |
| handleClickMoreButton    | Click event for the "more" button (parameters: clickNode)                                  | Function | No       | -       |
| handleClickDot           | Click event for dots                                                                       | Function | No       | -       |
| handleShiftUpDown        | Move node up/down (parameters: id, sortList, type)                                         | Function | No       | -       |
| handleSave               | Save the tree                                                                              | Function | No       | -       |
| handleDrag               | Drag nodes (parameters: dragInfo)                                                          | Function | No       | -       |
| handlePaste              | Copy nodes (parameters: pasteNodeKey, pasteType, targetNodeKey)                            | Function | No       | -       |
| hideHour                 | Hide task hours                                                                            | boolean  | No       | -       |
| dragEndFromOutside       | Drag nodes from outside the tree (parameters: node)                                        | Function | No       | -       |
| handleMouseEnterAvatar   | Mouse enter event for avatars (parameters: node)                                           | Function | No       | -       |
| handleMouseLeaveAvatar   | Mouse leave event for avatars (parameters: node)                                           | Function | No       | -       |
| handleChange             | Tree data change event                                                                     | Function | No       | -       |
| showDeleteConform        | Show delete confirmation (uncontrolled mode)                                               | Function | No       | -       |
| handleMutiSelect         | Multi-select nodes (parameters: selectedNodes)                                             | Function | No       | -       |
| handleFileChange         | To handle file changes (parameters: nodeKey: string,nodeName:string, files: FileList)      | Function | No       | -       |
| handleQuickCommandOpen   | To handle the event after pressing the `quickCommandKey` (parameters: nodeEl: HTMLElement) | Function | No       | -       |
| handlePasteText          | To handle the event after pasting text. (parameters: text: string)                         | Function | No       | -       |
| handleContextMenu        | To handle the right-click event. (parameters: nodeKey: string, event: React.MouseEvent)    | Function | No       | -       |
| handleClickNodeImage     | To handle click node image event. (parameters: url: string)                                | Function | No       | -       |
| handleResizeNodeImage    | To handle the node image resize. (parameters: nodeKey: string, nodeWidth: number)          | Function | No       | -       |

```javascript
interface DragInfo {
  dragNodeId: string;
  dropNodeId: string;
  placement: 'up' | 'down' | 'in';
}
```

## Menu Props

| Property     | Description                                                                              | Type    | Required | Default |
| ------------ | ---------------------------------------------------------------------------------------- | ------- | -------- | ------- |
| collapseMode | Whether it is in collapse mode (open one level at a time, automatically collapse others) | boolean | No       | false   |

## MiniMenu Props

| Property                | Description                                   | Type     | Required | Default |
| ----------------------- | --------------------------------------------- | -------- | -------- | ------- |
| nodes                   | Nodes                                         | Object   | Yes      | -       |
| startId                 | Root node ID                                  | String   | Yes      | -       |
| width                   | Menu width                                    | string   | No       | 48      |
| backgroundColor         | Menu background color                         | string   | No       | #333333 |
| selectedBackgroundColor | Selected menu background color                | string   | No       | #00CDD3 |
| color                   | Selected menu text color                      | string   | No       | #CDD0D2 |
| itemHeight              | Node element height                           | Number   | No       | 48      |
| fontSize                | Node font size                                | Number   | No       | 14      |
| columnSpacing           | Column spacing                                | Number   | No       | 1       |
| borderRadius            | border-radius                                 | Number   | No       | 0       |
| normalFirstLevel        | Whether the first level is normal width       | boolean  | No       | false   |
| handleClickNode         | Click node event, parameters: node            | Function | No       | -       |
| handleClickExpand       | Click expand/collapse event, parameters: node | Function | No       | -       |
| handleMouseEnter        | Mouse enter event                             | Function | No       | -       |
| handleMouseLeave        | Mouse leave event                             | Function | No       | -       |

## Catalog Props

| Property        | Description                        | Type                                           | Required | Default |
| --------------- | ---------------------------------- | ---------------------------------------------- | -------- | ------- |
| nodes           | Nodes                              | Object                                         | Yes      | -       |
| startId         | Root node ID                       | String                                         | Yes      | -       |
| backgroundColor | Menu background color              | string                                         | No       | -       |
| color           | Font color                         | string                                         | No       | #595959 |
| hoverColor      | Font color on hover                | string                                         | No       | #8c8c8c |
| itemHeight      | Node element height                | Number                                         | No       | 48      |
| blockHeight     | Node block height                  | Number                                         | No       | 30      |
| fontSize        | Node font size                     | Number                                         | No       | 14      |
| titleFontSize   | Title node font size               | Number                                         | No       | 24      |
| handleClickNode | Click node event, parameters: node | Function                                       | No       | -       |
| indent          | Indentation                        | Number                                         | No       | 25      |
| info            | Directory description info         | ReactElement                                   | No       | -       |
| itemInfoMap     | Directory item description info    | `ItemInfoMap { [_key: string]: ReactElement;}` | No       | -       |

## TreeEditor Props

| Property                   | Description                                                                                 | Type     | Required | Default |
| -------------------------- | ------------------------------------------------------------------------------------------- | -------- | -------- | ------- |
| handlePasteFiles           | Paste attachments                                                                           | Function | Yes      | -       |
| handleDeleteAttach         | Delete attachment                                                                           | Function | Yes      | -       |
| handleAddNote              | Add note                                                                                    | Function | No       | -       |
| handleChangeNote           | Change note                                                                                 | Function | No       | -       |
| handleDeleteNote           | Delete note                                                                                 | Function | No       | -       |
| handleSwitchToBrotherChild | Press Tab on an empty node, convert the current node to the last child of its brother node. | Function | No       | -       |

## Node Props

| Property        | Description                     | Type      |
| --------------- | ------------------------------- | --------- |
| \_key           | Node ID                         | String    |
| name            | Node text                       | String    |
| father          | Parent node ID                  | String    |
| sortList        | Array of child node IDs         | Array     |
| contract        | Whether to collapse child nodes | Boolean   |
| checked         | Whether it is checked           | Boolean   |
| avatarUri       | Avatar image address            | String    |
| icon            | Icon image address              | String    |
| dotIcon         | Dot icon image address          | String    |
| color           | Node font color                 | String    |
| backgroundColor | Node background color           | String    |
| showCheckbox    | Whether to show the checkbox    | Boolean   |
| showStatus      | Whether to show node status     | Boolean   |
| strikethrough   | Whether to show strikethrough   | Boolean   |
| hour            | Node (task) hours               | Number    |
| limitDay        | Node (task) remaining days      | timestamp |
| disabled        | Whether it is disabled          | Boolean   |
