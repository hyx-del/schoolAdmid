<!--
 * @Author: 刘帝君
 * @Date: 2021-09-23 10:04:35
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-01 10:40:27
 * @Descripttion: 套餐报名
-->
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
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
  enrollLists,
  enrollCancel,
  enrollActivation
} from "@/api/coursesManagement";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null);
    const itemList = [
      {
        label: "报名方式",
        el: "select",
        list: [
          { value: "20", label: "全款" },
          { value: "10", label: "定金" }
        ],
        code: "registerMode",
        placeholder: ""
      },
      {
        label: "状态",
        el: "select",
        list: [
          { value: "1", label: "正常" },
          { value: "0", label: "取消" },
          { value: "-1", label: "过期" },
          { value: "2", label: "已完成" }
        ],
        code: "status",
        placeholder: ""
      },
      {
        code: "mobile",
        label: "手机",
        placeholder: "搜索手机号"
      },
      {
        code: "name",
        label: "学员姓名",
        placeholder: "搜索学员姓名"
      }
    ];
    // 表单按钮
    const config = {
      allRequired: false, // 是否全部必填
      inline: true, //行内
      colon: "",
      inputStyle: {
        width: "200px"
      },
      buttons: [
        {
          funType: "confirm",
          type: "primary",
          name: "搜索",
          size: "small"
        },
        {
          funType: "add",
          name: "添加",
          size: "small",
          perCode: "a0802a"
        }
      ]
    };
    const column = reactive([
      // { prop: "id", label: "序号", width: "80" },
      { prop: "name", label: "姓名" },
      { prop: "mobile", label: "手机" },
      { prop: "mainCourseName", label: "报名套餐" },
      { prop: "earnestPaid", label: "已付定金" },
      { prop: "trainFeePaid", label: "已付尾款" },
      { prop: "trainValidDay", label: "有效期" },
      { prop: "salesmanNames", label: "销售" },
      {
        prop: "platform",
        label: "来源渠道",
        html: (row, val) => {
          if (val == 10) return "后台";
          else if (val == 20) return "小程序";
          else if (val == 30) return "公众号";
        }
      },
      {
        prop: "status",
        label: "状态",
        html: (row, val) => {
          if (val == 0) return `<span style="color:red"}">取消</span>`;
          else if (val == -1) return "过期";
          else if (val == 1) return "正常 ";
          else if (val == 2) return "完成 ";
        }
      },
      {
        prop: "action",
        label: "操作",
        width: "300px",
        actives: [
          {
            perCode: "a0802c",
            name: "详情",
            method: val => {
              router.push({
                path: "/overall/detailsPackageReg",
                query: {
                  id: val.id
                }
              });
            }
          },
          {
            perCode: "a0802b",
            name: val => {
              if (val.status !== 0) {
                return "编辑";
              }
            },
            method: val => {
              router.push({
                path: "/overall/editorPackageReg",
                query: {
                  id: val.id
                }
              });
            }
          },
          {
            perCode: "a0802d",
            name: val => {
              if (
                val.status == 0 ||
                val.status == -1 ||
                (val.earnestPaid * 1 == 0 && val.trainFeePaid * 1 == 0)
              ) {
                return "";
              } else {
                return "查看权益";
              }
            },
            method: val => {
              const dataObj = {
                id: val.id,
                name: val.name,
                mobile: val.mobile,
                studentId: val.studentId
              };
              router.push({
                path: "/overall/viewPermissions",
                query: { ...dataObj }
              });
            }
          },
          {
            perCode: "a0802e",
            name: val => {
              if (val.status == 0 || val.status == 2) {
                return "";
              } else {
                return "取消报名";
              }
            },
            method: val => {
              enrollCancel({ id: val.id }).then(res => {
                const { code } = res;
                console.log(res.data, "取消报名");
                if (code == 200) {
                  ElMessage.success("操作成功");
                  TableList.value.update();
                }
              });
            }
          },
          {
            perCode: "a0802f",
            name: val => {
              if (val.status == -1) {
                return "激活";
              }
            },
            method: val => {
              enrollActivation({ id: val.id }).then(res => {
                const { code } = res;
                console.log(res.data, "激活");
                if (code == 200) {
                  ElMessage.success("操作成功");
                  TableList.value.update();
                }
              });
            }
          }
        ]
      }
    ]);
    const state = reactive({
      formInitData: {}
    });
    const getList = computed(() => {
      return enrollLists;
    });
    const button = val => {
      if (val.text == "添加") {
        router.push({ path: "/overall/addPackageReg" });
      } else if (val.text == "搜索") {
        TableList.value.update({ ...val.value });
      }
    };
    return {
      ...toRefs(state),
      itemList,
      config,
      column,
      getList,
      button,
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
</style>
