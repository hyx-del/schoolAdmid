<template>
  <div>
    <el-table
      ref="checkTabel"
      :data="inTableData"
      style="width: 100%;margin-bottom: 20px;"
      :row-key="getRowKeys"
      border
      :max-height="maxHeight"
      :expand-row-keys="expandKeys"
      :tree-props="{ children: 'nodes', hasChildren: 'hasChildren' }"
    >
      <template v-for="(item, index) in column">
        <el-table-column
          v-if="item.prop == 'list'"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :key="index"
        >
          <template v-slot="scope">
            <el-checkbox-group v-model="scope.row.checkList">
              <el-checkbox
                v-for="it in scope.row.list"
                @change="listCheckChange(scope.row, scope)"
                :key="it[nodeKey]"
                :label="it[nodeKey]"
                :disabled="inAllDisabled ? true : it.disabled"
                >{{ it.label }}</el-checkbox
              >
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop != 'list'"
          :key="item.id"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align || 'left'"
        >
          <template v-if="item.render" v-slot="scope">
            <slot :scope="scope.row" :name="item.prop"></slot>
          </template>
          <template v-else-if="item.html" v-slot="scope">
            <span
              :scope="scope.row"
              v-html="item.html(scope.row, scope.row[item.prop])"
              @click="tabelColomClick(item, scope.row)"
            ></span>
          </template>
          <template v-else-if="item.select" v-slot="scope">
            {{ scope.row[item.prop] }}
            <el-checkbox
              :indeterminate="scope.row.indeterminate"
              v-model="scope.row.checkAll"
              @change="rowCheckChange(scope.row)"
              :disabled="inAllDisabled ? true : scope.row.disabled"
            >
              <!--              {{scope.row.indeterminate}}-->
            </el-checkbox>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
import {
  toRefs,
  reactive,
  ref,
  watch,
  computed,
  onUnmounted,
  onBeforeUnmount
} from "vue";
import { differenceArray } from "@/utils/tools";

