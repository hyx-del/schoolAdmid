<!--
 * @Author: 郑晶
 * @Date: 2021-09-02 10:19:18
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-17 17:00:47
 * @Descripttion:
-->
<template>
  <div>
    <formList
      :config="addFormConfig"
      :itemList="itemList"
      :formInitData="formInitData"
      @buttonClick="button"
      @formChange="formChange"
    >
    </formList>
  </div>
</template>

<script>
import { toRefs, reactive } from "vue";
import formList from "@/components/FormList/index.vue";
import { addCourse, courseDetail, updateCourseDetail } from "@/api/school";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { addFormConfig } from "../../utils/config";

export default {
  components: {
    formList
  },
  setup() {
    const router = useRouter();
    const itemList = [
      {
        code: "name",
        maxlength: 60,
        label: "课程名称"
      },
      {
        code: "type",
        maxlength: 60,
        label: "课程类型"
      },
      {
        el: "img",
        code: "picture",
        label: "课程图片",
        size: 2048,
        limit: 1
      },
      {
        el: "radio",
        code: "examine",
        label: "是否考核",
        list: [
          {
            value: "1",
            label: "是"
          },
          {
            value: "2",
            label: "否"
          }
        ]
      },
      {
        code: "duration",
        type: "number",
        lessCode: 1,
        label: "时长"
      },
      {
        code: "weights",
        label: "权重",
        type: "number",
        lessCode: 0
      },
      {
        el: "editer",
        code: "remark",
        label: "课程介绍"
      }
    ];
    const id = useRoute().query.id;
    const state = reactive({
      formInitData: {}
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
      addFormConfig,
      button,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped></style>
