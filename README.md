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

## Usage

```jsx
import { Tree, MenuTree, MiniMenu, Catalog, Mind } from 'tree-graph-react';

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
    limitDay: 1610726400000,
  },
  '002': {
    _key: '002',
    name: '計劃進度',
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

const MyComp = () => <Tree nodes={nodes} startId="001" />;
```

## operate

| 操作                | 按鍵             |
| ------------------- | ---------------- |
| 編輯節點名          | DoubleClick      |
| 新增子節點          | Tab              |
| 新增兄弟節點        | Enter            |
| 刪除節點            | Delete           |
| 向上移動節點        | shift + ↑        |
| 向下移動節點        | shift + ↓        |
| 複製節點            | Command/Ctrl + C |
| 剪切節點            | Command/Ctrl + X |
| 粘貼節點            | Command/Ctrl + V |
| 保存樹（file 模式） | Command/Ctrl + S |

<br/>

## Functions

| 方法名        | 說明                        |
| ------------- | --------------------------- |
| addNext       | 添加節點                    |
| addChild      | 添加子節點                  |
| deleteNode    | 刪除節點                    |
| rename        | 重命名                      |
| getSelectedId | 獲取選中節點的 id           |
| renameById    | 根據 id 修改名字（id,text） |

<br/>

## Tree Props

| 屬性                     | 說明                                                 | 類型     | 是否必須 | 默認值  |
| ------------------------ | ---------------------------------------------------- | -------- | -------- | ------- |
| nodes                    | 節點                                                 | Object   | 是       | -       |
| uncontrolled             | 是否為非受控組件                                     | Boolean  | 否       | true    |
| startId                  | 根節點 id                                            | String   | 是       | -       |
| defaultSelectedId        | 選中的節點 id                                        | String   | 是       | -       |
| ref                      | 通過 ref 調用組件內部方法                            | -        | 否       | -       |
| singleColumn             | 是否是單列視圖                                       | Boolean  | 否       | false   |
| itemHeight               | 節點元素高度                                         | Number   | 否       | 50      |
| blockHeight              | 節點塊高度                                           | Number   | 否       | 30      |
| fontSize                 | 節點字體大小                                         | Number   | 否       | 14      |
| fontWeight               | 節點字體粗細                                         | Number   | 否       | -       |
| indent                   | 縮進                                                 | Number   | 否       | 25      |
| columnSpacing            | 列間距                                               | Number   | 否       | 55      |
| avatarWidth              | 頭像寬度                                             | Number   | 否       | 22      |
| pathWidth                | 線條寬度                                             | Number   | 否       | 1       |
| backgroundColor          | 背景色                                               | Number   | 否       | unset   |
| color                    | 字體顏色                                             | Number   | 否       | #595959 |
| hoverBorderColor         | 移上節點邊框顏色                                     | Number   | 否       | #bed2fc |
| selectedBorderColor      | 選中節點邊框顏色                                     | Number   | 否       | #35a6f8 |
| selectedBackgroundColor  | 選中節點背景色                                       | Number   | 否       | #e8e8e8 |
| lineRadius               | 線條圓角半徑                                         | Number   | 否       | 4       |
| checkBoxWidth            | 勾選框寬度                                           | Number   | 否       | 18      |
| disableShortcut          | 是否禁用快捷鍵                                       | Number   | 否       | -       |
| disabled                 | 是否只讀                                             | Number   | 否       | -       |
| showPreviewButton        | 是否顯示節點預覽按鈕                                 | boolean  | 否       | -       |
| showAddButton            | 是否顯示節點新增節點按鈕                             | boolean  | 否       | -       |
| showMoreButton           | 是否顯示節點更多按鈕                                 | boolean  | 否       | -       |
| moreButtonWidth          | 節點操作按鈕寬度                                     | boolean  | 否       | -       |
| showIcon                 | 是否顯示圖標                                         | boolean  | 否       | true    |
| showAvatar               | 是否顯示頭像                                         | Boolean  |
| avatarUri                | 頭像地址                                             | String   |
| handleClickNode          | 點擊節點事件,参数：node                              | Function | 否       | -       |
| handleDbClickNode        | 雙擊節點事件,参数：node                              | Function | 否       | -       |
| handleClickExpand        | 點擊收起/展開事件,参数：node                         | Function | 否       | -       |
| handleCheck              | 點擊勾選框事件,参数：node                            | Function | 否       | -       |
| handleClickAvatar        | 點擊頭像事件,参数：node                              | Function | 否       | -       |
| handleClickStatus        | 點擊狀態事件,参数：node                              | Function | 否       | -       |
| handleChangeNodeText     | 更改節點名事件,参数：nodeId, text                    | Function | 否       | -       |
| handleAddNext            | 向後添加兄弟節點事件,参数：selectedNode              | Function | 否       | -       |
| handleAddChild           | 添加子節點事件,參數：selectedNode                    | Function | 否       | -       |
| handleDeleteNode         | 刪除節點事件,參數：selectedId,selectedNodes          | Function | 否       | -       |
| handleClickPreviewButton | 點擊更多按鈕,參數：clickNode                         | Function | 否       | -       |
| handleClickAddButton     | 點擊更多按鈕,參數：clickNode                         | Function | 否       | -       |
| handleClickMoreButton    | 點擊更多按鈕,參數：clickNode                         | Function | 否       | -       |
| handleClickDot           | 點擊圓點                                             | Function | 否       | -       |
| handleShiftUpDown        | 向上/向下移動節點，參數 id, sortList, type           | Function | 否       | -       |
| handleSave               | 保存樹                                               | Function | 否       | -       |
| handleDrag               | 拖拽節點,參數：dragInfo                              | Function | 否       | -       |
| handlePaste              | 複製節點：參數：pasteNodeKey,pasteType,targetNodeKey | Function | 否       | -       |
| hideHour                 | 隱藏任務小時數                                       | boolean  | 否       | -       |
| dragEndFromOutside       | 從外部拖入樹節點,參數：node                          | Function | 否       | -       |
| handleMouseEnterAvatar   | 鼠標移入頭像 ,參數：node                             | Function | 否       | -       |
| handleMouseLeaveAvatar   | 鼠標移出頭像,參數：node                              | Function | 否       | -       |
| handleChange             | 樹數據變更                                           | Function | 否｜-｜  |
| showDeleteConform        | 顯示刪除提示（非受控模式）                           | Function | 否｜-｜  |
| handleMutiSelect         | 框選節點，參數：selectedNodes                        | Function | 否｜-｜  |

