<!--
 * @Author: jiu yin
 * @Date: 2021-09-02 17:55:45
 * @LastEditTime: 2021-11-04 11:12:06
 * @LastEditors: 刘帝君
 * @Description: 666
 * @FilePath: \school_admin\src\views\coursesManagement\packageRegistration\details\index.vue
 *  “jiu”
-->
<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="报名表单" name="first">
        <div class="applyInfo" v-if="activeName == 'first'">
          <div class="left">
            <h2>报名信息</h2>
            <formShow
              ref="formShow"
              :config="tabelFormConfigs"
              :itemList="itemListDetaleInfo"
              :formInitData="applyData"
            >
            </formShow>
          </div>

          <div class="right">
            <h2>优惠</h2>
            <p class="f14"><span class="wdt">早鸟折扣：</span>95 折</p>
            <p
              class="f14"
              v-for="val in applyData.discountPercents"
              :key="val.id"
            >
              <span class="wdt"> {{ val.name }}：</span> {{ val.percent }}折
            </p>
            <formShow
              ref="formShow"
              :itemList="itemListdiscount"
              :formInitData="formInitdiscount"
            >
            </formShow>
            <h2>报名费用</h2>
            <div class="f14">
              <span>
                <span class="wdt" style="width:100px"> 原总价：</span>
                <span class="wdl">{{ applyData.price }}元</span>
              </span>
              <span>
                <span class="wdt" style="width:100px"> 优惠：</span>
                <span class="wdl">{{ applyData.tuitionPrivilege }}元</span>
              </span>
            </div>
            <el-divider></el-divider>
            <v-costInfo
              :formData="applyData"
              @returnsData="returnsData"
            ></v-costInfo>
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
            :params="adjustTheTableData"
            :showSortIndex="{ show: true, lable: '序号' }"
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
            :params="paymentParams"
            :showSortIndex="{ show: true, lable: '序号' }"
          />
        </div>
        <!-- 查看凭证 -->
        <el-dialog title="查看凭证" v-model="checkVoucher" width="600px">
          <div class="dialogBody" v-if="checkVoucher">
            <formShow
              ref="formShow"
              :itemList="itemListVoucher"
              :formInitData="formInitVoucher"
            />
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="转套餐记录" name="fourth">
        <div v-if="activeName == 'fourth'">
          <formList
            :config="tabelFormConfig"
            :itemList="itemListTransfer"
            :formInitData="formInitTransfer"
            @buttonClick="buttonTransfer"
          >
          </formList>
          <Table
            ref="TableList"
            :loadData="getList"
            :column="columnTransfer"
            :params="transferRecordParams"
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
            :params="salesRecordTable"
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
import {
  toSignupInformation,
  adjustTheList,
  paymentList,
  salesRecordList,
  refundModifythe,
  transferRecordList
} from "@/api/coursesManagement";
import vCostInfo from "./costInfo.vue";
import { payChannel } from "@/utils/enum/select";
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
import { staffGetSaleStaffList } from "@/api/managerStaff";
import { dictType } from "@/api/dict";
import formShow from "@/components/FormList/detailShow";

