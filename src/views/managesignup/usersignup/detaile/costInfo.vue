<!--
 * @Author: jiu yin
 * @Date: 2021-09-06 11:36:36
 * @LastEditTime: 2021-11-03 13:44:31
 * @LastEditors: 刘帝君
 * @Description: 666
 * @FilePath: \school_admin\src\views\managesignup\usersignup\detaile\costInfo.vue
 *  “jiu”
-->
<template>
  <div class="box">
    <formList
      :config="configCost"
      :itemList="itemListCost"
      :formInitData="formDetail"
      @buttonClick="buttonCost"
      @formChange="formChangeCost"
    >
      <template #slotCost>
        <!--        优惠-->
        <span class="slotCostP"
          >总优惠：{{
            (formDetail.originalAmount - formDetail.totalAmount || 0).toFixed(
              2
            ) || 0
          }}</span
        >
      </template>
      <template #slotCost1>
        <!--        培训费-->
        <el-button
          class="slotCostBut"
          type="primary"
          size="mini"
          v-if="isShowButtom('s0201k')"
          @click="adjust(1, formDetail.tuition)"
          >调整</el-button
        >
        <span class="slotCostP">已付：{{ formDetail.tuitionPaid || 0 }}</span>
        <span class="slotCostP"
          >待付：{{
            (formDetail.tuition - formDetail.tuitionPaid || 0).toFixed(2)
          }}</span
        >
        <span class="slotCostP">退款：{{ formDetail.tuitionRefund || 0 }}</span>
      </template>
      <template #slotCost2>
        <!--        住宿费-->
        <el-button
          class="slotCostBut"
          type="primary"
          size="mini"
          v-if="isShowButtom('s0201k')"
          @click="adjust(2, formDetail.quarterage)"
          >调整</el-button
        >
        <span class="slotCostP">已付：{{ formDetail.moneyPaid || 0 }}</span>
        <span class="slotCostP"
          >待付：{{
            (formDetail.quarterage - formDetail.moneyPaid || 0).toFixed(2) || 0
          }}</span
        >
        <span class="slotCostP">退款：{{ formDetail.moneyRefund || 0 }}</span>
      </template>
      <!--      餐费-->
      <template #slotCost3>
        <el-button
          class="slotCostBut"
          type="primary"
          size="mini"
          v-if="isShowButtom('s0201k')"
          @click="adjust(3, formDetail.mealMoney)"
          >调整</el-button
        >
        <span class="slotCostP">已付：{{ formDetail.mealMoneyPaid || 0 }}</span>
        <span class="slotCostP"
          >待付：{{
            (formDetail.mealMoney - formDetail.mealMoneyPaid || 0).toFixed(2) ||
              0
          }}</span
        >
        <span class="slotCostP"
          >退款：{{ formDetail.mealMoneyRefund || 0 }}</span
        >
      </template>
      <template #slotCost4>
        <!--        定金-->
        <el-button
          class="slotCostBut"
          type="primary"
          size="mini"
          v-if="isShowButtom('s0201k')"
          @click="adjust(4, formDetail.earnest)"
          >调整</el-button
        >
        <span class="slotCostP">已付：{{ formDetail.earnestPaid || 0 }}</span>
        <span class="slotCostP"
          >待付：{{
            (formDetail.earnest - formDetail.earnestPaid || 0).toFixed(2) || 0
          }}</span
        >
        <span class="slotCostP">退款：{{ formDetail.earnestRefund || 0 }}</span>
      </template>
      <template #slotCost5>
        <!--        押金-->
        <el-button
          class="slotCostBut"
          type="primary"
          size="mini"
          v-if="isShowButtom('s0201k')"
          @click="adjust(5, formDetail.deposit)"
          >调整</el-button
        >
        <!--        <span class="slotCostP">已付：{{ formDetail.depositPaid || 0 }}</span>-->
        <!--        <span class="slotCostP"-->
        <!--          >待付：{{-->
        <!--            (formDetail.deposit - formDetail.depositPaid || 0).toFixed(2) || 0-->
        <!--          }}</span-->
        <!--        >-->
        <!--        <span class="slotCostP">退款：{{ formDetail.depositRefund || 0 }}</span>-->
      </template>
      <template #slotCost6>
        <!--        总额-->
        <el-button
          class="slotCostBut"
          type="primary"
          size="mini"
          v-if="isShowButtom('s0201m')"
          @click="payment(false)"
          :disabled="!PaidObjAll"
          >退款</el-button
        >
        <!--        储值-->
        <el-button
          class="slotCostBut"
          type="primary"
          size="mini"
          v-if="isShowButtom('s0201p')"
          @click="adjust(6, formDetail.paidAmount)"
          :disabled="!PaidObjAll"
          >储值</el-button
        >
        <span class="slotCostP"
          >已付总额：{{ formDetail.paidAmount || 0 }}</span
        >
        <el-button
          class="slotCostBut"
          type="primary"
          size="mini"
          v-if="isShowButtom('s0201l')"
          :disabled="!noPaidObjAll"
          @click="payment(true)"
          >付款</el-button
        >
        <span class="slotCostP"
          >待付总额：{{
            (formDetail.totalAmount - formDetail.paidAmount || 0).toFixed(2) ||
              0
          }}</span
        >
      </template>
      <template #slotCost7>
        <!--        计入提成-->
        <el-button
          class="slotCostBut"
          type="primary"
          size="mini"
          v-if="isShowButtom('s0201k')"
          @click="adjust(7, formDetail.pushMoney)"
          >调整</el-button
        >
        <span class="slotCostP">已付总额：{{ formDetail.pushMoney || 0 }}</span>
      </template>
    </formList>
    <!-- 调整弹框 -->
    <el-dialog
      v-if="dialogFormVisibles"
      :title="adjustTitle"
      v-model="dialogFormVisibles"
      width="600px"
    >
      <div class="dialogBody">
        <formList
          :config="addFormConfig"
          :itemList="itemListCot"
          :formInitData="formInitData"
          @buttonClick="buttonCot"
        >
        </formList>
      </div>
    </el-dialog>
    <!-- 退款付款弹窗 -->
    <el-dialog
      v-if="paymentVisibles"
      :title="payTitle"
      v-model="paymentVisibles"
      width="1200px"
      top="15px"
    >
      <!-- 复选 -->
      <emptyBox>
        <formList
          ref="fromPay"
          :itemList="payList"
          :formInitData="paymentData"
          :config="payFormConfig"
          @buttonClick="buttonPays"
          @formChange="formChangePay"
          @checkItem="checkItem"
          :form-state="formState"
          :showList="showList"
          :hideList="hideList"
        >
          <template #add>
            <v-form
              :paymentData="paymentData"
              ref="dynamicValidateForm"
            ></v-form>
          </template>
        </formList>
      </emptyBox>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="paymentVisibles = false" size="small"
            >取 消</el-button
          >
          <el-button type="primary" @click="popSubmit" size="small"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  reactive,
  ref,
  getCurrentInstance,
  toRefs,
  watch
} from "vue";
import { ElMessage } from "element-plus";
import formList from "@/components/FormList/index.vue";
import vForm from "./form.vue";
import { addFormConfig } from "@/utils/config";
import { useRouter, useRoute } from "vue-router";
import { payChannel, payOnlineList2 } from "@/utils/enum/select";
import { costAdjustPut, transferBalancePut } from "@/api/studentSemester";
import { paymentApi, refundApi } from "@/api/coursesManagement";
import { orderPaymentPost, orderRefundPost } from "@/api/courseOrder";
import emptyBox from "@/components/emptyBox";
import { isShowButtom } from "@/utils/permissionsButton";
import { dictType } from "@/api/dict";
export default defineComponent({
  components: { formList, vForm, emptyBox },
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  setup(props, { emit }) {
    const fromPay = ref(null);
    const router = useRouter();
    const dynamicValidateForm = ref(null);
    //逻辑层主体
    const state = reactive({
      // 费用调整实体
      configCost: {
        inputStyle: {
          width: "160px"
        },
        buttons: []
      },
      itemListCost: [
        {
          code: "originalAmount",
          label: "原总价",
          disabled: true,
          afterSlot: "slotCost"
        },
        {
          code: "tuition",
          label: "培训费",
          disabled: true,
          afterSlot: "slotCost1"
        },
        {
          code: "quarterage",
          label: "住宿费",
          disabled: true,
          afterSlot: "slotCost2"
        },
        {
          code: "mealMoney",
          label: "餐费",
          disabled: true,
          afterSlot: "slotCost3"
        },
        {
          code: "earnest",
          label: "定金",
          disabled: true,
          afterSlot: "slotCost4"
        },
        {
          code: "deposit",
          label: "押金",
          disabled: true,
          afterSlot: "slotCost5"
        },
        {
          code: "totalAmount",
          label: "总额",
          disabled: true,
          afterSlot: "slotCost6"
        },
        {
          code: "pushMoney",
          label: "计入提成",
          disabled: true,
          afterSlot: "slotCost7"
        }
      ],
      formDetail: {},
      // 未付款项
      noPaidObj: {},
      noPaidObjAll: false,
      // 已付款项
      PaidObj: {},
      PaidObjAll: false,
      buttonCost: () => {},
      formChangeCost: () => {},
      // 插槽里的按钮
      // payType true付款 false退款
      payment: payType => {
        state.payType = payType;
        let par = payType ? state.noPaidObj : state.PaidObj;
        let allState = false;
        let formState = [];
        for (let key in par) {
          if (par[key] > 0) {
            allState = true;
          }
          formState.push({
            code: key,
            show: par[key] > 0
          });
        }
        for (let key in state.countArrObj) {
          state.countArrObj[key].value = 0;
        }
        // 如果有一个大于零就显示弹窗
        if (allState) {
          state.paymentData = {
            combination: [{ id: 0 }],
            ...state.formDetail,
            ...par,
            remark: ""
          };
          state.paymentVisibles = true;
          setTimeout(() => {
            state.formState = formState;
          }, 100);
        }else{
          ElMessage.success('已付完全部款项')
        }
      },
      adjust: (index, num) => {
        let { type, name } = state.adjustType[index];
        state.adjustTitle = name + "调整";
        state.formInitData = {
          ...state.formInitData,
          money: num || 0,
          type,
          newMoney: ""
        };
        state.dialogFormVisibles = true;
      },
      // 费用调整

      //复选框
      checkList: [],
      //付款
      formListRef: {},

      //总数
      countNum: null,
      // 小费用调整弹窗
      adjustTitle: "费用调整",
      adjustType: {
        1: {
          name: "培训费",
          type: "20"
        },
        2: {
          name: "住宿费",
          type: "30"
        },
        3: {
          name: "餐费",
          type: "60"
        },
        4: {
          name: "定金",
          type: "10"
        },
        5: {
          name: "押金",
          type: "40"
        },
        6: {
          name: "储值",
          type: "1000"
        },
        7: {
          name: "计入提成",
          type: "50"
        }
      },
      dialogFormVisibles: false,
      formInitData: {
        studentSemesterId: computed(() => props.info.id)
      },
      itemListCot: [
        {
          label: "原费用",
          code: "money",
          disabled: true,
          required: false
        },
        {
          label: "调整费用",
          code: "newMoney",
          type: "numberPoint3",
        },
        {
          el: "textArea",
          label: "备注",
          code: "remark",
          required: false,
          defalt: ""
        }
      ],
      buttonCot: val => {
        if (val.name == "confirm") {
          if (val.value.type == 1000) {
            let data = val.value;
            data.amount = data.newMoney;
            data.reason = data.remark;
            transferBalancePut(val.value).then(res => {
              ElMessage.success("调整成功");
              state.dialogFormVisibles = false;
              emit("update", true);
            });
          } else {
            costAdjustPut(val.value).then(res => {
              ElMessage.success("调整成功");
              state.dialogFormVisibles = false;
              emit("update", true);
            });
          }
        } else if (val.name == "cancel") {
          state.dialogFormVisibles = false;
        }
      },
      //付款退款 弹窗
      payTitle: computed(() => (state.payType ? "付款" : "退款")),
      payType: false,
      paymentVisibles: false,
      payFormConfig: {
        clearHideShow: true,
        watchList: ["type"],
        allRequired: false, // 是否全部必填
        inline: true, //行内
        colon: ":",
        inputStyle: {
          width: "220px"
        },
        buttonStyle: { display: "flex", marginLeft: "9em" },
        buttons: []
      },
      paymentData: {},
      payList: [
        {
          code: "tuition",
          label: "培训费",
          preCheck: true,
          disabled: true
        },
        {
          code: "quarterage",
          label: "住宿费",
          preCheck: true,
          disabled: true
        },
        {
          code: "mealMoney",
          label: "餐费",
          preCheck: true,
          disabled: true
        },
        {
          code: "earnest",
          label: "定金",
          preCheck: true,
          disabled: true
        },
        // {
        //   code: "deposit",
        //   label: "押金",
        //   preCheck: true,
        //   disabled: true
        // },
        {
          code: "payAmount",
          label: "总额",
          disabled: true,
          minCode: 0,
          required: true,
          backType: "Number"
        },
        {
          el: "radio",
          code: "type",
          label: "支付类型",
          list: payOnlineList2,
          required: true,
          backType: "Number",
          defalt: "10"
        },
        {
          el: "line",
          code: "line",
          label: "line",
          style: {
            width: "100%"
          }
        },
        {
          el: "itemSlot",
          code: "add",
          slotName: "add",
          show: false
        },
        {
          el: "select",
          code: "channel",
          label: "支付方式",
          fun: dictType,
          back: true,
          required: true,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          query: { type: "pay_type", useFlag: 1 },
          backType: "Number"
        },
        {
          label: "交易号",
          code: "tradeNo"
        },
        {
          el: "date",
          label: "付款时间",
          code: "paymentTime",
          required: true,
          dataFormat: "{y}-{m}-{d} {h}:{i}:{s}"
        },
        {
          el: "textArea",
          label: "备注",
          code: "remark"
        },
        {
          el: "img",
          code: "attaches",
          label: "上传凭证",
          size: 1024,
          // required: true,
          limit: 9
        }
      ],
      showList: [],
      hideList: [],
      formState: [],
      formChangePay: val => {
        state.paymentData[val.code] = val.value;
        if (state.countArr.includes(val.code)) {
          state.countArrObj[val.code].value = val.value || 0;
          let payAmount = 0;
          for (let key in state.countArrObj) {
            payAmount += parseFloat(state.countArrObj[key].value);
          }
          state.paymentData = { ...state.paymentData, payAmount };
        }
        if (val.code == "type") {
          if (val.value == 10) {
            state.showList = ["channel", "tradeNo", "paymentTime", "remark"];
            state.hideList = ["add"];
          } else {
            state.showList = ["add"];
            state.hideList = ["channel", "tradeNo", "paymentTime", "remark"];
          }
        }
      },
      countArr: ["tuition", "quarterage", "mealMoney", "earnest", "deposit"],
      countArrObj: {
        earnest: {
          type: 10,
          name: "定金",
          value: 0
        },
        tuition: {
          type: 20,
          name: "学费",
          value: 0
        },
        quarterage: {
          type: 30,
          name: "住宿费",
          value: 0
        },
        deposit: {
          type: 40,
          name: "押金",
          value: 0
        },
        mealMoney: {
          type: 50,
          name: "餐费",
          value: 0
        }
      },
      checkItem: val => {
        if (state.countArr.includes(val.code)) {
          state.countArrObj[val.code].value = val.checkValue ? val.value : 0;
          let payAmount = 0;
          for (let key in state.countArrObj) {
            payAmount += parseFloat(state.countArrObj[key].value);
          }
          payAmount=payAmount.toFixed(2)
          state.paymentData = { ...state.paymentData, payAmount };
        }
      },
      popSubmit: () => {
        fromPay.value.confirm();
      },
      buttonPays: val => {
        if (val.name == "confirm" && val.valid) {
          let {
            amount,
            attaches,
            payAmount,
            remark,
            channel,
            paymentTime,
            tradeNo,
            id: studentSemesterId,
            payments: combination
          } = val.value;
          studentSemesterId = Number(studentSemesterId);
          let data = { studentSemesterId, attaches, remark, payAmount };
          data.type = state.payType ? 10 : -10;
          data.items = [];
          for (let key in state.countArrObj) {
            if (state.countArrObj[key].value > 0) {
              data.items.push({
                total: state.countArrObj[key].value,
                type: state.countArrObj[key].type
              });
            }
          }
          // 支付类型 单个
          if (val.value.type == 10) {
            data.payments = [
              { amount: payAmount, channel, paymentTime, tradeNo, type: 10 }
            ];
          } else {
            data.payments = state.paymentData.combination;
          }
          if (state.payType) {
            orderPaymentPost(data).then(res => {
              state.paymentVisibles = false;
              ElMessage.success("操作成功");
              emit("update", true);
            });
          } else {
            orderRefundPost(data).then(res => {
              state.paymentVisibles = false;
              ElMessage.success("操作成功");
              emit("update", true);
            });
          }
        }
      }
    });

    watch(
      () => props.info,
      val => {
        state.formDetail = val;
        state.formDetail.originalAmount = val.costTotal.originalAmount;
        state.formDetail.totalAmount = val.costTotal.totalAmount;
        state.formDetail.paidAmount = val.costTotal.paidAmount;
        state.formDetail.totalRefund = val.costTotal.totalRefund;
        // 未付款项
        state.noPaidObj = {
          tuition: (
            state.formDetail.tuition - state.formDetail.tuitionPaid || 0
          ).toFixed(2),
          quarterage: (
            state.formDetail.quarterage - state.formDetail.moneyPaid || 0
          ).toFixed(2),
          mealMoney: (
            state.formDetail.mealMoney - state.formDetail.mealMoneyPaid || 0
          ).toFixed(2),
          earnest: (
            state.formDetail.earnest - state.formDetail.earnestPaid || 0
          ).toFixed(2)
          // deposit: (
          //   state.formDetail.deposit - state.formDetail.depositPaid || 0
          // ).toFixed(2)
        };
        for (let key in state.noPaidObj) {
          if (state.noPaidObj[key] > 0) {
            state.noPaidObjAll = true;
          }
        }
        // 已付款项
        state.PaidObj = {
          tuition: state.formDetail.tuitionPaid,
          quarterage: state.formDetail.moneyPaid,
          mealMoney: state.formDetail.mealMoneyPaid,
          earnest: state.formDetail.earnestPaid
          // deposit: state.formDetail.depositPaid
        };
        for (let key in state.PaidObj) {
          if (state.PaidObj[key] > 0) {
            state.PaidObjAll = true;
          }
        }
      }
    );
    return {
      ...toRefs(state),
      addFormConfig,
      fromPay,
      isShowButtom,
      dynamicValidateForm
    };
  }
});
</script>
<style lang="scss" scoped>
.slotCostBut {
  margin-left: 10px;
}
.slotCostP {
  margin-left: 10px;
}

.costInfoP {
  font: 14px Helvetica Neue, Helvetica;
  min-width: 526px;
  max-height: 28px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    height: 27px;
  }
}
.dialogBody {
  position: relative;
  display: flex;
  min-width: 280px;
  line-height: 40px;
  flex-direction: column;
  p {
    height: 62px;
  }
  .checkSpan {
    display: inline-block;
    width: 70px;
  }
  .marginP {
    margin: 0 0 0 25px;
  }
  .chebox {
    width: 220px;
    height: 30px;
    padding: 0 30px 0 15px;
    border: 1px solid #c0c4cc;
    outline: 0;
    border-radius: 4px;
    &:focus {
      border: 1px solid #2e8de6;
    }
  }
}
.costInfoPs {
  justify-content: flex-start;
  input {
    margin: 0 35px 0 13px;
  }
  button {
    margin-left: 30px;
  }
}
.combination {
  span {
    display: inline-block;
    width: 70px;
  }
  input {
    width: 220px;
    height: 30px;
    padding: 0 30px 0 15px;
    border: 1px solid #c0c4cc;
    outline: 0;
    border-radius: 4px;
    &:focus {
      border: 1px solid #2e8de6;
    }
  }
}
</style>
<style lang="scss" scoped></style>
