<template>
  <div
    ref="formListMadia"
    v-resize="resize"
    class="listShow"
    :class="{ column: inConfig.inline }"
  >
    <div class="add_list_item" v-for="(form, index) in inDataList" :key="index">
      <formList
        :ref="'formList' + index"
        :itemList="inItemList"
        v-model:formInitData="inDataList[index]"
        :config="inConfig"
        @buttonClick="buttonForm"
      />
      <div class="add_right" :style="{ ...rightButton }">
        <i
          v-if="inDataList.length != max"
          class="el-icon-circle-plus-outline addItem"
          @click="addItem(form, index)"
        ></i>
        <i
          v-if="inDataList.length > 1"
          class="el-icon-delete removeItem"
          @click.prevent="removeItem(form, index)"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
/*
 * index组件说明
 *
 * */

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
import formList from "./index";
import { backType } from "@/components/FormList/utils";
import { dealForm } from "@/components/FormList/dealForm";

export default {
  components: {
    formList
  },
  props: {
    // 按钮的样式
    rightButton: {
      type: Object,
      default: {}
    },
    // 最多多少个
    max: {
      type: Number,
      default: () => 100
    },
    // 列的属性
    itemList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 数据
    dataList: {
      type: Array,
      default: () => {
        return [{}];
      }
    },
    // 验证是否通过
    valid: {
      type: Boolean,
      default: () => false
    },
    config: {
      type: Object,
      default: () => {
        return {
          twowayBinding: true,
          labelWidth: 0,
          inline: true,
          buttons: [],
          inputStyle: {
            width: "100px"
          }
        };
      }
    }
  },
  directives: {
    resize: {
      // 指令的定义
      mounted(el, binding) {
        let width = "",
          height = "";
        function get() {
          const style = document.defaultView.getComputedStyle(el);
          if (width !== style.width || height !== style.height) {
            binding.value({ width, height });
          }
          width = style.width;
          height = style.height;
        }
        el.__vueReize__ = setInterval(get, 200);
      },
      unmounted(el) {
        clearInterval(el.__vueReize__);
      }
    }
  },

  setup(props, context) {
    const { emit, slots, attrs } = context;
    onMounted(() => {
      allDom.value = getCurrentInstance().proxy;
    });
    const formListMadia = ref(null);
    const allDom = ref(null);
    const state = reactive({
      initData: computed(() => {
        let obj = {};
        props.itemList.map(item => (obj[item.code] = ""));
        return obj;
      }),
      dataValid: [false], // 数据每条的验证状态
      allValid: computed(() => state.dataValid.every(v => v)),
      inDataList: [],
      inItemList: [],
      inConfig: {},
      addItem: (form, index) => {
        state.confirm();
        allDom.value.$refs["formList" + index].confirm({ name: "add" }, () => {
          if (state.inDataList.length <= props.max && state.allValid) {
            state.inDataList.splice(index + 1, 0, { ...state.initData });
            state.dataValid.splice(index + 1, 0, false);
          }
        });
      },
      removeItem: (form, index) => {
        if (state.inDataList.length > 1) {
          state.inDataList.splice(index, 1);
          state.dataValid.splice(index, 1);
        }
      },
      // 获取验证结果
      confirm: index => {
        state.inDataList.forEach((item, index) => {
          allDom.value.$refs[`formList${index}`]
            .confirm({ name: "add" }, null, { index })
            .then(res => {
              console.log("----------------/********", res);
            });
        });
      },
      getValue: () => {
        return new Promise((resolve, reject) => {
          state.inDataList.forEach((item, index) => {
            allDom.value.$refs[`formList${index}`]
              .confirm({ name: "add" }, null, { index })
              .then(res => {
                state.dataValid[res.index] = res.valid;
                emit("update:valid", state.allValid);
                if (res.valid && state.inDataList.length == index + 1) {
                  state.inDataList[res.index] = res.value;
                  emit("update:dataList", state.inDataList);
                  resolve({
                    valid: true,
                    value: state.inDataList
                  });
                }
              });
          });
        });
      },
      // 表单的验证事件
      buttonForm: val => {
        state.dataValid[val.index] = val.valid;
        emit("update:valid", state.allValid);
        if (val.valid) {
          state.inDataList[val.index] = val.value;
          emit("update:dataList", state.inDataList);
        }
      }
    });
    // 获取元素变化
    const resize = val => {
      formSize();
    };
    onMounted(() => {
      formSize();
    });
    const formSize = () => {};
    // 初始化组件
    const setForm = () => {
      state.inConfig = props.config;
    };
    watch(
      () => props.dataList,
      (newV, oldV) => {
        // 防止有些数字导致无限循环
        if (newV != oldV) {
          state.inDataList = [...newV];
          setForm();
        }
      },
      { immediate: true, deep: true }
    );
    watch(
      () => props.itemList,
      (newV, oldV) => {
        // 防止有些数字导致无限循环
        if (newV != oldV) {
          state.inItemList = [...state.inItemList, ...newV];
          setForm();
        }
      },
      { immediate: true, deep: true }
    );

    setForm();
    return {
      resize,
      confirm,
      formListMadia,
      ...toRefs(state),
      ...toRefs(props)
    };
  }
};
</script>

<style lang="scss" scoped>
.add_list_item {
  position: relative;
  box-sizing: border-box;
  padding-right: 45px;
}
.add_right {
  position: absolute;
  right: 0%;
  top: 10px;
  display: flex;
  font-size: 24px;
  .addItem {
    margin-right: 6px;
    color: blue;
  }
  .removeItem {
    color: red;
  }
}
</style>
