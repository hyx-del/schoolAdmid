<!--
 * @Author: 刘帝君
 * @Date: 2021-09-24 14:52:06
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-01 16:14:29
 * @Descripttion: 
-->
<template>
  <div>
    <formShow
      ref="formShow"
      :itemList="itemListDrawer"
      :formInitData="formInitDrawer"
    />
    <div class="drawerList">
      <p>支付方式</p>
      <Table
        ref="TableList"
        :column="columnPay"
        :data="paymentMethod"
        :headHight="138"
        :hidden="false"
      />
    </div>
    <div class="drawerList">
      <p>订单明细</p>
      <Table
        ref="TableList"
        :column="columnOrder"
        :data="orderDetails"
        :headHight="138"
        :hidden="false"
      />
    </div>
  </div>
</template>

<script>
import { toRefs, ref, reactive, computed } from "vue";
import formShow from "@/components/FormList/detailShow";
import { packageOrderDetails } from "@/api/coursesManagement";
import Table from "@/components/Table/index";
import { useRoute } from "vue-router";
// import { dictType } from "@/api/dict";
export default {
  components: {
    Table,
    formShow
  },
  setup() {
    const itemStyle = reactive({ width: "50%" });
    const state = reactive({
      orderDetails: [],
      paymentMethod: [],
      formInitDrawer: {},
      id: useRoute().query.id
    });

    // 回显
    if (state.id) {
      packageOrderDetails({ id: state.id }).then(({ code, data }) => {
        if (code == 200) {
          console.log(data, "套餐订单");
          switch (data.status) {
            case 0:
              data.status = "待支付";
              break;
            case 10:
              data.status = "已完成";
              break;
            case -10:
              data.status = "已取消";
              break;
            default:
              break;
          }
          state.formInitDrawer = data;
          //支付方式
          state.paymentMethod = data.paymentOrder;
          //订单明细
          state.orderDetails = data.mainOrderItemList;
        }
      });
    }

    const itemListDrawer = [
      {
        code: "studentName",
        label: "会员"
      },
      {
        code: "salesmanNames",
        label: "销售"
      },
      {
        code: "actualTotal",
        label: "订单金额"
      },
      {
        code: "status",
        label: "订单状态"
      },
      {
        code: "createdAt",
        label: "下单时间"
      },
      {
        code: "operatorName",
        label: "操作人"
      }
    ];

    //支付列表
    const columnPay = reactive([
      {
        prop: "channelName",
        label: "支付方式"
      },
      { prop: "amount", label: "金额" },
      { prop: "paymentTime", label: "付款时间" }
    ]);
    //订单明细列表
    const columnOrder = reactive([
      { prop: "typeName", label: "类型" },
      { prop: "mainCourseName", label: "套餐" },
      { prop: "total", label: "金额" }
    ]);

    return {
      ...toRefs(state),
      itemListDrawer,
      itemStyle,
      columnPay,
      columnOrder
    };
  }
};
</script>

<style lang="scss" scoped>
.drawerList {
  padding-left: 20px;
}
</style>
