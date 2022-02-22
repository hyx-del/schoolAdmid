<!--
 * @Author: aa
 * @Date: 2021-08-27 11:29:06
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-09 17:44:49
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
        :params="formInitData"
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
import { toRefs, ref, reactive, computed } from "vue";
import { templateList, deltemplate } from "@/api/headquarters";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { tabelFormConfig } from "@/utils/config";

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
          perCode: "a0201a"
        }
      ]
    };
    const state = reactive({
      formInitData: {},
      column: [
        // { prop: "id", label: "序号" },
        { prop: "name", label: "模板名称" },
        { prop: "category", label: "类别", render: true },
        { prop: "tuition", label: "报名费" },
        { prop: "createdAt", label: "创建时间" },
        {
          prop: "action",
          label: "操作",
          actives: [
            {
              perCode: "a0201b",
              name: "编辑",
              method: val => {
                router.push({
                  path: "/termTemplate/addtemplate",
                  query: { id: val.id }
                });
              }
            },
            {
              perCode: "a0201c",
              name: "详情",
              method: val => {
                router.push({
                  path: "/termTemplate/templatedetail",
                  query: { id: val.id }
                });
              }
            },
            {
              perCode: "a0201d",
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
    const buttonCallBack = val => {
      if (val.name == "confirm") {
        if (val.value) {
          TableList.value.update({ ...val.value });
        }
      } else if (val.name == "add") {
        router.push({ path: "/termTemplate/addtemplate" });
      }
    };
    // const detail = val => {
    //   router.push({
    //     path: "/termTemplate/templatedetail",
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
