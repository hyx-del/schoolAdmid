<!--
 * @Author: 郑晶
 * @Date: 2021-10-13 14:05:47
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-25 09:46:39
 * @Descripttion: 学员管理-学员详情-线索记录
-->
<template>
  <div>
    <formList
      :config="tabelFormConfigs"
      :itemList="itemListClueRecord"
      :formInitData="formInitDatas"
      @buttonClick="buttonClueRecord"
    >
    </formList>
    <Table
      ref="clueRecordTable"
      :loadData="getListClue"
      :column="columnClue"
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
import { studentClueList, getTopHeaderSchoolList } from "@/api/school";
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
    const clueRecordTable = ref(null);
    // 学员id
    const id = useRoute().query.id;
    const state = reactive({
      //选项卡默认
      activeName: "first",
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
      itemListClueRecord: [
        {
          el: "select",
          code: "schoolId",
          label: "学校",
          fun: getTopHeaderSchoolList,
          funMode: "one",
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          multiple: false,
          required: false
        }
      ],
      columnClue: [
        // { prop: "id", label: "序号", width: "80" },
        { prop: "schoolName", label: "学校名称" },
        { prop: "name", label: "姓名" },
        { prop: "source", label: "线索渠道" },
        { prop: "pushTime", label: "推送时间" },
        { prop: "createdAt", label: "记录创建时间" }
      ]
    });
    // 页面载入后
    onMounted(() => {});
    const buttonClueRecord = val => {
      val.value.schoolName = val.value.schoolIdlabel;
      clueRecordTable.value.update({ ...val.value });
    };
    const getListClue = computed(() => {
      return studentClueList;
    });
    return {
      ...toRefs(state),
      addFormConfig,
      buttonClueRecord,
      clueRecordTable,
      getListClue
    };
  }
});
</script>
