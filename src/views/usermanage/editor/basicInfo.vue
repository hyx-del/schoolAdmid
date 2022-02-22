<!--
 * @Author: 郑晶
 * @Date: 2021-10-13 14:05:47
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-24 14:53:03
 * @Descripttion: 学员管理-学员详情-基本信息
-->
<template>
  <emptyBox bottom="50" :style="{ paddingBottom: '46px' }">
    <formList
      :config="{ ...addFormConfig, allDisabled: Boolean(isDetails == '1') }"
      :itemList="itemList"
      :formInitData="formInitData"
      @buttonClick="button"
    />
  </emptyBox>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  genderList,
  studentStatusList,
  degreesList,
  practiceBaseList,
  studyIntentionList
} from "@/utils/enum/select";
import {
  studentDetail,
  getSourceList,
  getTopHeaderSchoolList,
  studentEdit
} from "@/api/school";
import { dictType } from "@/api/dict";
import formList from "@/components/FormList/index.vue";
import { staffGetSaleStaffList } from "@/api/managerStaff";
import store from "@/store";
import emptyBox from "@/components/emptyBox";
export default defineComponent({
  components: {
    formList,
    emptyBox
  },
  name: "basicInfo",
  setup(props) {
    const router = useRouter();
    const state = reactive({
      //选项卡默认
      activeName: "first",
      isDetails: useRoute().query.isDetails,
      // 按钮权限
      btnPermissions: "s0601d",
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
          label: "英文名"
        },
        {
          code: "mobile",
          type: "phone",
          maxlength: 11,
          label: "电话",
          disabled: true
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
          required: false
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
          required: false,
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
          code: "resourceStatus",
          maxlength: 60,
          label: "资源状态",
          required: false,
          disabled: true,
          placeholder: " "
        },
        {
          code: "followTime",
          maxlength: 60,
          label: "跟进时间",
          required: false,
          disabled: true,
          placeholder: " "
        },
        {
          code: "operatorName",
          maxlength: 60,
          label: "注册人",
          required: false,
          disabled: true,
          placeholder: " "
        },
        {
          code: "distributeStatus",
          maxlength: 60,
          label: "分配状态",
          required: false,
          disabled: true,
          placeholder: " "
        },
        {
          code: "expectedStartTime",
          maxlength: 60,
          label: "意向开始时间",
          required: false,
          disabled: true,
          placeholder: " "
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
    // 页面载入后
    onMounted(() => {
      const id = useRoute().query.id;
      // 回显
      id &&
        studentDetail({ id }).then(({ code, data }) => {
          if (code == 200) {
            // 格式化地址
            // data.mergerRegion = data.mergerRegion
            //   .split(",")
            //   .map(val => Number(val));
            data.genreNew = JSON.stringify(JSON.parse(data.genreNew));
            state.formInitData = data;
          }
        });
    });
    const button = val => {
      switch (val.text) {
        case "确认":
          studentEdit(val.value).then(({ code }) => {
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
    const addFormConfig = {
      inline: false, //行内
      allRequired: true, // 是否全部必填
      colon: "：",
      inputStyle: {
        width: "360px"
      },
      buttonStyle: {
        position: "absolute",
        bottom: "0px",
        marginBottom: "0",
        left: "0px"
      },
      buttons:
        useRoute().query.isDetails === "2"
          ? [
              {
                funType: "cancel",
                type: null,
                name: "取消",
                size: "small"
              },
              {
                funType: "confirm",
                type: "primary",
                name: "确认",
                size: "small",
                perCode: "s0601d"
              }
            ]
          : []
    };
    return {
      ...toRefs(state),
      addFormConfig,
      button
    };
  }
});
</script>
