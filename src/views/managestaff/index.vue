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
      >
      </Table>
    </div>
    <el-dialog
      v-if="dialogNumber"
      v-model="dialogNumber"
      title="绑定会员"
      width="500px"
    >
      <formList
        :config="configNumber"
        :itemList="itemListNumber"
        :formInitData="formInitDataNumber"
        @buttonClick="buttonNumber"
        @formChange="formChangeNumber"
      >
        <template #findMobile>
          <span class="find" @click="findMobile">查找</span>
        </template>
      </formList>
    </el-dialog>
    <el-dialog v-if="dialogPos" v-model="dialogPos" title="转正" width="500px">
      <formList
        :config="configPos"
        :itemList="itemListPos"
        :formInitData="formInitDataPos"
        @buttonClick="buttonPos"
      >
      </formList>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { templateList, deltemplate } from "@/api/headquarters";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  enableList,
  funList,
  genderList,
  getListHtml,
  jobsStateList,
  staffEnableList,
  staffEnableList2,
  staffStateList,
  studentStatusList2
} from "@/utils/enum/select";
import { deleteItem, farmatDate, messageBox } from "@/utils/tools";
import { schoolSemesterDelete } from "@/api/semester";
import { tabelFormConfig } from "@/utils/config";
import {
  staffAllStaffList,
  staffBindingMemberPost,
  staffEnabledStaffPost,
  staffFindMemberByMobile,
  staffGetStaffList,
  staffRemoveStaffDelete,
  staffStaffConversionPost
} from "@/api/managerStaff";
import { roleList, userinfoByMobile } from "@/api/role";
import store from "@/store";
import { discountManagementList } from "@/api/discount";

