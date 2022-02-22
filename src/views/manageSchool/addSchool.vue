<!--
 * @Author: aa
 * @Date: 2021-08-30 14:04:55
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-19 14:49:08
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
      <template v-slot:afterSlot2>
        <span
          @click="search"
          style="margin-left:20px;cursor: pointer;color:#2e8de6"
          >经纬度查询</span
        >
      </template>
    </formList>
  </emptyBox>
</template>

<script>
import { toRefs, ref, reactive, onMounted, inject } from "vue";
import emptyBox from "@/components/emptyBox/index.vue";
import formList from "@/components/FormList/index.vue";
import { addschool, schooldetail, editschool } from "@/api/headquarters";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { addFormBottom } from "@/utils/config";
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
        label: "学校名称"
      },
      {
        code: "nameEn",
        required: false,
        label: "英文名称",
        maxlength: 100
      },
      {
        el: "img",
        code: "picture",
        label: "学校图片",
        size: 1024,
        limit: 1
      },
      {
        el: "img",
        code: "pictures",
        label: "场馆图集",
        required: false,
        size: 1024,
        limit: 12
      },
      {
        code: "email",
        type: "email",
        required: false,
        label: "邮箱"
      },
      {
        code: "phone",
        type: "landline",
        label: "联系电话",
        maxlength: 12
      },
      {
        el: "area2",
        code: "area",
        label: "地址",
        areaCode: "province,provinceId,city,cityId"
      },
      {
        code: "address",
        label: "详细地址"
      },
      {
        code: "addressEn",
        label: "英文址",
        type: "letter"
      },
      {
        label: "经纬度",
        code: "mapPoint",
        afterSlot: "afterSlot2"
      },
      {
        el: "textArea",
        code: "description",
        required: false,
        label: "备注",
        maxlength: 120
      }
    ];
    const id = useRoute().query.id;
    const state = reactive({
      formInitData: {},
      config: { ...addFormBottom, watchList: ["staffType"] }
    });
    onMounted(() => {
      if (id) {
        // const updateLastTitle = inject("updateLastTitle");
        // updateLastTitle("编辑");
        schooldetail({ id }).then(res => {
          const { code, data } = res;
          if (code == 200) {
            data.pictures = JSON.parse(data.pictures);
            state.formInitData = data;
          }
        });
      }
    });
    const search = () => {
      window.open("https://lbs.qq.com/getPoint/");
    };

    const button = val => {
      if (val.name == "confirm") {
        let data = val.value;
        data.provinceId = data.area.split(",")[0];
        data.cityId = data.area.split(",")[1];
        if (data.pictures == "") {
          data.pictures = "[]";
        } else {
          data.pictures = JSON.stringify(data.pictures.split(","));
        }
        console.log(data, "这是上传的数据");
        if (id) {
          editschool(data).then(res => {
            const { code } = res;
            if (code == 200) {
              ElMessage.success("操作成功");
              router.push({ path: "/school/manageSchool" });
            }
          });
        } else {
          addschool(data).then(res => {
            const { code } = res;
            if (code == 200) {
              ElMessage.success("操作成功");
              //TODO 获取顶部学校列表的数据
              router.push({ path: "/school/manageSchool" });
            }
          });
        }
      } else if (val.name == "cancel") {
        router.push({ path: "/school/manageSchool" });
      }
    };
    return {
      itemList,
      search,
      button,
      onMounted,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped></style>
