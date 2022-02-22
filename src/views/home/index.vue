<!--
 * @Author: aa
 * @Date: 2021-08-27 11:29:06
 * @LastEditors: zx
 * @LastEditTime: 2021-10-29 17:58:45
 * @Descripttion: 宿舍管理
-->
<template>
  <div>
    <!-- <uploadCropperImg v-model="fileList"></uploadCropperImg> -->
  </div>
</template>

<script>
import { dictType } from "@/api/dict";
import store from "@/store";

export default {
  components: {},
  setup() {
    const fileList = [];
    // 获取支付方式字典
    const getPay = () => {
      let data = {
        type: "pay_type",
        useFlag: 1,
        size: 100
      };
      dictType(data).then(res => {
        store.dispatch("app/setPayChannels", res.data);
      });
    };
    getPay();
    return {
      fileList
    };
  }
};
</script>

<style lang="scss" scoped></style>
