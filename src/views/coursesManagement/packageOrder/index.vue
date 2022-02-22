<template>
  <div>
    <div class="title">
      <formList
        :config="config"
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
      />
    </div>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { packageOrderList } from "@/api/coursesManagement";
import { useRouter } from "vue-router";
import { staffGetSaleStaffList } from "@/api/managerStaff";
import {
  registerModeList,
  getListHtml,
  orderChannel,
  orderStatus,
  orderType
} from "@/utils/enum/select";

export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null);
    const state = reactive({
      formInitData: {}
    });
    // 表单按钮
    const config = {
      allRequired: false, // 是否全部必填
      inline: true, //行内
      colon: "",
      inputStyle: {
        width: "170px"
      },
      buttons: [
        {
          funType: "confirm",
          type: "primary",
          name: "搜索",
          size: "small"
        }
      ]
    };
    // 表单状态
    const itemList = [
      {
        code: "orderNum",
        label: "搜索",
        placeholder: "搜索订单号"
      },
      {
        el: "select",
        code: "salesmanId",
        label: "销售",
        fun: staffGetSaleStaffList,
        funMode: "one",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id", // 指定的value名
        required: false,
        filterable: true // 可搜索
      },
      {
        el: "select",
        label: "下单类型",
        code: "type",
        list: orderType
      },
      {
        el: "select",
        label: "下单渠道",
        code: "platform",
        list: orderChannel
      },
      {
        el: "select",
        label: "状态",
        code: "status",
        list: orderStatus
      }
    ];
    // 表单点击
    const button = val => {
      TableList.value.update({ ...val.value });
      console.log(val, "点击新增");
    };
    // 表格数据
    const getList = computed(() => {
      return packageOrderList;
    });
    // 表格表头
    const column = reactive([
      {
        prop: "mainCourseName",
        label: "全面套餐名"
      },
      {
        prop: "studentName",
        label: "学员"
      },
      {
        prop: "mobile",
        label: "手机号"
      },
      {
        prop: "orderNum",
        label: "订单号"
      },
      {
        prop: "total",
        label: "原价"
      },
      {
        prop: "actualTotal",
        label: "实际支付"
      },
      {
        prop: "registerMode",
        label: "支付类型",
        html: (row, val) => getListHtml(registerModeList, val)
      },
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
      {
        prop: "salesmanNames",
        label: "销售"
      },
      {
        prop: "operatorName",
        label: "操作人"
      },
      {
        prop: "createdAt",
        label: "操作时间"
      },
      {
        prop: "action",
        label: "操作",
        actives: [
          {
            perCode: "a0803a",
            name: "详情",
            method: val => {
              console.log(val, "详情");
              router.push({
                path: "/overall/packageOrderDetails",
                query: { id: val.id }
              });
            }
          }
        ]
      }
    ]);

    return {
      ...toRefs(state),
      config,
      itemList,
      TableList,
      button,
      getList,
      column
    };
  }
};
</script>

<style lang="scss" scoped></style>
