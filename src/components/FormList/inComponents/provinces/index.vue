<template>
  <!-- 省市区  -->
  <el-cascader
      v-bind="inInherit"
      ref="provinces"
      v-model="inValue"
      :style="{ ...inStyle }"
      :ref="item.code"
      :options="inList"
      @change="change"
      clearable
  />
</template>

<script>
/*
  * provinces 组件说明 ：省市区
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
  name: 'provinces',
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
      defalt:[]
    },
  },
  setup(props, context) {
    console.log('-------------',props)
    const provinces = ref(null);
    const {emit, slots, attrs} = context;
    const state = reactive({
      inList:schoolAreaData,
      inValue:props.value,
      inStyle:{...props.item.style},
      // 地区选择 item.areaCode province(省),provinceId(省id),city(市),cityId(市ID),county(区),countyId(区ID)
      change: (val) => {
        console.log(val)
        let formObj={}
        let value = val;
        let nameArr = provinces.value.presentText.split(" / ");
        let areaCode = props.item.areaCode || "province,provinceId,city,cityId,county,countyId";
        let areaCodeArr = areaCode.split(",");
        if (value) {
          formObj[areaCodeArr[0]] = nameArr[0];
          formObj[areaCodeArr[1]] = value[0];
          formObj[areaCodeArr[2]] = nameArr[1];
          formObj[areaCodeArr[3]] = value[1];
          formObj[areaCodeArr[4]] = nameArr[2];
          formObj[areaCodeArr[5]] = value[2];
        } else {
          formObj[areaCodeArr[0]] = "";
          formObj[areaCodeArr[1]] = "";
          formObj[areaCodeArr[2]] = "";
          formObj[areaCodeArr[3]] = "";
          formObj[areaCodeArr[4]] = "";
          formObj[areaCodeArr[5]] = "";
        }
        let changeObj={ code:props.item.code,ids: value, names: nameArr ,value:val,formObj}
        emit("value", state.inValue);
        emit("changValue", changeObj);
      },
      inInherit:computed(()=>props.item? getInherit(props.item,'el-cascader'):{})
    })
    return {
      provinces,
      ...toRefs(props),
      ...toRefs(state),
    };
  }
}
</script>

<style scoped>

</style>
