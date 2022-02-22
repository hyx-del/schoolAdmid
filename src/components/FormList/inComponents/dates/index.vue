<template>
  <!--日期选择-->
  <el-date-picker
      v-bind="{ ...inInherit }"
      v-model="inValue"
      @change="change"
      :type="item.dateType||item.type"
      :disabled-date="getDateDisabledDate"
  />
</template>

<script>
/*
  *
  * */
import {
  toRefs,
  ref,
  reactive,
  onMounted,
  watch,
  computed,
} from "vue";
import {inheritObj} from '@/components/FormList/config'
import {getFunData, getInherit} from '@/components/FormList/selfTools'
export default {
  name: 'radios',
  emits:{
    changValue:null,
    value:null,
    upLoad:null
  },
  props: {
    value: {
      type: [String,Array],
      defalt: ''
    },
    item:{
      defalt:{}
    },
    list:{
      type: [Array],
      defalt:[]
    },
  },
  setup(props, context) {
    const provinces = ref(null);
    const {emit, slots, attrs} = context;
    const state = reactive({
      inValue:props.value,
      inStyle:{...props.item.style},
      // 监听多选
      change: (val) => {
        emit("value", state.inValue);
      },
      inInherit:computed(()=>props.item? getInherit(props.item,'datePicker'):{}),
      // 限制时间
      getDateDisabledDate: (time) => {
        let minDate = props.item.minDate || "1997-12-30";
        let maxDate = props.item.maxDate || "2200-12-30";
        return (
            time.getTime() < new Date(minDate).getTime() ||
            time.getTime() > new Date(maxDate).getTime()
        );
      },
    })
    return {
      provinces,
      getInherit,
      ...toRefs(props),
      ...toRefs(state),
    };
  }
}
</script>

<style scoped>

</style>
