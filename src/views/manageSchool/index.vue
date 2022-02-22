<!--
 * @Author: aa
 * @Date: 2021-08-27 11:29:06
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-04 14:43:22
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
      />
    </div>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { schoolList, changestatus } from "@/api/headquarters";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { tabelFormConfig } from "@/utils/config";
import store from "@/store";
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
        label: "学校名称",
        placeholder: ""
      },
      {
        el: "area2",
        code: "area",
        label: "地区"
      },
      {
        el: "select",
        label: "状态",
        code: "status",
        list: [
          { value: "10", label: "筹备中" },
          { value: "20", label: "运营" },
          { value: "-20", label: "暂停" }
        ]
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
          perCode: "a0101a"
        }
      ]
    };
    const column = reactive([
      // { prop: "id", label: "序号", width: "80" },
      { prop: "name", label: "学校名称" },
      { prop: "phone", label: "手机" },
      { prop: "provinceName", label: "省" },
      { prop: "cityName", label: "市" },
      { prop: "address", label: "详细地址" },
      { prop: "email", label: "邮箱" },
      {
        prop: "status",
        label: "状态",
        html: (row, ins) => {
          if (row.status == 10) return "筹备中";
          else if (row.status == 20) return "运营";
          else if (row.status == -20)
            return `<span style='color:red'>暂停</span>`;
        }
      },
      {
        prop: "action",
        label: "操作",
        width: 200,
        actives: [
          {
            name: () => {
              return "编辑";
            },
            perCode: "a0101b",
            method: val => {
              router.push({ path: "/school/addschool", query: { id: val.id } });
            }
          },
          {
            name: "详情",
            perCode: "a0101c",
            method: val => {
              router.push({
                path: "/school/schooldetail",
                query: { id: val.id }
              });
            }
          },
          {
            name: val => {
              if (val.status == 20) {
                return "暂定运营";
              }
            },
            perCode: "a0101e",
            method: val => {
              // 20 运营,   -20 暂停运营
              let _status = null;
              if (val.status == 20) {
                _status = -20;
              } else {
                _status = 20;
              }
              changestatus({
                id: val.id,
                status: _status
              }).then(res => {
                const { code } = res;
                if (code == 200) {
                  ElMessage.success("操作成功");
                  TableList.value.update();
                  // 刷新顶部学校
                  store.dispatch("user/getUserHaveSchoolList");
                }
              });
            }
          },
          {
            name: val => {
              if (val.status == -20 || val.status == 10) {
                return "开始运营";
              }
            },
            perCode: "a0101d",
            method: val => {
              // 20 运营,   -20 暂停运营
              let _status = null;
              if (val.status == 20) {
                _status = -20;
              } else {
                _status = 20;
              }
              changestatus({
                id: val.id,
                status: _status
              }).then(res => {
                const { code } = res;
                if (code == 200) {
                  ElMessage.success("操作成功");
                  TableList.value.update();
                  // 刷新顶部学校
                  store.dispatch("user/getUserHaveSchoolList");
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
    const formChange = val => {
      if (val.code == "area") {
        state.formInitData.provinceId = val.value[0];
        state.formInitData.cityId = val.value[1];
      } else {
        state.formInitData[val.code] = val.value;
      }
      TableList.value.update({ ...state.formInitData });
    };
    const getList = computed(() => {
      return schoolList;
    });
    const buttonCallBack = val => {
      if (val.name == "confirm") {
        if (val.value) {
          TableList.value.update({ ...val.value });
        }
      } else if (val.name == "add") {
        router.push({ path: "/school/addschool" });
      }
    };
    return {
      ...toRefs(state),
      itemList,
      config,
      formChange,
      column,
      getList,
      buttonCallBack,
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
