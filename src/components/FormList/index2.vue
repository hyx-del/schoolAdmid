<template>
  <div ref="formListMadia" v-resize="resize" class="myFormList">
    <el-config-provider :locale="locale">
      <el-form
        ref="ruleForm"
        :inline="inConfig.inline"
        :rules="rules"
        :model="inFormObj"
        :label-width="inLabelWidth"
      >
        <div
          v-for="item in inList"
          class="formListItem"
          :style="{
            display: inConfig.inline ? 'inline-block' : 'block',
            ...{ width: itemWidth ? itemWidth : null },
            ...item.style
          }"
          :key="item.code || item.slotName"
        >
          <div class="formLine" v-if="item.el == 'line'"></div>
          <el-checkbox
            v-if="item.preCheck"
            class="formCheck"
            @change="checkItemObjChange(item)"
            v-model="inCheckItemObj[item.code]"
          ></el-checkbox>
          <!-- slot插槽  -->
          <slot v-if="item.el == 'itemSlot'" :name="item.slotName"></slot>
          <el-form-item
            v-if="!noEl.includes(item.el)"
            :style="{  ...item.valueStyle }"
            :class="{ 'is-required': item.required }"
            :prop="item.code"
            :label="item.label + (item.colon||inConfig.colon)"
          >
            <div :style="{ ...inConfig.rightStyle }" class="rightStyle">
              <template v-if="isSimple(item.el)">
                <component
                  :is="getComponent(item)"
                  v-bind="item.inherit"
                  v-model="inFormObj[item.code]"
                  @change="formChange(item.el, item.code)"
                >
                  <template v-if="item.prepend" #prepend>
                  <span
                      v-bind="getInherit(item.prepend, 'span')"
                      v-html="item.prepend.text || item.prepend"
                      @click="slotClick(item, item.prependClick)"
                  />
                  </template>
                  <template v-if="item.append" #append>
                  <span
                      v-bind="getInherit(item.append, 'span')"
                      v-html="item.append.text || item.append"
                      @click="slotClick(item, item.appendClick)"
                  />
                  </template>
                  <template v-if="item.suffix" #suffix>
                  <span
                      v-bind="getInherit(item.suffix, 'span')"
                      v-html="item.suffix"
                      @click="slotClick(item, item.suffixClick)"
                  />
                  </template>
                  <template v-if="item.prefix" #prefix>
                  <span
                      v-bind="getInherit(item.prefix, 'span')"
                      v-html="item.prefix"
                      @click="slotClick(item, item.prefixClick)"
                  />
                  </template>
                </component>
              </template>
              <template v-if="!isSimple(item.el)">
                <component
                  :is="getComponent(item)"
                  :item="item"
                  :list="backList[item.code] || item.list"
                  v-model="inFormObj[item.code]"
                  @changValue="changValue"
                  @upLoad="upLoad"
                >
                </component>
              </template>
              <slot
                v-if="item.el == 'slot'"
                :name="item.slotName"
                :value="inFormObj[item.code]"
              ></slot>
              <slot
                v-if="item.afterSlot"
                :name="item.afterSlot"
                :value="inFormObj[item.code]"
              ></slot>
              <div v-if="item.tips" class="tips">{{ item.tips }}</div>
            </div>
          </el-form-item>
        </div>
        <el-form-item
          :class="inConfig.buttonsArea"
          :style="{ ...inConfig.buttonStyle }"
        >
          <div v-if="buttons && buttons.length > 0">
            <el-button
              v-for="(bts, index) in buttons"
              v-bind="getInherit(bts, 'button')"
              v-show="showButtom(bts && bts.perCode)"
              :key="index"
              :loading="bts.funType == 'confirm' ? inLoading : false"
              @click="buttonsClick(bts)"
            >
              {{ bts.name }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-config-provider>
  </div>
</template>

<script>
import {
  toRefs,
  ref,
  reactive,
  watch,
  onMounted,
  onBeforeUnmount,
  computed,
  provide,
  getCurrentInstance
} from "vue";
import { ElMessage } from "element-plus";
import {
  parseTime,
  backType,
  getlabelWidth,
  differenceArray,
  showButtom
} from "./utils";
import {
  defaultButtons,
  inConfig,
  inputArr,
  updateArr,
  inheritObj,
  highInherit2,
  highList
} from "./config";
const OSS = require("ali-oss");
import UploadImgDrag from "@/components/upload";
import uploadCropperImg from "@/components/uploadCropperImg";
import uploadVideo from "@/components/uploadVideo";
import uploadAudio from "@/components/uploadAudio";
import editer from "@/components/editer";
import provinces from "@/components/FormList/inComponents/provinces";
import provinces2 from "@/components/FormList/inComponents/provinces2";
import checkboxs from "@/components/FormList/inComponents/checkboxs";
import radios from "@/components/FormList/inComponents/radios";
import selects from "@/components/FormList/inComponents/selects";
import dates from "@/components/FormList/inComponents/dates";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { formCheck } from "@/components/FormList/formCheck";
import { dealForm } from "@/components/FormList/dealForm";
import { pushValue } from "@/components/FormList/pushValue";
import {
  byBackFunChange,
  changeObj,
  countFun,
  getFunData,
  getInherit,
  itemStart,
  stateListChange
} from "@/components/FormList/selfTools";
export default {
  name: "formList",
  components: {
    UploadImgDrag,
    uploadCropperImg,
    uploadVideo,
    editer,
    provinces,
    provinces2,
    checkboxs,
    radios,
    selects,
    dates,
    uploadAudio
  },
  props: {
    // 赋值默认值
    formInitData: {
      type: Object,
      required: true
    },
    itemList: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 隐藏元素
    hideList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 显示元素
    showList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 清空某些元素
    clearList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 清空某些元素 例如[{code:xxx,show:false,disabld:true}]
    formState: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  directives: {
    resize: {
      // 指令的定义
      mounted(el, binding) {
        let width, height;
        let get = () => {
          const style = document.defaultView.getComputedStyle(el);
          if (width !== style.width || height !== style.height) {
            binding.value({ width, height });
          }
          width = style.width;
          height = style.height;
        };
        el.__vueReize__ = setInterval(get, 200);
      },
      unmounted(el) {
        clearInterval(el.__vueReize__);
      }
    }
  },
  setup(props, context) {
    const { emit, slots, attrs } = context;
    const state = reactive({
      // 插槽的点击
      slotClick: (item, fun) => {
        if (fun) {
          byBackFunChange(state, item, fun, () => start());
        }
      },
      test: val => {},
      isSimple: el => {
        return !highList.includes(el);
      },
      getComponent: val => {
        let check = val.el;
        check = highInherit2[check] ? highInherit2[check] : check;
        let { el = null } = inheritObj[check];
        return el;
      },
      changValue: change => {
        let { code, formObj, allList = [] } = change;
        state.inFormObj = { ...state.inFormObj, ...formObj };
        formChange(null, code, { ...formObj, allList });
      },
      upLoad: postObj => {
        let { item, query } = postObj;
        getFunData(state, item, { ...query });
      },
      countList: computed(() => {
        if (
          props.config &&
          props.config.countList &&
          props.config.countList.length > 0
        ) {
          return props.config.countList.map(c => {
            let obj = {
              countStr: c,
              codeArr: c.match(/[a-z]{1,}[1-9]{0,}/gi),
              endCode: c.split("=")[1]
            };
            return obj;
          });
        }
        return [];
      }),
      countCodeArr: computed(() => {
        let codeArr = state.countList.map(c => c.codeArr);
        return Array.from(new Set(codeArr.flat() || []));
      }),

      inHideList: [],
      inShowList: [],
      inItemList: [],
      itemWidth: "",
      locale: zhCn,
      inLoading: false, //加载事件
      inLabelWidth: "",
      noEl: ["line", "itemSlot"],
      inList: [],
      buttons: [],
      inFormObj: {},
      formListObj: {},
      inConfig,
      rules: {},
      inSearchVal: {},
      backList: {},
      backListRequst: {},
      refSeachObj: {},
      checkChangeObj: {},
      refDate: {},
      refTime: {},
      arrayObj: {}, //结果是数组的对象
      refCascader: {},
      deleteObj: {},
      refArea: {},
      refVideo: {},
      optionsList: schoolAreaData, //省市区数据
      optionsList2: schoolAreaData2, //省市数据
      splitCodeObj: {}, //需要分割的结果的对象
      inCheckItemObj: {}, // 选中的对象
      valueChangeArr: computed(() =>
        state.inItemList.filter(v => v.valueChange).map(val => val.code)
      ),
      checkItemObjChange: item => {
        if (state.checkCountCodeArr.includes(item.code)) {
          countFun(state, true);
        }
        emit("checkItem", {
          ...item,
          checkValue: state.inCheckItemObj[item.code],
          value: state.inFormObj[item.code]
        });
      },
      checkCountList: computed(() => {
        if (
          props.config &&
          props.config.checkCountList &&
          props.config.checkCountList.length > 0
        ) {
          return props.config.checkCountList.map(c => {
            let obj = {
              countStr: c,
              codeArr: c.match(/[a-z]{1,}[1-9]{0,}/gi),
              endCode: c.split("=")[1]
            };
            return obj;
          });
        }
        return [];
      }),
      checkCountCodeArr: computed(() => {
        let codeArr = state.checkCountList.map(c => c.codeArr);
        return Array.from(new Set(codeArr.flat() || []));
      }),
      otherCount: {}
    });
    // 更新组件的state
    const upFormState = (key, obj = {}) => {
      state[key] = { ...state[key], obj };
    };
    provide("formState", state);
    provide("upFormState", upFormState);
    state.buttons = props.config.buttons || defaultButtons;
    const ruleForm = ref(null);
    const formListRef = ref(null);
    const formListMadia = ref(null);
    const enter = () => {};
    const media = computed(() => {
      if (!props.config.media) return;
      let list = props.config.media.map((item, index) => {
        if (props.config.media.length == index + 1) {
          return [item, 30000];
        } else {
          return [item, props.config.media[index + 1]];
        }
      });
      return list;
    });
    const mediaObj = computed(() => {
      if (!media.value) return;
      let obj = {};
      media.value.forEach((item, index) => {
        let pei =
          parseFloat(1 / props.config.column[index]).toFixed(4) * 100 + "%";
        obj[item.join("_")] = {
          column: props.config.column[index],
          pei
        };
      });
      return obj;
    });
    // 监听dom变化
    const formSize = () => {
      if (!media.value) return;
      if (formListMadia.value && media) {
        let { width } = formListMadia.value.getBoundingClientRect();
        let cur = media.value.filter(
          item => item[0] <= width && item[1] > width
        );
        let keys = cur[0].join("_");
        state.itemWidth = mediaObj.value[keys].pei;
      }
    };
    // 获取元素变化
    const resize = val => {
      formSize();
    };
    onMounted(() => {
      formSize();
    });
    onBeforeUnmount(() => {});
    onMounted(() => {
      formListRef.value = getCurrentInstance().proxy;
    });
    // 初始化
    let start = () => {
      // 混入部分初始值
      state.inItemList = state.inItemList.map(item => {
        item = { ...state.inConfig.defalt, ...item };
        item.show = item.showType != 2 && item.show ? true : false;
        state.formListObj[item.code] = item;
        return item;
      });
      state.inList = state.inItemList.filter(item => item.show);
      // 最大label长度
      let maxLabelWidth = 0;
      let hasRequired = state.inList.some(item => item.required); //是否有必选
      let hasCheckItem = state.inList.some(item => item.preCheck); //是否选择的元素
      let rules = {}; //验证规则
      state.inConfig = { ...inConfig, ...props.config }; //合并配置
      state.inList = state.inList.map(value => {
        let { code, el = "input", label } = value;
        if (state.noEl.includes(el) || el == "slot") {
          return value;
        }
        if (value.showType == 2) {
          return null;
        }
        // 基本参数
        let defaltValue = {
          disabled: state.inConfig.allDisabled,
          required: state.inConfig.allRequired,
          maxlength: el == "input" ? 60 : 255,
          //后台加载数据时第一次是否请求
          firstRequest:
            value.firstRequest == undefined ? true : value.firstRequest,
          size:
            value.size || (updateArr.includes(el) ? 1000 : state.inConfig.size)
        };
        if (value.preCheck) {
          state.inCheckItemObj[code] =
            state.inCheckItemObj[code] == undefined
              ? false
              : state.inCheckItemObj[code];
        }
        value = {
          ...value,
          valueStyle:{
            ...inConfig.valueStyle,
           ...value.valueStyle
          },

          size: value.size || "small",
          clearable: value.clearable || true
        };
        // 从elementplus继承的属性
        value.inherit = getInherit(value, el);
        // 外部赋值区
        pushValue(state, value, el, code);
        // 未输入提示
        value.placeholder = value.placeholder
          ? value.placeholder
          : `${inputArr.includes(el) ? "请输入" : "请选择"}${value.label}`;
        // 统计最长的label
        let long = getlabelWidth(value.label);
        maxLabelWidth = long > maxLabelWidth ? long : maxLabelWidth;
        value = Object.assign(defaltValue, value);
        itemStart(state, value, el, code);
        // 把list的value变成字符串
        if (value.list) {
          let list = backType(value.list, "Array") ? value.list : value.list();
          value.list = list.map(v => {
            if (backType(v.value, "Number")) {
              v.value += "";
            }
            return v;
          });
        }
        // 创建验证规则
        rules[code] = [];
        let midRule = formCheck(value, state.inFormObj);
        rules[code] = [...rules[code], ...midRule[code]];
        state.formListObj[code] = value;
        return value;
      });
      // 自动计算
      if (
        props.config &&
        props.config.countList &&
        props.config.countList.length > 0
      ) {
        countFun(state);
      }
      // 勾选的自动计算
      if (
        props.config &&
        props.config.checkCountList &&
        props.config.checkCountList.length > 0
      ) {
        countFun(state, true);
      }
      state.inList = state.inList.filter(v => v);
      state.inLabelWidth =
        (props.config && props.config.labelWidth) || 0
          ? state.config.labelWidth
          : maxLabelWidth +
            state.inConfig.colon.length +
            (hasRequired || state.inConfig.allRequired ? 1 : 0) +
            (hasCheckItem ? 1 : 0) +
            1 +
            "em";
      state.rules = rules;
      setTimeout(() => {
        if (ruleForm && ruleForm.value) {
          ruleForm.value.clearValidate();
        }
      });
    };

    //按钮事件
    const buttonsClick = bts => {
      if (bts.funType == "reset") {
        reset(bts);
      } else if (bts.funType == "confirm") {
        confirm(bts);
      } else {
        emit("buttonClick", {
          name: bts.funType,
          node: ruleForm.value,
          value: "",
          valid: false,
          text: bts.name
        });
      }
    };
    // 重置表单
    const reset = (bts = { name: "reset" }) => {
      ruleForm.value.resetFields();
      let inFormObj = {};
      state.inList.forEach(item => {
        inFormObj[item.code] = "";
      });
      state.inFormObj = inFormObj;

      emit("buttonClick", {
        name: "reset",
        node: ruleForm.value,
        value: "",
        valid: false,
        text: bts.name || ""
      });
    };

    // 确认事件
    const confirm = (bts = { name: "" }, callBack, par = {}) => {
      return new Promise((resolve, reject) => {
        ruleForm.value.validate(valid => {
          if (valid) {
            if (state.inConfig.hasLoading) {
              state.inLoading = true;
              emit("update:loading", state.inLoading);
            }
            let backObj = dealForm(state);
            resolve({
              value: backObj,
              valid: true,
              text: bts.name || "",
              ...par
            });
            callBack && callBack();
            emit("buttonClick", {
              name: "confirm",
              node: ruleForm.value,
              value: backObj,
              valid: true,
              text: bts.name || "",
              ...par
            });
          }
        });
        // reject({
        //   valid: false,
        //   value: false,
        //   msg: "表单验证失败"
        // });
      });
    };
    // 抛出值的变化
    const formChange = (el, code, obj = {}) => {
      let item = state.formListObj[code];
      let formChange = {
        el: item.el || el,
        code,
        checkValue:
          state.inCheckItemObj[item.code] == undefined
            ? false
            : state.inCheckItemObj[item.code],
        value: state.inFormObj[code],
        allSelectCode: state.inFormObj[item.allSelectCode] || "",
        otherBack: state.inFormObj[item.otherBack || code + "_otherBack"] || "",
        ...obj
      };
      // 单选，多选，下拉，下拉多选结果处理
      if (obj.allList && item.countFun) {
        state.otherCount[code] =
          obj.allList.length > 0 ? item.countFun(obj.allList) : item.defalt;
      }
      // 自动计算的值的监听
      if (state.countCodeArr.includes(code)) {
        countFun(state);
      }
      // 选中的dom监听处理数值
      if (state.checkCountCodeArr.includes(code)) {
        countFun(state, true);
      }
      // 值变化监听执行改变dom
      if (item.valueChange) {
        byBackFunChange(state, item, item.valueChange, () => start());
      }
      // 数据联动
      if (item.seriesCode) {
        let seriesItem = state.formListObj[item.seriesCode];
        let par = (item.seriesFun && item.seriesFun(state.inFormObj[code])) || {
          id: state.inFormObj[code]
        };
        getFunData(state, seriesItem, { ...par }, true);
      }
      emit("formChange", formChange);
      if (state.inConfig.twowayBinding) {
        emit("update:formInitData", state.inFormObj);
      }
    };
    // 改变某些元素的状态
    watch(
      () => props.formState,
      (newValue, oldValue) => {
        if (newValue != oldValue) {
          stateListChange(newValue, state);
          start();
        }
      },
      { deep: true, immediate: true }
    );
    // 隐藏
    watch(
      () => props.hideList,
      (newValue, oldValue) => {
        if (newValue != oldValue) {
          if (state.inConfig.clearHideShow) {
            state.inHideList = [];
            state.inShowList = [];
          }
          state.inHideList = Array.from(
            new Set([...state.inHideList, ...newValue])
          );
          state.inShowList = differenceArray(newValue, state.inShowList);
          state.inItemList = state.inItemList.map(item => {
            item.show =
              state.inHideList.includes(item.code) || item.showType == 2
                ? false
                : state.inShowList.includes(item.code)
                ? true
                : item.show;
            if (state.inHideList.includes(item.code)) {
              state.inFormObj[item.code] =
                item.default != undefined ? item.default : "";
            }
            return item;
          });
          start();
        }
      },
      { immediate: true }
    );
    // 对 显示某些元素
    watch(
      () => props.showList,
      (newValue, oldValue) => {
        if (newValue != oldValue) {
          if (state.inConfig.clearHideShow) {
            state.inHideList = [];
            state.inShowList = [];
          }
          state.inShowList = Array.from(
            new Set([...state.inShowList, ...newValue])
          );
          state.inHideList = differenceArray(newValue, state.inHideList);
          state.inItemList = state.inItemList.map(item => {
            item.show = state.inShowList.includes(item.code)
              ? true
              : state.inHideList.includes(item.code) || item.showType == 2
              ? false
              : item.show;
            return item;
          });
          start();
        }
      },
      { immediate: true }
    );
    // 对 itemList 监听用于动态改变表单状态
    watch(
      () => props.itemList,
      (newValue, oldValue) => {
        if (newValue != oldValue && newValue.length > 0) {
          state.inItemList = newValue;
          start();
        }
      },
      { immediate: true }
    );
    // 对 itemList 监听用于动态改变表单状态
    watch(
      () => props.clearList,
      (newValue, oldValue) => {
        if (newValue != oldValue && newValue.length > 0) {
          newValue.forEach(key => {
            state.inFormObj[key] = "";
            formChange(null, key);
          });
        }
      },
      { immediate: true }
    );
    watch(
      () => props.formInitData,
      (newValue, oldValue) => {
        // 防止有些数字导致无限循环
        if (newValue != oldValue) {
          let newV = { ...newValue, ...props.formInitData };
          newV = changeObj(newV,state);
          state.inFormObj = { ...state.inFormObj, ...newV };
          // 检查传入的值是否需要更新dom
          for (let key in state.inFormObj) {
            let item = state.formListObj[key];
            // 如果可以是内部的对象且有返回valueChange且返回值是数组
            if (item) {
              if (item.show &&
                  item.valueChange &&
                  backType(
                      item.valueChange(state.inFormObj[key], state.inFormObj),
                      "Array"
                  )
              ) {
                stateListChange(
                    item.valueChange(state.inFormObj[key], state.inFormObj),
                    state
                );
              }
              if (item&&item.seriesCode) {
                formChange(item.el,item.code)
              }
            }
          }
          start();
        }
      },
      { immediate: true }
    );
    watch(
      () => state.inFormObj,
      (val, oldValue) => {
        if (
          val != oldValue &&
          JSON.stringify(val) != JSON.stringify(oldValue) &&
          val.length != oldValue.length
        ) {
          let checkChangeArr = Object.keys(state.checkChangeObj);
          // 对检查数组的监听
          if (checkChangeArr && checkChangeArr.length > 0) {
            checkChangeArr.forEach(key => {
              if (val[key] && val[key].length > 0) {
                ruleForm.value && ruleForm.value.validateField(key);
              }
              if (backType(val[key], "Object")) {
                ruleForm.value && ruleForm.value.validateField(key);
              }
            });
          }
          for (let key in state.formListObj) {
            if (
              state.inConfig.watchList.includes(key) &&
              val[key] != oldValue[key]
            ) {
              formChange(state.formListObj[key].el, key);
            }
          }
        }
      },
      { deep: true }
    );
    return {
      confirm,
      ruleForm,
      formListMadia,
      formListRef,
      enter,
      buttonsClick,
      formChange,
      resize,
      showButtom,
      reset,
      getInherit,
      ...toRefs(state)
    };
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
