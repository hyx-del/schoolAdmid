<!--
 * @Author: jiu yin
 * @Date: 2021-09-02 17:55:45
 * @LastEditTime: 2021-10-29 17:58:54
 * @LastEditors: zx
 * @Description: 666
 * @FilePath: \school_admin\src\views\managesignup\usersignup\detaile\index.vue
 *  “jiu”
-->
<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="报名表单" name="first">
        <div class="applyInfo">
          <div class="left">
            <h2>报名信息</h2>
            <emptyBox bottom="30">
              <formList
                :config="tabelFormConfigs"
                :itemList="itemListDetaleInfo"
                :formInitData="applyData"
                :formState="formState"
                @buttonClick="buttonInfo"
                @formChange="formChangeConfigs"
              >
                <template #changeSalesman>
                  <el-button
                    class="changeSalesman"
                    @click="changeSalesman"
                    size="small"
                    type="primary"
                    v-if="isShowButtom('s0201j')"
                    >{{ saleSave ? "保存" : "修改" }}</el-button
                  >
                </template>
              </formList>
            </emptyBox>
          </div>

          <div class="right">
            <h2>优惠</h2>
            <emptyBox bottom="30">
              <formList
                :config="configDiscount"
                :itemList="itemListdiscount"
                :formInitData="formInitdiscount"
                @buttonClick="buttonDiscount"
              />
              <h2>报名费用</h2>
              <v-costInfo :info="info" @update="updateDetail"></v-costInfo>
            </emptyBox>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import formList from "@/components/FormList/index.vue";
import detailShow from "@/components/FormList/detailShow.vue";
import Table from "@/components/Table/index";
import {
  schoolList,
  changestatus,
  templateListSchool
} from "@/api/headquarters";
import {
  registrationDetail,
  getStudentAdjustListAPI,
  getStudentPaymentListAPI,
  getSalesmanChangeListAPI,
  registrationSalemanPut,
  schoolRegistrationPut
} from "@/api/studentSemester";
import vCostInfo from "./costInfo.vue";
import {
  ContainList,
  genderList,
  mealStatusList,
  payChannel,
  payOnlineList2,
  stateList
} from "@/utils/enum/select";
//身份证上传
import UploadImgDrag from "@/components/upload";
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch
} from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import Templatedetail from "@/views/tremtemplate/templatedetail.vue";
import { orderChannel } from "@/utils/enum/select";
import { staffGetSaleStaffList } from "@/api/managerStaff";
import { semesterList, semesterListBySchoolId } from "@/api/semester";
import { backType } from "@/components/FormList/utils";
import { isShowButtom } from "@/utils/permissionsButton";
import emptyBox from "@/components/emptyBox";
import { dictType } from "@/api/dict";