export default defineComponent({
  components: {
    formList,
    Table,
    detailShow,
    vCostInfo,
    UploadImgDrag,
    Templatedetail,
    formShow
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    //逻辑层主体
    const state = reactive({
      // 查看凭证
      formInitVoucher: {},
      checkVoucher: false,
      //选项卡默认
      activeName: "first",
      applyData: {
        isMealStatus: -1,
        isQuarterage: 0
      },
      // 优惠
      formInitdiscount: {},
      options: [],
      detaleData: {}
    });
    //优惠
    const discounts = discount();
    //报名信息
    const detaleInfos = detaleInfo(state);
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
        {
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
    //选项卡
    const handleClick = (tab, event) => {
      console.log(tab.index);
    };

    // 套餐报名详情
    const packageDetails = () => {
      toSignupInformation({ studentMainCourseId: route.query.id }).then(res => {
        if (res.code == 200) {
          res.data.idCardImagesFront = res.data.id_card_images
            ? res.data.id_card_images.front
            : "";
          res.data.idCardImagesReverse = res.data.id_card_images
            ? res.data.id_card_images.reverse
            : "";
          res.data.studentMainCourseId = route.query.id;
          state.applyData = res.data;
          state.formInitdiscount = res.data;
          console.log(res.data, "报名信息");
        }
      });
    };
    onMounted(() => {
      packageDetails();
    });

    const returnsData = val => {
      packageDetails();
      console.log(val, "回调数据12");
    };

    return {
      ...toRefs(state),
      tabelFormConfig,
      tabelFormConfigs,
      handleClick,
      returnsData,
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
  const itemListdiscount = [
    {
      code: "money",
      label: "优惠券抵扣:",
      suffix: "元"
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
    itemListdiscount,
    buttonDiscount,
    configDiscount
  };
};
//报名信息
const detaleInfo = info => {
  //弹框显示
  const dialogFormVisible = ref(false);
  const router = useRouter();
  //表单信息
  const formInitDetaleInfo = reactive(info);
  const itemListDetaleInfo = [
    {
      type: "phone",
      code: "contact",
      label: "手机号",
      required: true
    },
    {
      code: "name",
      label: "学员姓名",
      type: "zh",
      required: true
    },
    {
      code: "englishName",
      label: "英文名",
      type: "letter"
    },
    {
      code: "mainCourseName",
      label: "报名学期",
      required: true
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
      code: "salesmanNames",
      label: "销售",
      fun: staffGetSaleStaffList,
      funMode: "one",
      otherBack: "select_label", // label的返回值
      back: true, // 从后台返回结果
      labelCode: "name", // 指定的label名
      valueCode: "id", // 指定的value名
      required: false,
      multiple: true
    },
    {
      code: "idCard",
      type: "identity",
      label: "身份证号",
      placeholder: "请输入身份证号"
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
      placeholder: "请输入紧急联系人电话"
    },
    {
      code: "address",
      label: "家庭住址",
      placeholder: "请输入家庭地址"
    },
    { el: "textArea", code: "remarks", label: "备注" }
  ];

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
  // 销售数据
  staffGetSaleStaffList()
    .then(res => {
      info.options = res.data;
    })
    .catch(err => {});

  // 销售弹窗确定
  const sales = () => {
    let str = "";
    formInitDetaleInfo.salesmanId.forEach(val => {
      str = str + val + ",";
    });

    const objData = {
      ...info.applyData,
      salesmanId: str.slice(0, -1),
      ...info.detaleData
    };

    console.log(objData, "销售弹窗确定");
    info.applyData = objData;
    dialogFormVisible.value = false;
  };

  //报名信息保存
  const buttonInfo = val => {
    val.value.isQuarterage = 0;
    val.value.isMealStatus = -1;
    console.log(val, "报名信息保存");
    refundModifythe({ ...val.value }).then(res => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: `操作成功`
        });
        router.push({
          path: "/overall/packageRegistration"
        });
      }
    });
  };

  const formChange = val => {
    if (val.code == "idCard") {
      info.detaleData.idCard = val.value;
    } else if (val.code == "remarks") {
      info.detaleData.remarks = val.value;
    }
  };

  return {
    formInitDetaleInfo,
    itemListDetaleInfo,
    tabelFormConfigs,
    buttonInfo,
    sales,

    formChange,
    dialogFormVisible
  };
};
//费用调整记录
const cost = (state, route) => {
  const costsTable = ref(null);
  const costFormInitData = reactive({});
  const adjustTheTableData = reactive({
    studentMainCourseId: route.query.id
  });
  const itemListCot = [
    {
      label: "费用类型",
      el: "select",
      list: [
        { value: "10", label: "定金" },
        { value: "20", label: "学费" },
        { value: "50", label: "提成" },
        { value: "70", label: "代补款项" }
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

  const getStudentAdjustList = computed(() => {
    return adjustTheList;
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
    adjustTheTableData,
    itemListCot,
    costsTable,
    buttonCot,
    getStudentAdjustList,
    column
  };
};
//付款记录
const payment = (state, route) => {
  const paymentTable = ref(null);
  const formInitPayment = reactive({});
  const paymentParams = reactive({
    studentMainCourseId: route.query.id
  });
  const itemListPayment = [
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
      label: "订单类型",
      el: "select",
      list: [
        { value: "10", label: "学期" },
        { value: "20", label: "全面课程" }
      ],
      code: "relationMode",
      placeholder: "订单类型"
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
      placeholder: "状态",
      list: [
        { value: "0", label: "未支付" },
        { value: "8", label: "支付中" },
        { value: "10", label: "支付成功" },
        { value: "-10", label: "支付失败" }
      ],
      placeholder: "状态"
    },
    {
      label: "下单渠道",
      el: "select",
      list: [
        { value: "1", label: "后台" },
        { value: "2", label: "小程序" },
        { value: "3", label: "App" }
      ],
      code: "platform",
      placeholder: "下单渠道"
    }
  ];
  //表单确定按钮
  const buttonPayment = val => {
    if (val.name == "confirm") {
      console.log(val, "付款记录");
      paymentTable.value.update({ ...val.value });
    }
  };

  const getStudentPaymentList = computed(() => {
    return paymentList;
  });

  const columnpayment = reactive([
    // { prop: "id", label: "序号", width: "80" },
    { prop: "relationId", label: "订单号" },
    {
      prop: "orderType",
      label: "订单类型",
      html: (row, val) => {
        if (val == "10") return "付款";
        else if (val == "-10") return "退款";
      }
    },
    { prop: "typeName", label: "支付类型" },
    { prop: "channelName", label: "付款方式" },
    { prop: "amount", label: "支付金额" },
    { prop: "statusName", label: "状态" },
    { prop: "tradeNo", label: "交易号" },
    { prop: "platformName", label: "下单渠道" },
    { prop: "remark", label: "支付备注" },
    { prop: "createdAt", label: "创建时间" },
    {
      prop: "action",
      label: "操作",
      width: "120px",
      actives: [
        {
          name: val => {
            return "查看凭证";
          },
          method: val => {
            console.log(val, "查看凭证");
            state.formInitVoucher = { pictures: val.attaches };
            state.checkVoucher = true;
          }
        }
      ]
    }
  ]);

  const itemListVoucher = [
    {
      el: "img",
      code: "pictures",
      label: "凭证图片"
    }
  ];
  return {
    formInitPayment,
    itemListPayment,
    buttonPayment,
    paymentParams,
    getStudentPaymentList,
    paymentTable,
    columnpayment,
    itemListVoucher
  };
};
//转学记录
const transfer = (state, route) => {
  const formInitTransfer = reactive({});
  const TableList = ref(null);
  const transferRecordParams = reactive({
    mainCourseId: route.query.id
  });
  const itemListTransfer = [
    {
      label: "搜索",
      el: "input",
      code: "keyWord",
      placeholder: "搜索学期名称和套餐名称"
    }
  ];
  //表单确定按钮
  const buttonTransfer = val => {
    if (val.name == "confirm") {
      console.log(val, "转学记录");
      TableList.value.update({ keyWord: val.value.keyWord });
    }
  };
  const getList = computed(() => {
    return transferRecordList;
  });
  const columnTransfer = reactive([
    // { prop: "id", label: "序号", width: "80" },
    { prop: "schoolName", label: "原学校" },
    { prop: "semesterName", label: "原学期" },
    { prop: "mainCourseName", label: "转入套餐" },
    { prop: "reason", label: "原因" },
    { prop: "operatorName", label: "操作人" },
    { prop: "createdAt", label: "创建时间" }
  ]);
  return {
    formInitTransfer,
    itemListTransfer,
    buttonTransfer,
    getList,
    TableList,
    transferRecordParams,
    columnTransfer
  };
};
//销售修改记录
const sell = (state, route) => {
  const salesmanChangeTable = ref(null);
  // const route = useRoute();
  const formInitSell = reactive({});
  const salesRecordTable = reactive({
    studentMainCourseId: route.query.id,
    staffName: ""
  });

  const itemListSell = [
    {
      label: "销售",
      el: "input",
      code: "staffName",
      placeholder: "销售"
    }
  ];
  //表单确定按钮
  const buttonSell = val => {
    if (val.name == "confirm") {
      console.log("销售修改记录", val.value);
      salesmanChangeTable.value.update({ ...val.value });
    }
  };

  const getSalesmanChangeList = computed(() => {
    return salesRecordList;
  });
  const columnSell = reactive([
    // { prop: "id", label: "序号", width: "80" },
    { prop: "oldSalesmanName", label: "更换前销售" },
    { prop: "newSalesmanName", label: "更换后销售" },
    { prop: "operatorName", label: "操作人" },
    { prop: "updatedAt", label: "修改时间" }
  ]);
  return {
    formInitSell,
    salesRecordTable,
    itemListSell,
    buttonSell,
    getSalesmanChangeList,
    salesmanChangeTable,
    columnSell
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
.wdt {
  width: 112px;
  display: inline-block;
  text-align: right;
}
.wdl {
  width: 100px;
  display: inline-block;
  text-align: left;
}
.f14 {
  font-size: 14px;
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
</style>