```javascript
interface DragInfo {
  dragNodeId: string;
  dropNodeId: string;
  placement: 'up' | 'down' | 'in';
}
```

## Mind Props

| 屬性                     | 說明                                                 | 類型     | 是否必須 | 默認值  |
| ------------------------ | ---------------------------------------------------- | -------- | -------- | ------- |
| nodes                    | 節點                                                 | Object   | 是       | -       |
| uncontrolled             | 是否為非受控組件                                     | Boolean  | 否       | true    |
| startId                  | 根節點 id                                            | String   | 是       | -       |
| defaultSelectedId        | 選中的節點 id                                        | String   | 是       | -       |
| ref                      | 通過 ref 調用組件內部方法                            | -        | 否       | -       |
| singleColumn             | 是否是單向視圖                                       | Boolean  | 否       | false   |
| itemHeight               | 節點元素高度                                         | Number   | 否       | 50      |
| blockHeight              | 節點塊高度                                           | Number   | 否       | 30      |
| fontSize                 | 節點字體大小                                         | Number   | 否       | 14      |
| fontWeight               | 節點字體粗細                                         | Number   | 否       | -       |
| indent                   | 縮進                                                 | Number   | 否       | 25      |
| columnSpacing            | 列間距                                               | Number   | 否       | 55      |
| avatarWidth              | 頭像寬度                                             | Number   | 否       | 22      |
| pathWidth                | 線條寬度                                             | Number   | 否       | 1       |
| backgroundColor          | 背景色                                               | Number   | 否       | unset   |
| color                    | 字體顏色                                             | Number   | 否       | #595959 |
| hoverBorderColor         | 移上節點邊框顏色                                     | Number   | 否       | #bed2fc |
| selectedBorderColor      | 選中節點邊框顏色                                     | Number   | 否       | #35a6f8 |
| selectedBackgroundColor  | 選中節點背景色                                       | Number   | 否       | #e8e8e8 |
| checkBoxWidth            | 勾選框寬度                                           | Number   | 否       | 18      |
| disableShortcut          | 是否禁用快捷鍵                                       | Number   | 否       | -       |
| disabled                 | 是否只讀                                             | Number   | 否       | -       |
| showPreviewButton        | 是否顯示節點預覽按鈕                                 | boolean  | 否       | -       |
| showAddButton            | 是否顯示節點新增節點按鈕                             | boolean  | 否       | -       |
| showMoreButton           | 是否顯示節點更多按鈕                                 | boolean  | 否       | -       |
| moreButtonWidth          | 節點操作按鈕寬度                                     | boolean  | 否       | -       |
| showIcon                 | 是否顯示圖標                                         | boolean  | 否       | true    |
| showAvatar               | 是否顯示頭像                                         | Boolean  |
| avatarUri                | 頭像地址                                             | String   |
| handleClickNode          | 點擊節點事件,参数：node                              | Function | 否       | -       |
| handleDbClickNode        | 雙擊節點事件,参数：node                              | Function | 否       | -       |
| handleClickExpand        | 點擊收起/展開事件,参数：node                         | Function | 否       | -       |
| handleCheck              | 點擊勾選框事件,参数：node                            | Function | 否       | -       |
| handleClickAvatar        | 點擊頭像事件,参数：node                              | Function | 否       | -       |
| handleClickStatus        | 點擊狀態事件,参数：node                              | Function | 否       | -       |
| handleChangeNodeText     | 更改節點名事件,参数：nodeId, text                    | Function | 否       | -       |
| handleAddNext            | 向後添加兄弟節點事件,参数：selectedNode              | Function | 否       | -       |
| handleAddChild           | 添加子節點事件,參數：selectedNode                    | Function | 否       | -       |
| handleDeleteNode         | 刪除節點事件,參數：selectedId,selectedNodes          | Function | 否       | -       |
| handleClickPreviewButton | 點擊更多按鈕,參數：clickNode                         | Function | 否       | -       |
| handleClickAddButton     | 點擊更多按鈕,參數：clickNode                         | Function | 否       | -       |
| handleClickMoreButton    | 點擊更多按鈕,參數：clickNode                         | Function | 否       | -       |
| handleClickDot           | 點擊圓點                                             | Function | 否       | -       |
| handleShiftUpDown        | 向上/向下移動節點，參數 id, sortList, type           | Function | 否       | -       |
| handleSave               | 保存樹                                               | Function | 否       | -       |
| handleDrag               | 拖拽節點,參數：dragInfo                              | Function | 否       | -       |
| handlePaste              | 複製節點：參數：pasteNodeKey,pasteType,targetNodeKey | Function | 否       | -       |
| hideHour                 | 隱藏任務小時數                                       | boolean  | 否       | -       |
| dragEndFromOutside       | 從外部拖入樹節點,參數：node                          | Function | 否       | -       |
| handleMouseEnterAvatar   | 鼠標移入頭像 ,參數：node                             | Function | 否       | -       |
| handleMouseLeaveAvatar   | 鼠標移出頭像,參數：node                              | Function | 否       | -       |
| handleChange             | 樹數據變更                                           | Function | 否｜-｜  |
| showDeleteConform        | 顯示刪除提示（非受控模式）                           | Function | 否｜-｜  |
| handleMutiSelect         | 框選節點，參數：selectedNodes                        | Function | 否｜-｜  |

