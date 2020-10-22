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
import { Tree } from 'tree-graph-react';

const MyComp = () => <Tree nodes={nodes} startId="rootKey" />;
```

## operate

| 操作                | 按鍵             |
| ------------------- | ---------------- |
| 編輯節點名          | DoubleClick      |
| 新增子節點          | Tab              |
| 新增兄弟節點        | Enter            |
| 刪除節點            | Delete           |
| 保存樹（file 模式） | Command/Ctrl + S |

<br/>

## Functions

| 方法名       | 說明         |
| ------------ | ------------ |
| addNext      | 添加節點     |
| addChild     | 添加子節點   |
| deleteNode   | 刪除節點     |
| rename       | 重命名       |
| closeOptions | 關閉選項面板 |

<br/>

## Tree Props

| 屬性                  | 說明                                    | 類型      | 是否必須 | 默認值 |
| --------------------- | --------------------------------------- | --------- | -------- | ------ |
| nodes                 | 節點                                    | Array     | 是       | -      |
| startId               | 根節點 id                               | String    | 是       | -      |
| defaultSelectedId     | 選中的節點 id                           | String    | 是       | -      |
| renameSelectedNode    | 是否重命名選中的節點                    | String    | 是       | -      |
| ref                   | 通過 ref 調用組件內部方法               | -         | 否       | -      |
| singleColumn          | 是否是單列視圖                          | Boolean   | 否       | false  |
| uncontrolled          | 是否為非受控組件                        | Boolean   | 否       | true   |
| itemHeight            | 節點元素高度                            | Number    | 否       | 50     |
| blockHeight           | 節點塊高度                              | Number    | 否       | 30     |
| fontSize              | 節點字體大小                            | Number    | 否       | 14     |
| indent                | 縮進                                    | Number    | 否       | 25     |
| avatarWidth           | 頭像寬度                                | Number    | 否       | 22     |
| checkBoxWidth         | 勾選框寬度                              | Number    | 否       | 18     |
| disableShortcut       | 是否禁用快捷鍵                          | Number    | 否       | -      |
| showMoreButton        | 是否顯示節點更多按鈕                    | boolean   | 否       | -      |
| showIcon              | 是否顯示圖標                            | boolean   | 否       | true   |
| showAvatar            | 是否顯示頭像                            | Boolean   |
| avatarUri             | 頭像地址                                | String    |
| showCheckbox          | 是否顯示勾選框                          | Boolean   |
| nodeOptions           | 節點選項菜單內容                        | component | 否       | -      |
| handleClickNode       | 點擊節點事件,参数：node                 | Function  | 否       | -      |
| handleDbClickNode     | 雙擊節點事件,参数：node                 | Function  | 否       | -      |
| handleClickExpand     | 點擊收起/展開事件,参数：node            | Function  | 否       | -      |
| handleCheck           | 點擊勾選框事件,参数：node               | Function  | 否       | -      |
| handleChangeNodeText  | 更改節點名事件,参数：nodeId, text       | Function  | 否       | -      |
| handleAddNext         | 向後添加兄弟節點事件,参数：selectedNode | Function  | 否       | -      |
| handleAddChild        | 添加子節點事件,參數：selectedNode       | Function  | 否       | -      |
| handleDeleteNode      | 刪除節點事件,參數：selectedNode         | Function  | 否       | -      |
| handleClickMoreButton | 點擊更多按鈕,參數：clickNode            | Function  | 否       | -      |
| handleClickDot        | 點擊圓點                                | Function  | 否       | -      |
| handleSave            | 保存樹                                  | Function  | 否       | -      |
| handleDrag            | 拖拽節點                                | Function  | 否       | -      |

## Menu Props

| 屬性                    | 說明                                    | 類型      | 是否必須 | 默認值  |
| ----------------------- | --------------------------------------- | --------- | -------- | ------- |
| nodes                   | 節點                                    | Array     | 是       | -       |
| startId                 | 根節點 id                               | String    | 是       | -       |
| width                   | 菜單寬度                                | string    | 否       | 320     |
| backgroundColor         | 菜單背景色                              | string    | 否       | #333333 |
| selectedBackgroundColor | 選中的菜單背景色                        | string    | 否       | #00CDD3 |
| color                   | 選中的菜單背景色                        | string    | 否       | #CDD0D2 |
| defaultSelectedId       | 選中的節點 id                           | String    | 是       | -       |
| renameSelectedNode      | 是否重命名選中的節點                    | String    | 是       | -       |
| ref                     | 通過 ref 調用組件內部方法               | -         | 否       | -       |
| singleColumn            | 是否是單列視圖                          | Boolean   | 否       | false   |
| uncontrolled            | 是否為非受控組件                        | Boolean   | 否       | true    |
| itemHeight              | 節點元素高度                            | Number    | 否       | 50      |
| blockHeight             | 節點塊高度                              | Number    | 否       | 30      |
| fontSize                | 節點字體大小                            | Number    | 否       | 14      |
| indent                  | 縮進                                    | Number    | 否       | 25      |
| disableShortcut         | 是否禁用快捷鍵                          | Number    | 否       | -       |
| showMoreButton          | 是否顯示節點選項菜單                    | boolean   | 否       | -       |
| showIcon                | 是否顯示圖標                            | boolean   | 否       | true    |
| nodeOptions             | 節點選項菜單內容                        | component | 否       | -       |
| handleClickNode         | 點擊節點事件,参数：node                 | Function  | 否       | -       |
| handleDbClickNode       | 雙擊節點事件,参数：node                 | Function  | 否       | -       |
| handleClickExpand       | 點擊收起/展開事件,参数：node            | Function  | 否       | -       |
| handleChangeNodeText    | 更改節點名事件,参数：nodeId, text       | Function  | 否       | -       |
| handleAddNext           | 向後添加兄弟節點事件,参数：selectedNode | Function  | 否       | -       |
| handleAddChild          | 添加子節點事件,参数：selectedNode       | Function  | 否       | -       |
| handleDeleteNode        | 刪除節點事件,参数：selectedNode         | Function  | 否       | -       |
| handleClickMoreButton   | 點擊更多按鈕,參數：clickNode            | Function  | 否       | -       |
| handleSave              | 保存樹                                  | Function  | 否       | -       |
| handleDrag              | 拖拽節點                                | Function  | 否       | -       |

## Node Props

| 屬性       | 說明                 | 類型    |
| ---------- | -------------------- | ------- |
| \_key      | 節點 id              | String  |
| name       | 節點文本             | String  |
| father     | 父節點 id            | String  |
| sortList   | 子節點 id            | Array   |
| contract   | 是否收起子節點       | Boolean |
| checked    | 是否勾選             | Boolean |
| showStatus | 是否顯示節點狀態     | Boolean |
| hour       | 節點（任務）工時     | Number  |
| limitDay   | 節點（任務）剩余天數 | Number  |
