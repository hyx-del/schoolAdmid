<template>
  <!--radio 单选-->
  <el-radio-group
      v-bind="{ ...inInherit }"
      v-model="inValue"
      @change="change"
  >
    <el-radio
        v-for="it in list"
        v-bind="getInherit(it, 'radio')"
        :key="it.value"
        :label="it.value"
    >
      {{ it.label }}
    </el-radio>
  </el-radio-group>
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
import {getInherit} from '@/components/FormList/selfTools'
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
        let formObj={}
        let {code}=props.item
        let item = props.item;
        let choseList = props.list.filter(v => val.includes(v.value)) || [];
        formObj[item.otherBack || code + "Label"] = choseList
            .map(i => i.label)
            .join(",");
        if (item.allSelectCode) {
          formObj[item.allSelectCode] = choseList;
        }
        let changeObj={ code ,value:val,formObj,allList:choseList}
        emit("value", state.inValue);
        emit("changValue", changeObj);
      },
      inInherit:computed(()=>props.item? getInherit(props.item,'radioGroup'):{})
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