## Menu Props

| 屬性                    | 說明                                             | 類型     | 是否必須 | 默認值                |
| ----------------------- | ------------------------------------------------ | -------- | -------- | --------------------- |
| nodes                   | 節點                                             | Object   | 是       | -                     |
| startId                 | 根節點 id                                        | String   | 是       | -                     |
| backgroundColor         | 菜單背景色                                       | string   | 否       | #333333               |
| selectedBackgroundColor | 選中的菜單背景色                                 | string   | 否       | #00CDD3               |
| color                   | 文字顏色                                         | string   | 否       | #CDD0D2               |
| selectedColor           | 選中文字顏色                                     | string   | 否       | #FFF                  |
| hoverColor              | hover 文字顏色                                   | string   | 否       | #FFFFFF               |
| cutColor                | 剪切後文字顏色                                   | string   | 否       | rgba(255,255,255,0.5) |
| defaultSelectedId       | 選中的節點 id                                    | String   | 是       | -                     |
| ref                     | 通過 ref 調用組件內部方法                        | -        | 否       | -                     |
| singleColumn            | 是否是單列視圖                                   | Boolean  | 否       | false                 |
| uncontrolled            | 是否為非受控組件                                 | Boolean  | 否       | true                  |
| itemHeight              | 節點元素高度                                     | Number   | 否       | 50                    |
| blockHeight             | 節點塊高度                                       | Number   | 否       | 30                    |
| fontSize                | 節點字體大小                                     | Number   | 否       | 14                    |
| indent                  | 縮進                                             | Number   | 否       | 25                    |
| disableShortcut         | 是否禁用快捷鍵                                   | Number   | 否       | -                     |
| disabled                | 是否只讀                                         | Number   | 否       | -                     |
| showMoreButton          | 是否顯示節點選項菜單                             | boolean  | 否       | false                 |
| showIcon                | 是否顯示圖標                                     | boolean  | 否       | true                  |
| handleClickNode         | 點擊節點事件,参数：node                          | Function | 否       | -                     |
| handleDbClickNode       | 雙擊節點事件,参数：node                          | Function | 否       | -                     |
| handleClickExpand       | 點擊收起/展開事件,参数：node                     | Function | 否       | -                     |
| handleChangeNodeText    | 更改節點名事件,参数：nodeId, text                | Function | 否       | -                     |
| handleAddNext           | 向後添加兄弟節點事件,参数：selectedNode          | Function | 否       | -                     |
| handleAddChild          | 添加子節點事件,参数：selectedNode                | Function | 否       | -                     |
| handleDeleteNode        | 刪除節點事件,参数：selectedId                    | Function | 否       | -                     |
| handleClickMoreButton   | 點擊更多按鈕,參數：clickNode,offsetTop           | Function | 否       | -                     |
| handleSave              | 保存樹                                           | Function | 否       | -                     |
| handleDrag              | 拖拽節點,參數：dragNodeId,dragInfo               | Function | 否       | -                     |
| dragEndFromOutside      | 從外部拖入樹節點,參數：node                      | Function | 否       | -                     |
| handleMouseEnterAvatar  | 鼠標移入頭像 ,參數：node                         | Function | 否       | -                     |
| handleMouseLeaveAvatar  | 鼠標移出頭像,參數：node                          | Function | 否       | -                     |
| collapseMode            | 是否是折疊模式（每次僅打開一級，其他的自動折疊） | boolean  | 否       | false                 |

