<!--
 * @Author: zx
 * @Date: 2021-09-02 14:05:19
 * @LastEditors: zx
 * @LastEditTime: 2021-11-19 14:18:08
 * @Descripttion:
-->
<template>
  <emptyBox bottom="70">
    <formList
      :formInitData="formInitData"
      :itemList="itemList"
      @buttonClick="buttonClick"
      :config="config"
      :clearList="clearList"
      :formState="formState"
      @formChange="formChange"
    />
  </emptyBox>
</template>

<script>
/*
 * add组件说明
 * 新增编辑 学期
 *
 * */
import formList from "@/components/FormList/index";
import { toRefs, ref, reactive, computed } from "vue";
import { itemList } from "./itemList";
import { useRoute, useRouter } from "vue-router";
import {
  schoolSemesterPost,
  schoolSemesterPut,
  semesterDetail,
  semesterForUsedPut
} from "@/api/semester";
import { addFormBottom, addFormConfig } from "@/utils/config";
import { schooldetail, templatedetail } from "@/api/headquarters";
import { ElMessage, ElMessageBox } from "element-plus";
import emptyBox from "@/components/emptyBox";
import store from "@/store";

export default {
  components: {
    formList,
    emptyBox
  },
  porps: [],
  setup() {
    const router = useRouter();
    const state = reactive({
      selectTemp1: "",
      selectTemp2: "",
      formInitData: {},
      clearList: [],
      formState: [],
      config: {
        ...addFormBottom,
        countList: ["registrationFee-quarterage-mealMoney-earnest=tuition"],
        watchList: ["isContainQuarterage", "mealStatus", "registerMode"]
      },
      itemList: [...itemList],
      edit: false,
      tuitionchangeList: [
        "registrationFee",
        "quarterage",
        "mealMoney",
        "earnest"
      ],
      tuitionList: ["quarterage", "mealMoney", "earnest"],
      formChange: val => {
        state.formInitData[val.code] = val.value;
        if (
          val.code == "selectTemp1" &&
          state.selectTemp1 != val.value &&
          val.value
        ) {
          state.selectTemp1 = val.value;
          templatedetail({ id: val.value }).then(({ code, data }) => {
            if (code == 200) {
              let _parData = data;
              _parData.registrationFee = _parData.tuition;
              _parData.tuition = _parData;
              state.formInitData = data;
              state.clearList = ["selectTemp2"];
            }
          });
        }
        if (
          val.code == "selectTemp2" &&
          state.selectTemp2 != val.value &&
          val.value
        ) {
          state.selectTemp2 = val.value;
          templatedetail({ id: val.value }).then(({ code, data }) => {
            if (code == 200) {
              let _parData = data;
              _parData.registrationFee = _parData.tuition;
              // _parData.tuition=0;
              state.formInitData = data;
              state.clearList = ["selectTemp1"];
            }
          });
        }
        // // 学费的计算
        // if (state.tuitionchangeList.includes(val.code)) {
        //   let total = 0;
        //   state.tuitionList.forEach(key => {
        //     total += Number(state.formInitData[key] || 0);
        //   });
        //   let midObj = { ...state.formInitData };
        //   if (Number(state.formInitData.registrationFee) - total <= 0) {
        //     ElMessage.error("报名费低于住宿费+餐费+定金的总和");
        //   }
        //   midObj.tuition = (
        //     Number(state.formInitData.registrationFee) - total
        //   ).toFixed(2);
        //   console.log(midObj, "midObj");
        //   state.formInitData = midObj;
        // }
      }
    });
    // 初始化
    const start = () => {
      const id = useRoute().query.id;
      if (id) {
        state.edit = true;
        state.itemList.shift();
        state.itemList.shift();
        semesterDetail({ id }).then(({ code, data }) => {
          if (code == 200) {
            state.formInitData = data;
            let { used } = data;
            console.log("used", used);
            let disabledList = [
              // "salesmanIds",
              "datess",
              "register",
              "registrationFee",
              "tuition",
              "isContainQuarterage",
              "quarterage",
              "mealStatus",
              "mealMoney",
              "registerMode",
              "payOnline",
              "earnest",
              "payOnline",
              "deposit"
            ];
            let itemObj={}
            itemList.map(item=>{
              itemObj[item.code]=item
            })
            let formState = disabledList.map(v => ({
              code: v,
              required: itemObj[v].required==undefined? !used:itemObj[v].required,
              disabled: used
            }));
            formState.push({
              code: "semesterCategoryId",
              show: !used
            });
            formState.push({
              code: "semesterCategoryName",
              show: used
            });
            formState.push({
              code: "salesmanIds",
              disabled: used,
              required: false
            });
            state.formState = formState;
            if (used) {
              state.formState.push({
                code: "number",
                minCode: data.number - 1
              });
            }
          }
        });
      } else {
        schooldetail({ id: store.getters.activeSchoolId }).then(res => {
          let { provinceId, cityId, address } = res.data;
          state.formInitData = { provinceId, cityId, address };
        });
        state.edit = false;
      }
    };
    const buttonClick = val => {
      if (val.name == "cancel") {
        router.back();
      }
      if (val.name == "confirm" && val.valid) {
        let data = val.value;
        // 如果报名方式 为全款的时候  支付方式只能是 线上
        if (data.registerMode == 20) {
          data.payOnline = 2;
        }
        if (state.edit) {
          let { used = false } = val.value;
          if (used) {
            semesterForUsedPut(data).then(res => {
              ElMessage.success("编辑成功");
              router.back();
            });
          } else {
            schoolSemesterPut(data).then(res => {
              ElMessage.success("编辑成功");
              router.back();
            });
          }
        } else {
          schoolSemesterPost(data).then(res => {
            ElMessage.success("新加成功");
            router.back();
          });
        }
      }
    };
    start();
    return {
      buttonClick,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped>
.commonAdd {
  height: 100%;
  padding: 30px;
  padding-bottom: 60px;
  overflow: hidden;
  box-sizing: border-box;
  .commonAddIn {
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
  }
}
</style>
