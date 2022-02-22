<!--
 * @Author: jiu yin
 * @Date: 2021-09-03 10:57:48
 * @LastEditTime: 2021-11-04 17:01:29
 * @LastEditors: zx
 * @Description: 666
 * @FilePath: \school_admin\src\views\managesignup\signuporder\index.vue
 *  “jiu”
-->
<template>
  <div>
    <!-- 列表 -->
    <div>
      <div class="title">
        <formList
          :config="tabelFormConfig"
          :itemList="itemList"
          :formInitData="formInitData"
          @buttonClick="button"
        />
      </div>
      <div class="table">
        <Table
          ref="TableList"
          :loadData="getList"
          :column="column"
          :params="formInitData"
          :showSortIndex="{ show: true, lable: '序号' }"
        />
      </div>
    </div>
    <!-- 抽屉详情 -->
    <div>
      <el-drawer
        title="订单详情"
        v-model="drawerModel"
        :direction="direction"
        :before-close="handleClose"
        destroy-on-close
        size="600px"
      >
        <div>
          <!-- 详情表单 -->
          <detailShow
            :itemList="itemListDrawer"
            :formInitData="formInitDrawerData"
            :config="{ itemStyle: itemStyle }"
          >
          </detailShow>
          <div class="drawerList">
            <p>支付方式</p>
            <Table
              :data="payTableData"
              :column="columnPay"
              :headHight="220"
              :hidden="false"
            />
          </div>
          <div class="drawerList">
            <p>订单明细</p>
            <Table
              :data="costProjectTableData"
              :column="columnOrder"
              :headHight="220"
              :hidden="false"
            />
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import detailShow from "@/components/FormList/detailShow.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { schoolList, changestatus } from "@/api/headquarters";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import {
  enableList,
  enableStatus,
  orderStatus,
  orderChannel,
  orderType,
  getListHtml,
  payChannel,
  costType, payModeList
} from "@/utils/enum/select";
import { semesterListBySchoolId } from "@/api/semester";
import { getOrderListAPI, ordinaryOrderDetailAPI } from "@/api/studentSemester";

// import { tabelFormConfig } from "@/utils/config";
export default {
  components: {
    formList,
    Table,
    detailShow
  },
  setup() {
    const itemStyle = { width: "50%" };
    const state = reactive({
      formInitData: {},
      formInitDrawerData: {},
      payTableData: [],
      costProjectTableData: [],
      drawerModel: false
    });
    const router = useRouter();
    const TableList = ref(null);
    const tabelFormConfig = {
      allRequired: false, // 是否全部必填
      inline: true, //行内
      colon: ":",
      inputStyle: {
        width: "240px"
      },
      buttons: [
        {
          funType: "confirm",
          type: "primary",
          name: "查 询",
          size: "small"
        }
      ]
    };
    const itemList = [
      {
        code: "id",
        el: "input",
        label: "搜索",
        placeholder: "搜索订单号"
      },
      {
        label: "销售名称",
        el: "input",
        code: "salesmanName",
        placeholder: "销售"
      },
      {
        el: "select",
        code: "semesterId",
        label: "学期",
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id", // 指定的value名
        fun: semesterListBySchoolId,
        query: { size: 1000 },
        // multiple:true,
        required: false
      },

      {
        label: "下单类型",
        el: "select",
        list: orderType,
        code: "type",
        placeholder: ""
      },
      {
        label: "下单渠道",
        el: "select",
        list: orderChannel,
        code: "platform",
        placeholder: ""
      },
      {
        label: "状态",
        el: "select",
        list: [
          { value: "10", label: "已完成" },
          { value: "20", label: "已取消" }
        ],
        code: "status",
        placeholder: ""
      }
    ];
    const column = reactive([
      // { prop: "id",label: "序号",width: "80" },
      {
        prop: "semesterName",
        label: "学期名"
      },
      { prop: "studentName", label: "学员" },
      { prop: "mobile", label: "手机号" },
      {
        prop: "id",
        label: "订单号"
      },
      { prop: "total", label: "原价" },
      { prop: "actualTotal", label: "实际支付" },
      {
        prop: "payMode",
        label: "支付类型" ,
        html: (row, val) => getListHtml(payModeList, val)
      },
      { prop: "remark", label: "订单说明" },
      {
        prop: "status",
        label: "状态",
        html: (row, val) => getListHtml(orderStatus, val)
      },
      {
        prop: "type",
        label: "下单类型",
        html: (row, val) => getListHtml(orderType, val)
      },
      {
        prop: "platform",
        label: "下单渠道",
        html: (row, val) => getListHtml(orderChannel, val)
      },
      { prop: "salesmanName", label: "销售" },
      { prop: "operatorName", label: "操作人" },
      { prop: "updatedAt", label: "操作时间" },
      {
        prop: "action",
        label: "操作",
        width: "100px",
        actives: [
          {
            name: val => {
              return "详情";
            },
            method: val => {
              ordinaryOrderDetailAPI({ id: val.id }).then(res => {
                if (res.code == 200) {
                  state.formInitDrawerData = res.data;
                  // 支付方式 表格数据处理
                  state.payTableData = res.data.payMode;
                  // 订单明细  payTableData
                  state.costProjectTableData = res.data.newOrderItem;
                  state.drawerModel = true;
                }
              });
            }
          }
        ]
      }
    ]);

    const getList = computed(() => {
      return getOrderListAPI;
    });
    const button = val => {
      if (val.name == "confirm") {
        // console.log("订单列表查询");
        TableList.value.update({ ...val.value });
      }
    };

    const itemListDrawer = [
      {
        code: "studentName",
        label: "会员",
        default: "--"
      },
      {
        code: "salesmanName",
        label: "销售",
        default: "--"
      },
      {
        code: "actualTotal",
        label: "订单金额",
        default: "--"
      },
      {
        code: "status",
        label: "订单状态",
        list: orderStatus,
        default: "--"
      },
      {
        code: "createdAt",
        label: "下单时间",
        placeholder: "",
        default: "--"
      },
      {
        code: "operatorName",
        label: "操作人",
        default: "--"
      }
    ];
    const drawer = ref(false);
    const direction = ref("rtl");
    //点击遮罩
    const handleClose = done => {
      done();
    };

    //支付列表
    const columnPay = [
      { prop: "channelName", label: "支付方式" },
      { prop: "amount", label: "金额" },
      { prop: "paymentTime", label: "修改时间" }
    ];
    //订单明细列表
    const columnOrder = [
      {
        prop: "itemType",
        label: "类型",
        html: (row, val) => getListHtml(costType, val)
      },
      { prop: "semesterName", label: "学期" },
      { prop: "itemTotol", label: "金额" }
    ];
    return {
      ...toRefs(state),
      itemList,
      tabelFormConfig,
      column,
      getList,
      button,
      TableList,
      itemStyle,
      itemListDrawer,
      drawer,
      direction,
      handleClose,
      columnPay,
      columnOrder
    };
  }
};
</script>

<style lang="scss" scoped>
.name {
  cursor: pointer;
  color: #2e8de6;
}
.drawerList {
  padding-left: 20px;
}
</style>
