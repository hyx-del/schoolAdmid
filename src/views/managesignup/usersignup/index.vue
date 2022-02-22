<template>
  <div>
    <div class="title">
      <formList
        :config="config"
        :itemList="itemList"
        :formInitData="formInitData"
        @buttonClick="button"
      />
    </div>
    <div class="table">
      <Table
        ref="TableList"
        :loadData="getList"
        :column="column"
        :params="formInitData"
        :showSortIndex="{ show: true, lable: '序号' }"
      />
    </div>
    <el-dialog
      v-if="dialogTrans"
      v-model="dialogTrans"
      title="转学"
      width="500px"
    >
      <formList
        :config="configTrans"
        :itemList="itemListTrans"
        :formInitData="formInitTrans"
        @buttonClick="buttonTrans"
      >
      </formList>
    </el-dialog>
    <el-dialog
      v-if="dialogPack"
      v-model="dialogPack"
      title="转套餐"
      width="600px"
      top="50px"
      @closed="openedPack"
      destroy-on-close
    >
      <emptyBox>
        <div class="title">当前报名信息</div>
        <formList
          :config="configPack"
          :itemList="itemListPack"
          :formInitData="formInitPack"
        />
        <div class="line"></div>
        <div class="title">转学信息</div>
        <formList
          ref="formPack"
          :config="configPack2"
          :itemList="itemListPack2"
          :formInitData="formInitPack2"
          @formChange="formChangePack2"
          @buttonClick="buttonPack2"
        />
      </emptyBox>
      <template #footer>
        <el-button @click="dialogPack = false">取 消</el-button>
        <el-button type="primary" @click="dialogBttonPack">确 定</el-button>
      </template>
    </el-dialog>
    <!--    // 组合支付-->
    <el-dialog
      v-if="paymentVisibles"
      title="尾款调整"
      v-model="paymentVisibles"
      width="1200px"
      top="50px"
    >
      <emptyBox>
        <formList
          ref="fromPay"
          :itemList="payList"
          :formInitData="paymentData"
          :config="payFormConfig"
          @buttonClick="buttonPays"
          @formChange="formChangePay"
          @checkItem="checkItem"
          :showList="showList"
          :hideList="hideList"
        >
          <template #add>
            <addFormList
              ref="addFormListRef"
              v-model:dataList="addDataList"
              :itemList="addList"
              v-model:valid="addValid"
            ></addFormList>
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
import formList from "@/components/FormList/index.vue";
import addFormList from "@/components/FormList/addFormList.vue";
import emptyBox from "@/components/emptyBox/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, createElementBlock } from "vue";
import { schoolList, registrationExport } from "@/api/headquarters";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  registrationCancelDelete,
  registrationCheckinPost,
  registrationDelayPost,
  registrationList,
  semesterOptions,
  transferMainCoursePut,
  transferSchoolPut
} from "@/api/studentSemester";
import {
  getListHtml,
  payChannel,
  payOnlineList2,
  reportStatusList
} from "@/utils/enum/select";
import { semesterList, semesterListBySchoolId } from "@/api/semester";
import { deleteItem, messageBox, objToUrl, operation } from "@/utils/tools";
import { staffGetSaleStaffList } from "@/api/managerStaff";
import { url } from "@/config";
import {
  couponManagementList,
  couponManagementSingle,
  courseGetMainCourseByCategoryId,
  courseGetMainCourseByCategoryIdPost,
  discountManagementList
} from "@/api/discount";
import {
  comprehensiveCurriculumInfo,
  orderPayPost
} from "@/api/coursesManagement";
import { orderPaymentPost, orderRefundPost } from "@/api/courseOrder";
import vForm from "@/views/managesignup/usersignup/detaile/form";
import { dictType } from "@/api/dict";
import store from "@/store";
// 不可点击状态+
// 1报到（已毕业、转学成功、取消报名、三个状态下不可操作）
// 2. 转学（已毕业、转学成功、取消报名、三个状态下不可操作）
// 3. 延期（已毕业、转学成功、取消报名、三个状态下不可操作）
// 4. 取消报名（存在已付款金额、已毕业、转学成功、取消报名、四种情况下不可操作）
export default {
  components: {
    emptyBox,
    formList,
    addFormList,
    Table,
    vForm
  },
  setup() {
    const router = useRouter();
    const addFormListRef = ref(null);
    const formPack = ref(null);
    const TableList = ref(null);
    const fromPay = ref(null); //尾款form的ref
    const state = reactive({
      // 转学弹窗
      dialogTrans: false,
      configTrans: {
        buttons: [
          {
            funType: "cancel",
            name: "取消",
            size: "small"
          },
          {
            funType: "confirm",
            type: "primary",
            name: "确定",
            size: "small"
          }
        ]
      },
      itemListTrans: [
        {
          label: "姓名",
          code: "studentName",
          disabled: true,
          required: false
        },
        {
          label: "电话",
          code: "mobile",
          disabled: true,
          required: false
        },
        {
          el: "select",
          label: "转入学校",
          code: "schoolId",
          fun: schoolList,
          funMode: "table",
          query:{
            status:20
          },
          otherBack: "schoolName", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          seriesCode: "semesterId",
          seriesFun: val => ({ schoolId: val })
        },
        {
          el: "select",
          code: "semesterId",
          label: "转入学期",
          fun: semesterList,
          funMode: "table",
          otherBack: "semesterName", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          filterable: true, //在已有值里面搜索
          firstRequest: false //第一次不请求
        },
        {
          el: "textArea",
          label: "原因",
          code: "reason"
        }
      ],
      formInitTrans: {},
      buttonTrans: val => {
        if (val.name == "cancel") {
          state.dialogTrans = false;
        }
        if (val.name == "confirm") {
          let data = { ...val.value, studentSemesterId: val.value.id };
          transferSchoolPut(data).then(res => {
            ElMessage.success("转学成功");
            state.dialogTrans = false;
            TableList.value.update();
          });
        }
      },
      // 转学弹窗--end
      formInitData: {},
      getList: registrationList,
      config: {
        countList: ["ad1+adb=adc", "(ad1+adb)*100*adb=add"],
        allRequired: false, // 是否全部必填
        inline: true, //行内
        colon: "",
        inputStyle: {
          width: "240px"
        },
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "查 询",
            size: "small"
          },
          {
            perCode: "s0201a",
            funType: "add",
            name: "新 增",
            size: "small"
          },
          {
            perCode: "s0201i",
            funType: "confirm",
            type: "primary",
            name: "导出",
            size: "small"
          }
        ]
      },
      itemList: [
        {
          label: "报到状态",
          el: "select",
          list: reportStatusList,
          code: "status"
        },
        {
          el: "select",
          code: "salesmanId",
          label: "销售",
          fun: staffGetSaleStaffList,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名,
          filterable: true // 可搜索
        },
        {
          el: "select",
          code: "semesterId",
          label: "学期",
          fun: semesterListBySchoolId,
          funMode: "table",
          otherBack: "select_label", // label的返回值
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          filterable: true, // 可搜索
          remoteMethod: name => ({ name }),
          remote: true
        },
        {
          code: "keyword",
          label: "搜索",
          placeholder: "搜索学员姓名和手机号"
        }
        // {
        //   code: 'ad1',
        //   label: '加数',
        //   type:'numberPoint'
        // },
        // {
        //   code: 'adb',
        //   label: '加数',
        //   type:'numberPoint'
        // },
        // {
        //   code: 'adc',
        //   label: '和',
        //   // type:'numberPoint'
        // },
        // {
        //   code: 'add',
        //   label: '乘',
        //   // type:'numberPoint'
        // },
        // {
        //   code: 'zh',
        //   label: 'zh',
        //   type:'identity'
        // },
      ],
      column: [
        // { prop: "id", label: "序号", width: "80" },
        {
          prop: "studentName",
          label: "姓名"
        },
        { prop: "mobile", label: "手机" },
        { prop: "semesterName", label: "学期" },
        { prop: "className", label: "班级" },
        { prop: "dormName", label: "宿舍" },
        {
          prop: "statusName",
          label: "报到状态",
          html: (row, val) => (row.status == 0 ? "未报道" : val)
        },
        { prop: "earnestPaid", label: "已付定金" },
        { prop: "finalPaid", label: "已付尾款" },
        {
          prop: "squareUp",
          label: "是否结清",
          html: (row, val) => (val ? "是" : "否")
        },
        { prop: "shareMemberName", label: "推荐人" },
        { prop: "salesmanNames", label: "销售" },
        { prop: "tradeTypeName", label: "成单类型" },
        {
          prop: "action",
          label: "操作",
          width: "380px",
          actives: [
            {
              perCode: "s0201b",
              name: val =>
                ["20", "30", "0", "10"].some(v => v == val.status)
                  ? "编辑"
                  : "",
              path: "editApply"
            },
            {
              perCode: "s0201c",
              name: "详情",
              // path: "Detaile",
              method: row => {
                router.push({
                  path: "Detaile",
                  query: {
                    id: row.id,
                    semesterId: row.semesterId,
                    sId: row.studentId
                  }
                });
              }
            },
            {
              perCode: "s0201f",
              name: val =>
                ["0", "10", "30"].some(v => v == val.status) ? "报到" : "",
              method: row => {
                messageBox(row, registrationCheckinPost, TableList, {
                  title: "确认报到吗?",
                  success: "报到成功"
                });
              }
            },
            {
              perCode: "s0201e",
              name: val =>
                ["0", "10", "20"].some(v => v == val.status) ? "延期" : "",
              method: val => {
                messageBox(val, registrationDelayPost, TableList, {
                  title: "确定延期？"
                });
              }
            },
            {
              perCode: "s0201g",
              name: row =>
                ["0", "10", "20", "30"].some(v => v == row.status)
                  ? "转学"
                  : "",
              method: val => {
                state.formInitTrans = { ...val, ...{ semesterId: "" } };
                state.dialogTrans = true;
              }
            },
            {
              perCode: "s0201h",
              name: row =>
                ["0", "10", "20", "30"].some(v => v == row.status) &&
                row.enable2MainCourse
                  ? "转套餐"
                  : "",
              // ["10", "20", "30"].some(v => v == row.status) ? "转套餐" : "",
              method: row => {
                if (!row.semesterCategoryId) {
                  ElMessage.error("没有派别，不能转套餐");
                  return;
                }
                state.dialogPack = true;
                state.formInitPack = row;
                state.itemListPack2[0].query.categoryId =
                  row.semesterCategoryId;
                state.formInitPack2.paidTotalAmount = row.paidTotalAmount;
                state.formInitPack2.studentSemesterId = row.id;
              }
            },
            {
              perCode: "s0201d",
              name: row =>
                row.enableCancel &&
                ["0", "10", "20", "30"].some(v => v == row.status)
                  ? "取消报名"
                  : "",
              method: row => {
                deleteItem(row, registrationCancelDelete, TableList, {
                  title: "确定取消？"
                });
              }
            }
          ]
        }
      ],
      // 转套餐
      dialogPack: false,
      openedPack: () => {
        formPack.value.reset();
      },
      configPack: {
        allDisabled: true,
        allRequired: false,
        buttons: []
      },
      itemListPack: [
        {
          label: "已报名学期",
          code: "semesterName",
          disabled: true
        },
        {
          label: "学期派别",
          code: "semesterCategoryName",
          disabled: true
        },
        {
          label: "已付学费",
          code: "paidTotalAmount",
          disabled: true
        },
        {
          code: "salesmanNames",
          label: "销售",
          placeholder: "没有销售员",
          disabled: true
        }
      ],
      formInitPack: {},
      configPack2: {
        // allDisabled:true,
        allRequired: true,
        buttons: []
      },
      itemListPack2: [
        {
          el: "select",
          code: "mainCourseId",
          label: "选择套餐",
          fun: courseGetMainCourseByCategoryId,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { status: 1, categoryId: "" },
          labelCode: "name", // 指定的label名
          valueCode: "id" // 指定的value名
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
          required: true,
          multiple: true,
          filterable: true // 可搜索
        },
        {
          label: "原价",
          code: "price",
          disabled: true
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
          // defalt:0
        },
        {
          label: "优惠后总价",
          code: "endTatol",
          disabled: true,
          tips: "总价 * 折扣乘积 *95折 - 优惠劵抵扣金额 = 优惠后总价"
        },
        {
          label: "转入费用",
          code: "paidTotalAmount",
          disabled: true
        },
        {
          label: "待补差价",
          code: "diffMoney",
          disabled: true
        },
        {
          el: "radio",
          label: "差价支付",
          code: "payDiffType",
          list: [
            {
              label: "转入前支付",
              value: "1"
            },
            {
              label: "转入后支付",
              value: "2"
            }
          ]
        }
      ],
      formInitPack2: {
        discount: 1,
        discountCash: 0
      },
      formChangePack2: val => {
        state.formInitPack2[val.code] = val.value;
        if (val.code == "mainCourseId") {
          if (val.value) {
            comprehensiveCurriculumInfo({ id: val.value }).then(res => {
              let info = res.data;
              state.formInitPack2 = { ...state.formInitPack2, ...info };
              let pack2 = { ...state.formInitPack2 };
              pack2.discountCash = pack2.discountCash || 0;
              pack2.discount = pack2.discount || 1;
              state.upDiffMoney(pack2);
            });
          } else {
            let pack2 = { ...state.formInitPack2, price: 0 };
            pack2.discountCash = pack2.discountCash || 0;
            pack2.discount = pack2.discount || 1;
            state.upDiffMoney(pack2);
          }
        }
        // 折扣
        if (val.code == "discountPercentIds") {
          let pack2 = { ...state.formInitPack2 };
          let discountArr = [];
          pack2.discount = 1;
          if (val.allList.length > 0) {
            discountArr = val.allList.map(v => parseFloat(v.percent || 1));
            pack2.discount =
              parseInt(discountArr.reduce((pre, cur) => pre * cur) * 10000) /
              10000;
          }
          state.upDiffMoney(pack2);
        }
        // 减去优惠
        if (val.code == "discountCashId") {
          let pack2 = { ...state.formInitPack2 };
          pack2.discountCash = val.allList[0] ? val.allList[0].money : 0;
          state.upDiffMoney(pack2);
        }
      },
      upDiffMoney: pack2 => {
        // 总价 * 折扣 - 优惠劵抵扣金额 = 优惠后总价
        pack2.endTatol = operation(pack2, "price*discount*0.95-discountCash");
        let diffMoney = operation(pack2, "paidTotalAmount-endTatol");
        pack2.diffMoney = diffMoney > 0 ? 0 : Math.abs(diffMoney);
        state.formInitPack2 = pack2;
      },
      buttonPack2: val => {
        if (val.valid) {
          transferMainCoursePut({ ...val.value }).then(res => {
            setTimeout(() => {
              ElMessage.success("转套餐成功");
            }, 500);
            if (val.value.payDiffType == 2 || val.value.diffMoney == 0) {
              state.dialogPack = false;
            } else {
              let { diffMoney } = val.value;
              state.studentMainCourseId = res.data.studentMainCourseId;
              state.paymentData = {
                diffMoney,
                studentMainCourseId: res.data.studentMainCourseId
              };
              state.paymentVisibles = true;
            }
          });
        }
      },
      studentMainCourseId: "",
      dialogBttonPack: () => {
        formPack.value.confirm();
      },
      // 组合支付
      payType: false,
      paymentVisibles: false,
      payFormConfig: {
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
          label: "待补差价",
          code: "diffMoney",
          preCheck: true
        },
        {
          label: "总额",
          code: "semesterCategoryName",
          disabled: true
        },
        {
          el: "radio",
          code: "type",
          label: "支付类型",
          list: payOnlineList2,
          required: true,
          backType: "Number"
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
          funMode: "one",
          back: true,
          otherBack: "select_label", // label的返回值
          query: { type: "pay_type", useFlag: 1 },
          required: true,
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
          required: true,
          limit: 9
        }
      ],
      showList: [],
      hideList: [],
      formChangePay: val => {
        state.paymentData[val.code] = val.value;
        if (state.countArr.includes(val.code)) {
          state.countArrObj[val.code].value = val.value || 0;
          let semesterCategoryName = 0;
          for (let key in state.countArrObj) {
            semesterCategoryName += parseFloat(state.countArrObj[key].value);
          }
          state.paymentData = { ...state.paymentData, semesterCategoryName };
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
      countArr: ["diffMoney"],
      countArrObj: {
        diffMoney: {
          type: 70,
          name: "待补差价",
          value: 0
        }
      },
      checkItem: val => {
        if (state.countArr.includes(val.code)) {
          state.countArrObj[val.code].value = val.checkValue ? val.value : 0;
          let semesterCategoryName = 0;
          for (let key in state.countArrObj) {
            semesterCategoryName += parseFloat(
              state.countArrObj[key].value || 0
            );
          }
          state.paymentData = { ...state.paymentData, semesterCategoryName };
        }
      },
      // 可以加减的元素
      addValid: false,
      addList: [
        {
          el: "select",
          code: "channel",
          label: "支付方式",
          fun: dictType,
          back: true,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          query: { type: "pay_type", useFlag: 1 },
          valueStyle: {
            width: "240px"
          },
          inputStyle: {
            width: "100%"
          }
        },
        {
          code: "amount",
          label: "支付金额",
          type: "numberPoint2"
        },
        {
          code: "tradeNo",
          label: "交易号",
          valueStyle: {
            width: "240px"
          },
          inputStyle: {
            width: "100%"
          }
        },
        {
          el: "date",
          code: "paymentTime",
          label: "付款时间",
          dataFormat: "{y}-{m}-{d} {h}:{i}:{s}",
          valueStyle: {
            width: "290px"
          },
          inputStyle: {
            width: "100%"
          }
        }
      ],
      addDataList: [{}],
      popSubmit: () => {
        fromPay.value
          .confirm()
          .then(val => {
            let {
              diffMoney,
              attaches,
              semesterCategoryName,
              remark,
              channel,
              paymentTime,
              tradeNo,
              studentMainCourseId,
              id: studentSemesterId,
              payments: combination
            } = val.value;

            studentMainCourseId = Number(studentMainCourseId);
            let data = {
              studentMainCourseId,
              attaches,
              remark,
              semesterCategoryName
            };
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
              data.paymentOrderList = [
                { amount: diffMoney, channel, paymentTime, tradeNo }
              ];
              orderPayPost(data)
                .then(res => {
                  ElMessage.success("转套餐成功");
                  state.paymentVisibles = false;
                  state.dialogPack = false;
                })
                .finally(() => {
                  state.dialogPack = false;
                });
            }
            if (val.value.type == 20) {
              // 获取多条记录
              addFormListRef.value.getValue().then(res => {
                data.paymentOrderList = res.value;
                orderPayPost(data).then(() => {
                  ElMessage.success("转套餐成功");
                  state.paymentVisibles = false;
                  state.dialogPack = false;
                });
              });
            }
          })
          .catch(err => {
            console.log("err", err);
          })
          .finally(() => {
            state.dialogPack = false;
          });
      },
      buttonPays: val => {
        if (val.name == "confirm" && val.valid) {
        }
      }
    });
    const button = val => {
      if (val.name == "add") {
        router.push("addUsersignup");
      }
      if (val.text == "查 询") {
        TableList.value.update(val.value);
      } else if (val.text === "导出") {
        val.value.schoolId = store.getters.activeSchoolId;
        let {semesterId='',status='',salesmanId='',keyword=''} = val.value ;
        let par =objToUrl({semesterId,status,salesmanId,keyword})
        window.open(`${url.APIUrl}/admin/school/registration/export${par}`);
      }
    };
    return {
      ...toRefs(state),
      TableList,
      addFormListRef,
      formPack,
      fromPay,
      button
    };
  }
};
</script>

<style lang="scss" scoped>
.name {
  cursor: pointer;
  color: #2e8de6;
}
.title {
  font-size: 20px;
  margin-bottom: 20px;
}
.line {
  height: 1px;
  margin: 16px 0;
  background: #999;
}
</style>
