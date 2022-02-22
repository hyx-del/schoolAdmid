<template>
  <!-- :max-height="topHead" -->
  <div style="margin-top: 20px;" ref="tableBox">
    <el-table
      class="tipleTable"
      :class="single ? 'single' : null"
      ref="multipleTable"
      v-model:data="tableData"
      style="width: 100%;"
      :max-height="topHead"
      border
      :default-sort="{ prop: 'date', order: 'descending' }"
      row-key="id"
      lazy
      :fit="true"
      :load="childrenLoad"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :indent="30"
      @selection-change="handleSelectionChange"
      @select="handleSelect"
      @select-all="allSelect"
      @sort-change="sortChange"
    >
      <el-table-column
        v-if="select"
        type="selection"
        width="55"
        :reserve-selection="true"
      ></el-table-column>
      <!-- v-if="showSortNum"     -->
      <el-table-column
        :label="showSortIndex.lable"
        v-if="showSortIndex.show"
        width="60"
      >
        <template v-slot="scope">
          <span>
            {{ scope.$index + 1 + listQuery.size * (listQuery.current - 1) }}
          </span>
        </template>
      </el-table-column>
      <template v-for="(item, index) in column" :key="index">
        <el-table-column
          :show-overflow-tooltip="true"
          :sortable="item.sortable ? 'custom' : false"
          :prop="item.prop ? item.prop : null"
          :label="item.label ? item.label : null"
          :align="
            item.align ? item.align : item.prop == 'action' ? 'left' : 'center'
          "
          :fixed="
            item.fixed || item.prop == 'action'
              ? item.fixed || (item.prop == 'action' ? 'right' : '')
              : null
          "
          :width="item.width ? item.width : null"
          :min-width="item.minwidth ? item.minwidth : item.img ? '140px' : null"
          :formatter="item.formatter ? item.formatter : null"
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
          <template v-else-if="item.img" v-slot="scope">
            <el-image
              v-if="scope.row[item.prop]"
              :scope="scope.row"
              :style="{
                width: item.width || 'auto',
                height: item.height || '100px'
              }"
              class="table_img"
              :src="scope.row[item.prop].split(',')[0]"
              :preview-src-list="scope.row[item.prop].split(',')"
            ></el-image>
            <div v-else>{{ item.defalt || "-" }}</div>
            <!--            {{scope.row[item.prop]}}-->
          </template>
          <template v-else-if="item.state" v-slot="scope">
            {{ scope.row[item.prop] ? "已上线" : "已下线" }}
          </template>
          <template v-else-if="item.time" v-slot="scope">
            {{
              scope.row[item.prop] ? parseTime(scope.row[item.prop]) : "未选择"
            }}
          </template>
          <template v-else-if="item.switch" v-slot="scope">
            <el-switch
              v-if="backType(scope.row[item.prop], 'String')"
              v-model.trim="scope.row[item.prop]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="'1'"
              :inactive-value="'0'"
              @change="switchFun(item, scope.row)"
            ></el-switch>
            <el-switch
              v-if="backType(scope.row[item.prop], 'Number')"
              v-model.trim="scope.row[item.prop]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="switchFun(item, scope.row)"
            ></el-switch>
            <el-switch
              v-if="backType(scope.row[item.prop], 'Boolean')"
              v-model.trim="scope.row[item.prop]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
              @change="switchFun(item, scope.row)"
            ></el-switch>
          </template>
          <template v-else-if="item.actives" v-slot="scope">
            <template v-for="active in item.actives">
              <template v-if="showButtom(active.perCode)">
                <template
                  v-if="
                    typeof active.name === 'function'
                      ? active.name(scope.row, scope.$index)
                        ? active.name
                        : false
                      : active.name
                  "
                >
                  <div
                    @click="tableMethod(scope.row, active, scope.$index)"
                    type="text"
                    size="small"
                    :key="'' + active.name"
                    class="clickA"
                  >
                    {{
                      typeof active.name === "function"
                        ? active.name(scope.row)
                        : active.name
                    }}
                  </div>
                  <!-- <a href="#"></a> -->
                </template>
              </template>
            </template>
          </template>
          <template v-else v-slot="scope">
            {{ scope.row[item.prop] || item.defalt || "-" }}
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div v-if="hidden">
      <!-- 全局包裹器中文 -->
      <el-config-provider :locale="locale">
        <el-pagination
          v-model:current-page="listQuery.current"
          v-model:page-size="listQuery.size"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="sizes"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-config-provider>
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from "@vue/reactivity";
import { watch } from "vue";
import { onBeforeUnmount, onMounted } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { backType } from "@/components/FormList/utils";
import { parseTime } from "@/utils/formaData";
import { useRouter, useRoute } from "vue-router";
//处理分页中文
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { isShowButtom } from "@/utils/permissionsButton";
/**
 * @name:
 * @description: 表格二次封装
 * showSortIndex: {
			type: Object,
			// default: { show: false },
			default: () => {
				let _obj = { show: false };
				return _obj;
			},
		},
	例如:	:showSortIndex="{ show: true, lable: '序号' }"
 * headHight 和 refHead: headHight是需要减掉的头部高度优先于refHead相邻头部的ref的高度
 * loadData       fun     一级数据接口函数  二级数据所需id默认会在此获取
 * childrenData   fun     二级数据接口函数  添加此函数默认开启数形结构 并且所有一级数据都会带上childen属性
 * params  obj 初始化的时候需要带的参数
 * column    array   表头数据   ==>
 *   表头参数如下：{
 *     props: string 表头key值
 *     label:string 表头名字
 *     width: number 表头该列的宽度
 *     formatter: fun 自定义格式 Function(row, column, cellValue, index)  row:整条数据实例  column:表头实例  cellValue:该条参数值  index:index
 *     actives: array  操作   {method 事件函数  name 操作名称 }
 *            ==>method：val=>{} val为返回的该行的值
 *            ==>name:string /function  当传入为回调函数时 回调参数返回为该行的值 当返回为false时 该操作按钮默认不显示
 *   }
 * render    boolean  是否需要自定义插槽 父组件插槽：    v-slot:prop值="{scope}" scope为该行值
 * html 函数 直接渲染dom  例如 html:(row)=>`<el-button >取消</el-button>`
 * img boolean渲染成图片
 * eg:
 * <template v-slot:avatar="{scope}">
        <img :src="scope.avatar" class="admin_avater" />
    </template>

 * select    function 开启多选框  传递函数 返回value  绑定函数需要在method中声明  value为选中数组 single为true 多选变成单选
 * hidden    boolean  是否显示分页器 不传则默认显示
 * single    boolean  是否开启单选
 *
 * ==================
 * 方法 通过this.$refs.表格名.方法名  调用  eg:this.$refs.table.update({...searchParams}) //搜索并更新表格 searchParams为搜索参数对象
 * reset重置表格  update更新表格  clearSelect清空单选/多选
 * @return:
 */
