<template>
  <el-dialog
    v-if="show"
    v-bind="{ ...dialogConfig }"
    :title="title"
    v-model="show"
    destroy-on-close
    @close="cancel"
  >
    <emptyBox>
      <formList
        ref="popFormList"
        :config="formConfig"
        :itemList="itemList"
        :formInitData="inFormInitData"
        @formChange="change"
      />
    </emptyBox>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="buttonCancel" size="small" @click="cancel">{{ buttonCancel }}</el-button>
        <el-button v-if="buttonConfirm" size="small" type="primary" @click="confirm">
          {{ buttonConfirm }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
/*
 * popupForm组件说明
 * 弹窗的form表单
 * import popupForm from "@/components/FormList/popupForm.vue";
 * tabelRef 非必填 弹窗关闭后更新的table
 * fun 非必填 确认按钮后的提交事件
 * show 弹窗显示
 * dialogConfig
 * */
import { ElMessage, ElMessageBox } from "element-plus";

import formList from "./index";
import {
  toRefs,
  ref,
  reactive,
  toRef,
  isRef,
  isReactive,
  watchEffect,
  watch,
  onMounted,
  computed,
  getCurrentInstance,
  onBeforeUnmount
} from "vue";
import emptyBox from "@/components/emptyBox";
export default {
  name: "popupForm",
  emits: {
    cancel: null,
    confirm: null,
    "update:show": {
      type: Boolean
    },
    "update:formInitData": null,
    formInitData: null
  },
  components: {
    formList,
    emptyBox
  },
  props: {
    // 联动的表格
    tabelRef: {
      required: false,
      type: Object
    },
    // 点击确认的事件
    fun: {
      required: false,
      type: Function
    },
    // 显示
    show: {
      type: Boolean
    },
    // 弹窗的设置
    dialogConfig: {
      default: {
        width: "600px"
      }
    },
    // 表格的设置
    formConfig: {
      default: {
        buttons: []
      }
    },
    // 标题
    title: {
      default: "弹窗名称"
    },
    //表格的list
    itemList: {
      type: Array,
      default: []
    },
    // 表格数据
    formInitData: {
      type: Object,
      default: {}
    },
    // 取消按钮文字
    buttonCancel: {
      type: String,
      default: "取消"
    },
    // 确认按钮文字
    buttonConfirm: {
      type: String,
      default: "确定"
    }
  },
  setup(props, context) {
    const { emit, slots, attrs } = context;
    const popFormList = ref(null);
    const state = reactive({
      inFormInitData: computed({
        get: () => props.formInitData,
        set: value => emit("update:formInitData", value)
      }),
      // 取消按钮
      cancel: () => {
        emit("update:show", false);
        popFormList.value.reset();
      },
      // 确认按钮
      confirm: () => {
        popFormList.value.confirm().then(({ value }) => {
          emit("update:formInitData", { ...value });
          emit("confirm", { ...value });
          props.fun &&
            props.fun({ ...value }).then(res => {
              emit("update:show", false);
              ElMessage.success("操作成功");
              props.tabelRef && props.tabelRef.update();
            });
        });
      },
      // 表单值改变
      change: val => {
        let { code, value } = val;
        state.inFormInitData[code] = value;
        emit("update:formInitData", { ...state.inFormInitData });
      }
    });
    watch(
      () => props.show,
      (val, oldVal) => {
        if (!val) {
          emit("update:formInitData", {});
          popFormList.value.reset();
        }
      }
    );
    return {
      popFormList,
      ...toRefs(props),
      ...toRefs(state)
    };
  }
};
</script>

<style scoped></style>
