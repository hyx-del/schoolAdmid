<!--
 * @Author: aa
 * @Date: 2021-08-31 13:09:20
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-10-25 14:45:34
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
import { schooldetail } from "@/api/headquarters";
import { useRoute } from "vue-router";
export default {
  components: { formShow },
  setup() {
    const itemList = [
      {
        code: "name",
        label: "学校名称"
      },
      {
        code: "nameEn",
        label: "英文名称"
      },
      {
        el: "img",
        code: "picture",
        label: "学校图片"
      },
      {
        el: "img",
        code: "pictures",
        label: "场馆图集"
      },
      {
        code: "email",
        label: "邮箱"
      },
      {
        code: "phone",
        label: "联系电话"
      },
      {
        el: "area2",
        code: "mergerName",
        label: "地址",
        areaCode: "province,provinceId,cityId,county"
      },
      {
        code: "address",
        label: "详细地址"
      },
      {
        code: "addressEn",
        label: "英文址"
      },
      {
        label: "经纬度",
        code: "mapPoint",
        afterSlot: "afterSlot2"
      },
      {
        el: "textArea",
        code: "description",
        label: "备注"
      }
    ];
    const id = useRoute().query.id;
    const state = reactive({
      formInitData: {}
    });
    schooldetail({ id }).then(res => {
      const { code, data } = res;
      if (code == 200) {
        data.pictures = JSON.parse(data.pictures);
        // data.area = [data.provinceId, data.cityId];
        state.formInitData = data;
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
