<template>
  <emptyBox bottom="70">
    <formList
      ref="formListRef"
      :formInitData="formInitData"
      :itemList="itemList"
      @buttonClick="buttonClick"
      :config="config"
      @formChange="formChange"
    >
    </formList>
  </emptyBox>
</template>

<script>
/*
 * add组件说明
 * 新增编辑
 * */
import formList from "@/components/FormList/index2";
import emptyBox from "@/components/emptyBox/index.vue";

import { toRefs, ref, reactive, computed } from "vue";
import { itemList } from "./itemList";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom } from "@/utils/config";

export default {
  components: {
    formList,
    emptyBox
  },
  porps: [],
  setup() {
    const router = useRouter();
    const formListRef = ref(null);
    const state = reactive({
      formInitData: {},
      config: { ...addFormBottom },
      itemList,
      // 手动隐藏
      hideList: [],
      // 手动显示
      showList: [],
      formState: [],
      id: "",
      // 表单变化
      formChange: val => {
        let { code, value } = val;
        state.formInitData[code] = value;
      },
      // 按钮
      buttonClick: val => {
        // 取消按钮
        if (val.name == "cancel") {
          router.go(-1);
        }
        // 确认按钮
        if (val.name == "confirm" && val.valid) {
          let data = val.value;
          // 编辑
          if (state.id) {
            // postFun({ ...data}).then(res => {
            //   ElMessage.success("编辑成功，即将返回列表");
            //   setTimeout(() => {
            //     router.go(-1);
            //   }, 500);
            // });
          } else {
            // 新加
            // postFun(data).then(res => {
            //   ElMessage.success("新加成功，即将返回列表");
            //   setTimeout(() => {
            //     router.go(-1);
            //   }, 500);
            // });
          }
        }
      },
      // 初始化
      start: () => {
        if (useRoute().query && useRoute().query.id) {
          state.id = useRoute().query.id;
          // 查询详情
          // postFun({id:state.id}).then(({data}) => {
          //   state.formInitData=data
          // });
        }
      }
    });
    state.start();
    return {
      formListRef,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped></style>
