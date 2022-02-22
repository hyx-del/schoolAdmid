<!--
 * @Author: 郑晶
 * @Date: 2021-09-02 16:38:58
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-02 13:10:02
 * @Descripttion:
-->
<template>
  <emptyBox bottom="70">
    <formList
      :config="addFormBottom"
      :itemList="itemList"
      :formInitData="formInitData"
      @buttonClick="button"
      @formChange="formChange"
    >
    </formList>
  </emptyBox>
</template>

<script>
import { toRefs, reactive, watch } from "vue";
import formList from "@/components/FormList/index.vue";
import {
  courseDetail,
  getSourceList,
  getTopHeaderSchoolList,
  addStudent
} from "@/api/school";
import { dictType } from "@/api/dict";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { addFormBottom, addFormConfig } from "../../utils/config";
import store from "@/store";
import {
  genderList,
  studentStatusList,
  degreesList,
  practiceBaseList,
  studyIntentionList
} from "@/utils/enum/select";
import { staffGetSaleStaffList } from "@/api/managerStaff";
import emptyBox from "@/components/emptyBox";

export default {
  components: {
    formList,
    emptyBox
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      formInitData: {},
      itemList: [
        {
          code: "name",
          maxlength: 60,
          label: "姓名"
        },
        {
          code: "englishName",
          required: false,
          maxlength: 60,
          label: "英文名",
          type: "letter"
        },
        {
          code: "mobile",
          type: "phone",
          maxlength: 11,
          label: "电话"
        },
        {
          code: "wechatId",
          maxlength: 60,
          label: "微信号",
          required: false
        },
        {
          code: "email",
          maxlength: 60,
          label: "邮箱",
          required: false,
          type: "email"
        },
        {
          el: "radio",
          code: "gender",
          label: "性别",
          list: genderList
        },
        {
          el: "img",
          code: "avatar",
          label: "头像",
          size: 2048,
          limit: 1,
          required: false
        },
        {
          el: "area",
          code: "address",
          label: "地址",
          areaCode: "province,provinceId,city,cityId,area,areaId"
        },
        {
          el: "select",
          code: "status",
          label: "状态",
          list: studentStatusList
        },
        {
          el: "select",
          code: "degree",
          label: "注册等级",
          list: degreesList
        },
        {
          el: "select",
          code: "sourceIds",
          label: "来源渠道",
          fun: getSourceList,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          multiple: true,
          backType: "ArrayStringNumber"
        },
        {
          el: "select",
          code: "genreNew",
          label: "注册派别",
          fun: dictType,
          funMode: "one",
          otherBack: "genre", // label的返回值
          back: true, // 从后台返回结果
          query: { type: "reg_clique" },
          multiple: true,
          required: false,
          backType: "ArrayStringNumber"
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
          code: "studyGoalIds",
          label: "学习目的",
          fun: dictType,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { type: "study_goal" },
          multiple: true,
          required: false,
          backType: "ArrayStringNumber"
        },
        {
          el: "select",
          code: "consultSchoolIds",
          label: "咨询校区",
          fun: getTopHeaderSchoolList,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          multiple: true,
          backType: "ArrayStringNumber"
        },
        {
          el: "select",
          code: "practiceBaseStatus",
          label: "练习基础",
          list: practiceBaseList,
          required: false
        },
        {
          el: "select",
          code: "consultCourseIds",
          label: "咨询课程",
          fun: dictType,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回果
          query: { type: "consulting_course" },
          multiple: true,
          required: false,
          backType: "ArrayStringNumber"
        },
        {
          el: "select",
          code: "studyIntentionStatus",
          label: "学习意向",
          list: studyIntentionList,
          required: false
        },
        {
          el: "select",
          code: "studentPositionIds",
          label: "学员身份",
          fun: dictType,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { type: "student_position" },
          multiple: true,
          required: false,
          backType: "ArrayStringNumber"
        },
        {
          el: "select",
          code: "resourceTypeId",
          label: "资源类型",
          fun: dictType,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { type: "resource_type" },
          required: false
        },
        {
          code: "company",
          maxlength: 60,
          label: "工作单位",
          required: false
        },
        {
          code: "weights",
          maxlength: 60,
          lessCode: 1,
          type: "number",
          label: "权重",
          required: false
        },
        {
          code: "introduction",
          el: "textArea",
          maxlength: 255,
          label: "描述",
          required: false
        },
        {
          code: "remark",
          el: "textArea",
          maxlength: 255,
          label: "备注",
          required: false
        }
      ]
    });
    setTimeout(() => {
      state.formInitData = {
        consultSchoolIds: [store.getters.activeSchoolId + ""]
      };
      console.log([store.getters.activeSchoolId + ""], "123");
    }, 1000);
    const id = useRoute().query.id;

    if (id) {
      courseDetail({ id }).then(({ code, data }) => {
        if (code == 200) {
          state.formInitData = data;
        }
      });
    }

    const formChange = val => {
      console.log(val, "val");
      let arr = [...state.itemList];
      if (val.code == "wechatId" && val.value) {
        arr[3].required = true;
        arr[2].required = false;
        state.itemList = arr;
      } else if (val.code == "mobile" && val.value) {
        arr[2].required = true;
        arr[3].required = false;
        state.itemList = arr;
      }
    };

    const button = val => {
      console.log(val, "这是拗口");
      switch (val.text) {
        case "确认":
          addStudent(val.value).then(({ code, msg }) => {
            ElMessage({
              message: `操作${code === 200 ? "成功" : "失败"}`,
              duration: 1000,
              type: "success",
              onClose: () => code === 200 && router.back()
            });
          });
          break;
        case "取消":
          router.back();
          break;
        default:
          break;
      }
    };
    return {
      // itemList,
      addFormBottom,
      button,
      formChange,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped></style>
