<!--
 * @Author: 刘帝君
 * @Date: 2021-10-11 13:07:52
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-09 17:46:02
 * @Descripttion:
-->
<template>
  <div>
    <div class="title">
      <formList
        :config="config"
        :itemList="itemList"
        :formInitData="formInitData"
        @buttonClick="buttonCallBack"
      />
    </div>
    <div class="table">
      <Table
        ref="TableList"
        :loadData="getList"
        :column="column"
        :params="formInitDataTable"
        :showSortIndex="{ show: true, lable: '序号' }"
      >
        <!-- <template v-slot:name="{ scope }">
          <span class="name" @click="detail(scope)">{{ scope.name }}</span>
        </template> -->
        <template v-slot:category="{ scope }">
          <span>{{
            scope.category == 1
              ? "常规课程"
              : scope.category == 2
              ? "工作坊"
              : "名师培训"
          }}</span>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed, watch } from "vue";
import { templateList, deltemplate } from "@/api/headquarters";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { tabelFormConfig } from "@/utils/config";
import store from "@/store";
import { categoryList2 } from "@/utils/enum/select";
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
        code: "name",
        label: "模板名称",
        placeholder: ""
      },
      {
        el: "select",
        label: "类别",
        code: "category",
        list: categoryList2
      }
    ];
    const config = {
      ...tabelFormConfig,
      buttons: [
        {
          funType: "confirm",
          type: "primary",
          name: "查 询",
          size: "small"
        },
        {
          funType: "add",
          name: "新 增",
          size: "small",
          perCode: "s0801d"
        }
      ]
    };
    const state = reactive({
      formInitData: {},
      formInitDataTable: {
        schoolId: store.getters.activeSchoolId
      },
      column: [
        // { prop: "id", label: "序号", width: 100 },
        { prop: "name", label: "模板名称" },
        { prop: "category", label: "类别", render: true, width: 200 },
        { prop: "tuition", label: "报名费", width: 120 },
        { prop: "createdAt", label: "创建时间", width: 200 },
        {
          prop: "action",
          label: "操作",
          width: 200,
          actives: [
            {
              perCode: "s0801a",
              name: "编辑",
              method: val => {
                router.push({
                  path: "/schoolTermTemplate/schoolAddtemplate",
                  query: { id: val.id }
                });
              }
            },
            {
              perCode: "s0801b",
              name: "详情",
              method: val => {
                router.push({
                  path: "/schoolTermTemplate/schoolTemplatedetail",
                  query: { id: val.id }
                });
              }
            },
            {
              perCode: "s0801c",
              name: "删除",
              method: val => {
                ElMessageBox.confirm("确认删除吗?", "确认提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(() => {
                  deltemplate({ id: val.id }).then(res => {
                    const { code } = res;
                    if (code == 200) {
                      ElMessage({
                        type: "success",
                        message: "删除成功!"
                      });
                      TableList.value.update({ ...state.formInitData });
                    }
                  });
                });
              }
            }
          ]
        }
      ]
    });
    const formChange = val => {
      state.formInitData[val.code] = val.value;
      TableList.value.update({ ...state.formInitData });
    };
    const getList = computed(() => {
      return templateList;
    });
    // 监听学校发生变化
    watch(
      () => store.getters.activeSchoolId,
      (val, old) => {
        console.log(val, "这是监听");
        TableList.value.update({ schoolId: val });
      }
    );

    const buttonCallBack = val => {
      if (val.name == "confirm") {
        if (val.value) {
          TableList.value.update({ ...val.value });
        }
      } else if (val.name == "add") {
        router.push({ path: "/schoolTermTemplate/schoolAddtemplate" });
      }
    };
    // const detail = val => {
    //   router.push({
    //     path: "/schoolTermTemplate/schoolTemplatedetail",
    //     query: { id: val.id }
    //   });
    // };
    return {
      ...toRefs(state),
      itemList,
      config,
      formChange,
      getList,
      buttonCallBack,
      TableList
      //   detail
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
