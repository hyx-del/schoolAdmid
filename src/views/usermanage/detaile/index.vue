<!--
 * @Author: 刘帝君
 * @Date: 2021-09-09 15:25:02
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-14 11:23:31
 * @Descripttion:
-->
<template>
  <div>
    <h2>学员详情</h2>
    <div class="studentDetaile">
      <el-row>
        <el-col :span="4" class="border-right">
          <div class="studentDetaileLeft">
            <div>
              <img :src="formInitData.avatar" alt="" />
            </div>
            <div>姓名：{{ formInitData.name }}</div>
            <div>电话：{{ formInitData.mobile }}</div>
            <div>账户储值：</div>
            <div>{{ formInitData.balance }}</div>
            <template v-if="isDetails === '2'">
              <div>
                <el-button
                  class="w90"
                  @click="adjustModal = true"
                  v-if="isShowButtom('s0601e')"
                >
                  余额调整
                </el-button>
              </div>
              <div>
                <el-button
                  class="w90"
                  @click="outModal = true"
                  v-if="isShowButtom('s0601f')"
                >
                  转出
                </el-button>
              </div>
            </template>
          </div>
        </el-col>
        <el-col :span="20">
          <div class="studentDetaileRight">
            <el-tabs v-model="activeName">
              <el-tab-pane label="基本信息" name="first">
                <BasicInfo
                  v-if="activeName === 'first' && formInitData.name"
                  :formInitData="formInitData"
                />
              </el-tab-pane>
              <el-tab-pane
                label="报名记录"
                name="second"
                v-if="isDetails === '1'"
              >
                <ReportLog v-if="activeName === 'second'" />
              </el-tab-pane>
              <el-tab-pane
                label="销售修改记录"
                name="third"
                v-if="isDetails === '1'"
              >
                <SalesmanChange v-if="activeName === 'third'" />
              </el-tab-pane>
              <el-tab-pane label="跟进记录" name="fourth">
                <FollowLog v-if="activeName === 'fourth'" />
              </el-tab-pane>
              <el-tab-pane
                label="线索记录"
                name="amend"
                v-if="isDetails === '1'"
              >
                <CluesLog v-if="activeName === 'amend'" />
              </el-tab-pane>
              <el-tab-pane label="储值余额" name="sex" v-if="isDetails === '1'">
                <BalanceLog v-if="activeName === 'sex'" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 余额调整 -->
    <el-dialog v-model="adjustModal" title="余额调整" width="50%">
      <formList
        :config="addFormConfig"
        :itemList="adjustList"
        :formInitData="adjustData"
        @buttonClick="adjustButton"
        @formChange="adjustChange"
      >
        <template v-slot:balanceInfo>
          <div>
            当前余额：{{ formInitData.balance }},调整后余额：{{ adjustMoney }}
          </div>
        </template>
        <template v-slot:balanceTip v-if="balanceTipData.show">
          <div style="color:red;line-height:1;margin-top:5px">
            {{ balanceTipData.content }}
          </div>
        </template>
      </formList>
    </el-dialog>
    <!-- 转出 -->
    <el-dialog v-model="outModal" title="余额转出" width="50%">
      <formList
        :config="addFormConfig"
        :itemList="outList"
        :formInitData="outData"
        @buttonClick="outButton"
        @formChange="outChange"
      >
        <template v-slot:balanceInfo>
          <div>
            当前余额：{{ formInitData.balance }},调整后余额：{{ outMoney }}
          </div>
        </template>
        <template v-slot:balanceTip v-if="showOutTip">
          <div style="color:red;line-height:1;margin-top:5px">
            可用余额不足
          </div>
        </template>
        <template v-slot:findPhone>
          <div class="findPhone">
            <div class="findBtn" @click="findPhone">
              <el-button size="small">查找</el-button>
            </div>
            <span v-if="transferStudent"
              >用户名：{{ transferStudent.name }} 手机号：{{
                transferStudent.mobile
              }}</span
            >
            <span v-if="!transferStudent" style="color:red">用户未找到</span>
          </div>
        </template>
      </formList>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import formList from "@/components/FormList/index.vue";
import { addFormConfig } from "../../../utils/config";
import { useRoute } from "vue-router";
import BasicInfo from "./basicInfo.vue";
import SalesmanChange from "./salesmanChange.vue";
import CluesLog from "./cluesLog.vue";
import BalanceLog from "./balanceLog.vue";
import FollowLog from "./followLog.vue";
import ReportLog from "./reportLog.vue";

