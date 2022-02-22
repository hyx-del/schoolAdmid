<!--
 * @Author: aa
 * @Date: 2021-08-30 14:04:55
 * @LastEditors: zx
 * @LastEditTime: 2021-12-07 22:59:21
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
import emptyBox from "@/components/emptyBox/index.vue";
import { toRefs, ref, reactive, onMounted } from "vue";
import formList from "@/components/FormList/index.vue";
import { addtemplate, templatedetail, edittemplate } from "@/api/headquarters";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { addFormBottom } from "@/utils/config";
import { semesterFactionListAPI } from "@/api/baseSet";
import { numberPoint2 } from "@/components/FormList/utils";

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
        label: "模板名称"
      },
      {
        el: "select",
        label: "类别",
        code: "category",
        list: [
          { value: "1", label: "常规课程" },
          { value: "2", label: "工作坊" },
          { value: "3", label: "名师培训" }
        ],
        seriesCode: "semesterCategoryId",
        seriesFun: val => ({ category: val }),
        tips: "先选《类别》才能选《学期派别》"
      },
      {
        el: "select",
        code: "semesterCategoryId",
        label: "学期派别",
        firstRequest: false, //第一次不请求
        fun: semesterFactionListAPI,
        funMode: "table",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        query: { enable: 1 },
        labelCode: "name",
        valueCode: "id"
        // multiple: true
      },
      {
        el: "img",
        code: "picture",
        label: "封面图",
        size: 2048,
        limit: 1,
        ratio: "750/375"
        // disabled: true
      },
      {
        el: "img",
        code: "posterPicture",
        label: "海报分享图",
        size: 2048,
        limit: 1,
        ratio: "200/200"
      },
      {
        el: "img",
        code: "wxPicture",
        label: "微信分享图",
        size: 2048,
        limit: 1,
        ratio: "500/400"
      },
      {
        code: "contact",
        label: "联系电话",
        maxlength: 20
      },
      {
        code: "number",
        label: "报名名额",
        type: "number",
        lessCode: 0
      },
      {
        code: "tuition",
        label: "报名费",
        type: "numberPoint2"
      },
      {
        el: "radio",
        code: "isContainQuarterage",
        label: "是否提供住宿",
        allSelectCode: "radio_label",
        required: false,
        defalt: "1",
        list: [
          {
            label: "是",
            value: 1
          },
          {
            label: "否",
            value: -1
          }
        ]
      },
      {
        el: "radio",
        code: "registerMode",
        label: "报名方式",
        defalt: "10",
        required: false,
        allSelectCode: "radio_label",
        list: [
          {
            label: "定金",
            value: 10
          },
          {
            label: "全款",
            value: 20
          }
        ]
      },
      {
        code: "deposit",
        label: "押金",
        type: "numberPoint2",
        required: false
      },
      {
        el: "editer",
        code: "introduction",
        label: "学期介绍"
      }
    ];
    const id = useRoute().query.id;
    const state = reactive({
      formInitData: {},
      config: { ...addFormBottom, watchList: ["staffType"] }
    });
    onMounted(() => {
      if (id) {
        templatedetail({ id }).then(res => {
          const { code, data } = res;
          if (code == 200) {
            // data.semesterCategoryId = data.semesterCategoryId + "";
            state.formInitData = data;
            console.log(state.formInitData, "formInitData");
          }
        });
      }
    });

    const button = val => {
      console.log(val, "val");
      if (val.name == "confirm") {
        let data = val.value;
        // data.picture = data.picture.join("");
        // data.posterPicture = data.posterPicture.join("");
        // data.wxPicture = data.wxPicture.join("");
        if (id) {
          edittemplate(data).then(res => {
            const { code } = res;
            if (code == 200) {
              ElMessage.success("操作成功");
              router.push({ path: "/termTemplate/termTemplateManage" });
            }
          });
        } else {
          console.log(data);
          addtemplate(data).then(res => {
            const { code } = res;
            if (code == 200) {
              ElMessage.success("操作成功");
              router.push({ path: "/termTemplate/termTemplateManage" });
            }
          });
        }
      } else {
        router.push({ path: "/termTemplate/termTemplateManage" });
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
