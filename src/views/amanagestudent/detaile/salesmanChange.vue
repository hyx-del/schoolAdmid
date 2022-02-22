<!--
 * @Author: 郑晶
 * @Date: 2021-10-13 14:05:47
 * @LastEditors: 郑晶
 * @LastEditTime: 2021-11-09 11:50:05
 * @Descripttion: 学员管理-学员详情-销售修改记录
-->
<template>
  <div>
    <formList
      :config="tabelFormConfigs"
      :itemList="itemListSales"
      :formInitData="formInitDatas"
      @buttonClick="buttonSales"
    >
    </formList>
    <Table
      ref="salesTable"
      :loadData="getListSales"
      :column="columnSales"
      :params="formInitDatas"
      :showSortIndex="{ show: true, lable: '序号' }"
    />
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  computed,
  ref
} from "vue";
import { addFormConfig } from "../../../utils/config";
import { salesModificationList } from "@/api/school";
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    formList,
    Table
  },
  name: "basicInfo",
  setup() {
    const salesTable = ref(null);
    // 学员id
    const id = useRoute().query.id;
    const state = reactive({
      //选项卡默认
      activeName: "first",
      formInitData: {},
      formInitDatas: {
        studentId: id
      },
      tabelFormConfigs: {
        allRequired: false, // 是否全部必填
        inline: true, //行内
        colon: "",
        inputStyle: {
          width: "230px"
        },
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "查 询",
            size: "small"
          }
        ]
      },
      columnSales: [
        // { prop: "id", label: "序号", width: "80" },
        { prop: "oldSalesmanName", label: "更换前销售" },
        { prop: "newSalesmanName", label: "更换后销售" },
        {
          prop: "operatorName",
          label: "操作人",
          html: (row, val) => val || "系统（超时释放）"
        },
        { prop: "createdAt", label: "操作时间" }
      ],
      itemListSales: [
        {
          code: "keyword",
          label: "",
          placeholder: "搜索销售名"
        }
      ]
    });
    // 页面载入后
    onMounted(() => {});
    //表单确定按钮
    const buttonSales = val => {
      salesTable.value.update({ ...val.value });
    };
    const getListSales = computed(() => {
      return salesModificationList;
    });
    return {
      ...toRefs(state),
      addFormConfig,
      buttonSales,
      getListSales,
      salesTable
    };
  }
});
</script>
