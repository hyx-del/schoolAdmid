<!--
 * @Author: jiu yin
 * @Date: 2021-09-02 17:55:45
 * @LastEditTime: 2021-12-17 17:56:02
 * @LastEditors: zx
 * @Description: 666
 * @FilePath: \school_admin\src\views\managesignup\usersignup\detaile\index.vue
 *  “jiu”
-->
<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="报名表单" name="first">
        <div class="applyInfo" v-if="activeName == 'first'">
          <div class="left">
            <h2>报名信息</h2>
            <emptyBox bottom="30">
              <detailShow
                :config="tabelFormConfigs"
                :itemList="itemListDetaleInfo"
                :formInitData="applyData"
              />
            </emptyBox>
          </div>

          <div class="right">
            <h2>优惠</h2>
            <emptyBox bottom="30">
              <div>
                <span>早鸟折扣</span>：<span
                  >{{
                    applyData.earlyBirdDiscount == 1
                      ? "不打"
                      : applyData.earlyBirdDiscount * 10 || "--"
                  }}折</span
                >
              </div>
              <div>
                <span>折扣信息</span>
                <Table
                  :data="applyData.discountPercentList"
                  :column="columnDiscountPercentList"
                  :headHight="140"
                  :hidden="false"
                  :showSortIndex="{ show: true, lable: '序号' }"
                />
              </div>
              <div>
                <span>优惠券抵扣</span>：<span>{{
                  applyData.discountCashMoney || "--"
                }}</span>
              </div>
              <h2>报名费用</h2>
              <div class="box">
                <div>
                  <p class="costInfoP">
                    <span class="cost_item"
                      >培训费： {{ applyData.tuition }}</span
                    >
                    <span class="cost_item"
                      >已付：{{ applyData.tuitionPaid }}</span
                    >
                    <span class="cost_item"
                      >待付：{{
                        pendingPayments(
                          applyData.tuition - applyData.tuitionPaid
                        )
                      }}</span
                    >
                    <span class="cost_item"
                      >退款：{{ applyData.tuitionRefund }}</span
                    >
                  </p>
                  <el-divider></el-divider>
                </div>
                <div>
                  <p class="costInfoP">
                    <span class="cost_item"
                      >住宿费： {{ applyData.quarterage }}</span
                    >
                    <span class="cost_item"
                      >已付：{{ applyData.moneyPaid }}</span
                    >
                    <span class="cost_item"
                      >待付：{{
                        pendingPayments(
                          applyData.quarterage - applyData.moneyPaid
                        )
                      }}</span
                    >
                    <span class="cost_item"
                      >退款：{{ applyData.moneyRefund }}</span
                    >
                  </p>
                  <el-divider></el-divider>
                </div>
                <div>
                  <p class="costInfoP">
                    <span class="cost_item"
                      >餐费： {{ applyData.mealMoney }}</span
                    >
                    <span class="cost_item"
                      >已付：{{ applyData.mealMoneyPaid }}</span
                    >
                    <span class="cost_item"
                      >待付：{{
                        pendingPayments(
                          applyData.mealMoney - applyData.mealMoneyPaid
                        )
                      }}</span
                    >
                    <span class="cost_item"
                      >退款：{{ applyData.mealMoneyRefund }}</span
                    >
                  </p>
                  <el-divider></el-divider>
                </div>
                <div>
                  <p class="costInfoP">
                    <span class="cost_item"
                      >定金： {{ applyData.earnest }}</span
                    >
                    <span class="cost_item"
                      >已付：{{ applyData.earnestPaid }}</span
                    >
                    <span class="cost_item"
                      >待付：{{
                        pendingPayments(
                          applyData.earnest - applyData.earnestPaid
                        )
                      }}</span
                    >
                    <span class="cost_item"
                      >退款：{{ applyData.earnestRefund }}</span
                    >
                  </p>
                  <el-divider></el-divider>
                </div>
                <div>
                  <p class="costInfoP">
                    <span class="cost_item"
                      >押金： {{ applyData.deposit }}</span
                    >
                    <span class="cost_item"
                      >已付：{{ applyData.depositPaid }}</span
                    >
                    <span class="cost_item"
                      >待付：{{
                        pendingPayments(
                          applyData.deposit - applyData.depositPaid
                        )
                      }}</span
                    >
                    <span class="cost_item"
                      >退款：{{ applyData.depositRefund }}</span
                    >
                  </p>
                  <el-divider></el-divider>
                </div>

                <!-- 总额 -->
                <div>
                  <p class="costInfoP">
                    <span class="cost_item"
                      >总额： {{ totalCost(applyData) }}</span
                    >
                    <span class="cost_item"
                      >已付总额：{{totalPayCost(applyData)}}</span
                    >
                    <span class="cost_item"
                      >待付总额：{{ totalOwePay(applyData) }}</span
                    >
                  </p>
                  <el-divider></el-divider>
                </div>

                <!-- 计入提成 -->
                <div>
                  <p class="costInfoP costInfoPs">
                    <span class="cost_item"
                      >计入提成： {{ applyData.pushMoney }}</span>
                    <span class="cost_item"
                      >已付总额：{{totalPayCost(applyData)}}</span>
                  </p>
                  <el-divider></el-divider>
                </div>
              </div>
            </emptyBox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="费用调整记录" name="second">
        <div v-if="activeName == 'second'">
          <formList
            :config="tabelFormConfig"
            :itemList="itemListCot"
            :formInitData="costFormInitData"
            @buttonClick="buttonCot"
          >
          </formList>
          <Table
            ref="costsTable"
            :loadData="getStudentAdjustList"
            :column="column"
            :params="costFormInitData"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="付款记录" name="third">
        <div v-if="activeName == 'third'">
          <formList
            :config="tabelFormConfig"
            :itemList="itemListPayment"
            :formInitData="formInitPayment"
            @buttonClick="buttonPayment"
          >
          </formList>
          <Table
            ref="paymentTable"
            :loadData="getStudentPaymentList"
            :column="columnpayment"
            :params="formInitPayment"
            :showSortIndex="{ show: true, lable: '序号' }"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="转学记录" name="fourth">
        <div v-if="activeName == 'fourth'">
          <!-- <formList
            :config="tabelFormConfig"
            :itemList="itemListTransfer"
            :formInitData="formInitTransfer"
            @buttonClick="buttonTransfer"
          >
          </formList> -->
          <Table
            ref="TableList"
            :loadData="getList"
            :column="columnTransfer"
            :params="formInitTransfer"
            :showSortIndex="{ show: true, lable: '序号' }"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="销售修改记录" name="amend">
        <div v-if="activeName == 'amend'">
          <formList
            :config="tabelFormConfig"
            :itemList="itemListSell"
            :formInitData="formInitSell"
            @buttonClick="buttonSell"
          >
          </formList>
          <Table
            ref="salesmanChangeTable"
            :loadData="getSalesmanChangeList"
            :column="columnSell"
            :params="formInitSell"
            :showSortIndex="{ show: true, lable: '序号' }"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import formList from "@/components/FormList/index.vue";
