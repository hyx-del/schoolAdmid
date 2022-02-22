<!--
 * @Author: 刘帝君
 * @Date: 2021-09-23 10:04:35
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-01 14:23:12
 * @Descripttion: 新增报名
-->
<template>
  <emptyBox bottom="70">
    <h3>新增报名</h3>
    <formList
      :config="config"
      :itemList="itemList"
      :formInitData="formInitData"
      @buttonClick="button"
      @formChange="formChange"
    >
    </formList>
  </emptyBox>
</template>

<script>
import { toRefs, ref, reactive } from "vue";
import emptyBox from "@/components/emptyBox/index.vue";
import formList from "@/components/FormList/index.vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { addFormBottom } from "@/utils/config";
import {
  enrollAdd,
  comprehensiveCurriculumList
} from "@/api/coursesManagement";
import { couponManagementList, discountManagementList } from "@/api/discount";
import { staffGetSaleStaffList } from "@/api/managerStaff";
import { findMobile } from "@/api/studentSemester";

export default {
  components: {
    formList,
    emptyBox
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      config: { ...addFormBottom, watchList: ["staffType"] },
      formInitData: {
        isMealStatus: -1,
        isQuarterage: 0
      },
      itemList: [
        {
          type: "phone",
          code: "contact",
          label: "手机号",
          maxlength: 11,
          tips: "填写手机号查询用户信息"
        },
        {
          code: "name",
          label: "学员姓名",
          maxlength: 60
        },
        {
          code: "englishName",
          label: "英文名",
          type: "letter",
          type: "en",
          required: false
        },
        {
          el: "select",
          code: "mainCourseId",
          label: "报名套餐",
          fun: comprehensiveCurriculumList,
          funMode: "table",
          filterable: true,
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          // query: { status: 1 },
          labelCode: "name", // 指定的label名
          valueCode: "id" // 指定的value名
        },
        {
          el: "select",
          code: "discountPercentIds",
          label: "折扣",
          fun: discountManagementList,
          funMode: "table",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { enabled: true },
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          multiple: true,
          required: false
        },
        {
          el: "select",
          code: "discountCashId",
          label: "优惠",
          filterable: true,
          fun: couponManagementList,
          funMode: "table",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { enable: 1 },
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          required: false
        },
        {
          el: "select",
          code: "salesmanId",
          label: "销售",
          filterable: true,
          fun: staffGetSaleStaffList,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          multiple: true,
          required: false,
          filterable: true // 可搜索
        },
        {
          el: "radio",
          code: "gender",
          label: "性别",
          allSelectCode: "radio_label",
          list: [
            {
              label: "男",
              value: 1
            },
            {
              label: "女",
              value: 2
            }
          ]
        },
        {
          code: "idCard",
          label: "身份证号",
          // type: "identity",
          required: false,
          checkFun: "idcard"
        },
        {
          el: "img",
          code: "front",
          label: "身份证照片正面",
          required: false,
          size: 1024,
          limit: 1
        },
        {
          el: "img",
          code: "reverse",
          label: "身份证照片反面",
          required: false,
          size: 1024,
          limit: 1
        },
        {
          code: "address",
          label: "家庭住址",
          placeholder: "请输入家庭地址",
          required: false
        },
        {
          code: "emergencyContact",
          type: "phones",
          label: "紧急联系人电话",
          placeholder: "请输入紧急联系人电话",
          required: false,
          maxlength: 11
        },
        {
          el: "textArea",
          code: "remarks",
          label: "备注",
          required: false,
          maxlength: 120
        }
      ],
      button: val => {
        switch (val.text) {
          case "确认":
            const { front, reverse } = val.value;
            if (front !== "") {
              let idCardImages = {
                front,
                reverse
              };
              val.value.idCardImages = idCardImages;
            }
            console.log(val.value, "这是按钮");
            enrollAdd({ ...val.value }).then(res => {
              const { code } = res;
              console.log(res.data, "这是数据");
              if (code == 200) {
                ElMessage.success("操作成功");
                router.push({ path: "/overall/packageRegistration" });
              }
            });
            break;
          case "取消":
            router.back();
            break;
          default:
            break;
        }
      },
      formChange: val => {
        if (val.code == "contact" && val.value) {
          findMobile({ mobile: val.value }).then(res => {
            if (res.data) {
              ElMessage.success(`查询成功`);
              let info = res.data;
              info.front = res.data.idCardImages.front; //身份证正面
              info.reverse = res.data.idCardImages.reverse; //身份证反面
              info.address = "";
              state.formInitData = info;
            } else {
              ElMessage.warning(`手机号不存在`);
              state.formInitData = {
                name: "",
                englishName: "",
                gender: "",
                idCard: "",
                front: "",
                reverse: "",
                isMealStatus: -1,
                isQuarterage: 0
              };
            }
          });
        }
      }
    });
    return {
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped></style>