import {
  updateStudentBalance,
  studentDetail,
  studentBalanceTransfer
} from "@/api/school";
import { userinfoByMobile } from "@/api/role";
import { dictType } from "@/api/dict";
import { ElMessage } from "element-plus";
import { isShowButtom } from "@/utils/permissionsButton";
export default {
  components: {
    formList,
    BasicInfo,
    SalesmanChange,
    CluesLog,
    BalanceLog,
    FollowLog,
    ReportLog
  },
  watch() {},
  setup() {
    // 学员id
    const id = useRoute().query.id;
    const state = reactive({
      //选项卡默认
      activeName: useRoute().query.tabs || "first",
      // 详情页不能操作
      isDetails: useRoute().query.isDetails,
      // 默认数据
      formInitData: {},
      // 余额调整参数
      adjustData: {},
      // 余额调整插槽
      adjustList: [
        {
          el: "radio",
          label: "调整到储值",
          code: "type",
          list: [
            { value: 1, label: "增加" },
            { value: 0, label: "减少" }
          ],
          afterSlot: "balanceInfo"
        },
        {
          code: "money",
          label: "金额",
          placeholder: "请输入金额",
          required: true,
          afterSlot: "balanceTip",
          type: "numberPoint2",
          disabled: true
        },
        {
          el: "select",
          code: "payType",
          label: "支付方式",
          fun: dictType,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          query: { type: "pay_type", useFlag: 1 },
          back: true // 从后台返回结果
        },
        {
          code: "reason",
          el: "textArea",
          label: "备注",
          placeholder: "请输入备注",
          required: false
        },
        {
          el: "img",
          code: "attatchs",
          label: "上传凭证",
          size: 1024,
          limit: 9,
          required: false
        }
      ],
      // 余额调整modal
      adjustModal: false,
      // 余额调整金额提示
      balanceTipData: {
        content: "请先选择调整储值类型",
        show: true
      },
      // 余额转出数据
      outData: {},
      // 余额转出插槽
      outList: [
        {
          el: "slot", //元素名字是slot
          slotName: "balanceInfo", // 插槽的名字，不能重复
          label: "调整后"
        },
        {
          code: "mobile",
          label: "手机",
          placeholder: "请输入要搜索的手机号",
          required: true,
          type: "phone",
          maxlength: 11,
          afterSlot: "findPhone"
        },
        {
          code: "money",
          label: "金额",
          placeholder: "请输入金额",
          required: true,
          type: "numberPoint2",
          disabled: true,
          afterSlot: "balanceTip"
        },
        // {
        //   el: "select",
        //   code: "payType",
        //   label: "支付方式",
        //   fun: dictType,
        //   funMode: "one",
        //   otherBack: "select_label", // label的返回值
        //   query: { type: "pay_type", useFlag: 1 },
        //   back: true // 从后台返回结果
        // },
        {
          code: "reason",
          el: "textArea",
          label: "备注",
          placeholder: "请输入备注",
          required: false
        },
        {
          el: "img",
          code: "attatchs",
          label: "上传凭证",
          size: 1024,
          limit: 9,
          required: false
        }
      ],
      // 余额转出modal
      outModal: false,
      // 搜索的手机号
      mobile: "",
      // 转入的学员信息
      transferStudent: null,
      // 是否转出提示
      showOutTip: false,
      // 余额调整输入金额
      adjustMoney: 0,
      // 余额转出输入金额
      outMoney: 0
    });
    // 页面载入后
    onMounted(() => {
      // 回显
      id && getStudentDetail();
    });
    // 学员详情
    const getStudentDetail = () => {
      studentDetail({ id }).then(({ code, data }) => {
        if (code == 200) {
          state.formInitData = data;
        }
      });
    };
    // 余额调整表单变化
    const adjustChange = val => {
      state.adjustList[val.code] = val.value;
      switch (val.code) {
        case "type":
          state.adjustData = {
            ...state.adjustData,
            balance: "",
            type: val.value
          };
          // 调整类型变化
          if (+val.value) {
            // 关闭金额提示
            state.balanceTipData.show = false;
            // 增加
            state.adjustList[1].disabled = false;
            state.adjustList = JSON.parse(JSON.stringify(state.adjustList));
          } else {
            // 减少
            if (+state.formInitData.balance) {
              // 关闭金额提示
              state.balanceTipData.show = false;
              // 关闭禁用
              state.adjustList[1].disabled = false;
              // 有余额的时候最大值为余额
              state.adjustList[1].maxCode = +state.formInitData.balance;
              state.adjustList = JSON.parse(JSON.stringify(state.adjustList));
            } else {
              // 更改提示语
              state.balanceTipData = {
                content: "可用余额不足",
                show: true
              };
              // 没有余额时禁用输入框
              state.adjustList[1].disabled = true;
              state.adjustList = JSON.parse(JSON.stringify(state.adjustList));
            }
          }
          break;
        case "money":
          if (+state.adjustData.type) {
            state.adjustMoney = Number(
              +state.formInitData.balance + +val.value
            ).toFixed(2);
          } else {
            state.adjustMoney = Number(
              +state.formInitData.balance - val.value
            ).toFixed(2);
          }
          break;
        default:
          break;
      }
    };
    // 调整余额
    const adjustButton = ({ text, value }) => {
      switch (text) {
        case "确认":
          updateStudentBalance({ ...value, studentId: id }).then(({ code }) => {
            ElMessage({
              message: `操作${code === 200 ? "成功" : "失败"}`,
              duration: 1000,
              type: "success",
              onClose: () => {
                getStudentDetail();
                state.adjustModal = false;
              }
            });
          });
          break;
        case "取消":
          state.adjustModal = false;
          break;
        default:
          break;
      }
    };
    // 余额转出
    const outButton = ({ text, value }) => {
      switch (text) {
        case "确认":
          studentBalanceTransfer({
            ...value,
            studentId: id,
            transferStudentId: state.transferStudent.id
          }).then(({ code }) => {
            ElMessage({
              message: `操作${code === 200 ? "成功" : "失败"}`,
              duration: 1000,
              type: "success",
              onClose: () => {
                getStudentDetail();
                state.outModal = false;
              }
            });
          });
          break;
        case "取消":
          state.outModal = false;
          break;
        default:
          break;
      }
    };
    // 余额转出表单变化
    const outChange = ({ code, value }) => {
      state.outList[code] = value;
      switch (code) {
        case "mobile":
          state.mobile = value;
          break;
        case "money":
          state.outMoney = (+state.formInitData.balance - value).toFixed(2);
          break;
        default:
          break;
      }
    };
    // 查找手机号
    const findPhone = () => {
      if (state.mobile) {
        userinfoByMobile({ mobile: state.mobile }).then(res => {
          if (res) {
            if (!res.msg) {
              ElMessage.success("查询成功");
            } else {
              ElMessage.warning("手机号不存在！");
            }
            // 查找到用户
            state.transferStudent = res.data;
            // 判断是否有余额
            if (+state.formInitData.balance) {
              // 关闭金额提示
              state.showOutTip = false;
              // 关闭禁用
              state.outList[2].disabled = false;
              // 有余额的时候最大值为余额
              state.outList[2].maxCode = +state.formInitData.balance;
              state.outList = JSON.parse(JSON.stringify(state.outList));
            } else {
              state.showOutTip = true;
              // 没有余额时禁用输入框
              state.outList[2].disabled = true;
              state.outList = JSON.parse(JSON.stringify(state.outList));
            }
          } else {
            // 未找到重置参数
            state.outData = { ...state.outData, mobile: "" };
            state.transferStudent = null;
            state.mobile = "";
          }
        });
      }
    };
    return {
      ...toRefs(state),
      addFormConfig,
      adjustChange,
      adjustButton,
      getStudentDetail,
      outButton,
      outChange,
      isShowButtom,
      findPhone
    };
  }
};
</script>

<style lang="scss" scoped>
.w90 {
  width: 90px;
}
.cf {
  cursor: pointer;
  color: #409eff;
}
.studentDetaile {
  padding-top: 10px;
  color: #333;
  border-top: 1px solid #ccc;
  .border-right {
    border-right: 1px solid #ccc;
  }
  .studentDetaileLeft {
    text-align: center;
    line-height: 30px;
    padding-top: 14px;
    div {
      margin-top: 10px;
    }
    img {
      max-width: 100px;
      max-height: 100px;
    }
  }
  .studentDetaileRight {
    padding-left: 10px;
  }
}
.findPhone {
  padding: 5px 0;
  line-height: 1;
  position: relative;
  .findBtn {
    position: absolute;
    right: 50px;
    top: -36px;
  }
}
</style>