import detailShow from "@/components/FormList/detailShow.vue";
import Table from "@/components/Table/index";
import { changestatus } from "@/api/headquarters";
import {
  registrationDetail,
  getStudentAdjustListAPI,
  getStudentPaymentListAPI,
  getSalesmanChangeListAPI,
  getTransferStudentListAPI
} from "@/api/studentSemester";
import vCostInfo from "./costInfo.vue";
import {
  getListHtml,
  orderType,
  payChannel,
  payOnlineList2
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
//import { ElMessage } from 'element-plus';
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import Templatedetail from "@/views/tremtemplate/templatedetail.vue";
import { orderChannel } from "@/utils/enum/select";
import emptyBox from "@/components/emptyBox";
import { dictType } from "@/api/dict";
export default defineComponent({
  components: {
    formList,
    emptyBox,
    Table,
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
      semesterId: route.query.semesterId,
      studentId: route.query.sId,
      //选项卡默认
      activeName: "first",

      applyData: {}
    });
    //优惠
    const discounts = discount();
    //报名信息
    const detaleInfos = detaleInfo(state, route);
    //费用记录
    const costs = cost(state, route);
    //付款记录
    const payments = payment(state, route);
    //转学记录
    const transfers = transfer(state, route);
    //销售修改记录
    const sells = sell(state, route);
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
        // {
        // 	funType: "confirm",
        // 	type: "primary",
        // 	name: "保存",
        // 	size: "small"
        // }
      ]
    };
    const columnDiscountPercentList = [
      { prop: "name", label: "折扣名称" },
      { prop: "percent", label: "折扣比例" }
    ];
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
    //选项卡
    const handleClick = (tab, event) => {
      console.log(tab.index);
    };
    onMounted(() => {
      registrationDetail({ id: route.query.id }).then(res => {
        if (res.code == 200) {
          let _data = { ...res.data, ...res.data.studentDetail };
          _data.address=res.data&&res.data.semester&&res.data.semester.address
          _data.remark = res.data.remark;
          state.applyData = _data;
          state.applyData.idCardImagesFront = _data.idCardImages
            ? _data.idCardImages.front
            : null;
          state.applyData.idCardImagesReverse = _data.idCardImages
            ? _data.idCardImages.reverse
            : null;

          // console.log("state", state);
        }
      });
    });
    const totalCost = tempData => {
      return state.applyData &&
          state.applyData.costTotal &&
          state.applyData.costTotal.totalAmount||0;
    };
    const totalPayCost = tempData => {
      return state.applyData &&
          state.applyData.costTotal &&
          state.applyData.costTotal.paidAmount||0;
    };
    const totalOwePay = args => {
      let _total = 0;
      _total = totalCost(state.applyData) - totalPayCost(state.applyData);
      _total = _total.toFixed(2);
      return _total;
    };
    onBeforeUnmount(() => {});
    // 待付
    const pendingPayments = computed(() => {
      return function(val) {
        return val.toFixed(2);
      };
    });

    return {
      ...toRefs(state),
      tabelFormConfig,
      tabelFormConfigs,
      handleClick,
      columnDiscountPercentList,
      totalCost,
      totalPayCost,
      totalOwePay,
      pendingPayments,
      ...discounts,
      ...detaleInfos,
      ...costs,
      ...payments,
      ...transfers,
      ...sells
    };
  }
});
// 优惠
const discount = () => {
  //表单信息
  const formInitdiscount = reactive({});
  const itemListdiscount = [
    {
      type: "input",
      code: "earlyBirdDiscount",
      label: "早鸟折扣",
      required: true,
      disabled: true,
      afterSlot: "afterSlot2"
    },
    {
      code: "nameEnsssssss",
      label: "折扣1",
      type: "zh",
      required: true,
      disabled: true,
      afterSlot: "afterSlot2"
    },
    {
      code: "ssddadasd",
      label: "优惠券抵扣",
      type: "letter",
      disabled: true,
      afterSlot: "afterSlot3"
    }
  ];
  //报名信息保存
  const buttonDiscount = () => {
    console.log("我是报名信息保存");
  };
  // 表单按钮
  const configDiscount = {
    allRequired: false, // 是否全部必填
    inline: false, //行内
    colon: "",
    inputStyle: {
      width: "200px"
    },
    buttons: []
  };
  return {
    formInitdiscount,
    itemListdiscount,
    buttonDiscount,
    configDiscount
  };
};
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
      code: "name",
      label: "学员姓名",
      type: "zh",
      required: true,
      disabled: true
    },
    {
      code: "englishName",
      label: "英文名",
      type: "letter",
      disabled: true
    },
    {
      code: "semesterName",
      label: "报名学期"
    },
    {
      el: "radio",
      code: "isQuarterage",
      label: "是否提供住宿",
      list: [
        {
          label: "是",
          value: 1
        },
        {
          label: "否",
          value: 0
        }
      ],
      style: { minWidth: "368px" }
    },
    {
      el: "radio",
      code: "isMealStatus",
      label: "是否供餐",
      list: [
        {
          label: "是",
          value: 1
        },
        {
          label: "否",
          value: -1
        }
      ],
      style: { minWidth: "368px" }
    },
    {
      el: "radio",
      code: "gender",
      label: "性别",
      required: true,
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
      ],
      style: { minWidth: "368px" }
    },
    {
      el: "select",
      label: "销售员",
      code: "salesmanNames", // salesmanId
      // otherBack:'select_label',// label的返回值
      // back: true,// 从后台返回结果
      // labelCode: 'name',// 指定的label名
      // valueCode: 'id',// 指定的value名
      // fun:getCoachesList,//使用的表格返回函数
      disabled: true
      // afterSlot: "afterSlot2"
    },

    {
      code: "idCard",
      type: "identity",
      label: "身份证号",
      placeholder: "请输入身份证号",
      checkFun: "idcard",
      maxlength: 18
    },
    {
      el: "img",
      code: "idCardImagesFront",
      label: "身份证正面照片",
      size: 1024,
      limit: 2,
      style: { minWidth: "452px", width: "100%" }
    },
    {
      el: "img",
      code: "idCardImagesReverse",
      label: "身份证反面照片",
      size: 1024,
      limit: 2,
      style: { minWidth: "452px", width: "100%" }
    },
    {
      code: "emergencyContact",
      type: "phones",
      label: "紧急联系人电话",
      placeholder: "请输入紧急联系人电话",
      disabled: true
    },
    {
      code: "address",
      label: "家庭住址",
      disabled: true
    },
    { el: "textArea", code: "remark", label: "备注" }
  ];
  //销售弹框数据
  const options = reactive([]);

  //数据
  const getStudentAdjustList = computed(() => {
    return getStudentAdjustListAPI;
  });

  return {
    formInitDetaleInfo,
    itemListDetaleInfo,
    getStudentAdjustList,
    dialogFormVisible,
    options
  };
};
//费用调整记录
const cost = (State, route) => {
  const costsTable = ref(null);
  const costFormInitData = reactive({
    studentSemesterId: route.query.id
  });
  const itemListCot = [
    {
      label: "费用类型",
      el: "select",
      list: [
        { value: "10", label: "定金" },
        { value: "20", label: "培训费" },
        { value: "30", label: "住宿费" },
        { value: "40", label: "餐费" },
        { value: "50", label: "押金" },
        { value: "60", label: "提成" }
      ],
      code: "type",
      placeholder: "类别"
    }
  ];
  //表单确定按钮
  const buttonCot = val => {
    if (val.name == "confirm") {
      costsTable.value.update({ type: val.value.type });
    }
  };

  //count或book.name改变了
  // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
  const getStudentAdjustList = computed(() => {
    return getStudentAdjustListAPI;
  });
  const column = [
    // { prop: "id", label: "序号", width: "80" },
    { prop: "typeName", label: "费用类型" },
    { prop: "oldMoney", label: "修改前" },
    { prop: "newMoney", label: "修改后" },
    { prop: "remark", label: "备注" },
    { prop: "updatedAt", label: "修改时间" },
    { prop: "operatorName", label: "操作人" }
  ];
  return {
    costFormInitData,
    itemListCot,
    costsTable,
    buttonCot,
    getStudentAdjustList,
    column
  };
};
//付款记录
const payment = (State, route) => {
  const paymentTable = ref(null);
  const formInitPayment = reactive({
    studentSemesterId: route.query.id
  });
  const itemListPayment = [
    {
      label: "支付方式",
      el: "select",
      fun: dictType,
      back: true,
      funMode: "one",
      otherBack: "select_label", // label的返回值
      query: { type: "pay_type", useFlag: 1 },
      code: "channel",
      placeholder: "支付方式"
    },
    {
      label: "支付类型",
      el: "select",
      list: [
        { value: "10", label: "单一支付" },
        { value: "20", label: "组合支付" }
      ],
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
      console.log("付款记录");
      console.log(val);
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
  const columnpayment = reactive([
    // { prop: "id", label: "序号", width: "80" },
    { prop: "relationId", label: "订单号" },
    {
      prop: "orderType",
      label: "订单类型",
      html: (row, val) => getListHtml(orderType, val)
    },
    { prop: "typeName", label: "支付类型" },
    { prop: "channelName", label: "付款方式" },
    { prop: "amount", label: "支付金额" },
    // { prop: "type", label: " 支付方式",html:(row,val)=>getListHtml(payOnlineList2,val)},
    { prop: "remark", label: "订单说明" },
    { prop: "statusName", label: "状态" },
    { prop: "tradeNo", label: "交易号" },
    { prop: "platformName", label: "下单渠道" },
    { prop: "paymentTime", label: "修改时间" },
    { prop: "attaches", label: "凭证", img: true }
    // {
    //   prop: "action",
    //   label: "操作",
    //   width: "120px",
    //   actives: [
    //     {
    //       name: val => {
    //         return "查看凭证";
    //       },
    //       method: val => {}
    //     }
    //   ]
    // }
  ]);
  return {
    formInitPayment,
    itemListPayment,
    buttonPayment,
    getStudentPaymentList,
    paymentTable,
    columnpayment
  };
};
//转学记录
const transfer = (State, route) => {
  const formInitTransfer = reactive({
    studentSemesterId: route.query.id
  });
  const itemListTransfer = [
    {
      label: "状态",
      el: "select",
      list: [
        { value: "10", label: "筹备中" },
        { value: "20", label: "运营" },
        { value: "-20", label: "暂停" }
      ],
      code: "name",
      placeholder: "类别"
    }
  ];
  //表单确定按钮
  const buttonTransfer = val => {
    if (val.name == "confirm") {
      console.log("转学记录");
    }
  };

  //count或book.name改变了
  // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
  const getList = computed(() => {
    return getTransferStudentListAPI;
  });
  const columnTransfer = reactive([
    // { prop: "id", label: "序号", width: "80" },
    { prop: "oldSchoolName", label: "原学校" },
    { prop: "oldSemesterName", label: "原学期" },
    { prop: "schoolName", label: "转入学校" },
    { prop: "semesterName", label: "转入学期" },
    { prop: "email", label: "状态", defalt: "转学成功" },
    { prop: "reason", label: "原因" },
    { prop: "operatorName", label: "操作人" },
    { prop: "updatedAt", label: "修改时间" }
  ]);
  return {
    formInitTransfer,
    itemListTransfer,
    buttonTransfer,
    getList,
    columnTransfer
  };
};
//销售修改记录
const sell = (State, route) => {
  const salesmanChangeTable = ref(null);
  const formInitSell = reactive({
    studentSemesterId: route.query.id
  });
  const itemListSell = [
    {
      label: "销售",
      el: "input",
      code: "keyword",
      placeholder: "销售"
    }
  ];
  //表单确定按钮
  const buttonSell = val => {
    if (val.name == "confirm") {
      console.log("销售修改记录", val.value.keyword);
      salesmanChangeTable.value.update({ keyword: val.value.keyword });
    }
  };

  //count或book.name改变了
  // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
  const getSalesmanChangeList = computed(() => {
    return getSalesmanChangeListAPI;
  });
  const columnSell = reactive([
    // { prop: "id", label: "序号", width: "80" },
    { prop: "oldSalesmanNames", label: "更换前销售" },
    { prop: "newSalesmanName", label: "更换后销售" },
    { prop: "operatorName", label: "操作人" },
    { prop: "updatedAt", label: "修改时间" }
  ]);
  return {
    formInitSell,
    itemListSell,
    buttonSell,
    getSalesmanChangeList,
    salesmanChangeTable,
    columnSell
  };
};
</script>
<style lang="scss" scoped>
.applyInfo {
  display: flex;
  justify-content: space-between;
  .cost_item {
    display: inline-block;
    width: 160px;
  }
  .left {
    // flex: 1.2;
    width: 510px;
    flex-shrink: 0;
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
  .right {
    width: 100%;
    padding-left: 30px;
    flex: 1;
  }
}
</style>
