<!--
 * @Author: 刘帝君
 * @Date: 2021-10-08 13:51:34
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-09 13:56:10
 * @Descripttion:
-->
<template>
  <emptyBox bottom="70">
    <formList
      :config="config"
      :itemList="itemList"
      :formInitData="formInitData"
      @buttonClick="button"
    >
    </formList>
  </emptyBox>
</template>

<script>
import { toRefs, reactive } from "vue";
import formList from "@/components/FormList/index.vue";
import { addCourse, courseDetail, updateCourseDetail } from "@/api/school";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { addFormBottom } from "@/utils/config";
import { examineList } from "@/utils/enum/select";
import emptyBox from "@/components/emptyBox/index.vue";

export default {
  components: {
    formList,
    emptyBox
  },
  setup() {
    const router = useRouter();
    const itemList = [
      {
        code: "name",
        label: "课程名称"
      },
      {
        code: "type",
        label: "课程类型"
      },
      {
        el: "img",
        code: "picture",
        label: "课程图",
        size: 2048,
        required: false,
        limit: 1
      },
      {
        el: "radio",
        code: "examine",
        label: "是否考核",
        required: false,
        defalt: "0",
        list: examineList
      },
      {
        code: "duration",
        type: "number",
        required: false,
        lessCode: 0,
        label: "时长"
      },
      {
        code: "weights",
        label: "权重",
        required: false,
        type: "number",
        lessCode: 0
      },
      {
        el: "editer",
        code: "remark",
        required: false,
        label: "课程介绍"
      }
    ];
    const id = useRoute().query.id;
    const state = reactive({
      formInitData: {},
      config: { ...addFormBottom, watchList: ["staffType"] }
    });
    if (id) {
      courseDetail({ id }).then(({ code, data }) => {
        if (code == 200) {
          state.formInitData = data;
        }
      });
    }
    const button = val => {
      switch (val.text) {
        case "确认":
          if (id) {
            // 修改
            updateCourseDetail(val.value).then(
              ({ code }) =>
                code === 200 &&
                ElMessage({
                  message: "修改成功",
                  duration: 1000,
                  type: "success",
                  onClose: () => router.back()
                })
            );
          } else {
            // 新增
            addCourse({ ...val.value }).then(
              ({ code }) =>
                code === 200 &&
                ElMessage({
                  message: "添加成功",
                  duration: 1000,
                  type: "success",
                  onClose: () => router.back()
                })
            );
          }
          break;
        case "取消":
          router.back();
          break;
        default:
          break;
      }
      if (val.name == "confirm") {
        let data = val.value;
        data.provinceId = val.value.area[0];
        data.cityId = val.value.area[1];
        data.pictures = JSON.stringify(data.pictures);
        data.picture = data.picture.join("");
        if (id) {
          editschool(data).then(res => {
            const { code } = res;
            if (code == 200) {
              ElMessage.success("操作成功");
              router.push({ path: "/manageSchool" });
            }
          });
        } else {
          addschool(data).then(res => {
            const { code } = res;
            if (code == 200) {
              ElMessage.success("操作成功");
              router.push({ path: "/manageSchool" });
            }
          });
        }
      }
    };
    return {
      itemList,
      button,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped></style>