export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null);
    const someCofig = {
      allRequired: false, // 是否全部必填
      inline: false, //行内
      inputStyle: {
        width: "240px"
      },
      buttons: [
        {
          funType: "cancel",
          type: "primary",
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
    };

    const getCode = list => {
      let index = store.getters.menuType - 1 || 0;
      return list[index];
    };
    const state = reactive({
      // 会员绑定
      configNumber: someCofig,
      itemListNumber: [
        {
          label: "手机号",
          code: "mobile",
          maxlength: 11,
          type: "phone",
          afterSlot: "findMobile",
          required: true
        },
        {
          code: "name",
          label: "姓名",
          disabled: true,
          required: true,
          errTip: "请点击查找",
          tips: "输入手机号查找绑定会员,否则无法绑定"
        }
      ],
      formInitDataNumber: {},
      dialogNumber: false,
      dialogNumberId: "",
      buttonNumber: val => {
        if (val.name == "confirm") {
          let data = {
            memberId: state.formInitDataNumber.member_id,
            staffId: state.dialogNumberId
          };
          staffBindingMemberPost(data).then(res => {
            ElMessage.success("绑定成功");
            state.dialogNumber = false;
          });
        }
        if (val.name == "cancel") {
          state.dialogNumber = false;
        }
      },
      formChangeNumber: val => {
        if (state.formInitDataNumber) {
          state.formInitDataNumber[val.code] = val.value;
        }
        if (val.code == "mobile") {
          state.findMobile(val.value);
        }
      },
      findMobile: (mobile = "") => {
        if (mobile && typeof mobile != "string") {
          mobile = state.formInitDataNumber.mobile;
        }
        if (mobile) {
          staffFindMemberByMobile({ mobile }).then(res => {
            if (res.data && res.data.name) {
              ElMessage.success("查找成功");
              state.formInitDataNumber = {
                mobile,
                member_id: res.data.member_id,
                name: res.data.name
              };
            } else {
              ElMessage.error("查找失败");
              state.formInitDataNumber = {
                mobile,
                name: ""
              };
            }
          });
        } else {
          ElMessage.error("请输入手机号");
        }
      },
      // 会员绑定----
      // 转正
      configPos: someCofig,
      itemListPos: [
        {
          el: "date",
          code: "conversionDate",
          label: "转正日期"
        }
      ],
      dialogPosId: "",
      formInitDataPos: {},
      dialogPos: false,
      buttonPos: val => {
        if (val.name == "confirm") {
          let data = val.value;
          data.id = state.dialogPosId;
          // messageBox(data,staffStaffConversionPost,TableList,{titile:'确定转正？'})
          staffStaffConversionPost({ ...data }).then(res => {
            ElMessage.success("成功");
            state.dialogPos = false;
            TableList.value.update();
          });
        }
        if (val.name == "cancel") {
          state.dialogPos = false;
        }
      },
      // 搜索表单
      itemList: [
        {
          code: "name",
          label: "员工"
        },
        {
          code: "mobile",
          label: "手机号",
          maxlength: 11
        },
        {
          el: "select",
          label: "状态",
          code: "status",
          list: staffEnableList2
        },
        {
          el: "select",
          label: "性别",
          code: "gender",
          list: genderList
        },
        {
          el: "select",
          label: "岗位状态",
          code: "staffType",
          list: staffStateList
        },
        {
          el: "select",
          label: "职能",
          code: "functions",
          list: funList
        },
        {
          el: "select",
          label: "角色",
          code: "roleId",
          fun: roleList,
          funMode: "table",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "roleName", // 指定的label名
          valueCode: "id" // 指定的value名
        }
        // {
        //   preCheck:true,
        //   code:'aaa',
        //   label: 'a',
        //   defalt:0
        // },
        // {
        //   preCheck:true,
        //   code:'bbb',
        //   label: 'b',
        //   defalt:1
        // },
        // // {
        // //   preCheck:true,
        // //   el: "select",
        // //   code: "dis",
        // //   label: "折扣",
        // //   fun: discountManagementList,
        // //   funMode: "table",
        // //   otherBack: "select_label", // label的返回值
        // //   back: true, // 从后台返回结果
        // //   query: { enabled: true },
        // //   labelCode: "name", // 指定的label名
        // //   valueCode: "id", // 指定的value名
        // //   multiple: true,
        // //   countFun:(list)=>list.map(v=>v.percent).reduce((pre, cur) =>( pre*100 * cur*100)/10000,0.95),
        // //   required: false,
        // //   defalt:0.95
        // // },
        // {
        //   preCheck:true,
        //   // el: "checkbox",
        //   code: "dis",
        //   label: "折扣",
        //   // countFun:(list)=>list.map(v=>v.value).reduce((pre, cur) =>( pre*100 + cur*100)/100,0),
        //   defalt:'10',
        //   list:[
        //     {
        //       value: 10,
        //       label: 10
        //     },
        //     {
        //       value: 20,
        //       label: 20
        //     },
        //     {
        //       value: 30,
        //       label: 30
        //     },
        //   ]
        // },
        // {
        //   preCheck:true,
        //   code:'ccc',
        //   label: 'ccc',
        //   defalt:0
        // },
        // {
        //   // preCheck:true,
        //   code:'ddd',
        //   label: 'd',
        //   defalt:0
        // },
      ],
      config: {
        ...tabelFormConfig,
        checkCountList: ["aaa+bbb*dis=ccc", "aaa*bbb=ddd"],
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "查 询",
            size: "small"
          },
          {
            perCode: getCode(["a0501a", "s0901a", "c0401a"]),
            funType: "add",
            name: "新 增",
            size: "small"
          }
        ]
      },
      formInitData: {},
      button: val => {
        if (val.name == "add") {
          router.push({ path: "/staff/add" });
        }
        if (val.name == "confirm" && val.valid) {
          TableList.value.update({ ...val.value });
        }
      },
      // table表单
      getList:
        store.getters.menuType == 1 ? staffAllStaffList : staffGetStaffList,
      column: [
        // { prop: "id", label: "序号" },
        { prop: "name", label: "姓名" },
        { prop: "nameEn", label: "英文名" },
        { prop: "mobile", label: "手机" },
        {
          prop: "gender",
          label: "性别",
          html: (row, val) => getListHtml(genderList, val)
        },
        {
          prop: "status",
          label: "状态",
          html: (row, val) => getListHtml(staffEnableList2, val)
        },
        {
          prop: "entryTime",
          label: "入职日期",
          html: row => row.entryTime && farmatDate(row.entryTime).date
        },
        { prop: "address", label: "地址" },
        {
          prop: "functions",
          label: "职能",
          html: (row, val) => getListHtml(funList, val)
        },
        {
          prop: "type",
          label: "岗位状态",
          // html: (row, val) => getListHtml(staffStateList, val)
          html: (row, val) => getListHtml(staffStateList, val)
        },
        {
          prop: "action",
          label: "操作",
          fixed: "right",
          width: 320,
          actives: [
            {
              perCode: getCode(["a0501b", "s0901b", "c0401b"]),
              name: "编辑",
              method: val =>
                router.push({ path: "/staff/add", query: { id: val.id } })
            },
            {
              perCode: getCode(["a0501c", "s0901c", "c0401c"]),
              name: "查看",
              method: val =>
                router.push({ path: "/staff/detail", query: { id: val.id } })
            },
            {
              perCode: getCode(["a0501d", "s0901d", "c0401d"]),
              name: "绑定会员",
              method: val => {
                console.log(val);
                state.dialogNumberId = val.id;
                state.dialogNumber = true;
                if (state.formInitDataNumber) {
                  state.formInitDataNumber.mobile = val.mobile;
                }
                state.findMobile(val.mobile);
              }
            },
            {
              perCode: getCode(["a0501e", "s0901e", "c0401e"]),
              name: row => (row.type == 1 ? "转正" : ""),
              method: val => {
                state.dialogPos = true;
                state.dialogPosId = val.id;
              }
            },
            {
              perCode: getCode(["a0501h", "s0901h", "c0401h"]),
              name: row => (row.status == 1 ? "" : "启用"),
              method: row => {
                messageBox(row, staffEnabledStaffPost, TableList, {
                  params: { staffId: row.id, status: row.status == 1 ? -1 : 1 },
                  title: `是否${row.status ? "禁用" : "启用"}`,
                  success: "操作成功"
                });
              }
            },
            {
              perCode: getCode(["a0501g", "s0901g", "c0401g"]),
              name: row => (row.status == 1 ? "禁用" : ""),
              method: row => {
                messageBox(row, staffEnabledStaffPost, TableList, {
                  params: { staffId: row.id, status: row.status == 1 ? -1 : 1 },
                  title: `是否${row.status ? "禁用" : "启用"}`,
                  success: "操作成功"
                });
              }
            },
            {
              perCode: getCode(["a0501f", "s0901f", "c0401f"]),
              name: "删除",
              method: row =>
                deleteItem(row, staffRemoveStaffDelete, TableList, {
                  params: { staffId: row.id }
                })
            }
          ]
        }
      ]
    });
    return {
      ...toRefs(state),
      TableList
    };
  }
};
</script>

<style lang="scss" scoped>
.name {
  cursor: pointer;
  color: #2e8de6;
}
.find {
  margin-left: 10px;
  cursor: pointer;
  color: #2e8de6;
}
</style>
