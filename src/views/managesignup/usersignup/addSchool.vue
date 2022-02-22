<!--
 * @Author: aa
 * @Date: 2021-08-30 14:04:55
 * @LastEditors: zx
 * @LastEditTime: 2021-10-29 17:58:44
 * @Descripttion:
-->
<template>
  <div>
    <h3>新增报名</h3>
    <emptyBox bottom="70">
      <formList
        :config="config"
        :itemList="itemList"
        :formInitData="formInitData"
        @buttonClick="button"
        @formChange="formChange"
      />
    </emptyBox>
  </div>
</template>

<script>
import { toRefs, ref, reactive } from "vue";
import formList from "@/components/FormList/index.vue";
import { addschool, schooldetail, editschool } from "@/api/headquarters";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { addFormBottom, addFormConfig } from "../../../utils/config";
import { ContainList, genderList, mealStatusList } from "@/utils/enum/select";
import { staffGetSaleStaffList } from "@/api/managerStaff";
import {semesterDetail, semesterListBySchoolId} from "@/api/semester";
import {
  findMobile,
  schoolRegistrationPost,
  semesterOptions
} from "@/api/studentSemester";
import { couponManagementList, discountManagementList } from "@/api/discount";
import emptyBox from "@/components/emptyBox";
export default {
  components: {
    formList,
    emptyBox
  },
  setup() {
    const router = useRouter();
    const itemList = [
      {
        code: "mobile",
        label: "手机号",
        maxlength: 11,
        type: "phone",
        tips: "填写手机号查询用户信息"
      },
      {
        code: "studentName",
        label: "学员名",
        // type: "zh",
        defaltValueSort: "name"
      },
      {
        code: "studentNameEn",
        label: "英文名",
        // type: "en",
        required: false,
        defaltValueSort: "englishName"
      },
      {
        el: "select",
        code: "semesterId",
        label: "学期",
        fun: semesterOptions,
        funMode: "one",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id", // 指定的value名
        filterable: true,// 可搜索
        valueChange:async (val, obj) =>{
          let res=await semesterDetail({id:val})
          console.log(res)
          let info=res.data
          let changeFormObj={}
          let list=[]
          if (info) {
            changeFormObj ={
              isQuarterage:info.isContainQuarterage==0?'0':undefined,
              isMealStatus:info.mealStatus==-1?'-1':undefined,
            }
            list= [{
              code:'isQuarterage',
              disabled:info.isContainQuarterage==0?true:false,
            },{
              code:'isMealStatus',
              disabled:info.mealStatus==-1?true:false,
            }]
          }
          return  {
            formObj:null,//null不整体改变任何值
            changeFormObj, //改变表单某些值
            // 没有值就清空表单，mobile是需要保留的值
            reset: false,
            // list对表单内某些元素禁用或者显示隐藏
            list
          };

        }
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
        el: "radio",
        code: "isQuarterage",
        label: "是否提供住宿",
        list: ContainList,
        required: false,
        defalt: "1"
      },
      {
        el: "radio",
        code: "isMealStatus",
        label: "是否供餐",
        list: mealStatusList,
        required: false,
        defalt: "1"
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
        filterable: true, // 可搜索
        multiple: true // 多选
      },
      {
        el: "radio",
        code: "gender",
        label: "性别",
        list: genderList,
        defalt: "2"
      },
      {
        code: "idcard",
        label: "身份证号",
        required: false,
        checkFun: "idcard",
        defaltValueSort: "idCard",
        maxlength: 18
      },
      {
        el: "img",
        code: "idCardImagesFront",
        label: "身份证正面照片",
        size: 1024,
        limit: 1,
        required: false,
        defalt: "school/fcard.png"
      },
      {
        el: "img",
        code: "idCardImagesReverse",
        label: "身份证反面照片",
        size: 1024,
        limit: 1,
        required: false,
        defalt: "school/bcard.png"
      },
      {
        el: "textArea",
        code: "address",
        label: "家庭住址",
        required: false,
        maxlength: 80,
        // defaltValueSort: "mergerRegion"
      },
      {
        code: "emergencyContact",
        label: "紧急联系人电话",
        type: "phone",
        maxlength: 11,
        required: false,
        defaltValueSort: "emergencyContact"
      },
      {
        el: "textArea",
        code: "remark",
        label: "备注",
        required: false
      }
    ];
    const id = useRoute().query.id;
    const state = reactive({
      config: { ...addFormBottom },
      formInitData: {},
      formChange: val => {
        if (val.code == "mobile" && val.value) {
          findMobile({ mobile: val.value }).then(res => {
            if (res.data) {
              ElMessage.success(`查询成功`);
              let info = res.data;
              info.studentName = res.data.name;
              info.studentId = res.data.id;
              info.idCardImagesReverse = info.idCardImages.reverse || "";
              info.idCardImagesFront = info.idCardImages.front || "";
              state.formInitData = info;

            } else {
              state.formInitData = {
                studentName: "",
                studentId: "",
                gender: "1"
              };
            }
          });
        }
      }
    });
    if (id) {
      schooldetail({ id }).then(res => {
        const { code, data } = res;
        if (code == 200) {
          data.pictures = JSON.parse(data.pictures);
          data.area = [data.provinceId, data.cityId];
          state.formInitData = data;
        }
      });
    }
    const button = val => {
      if (val.name == "confirm") {
        let data = { ...val.value };
        let obj = {
          reverse: val.value.idCardImagesReverse || "",
          front: val.value.idCardImagesFront || ""
        };
        data.idCardImages = JSON.stringify(obj);
        schoolRegistrationPost(data).then(res => {
          const { code } = res;
          if (code == 200) {
            ElMessage.success("操作成功");
            router.go(-1);
          }
        });
      }else{
        router.go(-1);
      }
    };
    return {
      itemList,
      button,
      addFormConfig,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped></style>
