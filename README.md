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
****
## operate

| 操作                | 按鍵             |
| ------------------- | ---------------- |
| 編輯節點名          | DoubleClick              |
| 新增子節點          | Tab              |
| 新增兄弟節點        | Enter            |
| 刪除節點            | Delete           |
| 保存樹（file 模式） | Command/Ctrl + S |

<br/>

## Functions
| 方法名                | 說明             |
| ------------------- | ---------------- |
| addNext          | 添加節點              |
| addChild        | 添加子節點            |
| deleteNode            | 刪除節點           |

<br/>

## Props

| 屬性                 | 說明                 | 類型     | 是否必須 | 默認值 |
| -------------------- | -------------------- | -------- | -------- | ------ |
| nodes                | 節點                 | Array    | 是       | -      |
| startId              | 根節點 id            | String   | 是       | -      |
| ref              | 通過ref調用組件內部方法            | -   | 否       | -      |
| singleColumn         | 是否是單列視圖       | Boolean  | 否       | false  |
| uncontrolled         | 是否為非受控組件     | Boolean  | 否       | true   |
| ITEM_HEIGHT          | 節點元素高度         | Number   | 否       | 50     |
| BLOCK_HEIGHT         | 節點塊高度           | Number   | 否       | 30     |
| FONT_SIZE            | 節點字體大小         | Number   | 否       | 14     |
| INDENT               | 縮進                 | Number   | 否       | 25     |
| AVATAR_WIDTH         | 頭像寬度             | Number   | 否       | 22     |
| CHECK_BOX_WIDTH      | 勾選框寬度           | Number   | 否       | 18     |
| handleClickNode      | 點擊節點事件         | Function | 否       | -      |
| handleDbClickNode      | 雙擊節點事件         | Function | 否       | -      |
| handleClickExpand       | 點擊收起/展開事件    | Function | 否       | -      |
| handleCheck          | 點擊勾選框事件       | Function | 否       | -      |
| handleChangeNodeText | 更改節點名事件       | Function | 否       | -      |
| handleAddNext        | 向後添加兄弟節點事件 | Function | 否       | -      |
| handleAddChild       | 添加子節點事件       | Function | 否       | -      |
| handleDeleteNode     | 刪除節點事件         | Function | 否       | -      |
| handleSave           | 保存樹               | Function | 否       | -      |
| handleDrag           | 拖拽节点               | Function | 否       | -      |

## Node Props

| 屬性         | 說明                 | 類型    |
| ------------ | -------------------- | ------- |
| _key           | 節點 id              | String  |
| name         | 節點文本             | String  |
| father     | 父節點 id            | String  |
| sortList     | 子節點 id            | Array   |
| contract     | 是否收起子節點       | Boolean |
| showAvatar   | 是否顯示頭像         | Boolean |
| avatarUri    | 頭像地址             | String  |
| showCheckbox | 是否顯示勾選框       | Boolean |
| checked      | 是否勾選             | Boolean |
| showStatus   | 是否顯示節點狀態     | Boolean |
| hour         | 節點（任務）工時     | Number  |
| limitDay     | 節點（任務）剩余天數 | Number  