import React, { useRef } from 'react';
import { Tree, Props } from '../src';

export default {
  title: '树状脑图',
};

const nodes = {
  '001': {
    _key: '001',
    name: '項目管理',
    father: '',
    sortList: ['002', '003', '004', '005'],
    contract: false,
    showAvatar: true,
    avatarUri: 'https://psnine.com/Upload/game/11387.png',
    showCheckbox: true,
    checked: true,
    showStatus: true,
    hour: 0.1,
    limitDay: -23,
  },
  '002': {
    _key: '002',
    name: '計劃進度',
    father: '001',
    sortList: ['006', '007'],
    contract: false,
    showAvatar: false,
    showCheckbox: true,
    checked: true,
    showStatus: true,
    hour: 0.1,
    limitDay: -23,
  },
  '003': {
    _key: '003',
    name: '項目狀態',
    father: '001',
    sortList: ['010', '011'],
    showAvatar: false,
    showCheckbox: true,
    checked: false,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
  '004': {
    _key: '004',
    name: '項目會議',
    father: '001',
    sortList: [],
    showAvatar: false,
    showCheckbox: true,
    checked: false,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
  '005': {
    _key: '005',
    name: '驗收',
    father: '001',
    sortList: [],
    showAvatar: false,
    showCheckbox: true,
    checked: false,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
  '006': {
    _key: '006',
    name: '階段壹',
    father: '002',
    contract: false,
    sortList: ['008', '009'],
    showAvatar: false,
    showCheckbox: true,
    checked: false,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
  '007': {
    _key: '007',
    name: '階段二',
    father: '002',
    sortList: [],
    showAvatar: false,
    showCheckbox: true,
    checked: false,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
  '008': {
    _key: '008',
    name: '備份json文件',
    father: '006',
    sortList: [],
    showAvatar: false,
    showCheckbox: true,
    checked: false,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
  '009': {
    _key: '009',
    name: '還原數據',
    father: '006',
    sortList: ['015'],
    showAvatar: false,
    showCheckbox: true,
    checked: false,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
  '010': {
    _key: '010',
    name: '4月計劃',
    father: '003',
    sortList: [],
    showAvatar: false,
    showCheckbox: true,
    checked: true,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
  '011': {
    _key: '011',
    name: '5月計劃',
    father: '003',
    sortList: ['012', '013', '014'],
    contract: false,
    showAvatar: false,
    showCheckbox: true,
    checked: true,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
  '012': {
    _key: '012',
    name: '原型、界面設計',
    father: '011',
    sortList: [],
    showAvatar: false,
    showCheckbox: true,
    checked: true,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
  '013': {
    _key: '013',
    name: '開發',
    father: '011',
    sortList: [],
    showAvatar: false,
    showCheckbox: true,
    checked: true,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
  '014': {
    _key: '014',
    name: '測試',
    father: '011',
    sortList: [],
    showAvatar: false,
    showCheckbox: true,
    checked: true,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
  '015': {
    _key: '015',
    name: '還原數據-還原數據',
    father: '009',
    sortList: [],
    showAvatar: false,
    showCheckbox: true,
    checked: true,
    showStatus: true,
    hour: 0.1,
    limitDay: 2,
  },
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.

export const Default = () => {
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
      <Tree
        ref={treeRef}
        nodes={nodes}
        startId="001"
        handleClickExpand={(node: any) =>
          console.log('---handleClickExpand---', node.name)
        }
        handleCheck={(node: any) => console.log('---handleCheck---', node.name)}
        handleClickNode={(node: any) =>
          console.log('---handleClickNode---', node.name)
        }
        handleDbClickNode={(node: any) =>
          console.log('---handleDbClickNode---', node.name)
        }
        handleChangeNodeText={(nodeId: string, value: string) =>
          console.log('---handleChangeNodeText---', nodeId, value)
        }
        handleAddNext={(selected: any, addedNode: any) =>
          console.log(
            '---handleChangeNodeText---',
            selected.name,
            addedNode?.name
          )
        }
        handleAddChild={(selected: any, addedNode: any) =>
          console.log('---handleAddChild---', selected.name, addedNode?.name)
        }
        handleDeleteNode={(selected: any, addedNode: any) =>
          console.log('---handleDeleteNode---', selected.name, addedNode?.name)
        }
      />
    </div>
  );
};
