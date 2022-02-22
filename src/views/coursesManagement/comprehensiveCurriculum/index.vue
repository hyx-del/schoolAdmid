<!--
 * @Author: 刘帝君
 * @Date: 2021-09-23 10:04:45
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-04 10:24:22
 * @Descripttion: 全面课程
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
  comprehensiveCurriculumList,
  comprehensiveCurriculumStatus,
  comprehensiveCurriculumDelete
} from "@/api/coursesManagement";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { registerModeList, onlineList, getListHtml } from "@/utils/enum/select";

export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null);
    const state = reactive({
      formInitData: {}
    });
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
          perCode: "a0801a"
        }
      ]
    };
    // 表单状态
    const itemList = [
      {
        code: "name",
        label: "搜索",
        placeholder: "搜索学期名称"
      },
      {
        el: "select",
        label: "报名方式",
        code: "registerMode",
        list: registerModeList
      },
      {
        el: "select",
        label: "状态",
        code: "status",
        list: onlineList
      }
    ];
    // 表单点击
    const button = val => {
      switch (val.text) {
        case "添加":
          console.log(val, "点击添加");
          router.push({ path: "/overall/addComprehensiveCurriculum" });
          break;
        case "搜索":
          TableList.value.update({ ...val.value });
          console.log(val, "点击搜索");
          break;
        default:
          break;
      }
    };
    // 表格数据
    const getList = computed(() => {
      return comprehensiveCurriculumList;
    });
    // 表格表头
    const column = reactive([
      // { prop: "id", label: "序号", width: "80" },
      { prop: "name", label: "名称" },
      {
        prop: "registerMode",
        label: "报名方式",
        width: "120",
        html: (row, val) => getListHtml(registerModeList, val)
      },
      {
        prop: "price",
        label: "价格",
        width: "200"
      },
      {
        prop: "status",
        label: "状态",
        width: "120",
        html: (row, val) => {
          if (row.status == 1) return "上线";
          else if (row.status == -1)
            return `<span style="color:red"}">下线</span>`;
          else if (row.status == 0) return "未发布";
        }
      },
      {
        prop: "createdAt",
        label: "创建时间",
        width: "200"
      },
      {
        prop: "action",
        label: "操作",
        width: 280,
        actives: [
          {
            perCode: "a0801b",
            name: val => {
              if (val.status !== 1) {
                return "编辑";
              }
            },
            method: val => {
              state.title = "编辑";
              router.push({
                path: "/overall/addComprehensiveCurriculum",
                query: { id: val.id }
              });
            }
          },
          {
            perCode: "a0801c",
            name: "详情",
            method: val => {
              router.push({
                path: "/overall/detailsComprehensiveCurriculum",
                query: { id: val.id }
              });
            }
          },
          {
            perCode: "a0801g",
            name: val => {
              if (val.status !== 0) {
                return "未发布";
              }
            },
            method: val => {
              comprehensiveCurriculumStatus({
                id: val.id,
                status: 0
              }).then(res => {
                const { code } = res;
                if (code == 200) {
                  ElMessage.success("操作成功");
                  TableList.value.update({ ...state.formInitData });
                }
              });
            }
          },
          {
            perCode: "a0801d",
            name: val => {
              if (val.status !== 1) {
                return "上线";
              }
            },
            method: val => {
              comprehensiveCurriculumStatus({
                id: val.id,
                status: val.status == 1 ? -1 : 1
              }).then(res => {
                const { code } = res;
                if (code == 200) {
                  ElMessage.success("操作成功");
                  TableList.value.update({ ...state.formInitData });
                }
              });
            }
          },
          {
            perCode: "a0801e",
            name: val => {
              if (val.status == 1) {
                return "下线";
              }
            },
            method: val => {
              comprehensiveCurriculumStatus({
                id: val.id,
                status: val.status == 1 ? -1 : 1
              }).then(res => {
                const { code } = res;
                if (code == 200) {
                  ElMessage.success("操作成功");
                  TableList.value.update({ ...state.formInitData });
                }
              });
            }
          },
          {
            perCode: "a0801f",
            name: "删除",
            method: val => {
              console.log(val, "删除");

              ElMessageBox.confirm(`确认删除${val.name}?`, "确认提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  comprehensiveCurriculumDelete({ ...val }).then(res => {
                    if (res.code == 200) {
                      ElMessage({
                        type: "success",
                        message: `操作成功`
                      });
                      TableList.value.update({ ...state.formInitData });
                    } else {
                      ElMessage({
                        type: "error",
                        message: `操作失败`
                      });
                    }
                  });
                })
                .catch(error => {
                  console.log(error);
                });
            }
          }
        ]
      }
    ]);

    return {
      ...toRefs(state),
      TableList,
      config,
      itemList,
      button,
      getList,
      column
    };
  }
};
</script>

<style lang="scss" scoped></style>
