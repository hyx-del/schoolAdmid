<!--
 * @Author: 刘帝君
 * @Date: 2021-10-11 13:08:27
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-09 17:45:53
 * @Descripttion:
-->
<template>
  <emptyBox bottom="70">
    <formList
      :config="config"
      :itemList="itemList"
      :formInitData="formInitData"
      @buttonClick="button"
      @formChange="formChange"
    >
      <template v-slot:afterSlot2>
        <el-button
          type="success"
          style="height:32px;margin-left:10px"
          @click="determine"
          >确定</el-button
        >
      </template>
      <template v-slot:afterSlot>
        <el-button type="success" style="height:32px;margin-left:10px"
          >确定</el-button
        >
      </template>
    </formList>
  </emptyBox>
</template>

<script>
import { toRefs, ref, reactive, onMounted } from "vue";
import emptyBox from "@/components/emptyBox/index.vue";
import formList from "@/components/FormList/index.vue";
import {
  addtemplate,
  templatedetail,
  edittemplate,
  templateList
} from "@/api/headquarters";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { addFormBottom } from "@/utils/config";
import { semesterFactionListAPI } from "@/api/baseSet";
import { numberPoint2 } from "@/components/FormList/utils";
import store from "@/store";

export default {
  components: {
    formList,
    emptyBox
  },
  setup() {
    const router = useRouter();
    const id = useRoute().query.id;
    const state = reactive({
      formInitData: {},
      headquartersTemplate: {},
      config: { ...addFormBottom, watchList: ["staffType"] }
    });
    const itemList = [
      {
        code: "name",
        label: "模板名称",
        maxlength: 60
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
        fun: semesterFactionListAPI,
        funMode: "table",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        query: { enable: 1 },
        labelCode: "name",
        valueCode: "id",
        firstRequest: false //第一次不请求
        // multiple: true
      },
      {
        el: "img",
        code: "picture",
        label: "封面图",
        size: 1024,
        limit: 1,
        ratio: "750/375"
      },
      {
        el: "img",
        code: "posterPicture",
        label: "海报分享图",
        size: 1024,
        limit: 1,
        ratio: "200/200"
      },
      {
        el: "img",
        code: "wxPicture",
        label: "微信分享图",
        size: 1024,
        limit: 1,
        ratio: "500/400"
      },
      {
        code: "contact",
        type: "landline",
        label: "联系电话",
        maxlength: 12
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
        deleteArr: [
          [1, "tips"],
          [2, ""]
        ],
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
        required: false,
        allSelectCode: "radio_label",
        deleteArr: [
          [1, "tips"],
          [2, ""]
        ],
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
      if (val.name == "confirm") {
        let data = val.value;
        let _par = {
          ...data
        };
        _par.schoolId = store.getters.activeSchoolId;
        if (id) {
          edittemplate(_par).then(res => {
            const { code } = res;
            if (code == 200) {
              ElMessage.success("操作成功");
              router.push({ path: "/schoolTermTemplate/termTemplateInfo" });
            }
          });
        } else {
          console.log(data);
          // let _par = {
          //   ...data
          // };
          // _par.schoolId = store.getters.activeSchoolId;
          addtemplate(_par).then(res => {
            const { code } = res;
            if (code == 200) {
              ElMessage.success("操作成功");
              router.push({ path: "/schoolTermTemplate/termTemplateInfo" });
            }
          });
        }
      } else {
        router.push({ path: "/schoolTermTemplate/termTemplateInfo" });
      }
    };

    const formChange = val => {
      if (val.code == "headquartersTemplate") {
        if (val.value !== "") {
          templatedetail({ id: val.value }).then(res => {
            const { code, data } = res;
            if (code == 200) {
              state.headquartersTemplate = data;
            }
          });
        } else {
          state.headquartersTemplate = null;
        }
      }
    };

    const determine = () => {
      if (state.headquartersTemplate) {
        state.formInitData = state.headquartersTemplate;
        console.log(state.formInitData, "模板总部");
      } else {
        state.formInitData = {
          name: "",
          category: "",
          registerMode: null,
          introduction: "",
          deposit: "",
          isContainQuarterage: null,
          tuition: "",
          number: "",
          contact: "",
          wxPicture: "",
          posterPicture: "",
          picture: "",
          semesterCategoryId: ""
        };
      }
    };
    return {
      itemList,
      button,
      formChange,
      determine,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped></style>
