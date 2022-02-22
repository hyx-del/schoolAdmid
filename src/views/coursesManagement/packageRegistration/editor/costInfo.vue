<!--
 * @Author: jiu yin
 * @Date: 2021-09-06 11:36:36
 * @LastEditTime: 2021-11-05 11:15:05
 * @LastEditors: 刘帝君
 * @Description: 666
 * @FilePath: \school_admin\src\views\managesignup\usersignup\detaile\costInfo.vue
 *  “jiu”
-->
<template>
  <div class="box">
    <div>
      <p class="costInfoP">
        定金：<input type="text" v-model="dataExpenses.earnest" disabled />
        <el-button
          type="primary"
          size="mini"
          @click="adjust('10', dataExpenses)"
          v-if="isShowButtom('a0802k')"
          >调整</el-button
        >
        <span>已付：{{ dataExpenses.earnestPaid }}</span>
        <span>待付：{{ dataExpenses.earnestNeed }}</span>
        <span>已退：{{ dataExpenses.earnestRefund }}</span>
      </p>
      <el-divider></el-divider>
    </div>
    <div>
      <p class="costInfoP">
        学费：<input type="text" v-model="dataExpenses.trainFee" disabled />
        <el-button
          type="primary"
          size="mini"
          @click="adjust('20', dataExpenses)"
          v-if="isShowButtom('a0802k')"
          >调整</el-button
        >
        <span>已付：{{ dataExpenses.trainFeePaid }}</span>
        <span>待付：{{ dataExpenses.trainFeeNeed }}</span>
        <span>已退：{{ dataExpenses.trainFeeRefund }}</span>
      </p>
      <el-divider></el-divider>
    </div>
    <!-- 调整弹框 -->
    <el-dialog title="费用调整" v-model="dialogFormVisibles" width="600px">
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

    <!-- 储值调整 -->
    <el-dialog title="储值调整" v-model="storedValuePopup" width="600px">
      <div class="dialogBody">
        <formList
          :config="addFormConfig"
          :itemList="storedValueList"
          :formInitData="storedValueData"
          @buttonClick="buttonStoredValue"
        >
        </formList>
      </div>
    </el-dialog>

    <!-- 总额 -->
    <div>
      <p class="costInfoP" style="margin-left:10px">
        报名费：<input type="text" v-model="dataExpenses.totalFee" disabled />
        <span>已付报名费：{{ dataExpenses.totalFeePaid }}</span>
        <el-button
          type="primary"
          :disabled="dataExpenses.totalFeePaid > 0 ? false : true"
          size="mini"
          v-if="isShowButtom('a0802g')"
          @click="payment('退款')"
          >退款</el-button
        >
        <el-button
          type="primary"
          v-if="isShowButtom('a0802i')"
          size="mini"
          :disabled="dataExpenses.totalFeePaid > 0 ? false : true"
          @click="storedValue(dataExpenses)"
          >储值</el-button
        >
        <span>待付报名费：{{ dataExpenses.totalFeeNeed }}</span>
        <el-button
          type="primary"
          :disabled="dataExpenses.totalFeeNeed > 0 ? false : true"
          size="mini"
          v-if="isShowButtom('a0802h')"
          @click="payment('付款')"
          >付款</el-button
        >
      </p>
      <el-divider></el-divider>
    </div>

    <!-- 调整弹框 -->
    <el-dialog
      :title="title"
      v-model="paymentVisibles"
      v-if="paymentVisibles"
      width="1126px"
    >
      <!-- 复选 -->
      <div style="min-height: 600px;">
        <div class="dialogBody">
          <el-checkbox-group v-model="checkList">
            <p v-if="refundPayment.earnest > 0 ? true : false">
              <el-checkbox label="定金">
                <span class="checkSpan">定金：</span>
                <input
                  type="text"
                  disabled
                  class="chebox"
                  v-model="refundPayment.earnest"
                />
              </el-checkbox>
            </p>
            <p v-if="refundPayment.trainFee > 0 ? true : false">
              <el-checkbox label="学费">
                <span class="checkSpan">学费：</span>
                <input
                  type="text"
                  disabled
                  class="chebox"
                  v-model="refundPayment.trainFee"
                />
              </el-checkbox>
            </p>
          </el-checkbox-group>

          <p class="marginP">
            <span class="checkSpan">总额</span>
            <input type="text" disabled v-model="itemsAmount" class="chebox" />
          </p>

          <p class="marginP">
            <span class="checkSpan">支付类型：</span>
            <el-button type="primary" size="mini" @click="manner = true"
              >单一支付</el-button
            >
            <el-button type="primary" size="mini" @click="manner = false"
              >组合支付</el-button
            >
          </p>
        </div>

        <formList
          ref="fromPay"
          :itemList="payList"
          :formInitData="paymentDatas"
          :config="tabelFormConfig"
          @buttonClick="buttonPays"
          v-if="manner"
        />
        <div>
          <v-form
            v-if="!manner"
            :paymentData="paymentData"
            ref="dynamicValidateForm"
          ></v-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="paymentVisibles = false" size="small"
            >取 消</el-button
          >
          <el-button type="primary" @click="formPaySubmit" size="small"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 计入提成 -->
    <div>
      <p class="costInfoP costInfoPs">
        计入提成：<input
          type="text"
          v-model="dataExpenses.pushMoney"
          disabled
        />
        <el-button
          type="primary"
          size="mini"
          @click="adjust('50', dataExpenses)"
          v-if="isShowButtom('a0802k')"
          >调整</el-button
        >
      </p>
      <el-divider></el-divider>
    </div>
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
import {
  adjustExpenses,
  storedValueApi,
  paymentApi,
  refundApi
} from "@/api/coursesManagement";
import { dictType } from "@/api/dict";
import { isShowButtom } from "@/utils/permissionsButton";
export default defineComponent({
  components: { formList, vForm },
  props: {
    formData: {
      type: Object
    }
  },
  setup(props, ctx) {
    const router = useRouter();
    const route = useRoute();
    //逻辑层主体
    const State = reactive({
      // 数据
      dataExpenses: {},
      //调整
      dialogFormVisibles: false,
      formInitData: {},
      // 储值
      storedValueData: {},
      storedValuePopup: false,
      //退付款
      paymentVisibles: false,
      //复选框
      checkList: [],
      itemsAmount: null,
      paymentData: {
        combination: [
          {
            namesssn: "",
            id: 0
          }
        ]
      },
      paymentDatas: {},
      //单一组合
      manner: true,
      // 订单费用清单
      costOfListing: [],
      // 付/退款弹框标题
      title: "",
      refundPayment: {}
    });

    // 监听
    watch(
      () => props.formData,
      (newValue, oldValue) => {
        State.dataExpenses = newValue;
      },
      { immediate: true }
    );

    //调整弹框事件
    const adjust = (type, val) => {
      console.log(val, "费用类型");
      const dataObj = {
        studentMainCourseId: props.formData.studentMainCourseId,
        type,
        newMoney: "",
        remark: ""
      };
      switch (type) {
        case "10":
          dataObj.oldMoney = val.earnest;
          State.formInitData = dataObj;
          break;
        case "20":
          dataObj.oldMoney = val.trainFee;
          State.formInitData = dataObj;
          break;
        case "50":
          dataObj.oldMoney = val.pushMoney;
          State.formInitData = dataObj;
          break;
        // case "70":
        //   dataObj.oldMoney = val.paymentWait;
        //   State.formInitData = dataObj;
        //   break;
        default:
          break;
      }

      State.dialogFormVisibles = true;
    };

    //付款弹框事件
    const payment = val => {
      console.log(State.dataExpenses, "dataExpenses");
      if (val == "付款") {
        // 待付
        State.refundPayment.earnest = State.dataExpenses.earnestNeed;
        State.refundPayment.trainFee = State.dataExpenses.trainFeeNeed;
      } else {
        // 已付
        State.refundPayment.earnest = State.dataExpenses.earnestPaid;
        State.refundPayment.trainFee = State.dataExpenses.trainFeePaid;
      }
      State.title = val;
      State.paymentVisibles = true;
    };

    // 付款多选监听
    watch(
      () => State.checkList,
      (newValue, oldValue) => {
        const { earnest, trainFee } = State.refundPayment;
        const str = ref(null);
        const listing = ref([]);
        newValue.forEach(val => {
          switch (val) {
            case "定金":
              str.value = str.value + earnest * 1;
              listing.value.push({
                total: earnest,
                type: "10"
              });
              break;
            case "学费":
              str.value = str.value + trainFee * 1;
              listing.value.push({
                total: trainFee,
                type: "20"
              });
              break;
            default:
              break;
          }
        });
        State.itemsAmount = str.value ? str.value.toFixed(2) : "";
        State.costOfListing = listing.value;
      },
      { immediate: true }
    );

    //报名信息格式保存
    const tabelFormConfig = {
      allRequired: false, // 是否全部必填
      inline: true, //行内
      colon: ":",
      inputStyle: {
        width: "220px"
      },
      buttonStyle: { display: "flex", marginLeft: "9em" },
      buttons: []
    };

    //调整
    const itemListCot = [
      {
        label: "原费用",
        code: "oldMoney",
        disabled: true
      },
      {
        label: "调整费用",
        code: "newMoney",
        required: true,
        type: "Number"
      },
      {
        label: "备注",
        code: "remark",
        required: false
      }
    ];

    //调整表单确定按钮
    const buttonCot = val => {
      if (val.name == "confirm") {
        console.log(val.value, "费用调整");
        adjustExpenses({ ...val.value }).then(res => {
          const { code } = res;
          if (code == 200) {
            console.log(res.data, "费用调整接口回调");
            ElMessage({
              type: "success",
              message: `操作成功`
            });
            ctx.emit("returnsData", true);
            State.dialogFormVisibles = false;
          }
        });
      } else if (val.name == "cancel") {
        State.dialogFormVisibles = false;
      }
    };

    //点击储值
    const storedValue = val => {
      const dataObj = {
        studentMainCourseId: props.formData.studentMainCourseId,
        oldAmount: val.totalFeePaid
        // type
      };
      State.storedValueData = dataObj;
      State.storedValuePopup = true;
    };

    //储值
    const storedValueList = [
      {
        label: "当前报名余额",
        code: "oldAmount",
        disabled: true
      },
      {
        label: "调整到储值",
        code: "amount",
        required: true,
        type: "Number"
      },
      {
        label: "备注",
        code: "reason",
        required: false
      }
    ];

    // 储值按钮
    const buttonStoredValue = val => {
      if (val.name == "confirm") {
        console.log(val.value, "储值");

        storedValueApi({ ...val.value }).then(res => {
          const { code } = res;
          if (code == 200) {
            console.log(res.data, "储值接口回调");
            ElMessage({
              type: "success",
              message: `操作成功`
            });
            ctx.emit("returnsData", true);
            State.storedValuePopup = false;
          }
        });
      } else if (val.name == "cancel") {
        State.storedValuePopup = false;
      }
    };

    // 付款接口
    const paymentInterface = val => {
      paymentApi(val).then(res => {
        const { code } = res;
        if (code == 200) {
          console.log(res.data, "付款回调");
          ElMessage({
            type: "success",
            message: `操作成功`
          });
          ctx.emit("returnsData", true);
          State.paymentVisibles = false;
        }
      });
    };

    // 退款接口
    const refundInterface = val => {
      refundApi(val).then(res => {
        const { code } = res;
        if (code == 200) {
          console.log(res.data, "退/付款接口回调");
          ElMessage({
            type: "success",
            message: `操作成功`
          });
          ctx.emit("returnsData", true);
          State.paymentVisibles = false;
        }
      });
    };

    //单一支付
    const payList = [
      {
        el: "select",
        code: "channel",
        label: "支付方式",
        fun: dictType,
        funMode: "one",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        query: { type: "pay_type", useFlag: 1 },
        required: true
      },
      {
        label: "交易号",
        code: "tradeNo"
      },
      {
        label: "备注",
        code: "remark"
      },
      {
        el: "date",
        label: "付款时间",
        code: "paymentTime",
        dataFormat: "{y}-{m}-{d} {h}:{i}:{s}",
        required: true
      },
      {
        el: "img",
        code: "attaches",
        label: "上传凭证",
        size: 1024,
        default:''
      }
    ];
    const fromPay = ref(null);
    const dynamicValidateForm = ref(null);

    //退/付款弹框确定
    const formPaySubmit = () => {
      if (State.manner) {
        //手动触发formlist but事件
        fromPay.value.confirm();
      } else {
        // dynamicValidateForm.value.ruless();
        // if (
        //   State.paymentData.attaches &&
        //   State.paymentData.attaches.length !== 0
        // ) {
        const arrData = ref([]);
        const strData = ref("");
        State.paymentData.combination.forEach(val => {
          arrData.value.push({
            amount: val.amount,
            channel: val.channel,
            paymentTime: val.paymentTime,
            tradeNo: val.tradeNo,
            type: 20
          });
        });
        if (
          State.paymentData.attaches &&
          State.paymentData.attaches.length !== 0
        ) {
          State.paymentData.attaches.forEach(item => {
            strData.value += item + ",";
          });
        }

        const paymentData = {
          attaches: strData.value.slice(0, -1),
          items: State.costOfListing,
          payAmount: State.itemsAmount,
          payments: arrData.value,
          remark: "",
          studentMainCourseId: props.formData.studentMainCourseId,
          type: State.title == "付款" ? 10 : -10
        };
        if (State.title == "付款") paymentInterface(paymentData);
        else refundInterface(paymentData);
        console.log(paymentData, "上传的数据");
        // } else {
        //   ElMessage({
        //     type: "error",
        //     message: `上传凭证不能为空！13`
        //   });
        // }
      }
    };
    //组合支付单一
    const buttonPays = val => {
      if (val.value.paymentTime) {
        const paymentData = {
          attaches: val.value.attaches,
          items: State.costOfListing,
          payAmount: State.itemsAmount,
          payments: [
            {
              amount: State.itemsAmount,
              channel: val.value.channel,
              paymentTime: val.value.paymentTime,
              tradeNo: val.value.tradeNo,
              type: 10
            }
          ],
          remark: val.value.remark,
          studentMainCourseId: props.formData.studentMainCourseId,
          type: State.title == "付款" ? 10 : -10
        };
        console.log(paymentData, "组合支付单一");
        if (State.title == "付款") paymentInterface(paymentData);
        else refundInterface(paymentData);
      } else {
        ElMessage({
          type: "error",
          message: `付款时间不能为空！`
        });
      }
    };
    computed(() => {});
    onMounted(() => {});
    onBeforeUnmount(() => {});
    return {
      ...toRefs(State),
      adjust,
      tabelFormConfig,
      isShowButtom,
      itemListCot,
      buttonCot,
      payment,
      addFormConfig,
      payList,
      fromPay,
      formPaySubmit,
      buttonPays,
      dynamicValidateForm,
      storedValue,
      storedValueList,
      buttonStoredValue
    };
  }
});
</script>
<style lang="scss" scoped>
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