export default {
  props: {
    column: {
      type: Array,
      default: () => [
        {
          label: "页面权限",
          prop: "select",
          width: 100,
          select: true,
          align: "center"
        },
        {
          label: "功能模块",
          prop: "name"
        },
        {
          label: "按钮权限",
          prop: "list"
        }
      ]
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    tableData: {
      type: Array,
      default: () => []
    },
    listCode: {
      required: true,
      type: String,
      default: ""
    },
    // 表格高度
    maxHeight: {
      required: true,
      type: [String, Number],
      default: "630"
    },
    nodeKey: {
      crequired: true,
      type: String,
      default: "id"
    }
  },
  setup(props) {
    const state = reactive({
      getRowKeys: row => {
        return row.id;
      },
      // 选中的数组
      multipleSelection: [],
      // 展开的数组
      expandKeys: [],
      column: [],
      maxHeight: props.maxHeight,
      selectAll: false,
      inTableData: [],
      updateIng: false, // 数据更新
      treeValue: [],
      inAllDisabled: props.disabled
    });
    const checkTabel = ref(null);
    const upDataButton = list => {
      if (list) {
        list.forEach(item => {
          if (item.nodes && item.nodes.length > 0) {
            upDataButton(item.nodes);
          }
          if (item.checkAll) {
            let pathArr = item.path.split("/").filter(i => i);
            pathToChange(pathArr, state.inTableData, 0, [], item.name);
          }
        });
      }
    };
    // 根据path，递归寻到到路径[0][3][3][...],sort==pathArr.length时根据路径改变状态
    const pathToChange = (pathArr, list, sort, back = [], name) => {
      if (sort == pathArr.length) {
        let midArr = back
          .map((item, index) => {
            return [...back].splice(0, index + 1);
          })
          .reverse();
        midArr.forEach(arr => {
          pathIndexChange(arr, state.inTableData, 0);
        });
        return;
      }
      let search = pathArr[sort];
      let find = list.filter((i, index) => {
        if (i.id == search) {
          back.push(index);
          return i;
        }
      });

      if (find.length > 0) {
        pathToChange(pathArr, find[0].nodes, sort + 1, back);
      }
      if (find.length > 0 && !find[0].nodes) {
        pathIndexChange(pathArr, state.inTableData, 0);
      }
    };
    // 对每层数据的递归
    const pathIndexChange = (arr, list, index) => {
      if (arr.length == index + 1) {
        if (list[arr[index]] && list[arr[index]].nodes) {
          list[arr[index]].checkList = list[arr[index]].nodes.filter(
            i => i.checkAll == true
          );
          list[arr[index]].checkAll = list[arr[index]].nodes.every(
            i => i.checkAll == true
          );
          let someCheck = list[arr[index]].nodes.some(i => i.checkAll == true);
          let someIndeterminate = list[arr[index]].nodes.some(
            i => i.indeterminate == true
          );
          list[arr[index]].indeterminate =
            (someCheck && !list[arr[index]].checkAll) || someIndeterminate;
        }
      } else {
        list[arr[index]] &&
          list[arr[index]].nodes &&
          pathIndexChange(arr, list[arr[index]].nodes, index + 1);
      }
    };

    // 初始化数据
    const startData = list => {
      if (list && list.length > 0) {
        list.forEach(node => {
          if (!node.nodes) return;
          node.checkList = [];
          node.indeterminate = false;
          node.checkAll = false;
          if (node.nodes && node.nodes.length > 0) {
            if (node.nodes[0].type == "BUTTON") {
              node.list = node.nodes.map(item => {
                item.value = item[props.nodeKey];
                item.label = item.name;
                return item;
              });
              node.nodes = null;
            } else {
              startData(node.nodes);
            }
          }
        });
      }
    };
    // 展开某个节点所有,ex是否展开
    const expandNode = (row, ex = true) => {
      if (ex) {
        state.expandKeys.push(row.id + "");
        state.expandKeys = Array.from(new Set(state.expandKeys));
      } else {
        checkTabel.value.toggleRowExpansion(row, false);
        let index = state.expandKeys.indexOf(row.id + "");
        state.expandKeys.splice(index, 1);
      }
      if (row.nodes) {
        row.nodes.forEach(item => expandNode(item));
      }
    };
    // 全选
    const selectAllChange = val => {
      state.inTableData.forEach(row => rowCheckChange(row, val));
    };
    // 单行选中，右边的
    const rowCheckChange = (row, check = null) => {
      //   debugger;
      //    判断是否有按钮级菜单，如果有，就将按钮级菜单切换成当前的选择状态
      let chose = check != null ? check : row.checkAll;
      checkRecursive(row, chose);
      expandNode(row, chose);
      row.indeterminate = false;
      upDataButton(state.inTableData);
      return val => {
        expandNode(row, chose);
        return val;
      };
    };
    // 中间list选中，左边的
    const listCheckChange = row => {
      upDataButton(state.inTableData);
    };
    // 外部设置合并tree的选中并禁用
    const setTreeJion = (arr, disable = true) => {
      arr = Array.from(new Set([...arr]));
      setTreeJions(arr, state.inTableData, disable);
      upDataButton(state.inTableData);
    };
    // 设置合并tree的选中并禁用的递归
    const setTreeJions = (arr, tableData, disable) => {
      tableData.forEach(item => {
        item.disabled = arr.includes(item[props.nodeKey]) ? disable : false;
        if (!item.nodes) {
          item.checkAll = arr.includes(item[props.nodeKey]);
          item.checkList = [item[props.nodeKey]];
        }
        // 最后一级
        if (item.checkList) {
          item.indeterminate = false;
        } else {
          item.indeterminate =
            item.checkAll.length > 0 &&
            item.checkAll.length < item.nodes.length;
        }
        if (item.nodes && item.nodes.length > 0) {
          setTreeJions(arr, item.nodes, disable);
        }
        if (item.list && item.list.length > 0) {
          item.checkList = [];
          item.list.map(it => {
            if (arr.includes(it[props.nodeKey])) {
              it.disabled = disable;
              item.checkList.push(it[props.nodeKey]);
            } else {
              it.disabled = false;
            }
          });
          item.checkList = Array.from(new Set(item.checkList));
        }
      });
    };
    // 递归选中
    const checkRecursive = (row, check = true) => {
      row.checkAll = check;
      if (row.nodes) {
        row.nodes.forEach(items => checkRecursive(items, check));
      }
    };
    // 获取选中结果
    const getValue = () => {
      state.inTableData.forEach(item => recurValue(item));
      return Array.from(new Set([...state.treeValue]));
    };
    // 递归筛选结果
    const recurValue = row => {
      if (row.checkAll || row.indeterminate) {
        state.treeValue.push(row[props.nodeKey]);
      }
      if (row.nodes && row.nodes.length > 0) {
        row.nodes.forEach(item => recurValue(item));
      }
      if (row.list && row.checkList.length > 0) {
        state.treeValue = [...state.treeValue, ...row.checkList];
      }
    };

    const tabelColomClick = (item, row) => {
      item.click(row);
    };
    const treeClick = val => {};

    watch(
      () => props.tableData,
      (val, old) => {
        state.inTableData = [...val];
        startData(state.inTableData);
        upDataButton(state.inTableData);
      },
      {
        immediate: true
      }
    );
    watch(
      () => props.column,
      val => {
        state.column = val;
      }
    );
    onBeforeUnmount(() => {
      selectAllChange(false);
    });
    return {
      ...toRefs(state),
      ...toRefs(props),
      checkTabel,
      getValue,
      setTreeJion,
      treeClick,
      tabelColomClick,
      rowCheckChange,
      listCheckChange,
      selectAllChange
    };
  }
};
</script>
<style lang="scss" scoped>
/deep/ {
  .el-tree-node__expand-icon {
    display: none;
  }
  .el-tree-node {
    display: flex;
  }
  .el-tree-node__content {
    display: flex;
  }
}
</style>