export default defineComponent({
  components: {
    formList,
    Table,
    emptyBox,
    detailShow,
    vCostInfo,
    UploadImgDrag,
    Templatedetail
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    //逻辑层主体
    const state = reactive({
      updateDetail: () => {
        state.getDetail();
      },
      info: {},
      //选项卡默认
      activeName: "first",
      applyData: {},
      // 报名信息
      saleSave: false, // 改变销售
      changeSalesman: () => {
        state.saleSave = !state.saleSave;
        state.formState = [
          {
            code: "salesmanId",
            disabled: state.saleSave ? false : true
          }
        ];
        if (!state.saleSave) {
          let data = {
            id: route.query.id,
            salesmanId: backType(state.applyData.salesmanId, "String")
              ? state.applyData.salesmanId
              : state.applyData.salesmanId.join(",")
          };
          registrationSalemanPut(data).then(res => {
            ElMessage.success("保存成功");
          });
        }
      },
      formState: [],
      formChangeConfigs: val => {
        state.applyData[val.code] = val.value;
      },
      // 优惠信息
      formInitdiscount: {},
      itemListdiscount: [
        {
          code: "earlyBirdDiscount",
          label: "早鸟折扣",
          disabled: true,
          suffix: "折"
        },
        {
          code: "discountCashMoney",
          label: "优惠券抵扣",
          type: "letter",
          disabled: true,
          suffix: "元"
        }
      ],
      buttonDiscount: () => {},
      configDiscount: {
        allRequired: false, // 是否全部必填
        inline: false, //行内
        colon: "",
        inputStyle: {
          width: "200px"
        },
        buttons: []
      },
      getDetail: () => {
        registrationDetail({ id: route.query.id }).then(res => {
          if (res.code == 200) {
            let {
              identity,
              remark,
              salesmanId,
              isMealStatus,
              isQuarterage,
              semesterId,
              semester
            } = res.data;
            let obj = {
              identity,
              remark,
              salesmanId,
              isMealStatus,
              isQuarterage,
              semesterId
            };
            let applyData = { ...res.data.studentDetail, ...obj,semester };
            let { front, reverse } = res.data.studentDetail.idCardImages;
            applyData.remark = res.data.remark;
            applyData.studentSemesterId = res.data.id;
            state.applyData = applyData;
            state.formInitdiscount = res.data;
            // 优惠
            state.itemListdiscount.splice(2, 6);
            let discountPercentList = res.data.discountPercentList.map(
              (item, index) => {
                return {
                  code: "names" + index,
                  label: item.name,
                  disabled: true,
                  suffix: "折",
                  placeholder: item.name
                };
              }
            );
            state.info = res.data;
            state.itemListdiscount = [
              ...state.itemListdiscount,
              ...discountPercentList
            ];
          }
        });
      }
    });
    state.getDetail();
    //报名信息
    const detaleInfos = detaleInfo(state);

    //报名信息格式保存
    const tabelFormConfigs = {
      allRequired: false, // 是否全部必填
      inline: true, //行内
      colon: ":",
      inputStyle: {
        width: "220px"
      },
      buttonStyle: { display: "flex", marginLeft: "9em" },
      buttons: [
        {
          perCode: "s0201n",
          funType: "confirm",
          type: "primary",
          name: "保存",
          size: "small"
        }
      ]
    };
    //表单按钮格式查询
    const tabelFormConfig = {
      allRequired: false, // 是否全部必填
      inline: true, //行内
      colon: ":",
      column: 3,
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

    onMounted(() => {});
    onBeforeUnmount(() => {});
    return {
      ...toRefs(state),
      tabelFormConfig,
      tabelFormConfigs,
      isShowButtom,
      ...detaleInfos
    };
  }
});

//报名信息
const detaleInfo = info => {
  //弹框显示
  const dialogFormVisible = ref(false);
  //表单信息
  const formInitDetaleInfo = reactive(info);
  const itemListDetaleInfo = [
    {
      type: "phone",
      code: "mobile",
      label: "手机号",
      required: true,
      disabled: true
    },
    {
      code: "name",//studentName
      label: "学员姓名",
      type: "zh",
      required: true,
      maxlength:12,
      minlength:2,
      defaltValueSort: "studentName" //取值序列
    },
    {
      code: "englishName",
      label: "英文名",
      type: "letter",
      disabled: true
    },
    {
      el: "select",
      code: "semesterId",
      label: "报名学期",
      required: true,
      disabled: true,
      back: true, // 从后台返回结果
      labelCode: "name", // 指定的label名
      valueCode: "id", // 指定的value名
      fun: semesterListBySchoolId,
      funMode: "table"
    },
    {
      el: "radio",
      code: "isQuarterage",
      label: "是否提供住宿",
      list: ContainList,
      style: { minWidth: "368px" },
      required: true,
      valueChange:(val,obj)=>[
        {
          code:'isQuarterage',
          disabled:obj.semester&&obj.semester.isContainQuarterage==0?true:false
        }
      ]
    },
    {
      el: "radio",
      code: "isMealStatus",
      label: "是否供餐",
      list: mealStatusList,
      style: { minWidth: "368px" },
      required: true,
      valueChange:(val,obj)=>[
        {
          code:'isMealStatus',
          disabled:obj.semester&&obj.semester.mealStatus==-1?true:false
        }
      ]
    },
    {
      el: "radio",
      code: "gender",
      label: "性别",
      // required: true,
      // disabled: true,
      allSelectCode: "radio_label",
      list: genderList,
      style: { minWidth: "368px" }
    },
    {
      el: "select",
      code: "salesmanId",
      label: "销售员",
      fun: staffGetSaleStaffList,
      funMode: "one",
      otherBack: "select_label", // label的返回值
      back: true, // 从后台返回结果
      labelCode: "name", // 指定的label名
      valueCode: "id", // 指定的value名
      filterable: true, // 可搜索
      multiple: true, // 多选
      disabled: true,
      afterSlot: "changeSalesman"
    },
    {
      code: "idCard",
      type: "identity",
      label: "身份证号",
      placeholder: "请输入身份证号",
      maxlength: 18,
      checkFun: "idcard"
    },
    {
      el: "img",
      code: "idCardImagesFront",
      label: "身份证正面照片",
      size: 1024,
      limit: 1,
      defalt: "school/fcard.png",
      style: { minWidth: "452px", width: "100%" },
      setValue: formObj =>  (formObj.idCardImages && formObj.idCardImages.front),
    },
    {
      el: "img",
      code: "idCardImagesReverse",
      label: "身份证反面照片",
      size: 1024,
      limit: 1,
      style: { minWidth: "452px", width: "100%" },
      setValue: formObj =>  (formObj.idCardImages && formObj.idCardImages.reverse),
      getValue:(formObj,value)=>({idCardImages:JSON.stringify( {reverse:value.toString(),front:formObj.idCardImagesFront.toString()})})
    },
    {
      code: "emergencyContact",
      // type: "phones",
      label: "紧急联系人电话",
      placeholder: "请输入紧急联系人电话",
      disabled: true
    },
    {
      code: "address",
      label: "家庭住址",
      placeholder: "没有录入家庭住址",
      disabled: true,
      setValue: formObj =>  (formObj.semester && formObj.semester.address),
    },
    { el: "textArea", code: "remark", label: "备注" }
  ];
  //销售弹框数据
  const options = reactive([]);

  //数据
  const getStudentAdjustList = computed(() => {
    return getStudentAdjustListAPI;
  });
  //报名信息保存
  const buttonInfo = val => {
    if (val.name == "confirm" && val.valid) {
      let data = { ...val.value };
      schoolRegistrationPut(data).then(res => {
        ElMessage.success("保存成功");
      });
    }
  };
  return {
    formInitDetaleInfo,
    itemListDetaleInfo,
    getStudentAdjustList,
    buttonInfo,
    dialogFormVisible,
    options
  };
};

//付款记录
const payment = State => {
  const paymentTable = ref(null);
  const formInitPayment = reactive({});
  const itemListPayment = [
    {
      label: "支付方式",
      el: "select",
      fun: dictType,
      back: true,
      code: "channel",
      funMode: "one",
      otherBack: "select_label", // label的返回值
      query: { type: "pay_type", useFlag: 1 },
      placeholder: "支付方式"
    },
    {
      label: "支付类型",
      el: "select",
      list: payOnlineList2,
      code: "type",
      placeholder: "支付类型"
    },

    {
      label: "状态",
      el: "select",
      list: [
        { value: "0", label: "未支付" },
        { value: "8", label: "支付中" },
        { value: "10", label: "支付成功" },
        { value: "-10", label: "支付失败" }
      ],
      code: "status",
      placeholder: "状态"
    },
    {
      label: "下单渠道",
      el: "select",
      list: orderChannel,
      code: "platform",
      placeholder: "类别"
    }
  ];
  //表单确定按钮
  const buttonPayment = val => {
    if (val.name == "confirm") {
      paymentTable.value.update({
        channel: val.value.channel,
        platform: val.value.platform,
        status: val.value.status,
        type: val.value.type
      });
    }
  };

  //count或book.name改变了
  // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
  const getStudentPaymentList = computed(() => {
    return getStudentPaymentListAPI;
  });

  return {
    formInitPayment,
    itemListPayment,
    buttonPayment,
    getStudentPaymentList,
    paymentTable,
    columnpayment
  };
};
</script>
<style lang="scss" scoped>
@media screen and (max-width: 1660px) {
  .left {
    min-width: 450px;
    max-width: 450px;
  }
  .right {
    min-width: 760px;
    max-width: 760px;
    padding-left: 10px;
    flex: 1;
  }
  .box {
    max-width: 640px;
    max-width: 640px;
  }
}
@media screen and (min-width: 1660px) {
  .right {
    flex: 1;
    min-width: 760px;
    max-width: 760px;
    padding-left: 40px;
  }
  .box {
    max-width: 720px;
    max-width: 720px;
  }
}
.applyInfo {
  display: flex;
  justify-content: space-between;
  .left {
    // flex: 1.2;
    border-right: 2px solid #ccc;
    padding-right: 40px;
    .stay {
      max-height: 24px;
      display: flex;
      max-width: 232px;
      margin-top: 6px;
    }
    .identity {
      min-width: 181px;
    }
    .identityImg {
      min-width: 308px;
    }
    .description {
      min-width: 260px;
    }
    .dialogBody {
      display: flex;
      min-width: 280px;
      line-height: 40px;
      .el-select {
        width: 80%;
      }
    }
  }
}
.changeSalesman {
  position: absolute;
  right: -63px;
  top: 5px;
  z-index: 1000;
}
</style>
