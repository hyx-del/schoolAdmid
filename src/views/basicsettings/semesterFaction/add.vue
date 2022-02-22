<!--
 * @Author: 刘帝君
 * @Date: 2021-10-09 16:49:24
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-19 14:41:20
 * @Descripttion:
-->
<template>
  <div>
    <div class="title">
      <formList
        :config="addFormConfig"
        :itemList="itemList"
        :formInitData="formInitData"
        @buttonClick="button"
        :formState="formState"
      >
      </formList>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import formList from "@/components/FormList/index.vue";
import { useRouter, useRoute } from "vue-router";
import { addFormConfig } from "../../../utils/config";
import { ElMessage } from "element-plus";
import {
  semesterFactionAdd,
  semesterFactionDetails,
  semesterFactionEditor
} from "@/api/baseSet";
import { categoryList2 } from "@/utils/enum/select";

export default {
  components: {
    formList
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      formState: [],
      itemList: [
        {
          code: "name",
          maxlength: 60,
          label: "派别名称"
        },
        {
          el: "select",
          code: "category",
          label: "类别",
          list: [...categoryList2]
        },
        {
          el: "img",
          code: "coverUrl",
          label: "封面图",
          size: 1024,
          limit: 1,
          ratio: "750/375"
        },
        {
          el: "img",
          code: "posterUrl",
          label: "海报分享图",
          size: 1024,
          limit: 1,
          ratio: "200/200"
        },
        {
          el: "img",
          code: "wxIconUrl",
          label: "微信分享图",
          size: 1024,
          limit: 1,
          ratio: "500/400"
        },
        {
          el: "radio",
          code: "mainCourseEnable",
          required: false,
          label: "是否用于全面课程",
          list: [
            {
              value: "1",
              label: "是"
            },
            {
              value: "0",
              label: "否"
            }
          ]
        }
      ],
      id: useRoute().query.id,
      formInitData: {
        mainCourseEnable: "0"
      }
    });
    // 回显
    if (state.id) {
      semesterFactionDetails({ id: state.id }).then(({ code, data }) => {
        if (code == 200) {
          const dataObj = {
            ...data
          };
          state.formInitData = dataObj;
          state.formState = [
            {
              code: "category",
              disabled: true
            }
          ];
        }
      });
    }

    // 按钮
    const button = val => {
      switch (val.text) {
        case "取消":
          router.back();
          break;

        case "确认":
          if (state.id) {
            semesterFactionEditor({ ...val.value }).then(({ code, data }) => {
              if (code == 200) {
                ElMessage({
                  message: `操作${code === 200 ? "成功" : "失败"}`,
                  duration: 1000,
                  type: "success",
                  onClose: () => code === 200 && router.back()
                });
              }
            });
          } else {
            // console.log(val.value)
            // return false;
            semesterFactionAdd({ ...val.value }).then(({ code, msg }) => {
              ElMessage({
                message: `操作${code === 200 ? "成功" : "失败"}`,
                duration: 1000,
                type: "success",
                onClose: () => code === 200 && router.back()
              });
            });
          }

          break;

        default:
          break;
      }
    };

    return {
      ...toRefs(state),
      addFormConfig,
      button
    };
  }
};
</script>

<style lang="scss" scoped></style>
