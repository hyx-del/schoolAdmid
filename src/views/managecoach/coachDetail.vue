<!--
 * @Author: aa
 * @Date: 2021-08-31 13:09:20
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-10-15 16:13:09
 * @Descripttion:
-->
<template>
  <div>
    <formShow
      ref="formShow"
      :formInitData="formInitData"
      :itemList="itemList"
    />
  </div>
</template>

<script>
import { toRefs, ref, reactive } from "vue";
import formShow from "@/components/FormList/detailShow";
import { getCoachDetailAPI } from "@/api/coach";
import { useRoute } from "vue-router";
import { showGender } from "@/utils/enum/select";

export default {
  components: { formShow },
  setup() {
    const itemList = [
      {
        code: "name",
        label: "姓名"
      },
      {
        code: "nameEn",
        label: "英文名称"
      },
      {
        code: "mobile",
        label: "手机号码"
      },
      {
        el: "img",
        code: "avatar",
        label: "照片"
      },
      {
        code: "gender",
        label: "性别"
      },
      {
        code: "entryTime",
        label: "入职时间"
      },
      {
        code: "address",
        label: "住址"
      },
      {
        code: "weights",
        label: "权重"
      },
      {
        el: "editer",
        code: "description",
        label: "个人介绍"
      }
    ];
    const id = useRoute().query.id;
    const state = reactive({
      formInitData: {}
    });
    getCoachDetailAPI({ id }).then(res => {
      const { code, data } = res;
      if (code == 200) {
        data.gender = data.genderName == 1 ? "男" : "女";
        data.description = data.description ? data.description : "";
        state.formInitData = data;
        console.log(data, "data");
      }
    });
    return {
      itemList,
      id,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped></style>