/*分页器
 * total         number   总条目数
 * current-page.sync      number   当前页数
 * page-size.sync         number   每页限制条数
 * sizes     array    每页显示条目个数，支持 .sync 修饰符
 * layout        string   组件布局，子组件名用逗号分隔
 * hidden        boolean  是否隐藏
 */

export default {
  name: "xtable",
  props: {
    // 获取数据的回调函数
    loadData: {
      type: Function
      // required: true
    },
    // 传入静态数据，与上面的loadData，两个只能存在一个
    data: {
      type: Array
    },

    showSortIndex: {
      type: Object,
      // default: { show: false },
      default: () => {
        let _obj = { show: false };
        return _obj;
      }
    },
    childrenData: {
      type: Function
    },
    column: {
      type: Array
    },
    hidden: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object
    },
    // 接收选中的数组的函数
    select: {
      type: Function
    },
    // 是否单选
    single: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number
    },
    // 滚条高度
    headHight: {
      type: Number,
      default: () => 0
    },
    refHead: {
      type: String,
      default: () => ""
    },
    // 额外的高度
    additional: {
      type: [Number, String],
      default: () => 0
    }
  },
  setup(porps, context) {
    const router = useRouter();
    const locale = zhCn;
    const state = reactive({
      tableMethod: (row, active, index) => {
        if (active.path) {
          router.push({
            path: active.path,
            query: { id: row.id }
          });
        }
        active.method && active.method(row, index);
      },
      screenWidth: "",
      topHead: "1000",
      total: 0,
      listQuery: {
        current: 1,
        size: porps.params && porps.params.size ? porps.params.size : 20
      },
      tableData: [],
      sizes: [5, 10, 20, 30, 50],
      searchParams: {}, //搜索参数,
      activeRow: {}, //选择当前行
      parentId: 0,
      cutId: ""
    });
    // 根据后台返回权限显示按钮
    const showButtom = perCode => {
      if (!perCode) {
        return true;
      } else {
        return isShowButtom(perCode);
      }
    };
    const getData = params => {
      if (porps.loadData) {
        porps.loadData({ ...params }).then(
          res => {
            let data = res.data;
            if (res.code == 200) {
              let list = [];
              if (porps.childrenData) {
                list = data.records.map(item => {
                  item.hasChildren = true;
                  return item;
                });
              } else {
                list = data.records;
              }
              state.total = data.total;
              context.emit("total", data.total);
              state.tableData = data.records || data;
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    };
    onMounted(() => {
      getData({ ...state.listQuery, ...porps.params });
      getHeight();
      window.addEventListener("resize", watchWidth);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", watchWidth);
    });
    // 获取头部高度
    const tableBox = ref(null);
    const getHeight = () => {
      if (porps.headHight) {
        state.topHead = porps.headHight;
      } else {
        //窗口高
        let windowHeight = document.documentElement.clientHeight;
        //元素到窗口顶部距离
        if (tableBox.value) {
          // debugger;
          //   console.log( tableBox.value.getBoundingClientRect())
          let table__body = tableBox.value.getBoundingClientRect().top;
          //tabs组件应用是style显示隐藏不会重新加载节点  如果默认项没引用表格 就写死630
          if (table__body) {
            state.topHead = windowHeight - table__body - 120;
          } else {
            state.topHead = 630;
          }
          // console.log(state.topHead);
        }
      }
    };
    const tabelColomClick = (item, row) => {
      item.click && item.click(row);
    };
    // 获取浏览器宽度
    const watchWidth = () => {
      // const that = this
      window.onresize = () => {
        return (() => {
          getHeight();
        })();
      };
    };

    const toStr = par => {
      console.log(par);
      return par.toString();
    };
    //切换
    const switchFun = (item, row) => {
      let data = { id: row.id, [item.prop]: row[item.prop] };
      item
        .fun({ ...data })
        .then(res => {
          ElMessage.success("操作成功");
        })
        .finally(() => {
          reset();
        });
    };

    // 修改每页展示条数
    const handleSizeChange = val => {
      getData({
        current: state.listQuery.current,
        size: val,
        ...porps.params,
        ...state.searchParams
      });
    };
    // 页数
    const handleCurrentChange = val => {
      getData({
        current: val,
        size: state.listQuery.size,
        ...porps.params,
        ...state.searchParams
      });
    };
    // 通过this.$refs.表格名  调用的方法==============
    // 重置表格 刷新
    const reset = () => {
      getData({ ...porps.params, ...state.listQuery });
    };
    // 更新表格
    const update = params => {
      state.searchParams = params;
      clearSelect();
      getData({ ...porps.params, ...state.listQuery, ...params });
    };
    // 清空选项
    const multipleTable = ref(null);
    const clearSelect = () => {
      multipleTable.value.clearSelection();
    };
    //================================================
    // 二级类目
    const childrenLoad = (row, treeNode, resolve) => {
      porps.childrenData({ parentId: row.id, size: 100 }).then(res => {
        if (res.success) {
          resolve(res.data.list);
        }
      });
    };
    const handleSelect = (val, row) => {
      if (porps.single) {
        if (val.length > 1) {
          multipleTable.value.clearSelection(); // 清空所有选择
          val.shift();
          multipleTable.value.toggleRowSelection(row); //  选中当前选择
        }

        let selected = val.length && val.indexOf(row) !== -1;
        // true就是选中，0或者false是取消选中
      }
      porps.select(val);
    };
    const sortChange = (val, row) => {
      context.$emit("sortChangechild", val);
    };

    const handleSelectionChange = val => {
      if (porps.single) {
        let posy = val;
        let pos = [];
        posy.forEach(item => {
          pos.push(item.id);
          state.cutId = pos.join(","); //把选中的id已字符串传递出去  例如：'1,3,4,5'
        });
      }
    };

    watch(
      () => porps.data,
      (val, oldValue) => {
        if (val != oldValue) {
          state.tableData = val;
        }
      },
      { deep: true, immediate: true }
    );

    // 全选按钮
    const allSelect = val => {
      porps.select(val);
    };
    return {
      ...toRefs(state),
      tabelColomClick,
      watchWidth,
      childrenLoad,
      handleSelectionChange,
      handleSelect,
      allSelect,
      sortChange,
      handleSizeChange,
      handleCurrentChange,
      update,
      clearSelect,
      switchFun,
      toStr,
      multipleTable,
      parseTime,
      tableBox,
      backType,
      showButtom,
      locale
    };
  }
};
</script>

<style lang="scss" scoped>
>>> .table_img > img.el-image__inner {
  width: auto !important;
}
.tipleTable {
  //height: 50vh;
  & >>> .el-table__body-wrapper {
    height: 100%;
    overflow: auto;
    //padding-bottom: 48px;
    /*滚动条样式*/
    &::-webkit-scrollbar {
      width: 4px;
      height: 14px;
    }
    //滑块
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #ccc;
    }
    //外层轨道
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: #fafafa;
    }
  }
}
.el-pagination {
  text-align: right;
  padding: 10px 10px;
}
.el-table th {
  background-color: #fafafa;
}
.single thead tr .el-checkbox__input {
  display: none;
}

.clickA {
  display: inline-block;
  color: #2e8de6;
  padding: 0 8px;
  text-decoration: underline;
  cursor: pointer;
}
.clickA:active {
  color: #1879d4;
}
// .el-table .cell.el-tooltip {
// 	white-space: pre-wrap;
// 	overflow: hidden;
// 	text-overflow: ellipsis;
// 	display: -webkit-box;
// 	-webkit-line-clamp: 2;
// 	line-clamp: 2;
// 	-webkit-box-orient: vertical;
// }
// .el-tooltip__popper {
// 	max-width: 500px;
// 	// left: 230px;
// }
</style>
