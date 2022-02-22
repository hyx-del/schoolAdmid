<!--
 * @Author: zx
 * @Date: 2021-11-16 15:28:03
 * @LastEditors: zx
 * @LastEditTime: 2021-11-19 14:17:54
 * @Descripttion:
-->
<template>
  <!--下拉-->
  <el-select
    v-bind="{ ...inInherit }"
    v-model="inValue"
    @change="change"
    :remote-method="item.remoteMethod ? remoteMethodSelect(item) : null"
  >
    <el-option
      v-for="it in list"
      :key="it.value"
      :label="it.value"
      v-bind="getInherit(it, 'option')"
    ></el-option>
  </el-select>
</template>

<script>
/*
 * 内部的下拉会传出 allList：所有选中的值
 * */
import { toRefs, ref, reactive, onMounted, watch, inject, computed } from "vue";
import { inheritObj } from "@/components/FormList/config";
import { getFunData, getInherit } from "@/components/FormList/selfTools";
export default {
  name: "radios",
  emits: {
    changValue: null,
    value: null,
    upLoad: null
  },
  props: {
    value: {
      type: [String, Array],
      defalt: ""
    },
    item: {
      defalt: {}
    },
    list: {
      type: [Array],
      defalt: []
    }
  },
  setup(props, context) {
    const provinces = ref(null);
    const { emit, slots, attrs } = context;
    const state = reactive({
      inValue: props.value,
      inStyle: { ...props.item.style },
      // 监听多选
      change: val => {
        let formObj = {};
        let { code } = props.item;
        let item = props.item;
        let choseList = props.list.filter(v => val.includes(v.value)) || [];
        formObj[item.otherBack || code + "Label"] = choseList
          .map(i => i.label)
          .join(",");
        if (item.allSelectCode) {
          formObj[item.allSelectCode] = choseList;
        }
        let changeObj = { code, value: val, formObj, allList: choseList };
        emit("value", state.inValue);
        emit("changValue", changeObj);
      },
      inInherit: computed(() =>
        props.item ? getInherit(props.item, "select", props.item.inherit) : {}
      ),
      remoteMethodSelect: item => {
        return value => {
          if (item.fun) {
            let par = item.remoteMethod(value);
            emit("upLoad", { item, query: { ...item.query, ...par } });
          }
        };
      }
    });
    return {
      provinces,
      getInherit,
      ...toRefs(props),
      ...toRefs(state)
    };
  }
};
</script>

<style scoped></style>
