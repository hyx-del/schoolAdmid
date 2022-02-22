<!--
 * @Author: jiu yin
 * @Date: 2021-09-02 17:55:45
 * @LastEditTime: 2021-11-04 14:18:56
 * @LastEditors: 刘帝君
 * @Description: 666
 * @FilePath: \school_admin\src\views\managesignup\usersignup\detaile\index.vue
 *  “jiu”
-->
<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="报名表单" name="first">
        <div class="applyInfo">
          <div class="left">
            <h2>报名信息</h2>
            <formList
              :config="tabelFormConfigs"
              :itemList="itemListDetaleInfo"
              :formInitData="applyData"
              @formChange="formChange"
              @buttonClick="buttonInfo"
            >
              <template v-slot:afterSlot2>
                <el-button
                  v-if="isShowButtom('a0802j')"
                  type="primary"
                  size="mini"
                  style="margin-left: 20px;"
                  @click="modify"
                  >修改</el-button
                >
              </template>
            </formList>

            <el-dialog
              title="销售修改弹框"
              v-model="dialogFormVisible"
              width="400px"
            >
              <div class="dialogBody">
                销售员：<el-select
                  v-model="formInitDetaleInfo.salesmanId"
                  multiple
                  placeholder="请选择"
                >
                  <!-- multiple -->
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogFormVisible = false"
                    >取 消</el-button
                  >
                  <el-button type="primary" @click="sales">确 定</el-button>
                </span>
              </template>
            </el-dialog>
          </div>

          <div class="right">
            <h2>优惠</h2>
            <formList
              :config="configDiscount"
              :itemList="itemListdiscount"
              :formInitData="formInitdiscount"
              @buttonClick="buttonDiscount"
            >
              <template v-slot:slot1>
                <el-form-item label="早鸟折扣">
                  <el-input
                    disabled
                    placeholder="95"
                    style="width:200px"
                  ></el-input>
                  折
                </el-form-item>
                <el-form-item
                  :label="`${val.name}:`"
                  v-for="val in applyData.discountPercents"
                  :key="val.id"
                >
                  <el-input
                    disabled
                    placeholder="折扣"
                    style="width:200px"
                    v-model="val.percent"
                  ></el-input>
                  折
                </el-form-item>
              </template>
            </formList>
            <h2>报名费用</h2>
            <div>
              <span style="padding: 10px 20px;font-size:14px"
                >原总价：{{ applyData.price }}元</span
              >
              <span style="padding: 10px 20px;font-size:14px"
                >优惠：{{ applyData.tuitionPrivilege }}元</span
              >
            </div>
            <v-costInfo
              :formData="applyData"
              @returnsData="returnsData"
            ></v-costInfo>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import {
  toSignupInformation,
  refundModifythe,
  modifyTheSales
} from "@/api/coursesManagement";
import vCostInfo from "./costInfo.vue";
//身份证上传
import UploadImgDrag from "@/components/upload";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import Templatedetail from "@/views/tremtemplate/templatedetail.vue";
import { staffGetSaleStaffList } from "@/api/managerStaff";
import { isShowButtom } from "@/utils/permissionsButton";

export default defineComponent({
  components: {
    formList,
    Table,
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
      isShowButtom,
      tabelFormConfig,
      tabelFormConfigs,
      handleClick,
      returnsData,
      ...discounts,
      ...detaleInfos
    };
  }
});
// 优惠
const discount = () => {
  const itemListdiscount = [
    {
      el: "itemSlot", //元素名字是slot
      slotName: "slot1" // 插槽的名字，不能重复
    },
    {
      code: "money",
      label: "优惠券抵扣:",
      disabled: true,
      suffix: "元",
      placeholder: "0"
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
      required: true,
      disabled: true
    },
    {
      code: "name",
      label: "学员姓名",
      type: "zh",
      required: true,
      maxlength:12,
      minlength:2
    },
    {
      code: "englishName",
      label: "英文名",
      type: "letter",
      disabled: true
    },
    {
      code: "mainCourseName",
      label: "报名学期",
      required: true,
      disabled: true
    },
    {
      el: "radio",
      code: "gender",
      label: "性别",
      required: true,
      disabled: true,
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
      code: "salesmanId",
      label: "销售",
      fun: staffGetSaleStaffList,
      funMode: "one",
      otherBack: "select_label", // label的返回值
      back: true, // 从后台返回结果
      labelCode: "name", // 指定的label名
      valueCode: "id", // 指定的value名
      required: false,
      multiple: true,
      afterSlot: "afterSlot2",
      disabled: true
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
      limit: 1,
      style: { minWidth: "452px", width: "100%" }
    },
    {
      el: "img",
      code: "idCardImagesReverse",
      label: "身份证反面照片",
      size: 1024,
      limit: 1,
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
      placeholder: "请输入家庭地址",
      disabled: true
    },
    { el: "textArea", code: "remarks", label: "备注" }
  ];
  const modify = () => {
    // 销售数据
    staffGetSaleStaffList()
      .then(res => {
        info.options = res.data;
        dialogFormVisible.value = true;
      })
      .catch(err => {});
  };

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
    objData.isQuarterage = 0;
    objData.isMealStatus = -1;
    modifyTheSales({ ...objData }).then(res => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: `操作成功`
        });
      }
    });
    console.log(objData, "销售弹窗确定");
    info.applyData = objData;
    dialogFormVisible.value = false;
  };

  //报名信息保存
  const buttonInfo = val => {
    val.value.isQuarterage = 0;
    val.value.isMealStatus = -1;
    console.log(val, "报名信息保存");
    const data = {
      ...val.value,
      idCardImages: {
        front: val.value.idCardImagesFront,
        reverse: val.value.idCardImagesReverse
      }
    };
    refundModifythe({ ...data }).then(res => {
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
    buttonInfo,
    sales,
    modify,
    formChange,
    dialogFormVisible
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
</style>