## MiniMenu Props

| 屬性                    | 說明                         | 類型     | 是否必須 | 默認值  |
| ----------------------- | ---------------------------- | -------- | -------- | ------- |
| nodes                   | 節點                         | Object   | 是       | -       |
| startId                 | 根節點 id                    | String   | 是       | -       |
| width                   | 菜單寬度                     | string   | 否       | 48      |
| backgroundColor         | 菜單背景色                   | string   | 否       | #333333 |
| selectedBackgroundColor | 選中的菜單背景色             | string   | 否       | #00CDD3 |
| color                   | 選中的菜單背景色             | string   | 否       | #CDD0D2 |
| itemHeight              | 節點元素高度                 | Number   | 否       | 48      |
| fontSize                | 節點字體大小                 | Number   | 否       | 14      |
| columnSpacing           | 列間距                       | Number   | 否       | 1       |
| borderRadius            | border-radius                | Number   | 否       | 0       |
| normalFirstLevel        | 首頁是否正常寬度             | boolean  | 否       | false   |
| handleClickNode         | 點擊節點事件,参数：node      | Function | 否       | -       |
| handleClickExpand       | 點擊收起/展開事件,参数：node | Function | 否       | -       |
| handleMouseEnter        | 鼠標移入事件                 | Function | 否       | -       |
| handleMouseLeave        | 鼠標移開事件                 | Function | 否       | -       |

## Catalog Props

| 屬性            | 說明                    | 類型                                           | 是否必須 | 默認值  |
| --------------- | ----------------------- | ---------------------------------------------- | -------- | ------- |
| nodes           | 節點                    | Object                                         | 是       | -       |
| startId         | 根節點 id               | String                                         | 是       | -       |
| backgroundColor | 菜單背景色              | string                                         | 否       | -       |
| color           | 字體顏色                | string                                         | 否       | #595959 |
| hoverColor      | 字體顏色（hover）       | string                                         | 否       | #8c8c8c |
| itemHeight      | 節點元素高度            | Number                                         | 否       | 48      |
| blockHeight     | 節點塊高度              | Number                                         | 否       | 30      |
| fontSize        | 節點字體大小            | Number                                         | 否       | 14      |
| titleFontSize   | 標題節點字體大小        | Number                                         | 否       | 24      |
| handleClickNode | 點擊節點事件,参数：node | Function                                       | 否       | -       |
| indent          | 縮進                    | Number                                         | 否       | 25      |
| info            | 目錄描述信息            | ReactElement                                   | 否       | -       |
| itemInfoMap     | 目錄項目描述信息        | `ItemInfoMap { [_key: string]: ReactElement;}` | 否       | -       |

## Node Props

| 屬性            | 說明                        | 類型      |
| --------------- | --------------------------- | --------- |
| \_key           | 節點 id                     | String    |
| name            | 節點文本                    | String    |
| father          | 父節點 id                   | String    |
| sortList        | 子節點 id                   | Array     |
| contract        | 是否收起子節點              | Boolean   |
| checked         | 是否勾選                    | Boolean   |
| avatarUri       | 頭像圖片地址                | String    |
| icon            | 圖標圖片地址                | String    |
| dotIcon         | 圓點圖標圖片地址            | String    |
| color           | 節點字體顏色                | String    |
| backgroundColor | 節點背景色                  | String    |
| showCheckbox    | 是否顯示勾選框              | Boolean   |
| showStatus      | 是否顯示節點狀態            | Boolean   |
| strikethrough   | 是否顯示刪除線｜ Boolean ｜ |
| hour            | 節點（任務）工時            | Number    |
| limitDay        | 節點（任務）剩余天數        | timestamp |
| disabled        | 是否禁用｜ Boolean ｜       |
