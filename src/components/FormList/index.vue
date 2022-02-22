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
            :style="{ ...inConfig.itemStyle, ...item.valueStyle }"
            :class="{ 'is-required': item.required }"
            :prop="item.code"
            :label="item.label + inConfig.colon"
          >
            <div :style="{ ...inConfig.rightStyle }" class="rightStyle">
              <!--输入框-->
              <el-input
                v-if="item.el == 'input'"
                v-bind="{ ...item.inherit }"
                @change="inputChange(item.code, item)"
                @clear="inputChange(item.code, item)"
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                v-model.trim="inFormObj[item.code]"
                @keyup.enter.native="enter"
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
              </el-input>
              <!--文本域输入框-->
              <el-input
                show-word-limit
                v-bind="{ ...item.inherit }"
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                v-if="item.el == 'textArea'"
                type="textarea"
                v-model="inFormObj[item.code]"
                @change="formChange(item.el, item.code)"
              />
              <el-input-number
                v-bind="{ ...item.inherit }"
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                v-if="item.el == 'inputNumber'"
                v-model="inFormObj[item.code]"
                @change="formChange(item.el, item.code)"
              />
              <el-rate
                v-bind="{ ...item.inherit }"
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                v-if="item.el == 'rate'"
                v-model="inFormObj[item.code]"
                @change="formChange(item.el, item.code)"
              />
              <el-slider
                v-bind="{ ...item.inherit }"
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                v-if="item.el == 'slider'"
                v-model="inFormObj[item.code]"
                @change="formChange(item.el, item.code)"
              />
              <el-switch
                v-bind="{ ...item.inherit }"
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                v-if="item.el == 'switch'"
                v-model="inFormObj[item.code]"
                @change="formChange(item.el, item.code)"
              />
              <!--下拉-->
              <el-select
                v-bind="{ ...item.inherit }"
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                v-if="item.el == 'select'"
                v-model="inFormObj[item.code]"
                @change="selectChange(item.code, item)"
                :remote-method="remoteMethod ? remoteMethodSelect(item) : null"
              >
                <el-option
                  v-for="it in item.back ? backList[item.code] : item.list"
                  :key="it.value"
                  v-bind="getInherit(it, 'option')"
                ></el-option>
              </el-select>
              <!--下拉选择联合tag-->
              <el-select
                remote
                filterable
                v-bind="{ ...item.inherit }"
                :style="{ ...inConfig.inputStyle }"
                v-if="item.el == 'searchTags'"
                v-model="inSearchVal[item.code]"
                :ref="item.code"
                @change="searchTagsChange(item.code)"
                :remote-method="remoteMethod"
              >
                <el-option
                  v-for="it in backList[item.code]"
                  v-bind="getInherit(it, 'option')"
                  :key="it.value"
                  :label="it.label"
                  :value="it.value"
                />
              </el-select>
              <el-tag
                v-bind="{ ...item.inherit }"
                class="formListTag"
                v-if="item.el == 'searchTags'"
                v-for="(tag, ind) in inFormObj[item.code]"
                :key="tag.label"
                closable
                :disable-transitions="false"
                @close="searchTagsClose(item, tag)"
              >
                {{ tag.label }}
              </el-tag>
              <!--日期选择-->
              <el-date-picker
                v-bind="{ ...item.inherit }"
                :placeholder="item.placeholder"
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                v-if="item.el == 'date'"
                v-model="inFormObj[item.code]"
                :type="item.dateType"
                @blur="dateChange(item.code)"
                :disabled-date="getDateDisabledDate(item)"
                :ref="item.code"
              />
              <el-time-picker
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                v-bind="{ ...item.inherit }"
                v-model="inFormObj[item.code]"
                v-if="item.el == 'timePicker'"
              />
              <!--时间选择-->
              <el-time-select
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                v-bind="{ ...item.inherit }"
                v-model="inFormObj[item.code]"
                v-if="item.el == 'timeSelect'"
              />
              <!--Cascader 级联选择器 + tag-->
              <el-cascader
                v-bind="{ ...item.inherit }"
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                v-if="item.el == 'cascaderTags'"
                :ref="item.code"
                v-model="inFormObj[item.code + '_v']"
                :options="item.back ? backList[item.code] : item.list"
                @change="cascaderTagsChange(item.code)"
                :placeholder="item.placeholder"
              />
              <el-tag
                class="formListTag"
                v-if="item.el == 'cascaderTags'"
                v-for="(tag, ind) in inFormObj[item.code]"
                :key="tag.label"
                closable
                :disable-transitions="false"
                @close="cascaderTagsChangeClose(item, tag)"
              >
                {{ tag.label }}
              </el-tag>
              <!--radio 单选-->
              <el-radio-group
                v-bind="{ ...item.inherit }"
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                v-if="item.el == 'radio'"
                v-model="inFormObj[item.code]"
                @change="radioChange(item.code)"
              >
                <el-radio
                  :style="{ ...inConfig.radioStyle }"
                  v-for="it in item.back ? backList[item.code] : item.list"
                  v-bind="getInherit(it, 'radio')"
                  :label="it.value"
                  :key="it.value"
                >
                  {{ it.label }}
                </el-radio>
              </el-radio-group>
              <!--checkbox 多选-->
              <el-checkbox-group
                v-bind="{ ...item.inherit }"
                :style="{ ...inConfig.checkboxStyle, ...item.inputStyle }"
                v-if="item.el == 'checkbox'"
                v-model="inFormObj[item.code]"
                @change="checkboxChange(item.code)"
              >
                <el-checkbox
                  v-for="it in item.back ? backList[item.code] : item.list"
                  v-bind="getInherit(it, 'checkbox')"
                  :key="it.value"
                  :label="it.value"
                >
                  {{ it.label }}
                </el-checkbox>
              </el-checkbox-group>
              <!--富文本editer-->
              <editer
                v-bind="{ ...item.inherit }"
                v-if="item.el == 'editer'"
                v-model:value="inFormObj[item.code]"
                @change="formChange(item.el, item.code)"
              />
              <!--图片上传-->
              <UploadImgDrag
                v-bind="{ ...item.inherit }"
                v-if="item.el == 'img' && !item.ratio"
                @fileChange="formChange(item.el, item.code)"
                v-model:value="inFormObj[item.code]"
              />
              <uploadCropperImg
                v-bind="{ ...item.inherit }"
                v-if="item.el == 'img' && item.ratio"
                @fileChange="formChange(item.el, item.code)"
                v-model:value="inFormObj[item.code]"
              >
              </uploadCropperImg>
              <!-- 视频  -->
              <uploadVideo
                v-bind="{ ...item.inherit }"
                v-if="item.el == 'video'"
                v-model:value="inFormObj[item.code]"
              />
              <!-- 音频  -->
              <uploadAudio
                v-if="item.el == 'mp3'"
                v-model:value="inFormObj[item.code]"
              />
              <!-- 省市区  -->
              <el-cascader
                v-bind="{ ...item.inherit }"
                class="formListArea"
                v-if="item.el == 'area'"
                v-model="inFormObj[item.code]"
                :options="optionsList"
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                @change="addressHandleChange(item, item.code)"
                :ref="item.code"
                clearable
              />
              <!-- 省市  -->
              <el-cascader
                v-bind="{ ...item.inherit }"
                class="formListArea"
                v-if="item.el == 'area2'"
                v-model="inFormObj[item.code]"
                :options="optionsList2"
                :style="{ ...inConfig.inputStyle, ...item.inputStyle }"
                @change="addressHandleChange(item, item.code, 2)"
                :ref="item.code"
                clearable
              />
              <!-- slot插槽  -->
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
              <!--end-->
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
  wangEditorConfig,
  updateArr,
  numberArr,
  checkType,
  inheritObj
} from "./config";
const OSS = require("ali-oss");
import UploadImgDrag from "@/components/upload";
import uploadCropperImg from "@/components/uploadCropperImg";
import uploadVideo from "@/components/uploadVideo";
import uploadAudio from "@/components/uploadAudio";
import editer from "@/components/editer";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { formCheck } from "@/components/FormList/formCheck";
import { dealForm } from "@/components/FormList/dealForm";
import { pushValue } from "@/components/FormList/pushValue";
import {
  byBackFunChange, changeObj,
  countFun,
  getFunData,
  getInherit,
  itemStart,
  stateListChange
} from "@/components/FormList/selfTools";
export default {
  name: "formListssssss",
  components: {
    UploadImgDrag,
    uploadCropperImg,
    uploadVideo,
    editer,
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
      inReset:reset,
      // 插槽的点击
      slotClick: (item, fun) => {
        if (fun) {
          byBackFunChange(state, item, fun, () => start());
        }
      },
      defaltValue: {},
      test: val => {},
      getComponent: val => {
        let { el = null } = inheritObj[val.el];
        return el;
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
      otherCount: {},
      // 限制时间
      getDateDisabledDate: item => {
        let minDate = item.minDate || "1997-12-30";
        let maxDate = item.maxDate || "2200-12-30";
        return time => {
          return (
            time.getTime() < new Date(minDate).getTime() ||
            time.getTime() > new Date(maxDate).getTime()
          );
        };
      }
    });
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
    onBeforeUnmount(() => {
      resize();
    });
    onMounted(() => {
      formListRef.value = getCurrentInstance().proxy;
    });
    // 输入框发生变化
    const inputChange = (code, item) => {
      if (item.type && checkType[item.type].correctRegular) {
        let str = state.inFormObj[item.code] + "";
        state.inFormObj[item.code] = str.replace(
          checkType[item.type].correctRegular,
          ""
        );
        if (numberArr.includes(item.type)) {
          state.inFormObj[item.code] =
            parseFloat(str.replace(checkType[item.type].correctRegular, "")) ||
            "";
        }
      }
      formChange(item.el, item.code);
    };
    //监听下拉事件
    const selectChange = (code, item) => {
      let { otherBack = code + "label" } = item;
      let choos = [];
      let selectList = item.fun ? state.backList[code] || [] : item.list;
      if (item.multiple) {
        choos = selectList.filter(v => state.inFormObj[code].includes(v.value));
        let mid = choos.map(item => item.label);
        state.inFormObj[otherBack] = mid.join(",") || "";
        if (item.allSelectCode)
          state.inFormObj[item.allSelectCode] = choos || [];
      } else {
        if (selectList) {
          choos = selectList.filter(v => v.value == state.inFormObj[code]);
        }
        state.inFormObj[otherBack] = (choos[0] && choos[0].label) || "";
      }

      formChange("select", code, { allList: choos });
    };
    //
    const remoteMethodSelect = item => {
      return value => {
        if (item.fun) {
          let par = item.remoteMethod(value);
          getFunData(state, item, { ...item.query, ...par });
        }
      };
    };
    // 搜索下拉的搜索值传出
    const remoteMethod = val => {
      let seachArr = Object.keys(state.refSeachObj);
      let code = "";
      // 获取当前的code
      seachArr.forEach(el => {
        if (val == formListRef.value.$refs[el].query) {
          code = el;
        }
      });
      let item = state.formListObj[code];
      let searchCode = item.searchCode || "id";
      state.inSearchVal[code] = val;
      if (item.fun) {
        getFunData(state, item, { ...item.query });
      }
      formChange("searchTags", code);
    };
    //搜索下拉tag事件
    const searchTagsChange = (code, item) => {
      let list = state.backList[code];
      let chose = list.filter(val => state.inSearchVal[code] == val.value);
      state.inFormObj[code] = addItem(chose[0], state.inFormObj[code]);
      state.inSearchVal[code] = "";
      formChange(item.el, item.code);
    };
    // 搜索下拉tag添加tag标签
    const addItem = (item, arr, key = "value") => {
      if (arr.length == 0) return [item];
      let repeat = arr.filter(val => val[key] == item[key]);
      arr = repeat.length > 0 ? arr : [...arr, item];
      return arr;
    };

    // 日期变化处理
    const dateChange = code => {
      let { maxTime, minTime, label } = state.formListObj[code];
      maxTime = new Date(maxTime).getTime();
      minTime = new Date(minTime).getTime();
      let choseTime = new Date(state.inFormObj[code] || new Date()).getTime();
      if (maxTime && maxTime < choseTime) {
        ElMessage.error(
          `${label}选择日期大于可选的最大日期${parseTime(maxTime)}`
        );
        state.inFormObj[code] = "";
      }
      if (minTime && minTime > choseTime) {
        ElMessage.error(
          `${label}选择日期小于可选的最小日期${parseTime(minTime)}`
        );
        state.inFormObj[code] = "";
      }
    };

    //级联选择器+tag 监听变化
    const cascaderTagsChange = code => {
      let value = state.inFormObj[code + "_v"];
      let options = formListRef.value.$refs[code].options;
      let obj = getCascaderLabel(options, value);
      state.inFormObj[code] = obj
        ? addItem(obj, state.inFormObj[code])
        : state.inFormObj[code];
      state.inFormObj[code + "_v"] = [];
    };
    //级联选择器+tag 删除某个tag
    const cascaderTagsChangeClose = (item, index) => {
      state.inFormObj[item.code] = state.inFormObj[item.code].filter(
        val => val != index
      );
    };
    const getCascaderLabel = (list, arr) => {
      let obj = { value: arr.join(",") };
      list.forEach(v => {
        if (v.value == arr[0]) {
          v.children.map(val => {
            if (val.value == arr[1]) {
              obj.label = v.label + "," + val.label;
            }
          });
        }
      });
      return obj.label ? obj : false;
    };
    // 地区选择 item.areaCode province(省),provinceId(省id),city(市),cityId(市ID),county(区),countyId(区ID)
    const addressHandleChange = (item, code, level = 3) => {
      setTimeout(() => {
        let value = state.inFormObj[code];
        let nameArr = formListRef.value.$refs[code].presentText.split(" / ");
        let areaCode =
          item.areaCode || "province,provinceId,city,cityId,county,countyId";
        let areaCodeArr = areaCode.split(",");
        if (value) {
          state.inFormObj[areaCodeArr[0]] = nameArr[0];
          state.inFormObj[areaCodeArr[1]] = value[0];
          state.inFormObj[areaCodeArr[2]] = nameArr[1];
          state.inFormObj[areaCodeArr[3]] = value[1];
          if (level == 3) {
            state.inFormObj[areaCodeArr[4]] = nameArr[2];
            state.inFormObj[areaCodeArr[5]] = value[2];
            formChange("area", code, { ids: value, names: nameArr });
          } else {
            formChange("area2", code, { ids: value, names: nameArr });
          }
        } else {
          state.inFormObj[areaCodeArr[0]] = "";
          state.inFormObj[areaCodeArr[1]] = "";
          state.inFormObj[areaCodeArr[2]] = "";
          state.inFormObj[areaCodeArr[3]] = "";
          if (level == 3) {
            state.inFormObj[areaCodeArr[4]] = "";
            state.inFormObj[areaCodeArr[5]] = "";
            formChange("area", code, { ids: value, names: nameArr });
          } else {
            formChange("area2", code, { ids: value, names: nameArr });
          }
        }
      }, 100);
    };
    // 单选监听
    const radioChange = code => {
      let item = state.formListObj[code];
      let list = state.backList[code] || state.formListObj[code].list;
      let otheValue = list.filter(i => i.value == state.inFormObj[code]);
      state.inFormObj[item.otherBack || code + "_otherBack"] =
        otheValue[0].label;
      state.inFormObj[item.allSelectCode] = otheValue[0];
      formChange("radio", code, { allList: otheValue });
    };
    // 监听多选
    const checkboxChange = (code, it) => {
      let item = state.formListObj[code];
      let list = state.backList[code] || item.list;
      let choseList =
        list.filter(v => state.inFormObj[code].includes(v.value)) || [];
      state.inFormObj[item.otherBack || code + "_otherBack"] = choseList
        .map(i => i.label)
        .join(",");
      if (item.allSelectCode) {
        state.inFormObj[item.allSelectCode] = choseList;
      }
      formChange("checkbox", code, { allList: choseList });
    };
    // 初始化
    let start = () => {
      state.inItemList = state.inItemList.map(item => {
        item = { ...state.inConfig.defalt, ...item };
        item.show = item.showType != 2 && item.show ? true : false;
        // 未输入提示
        item.placeholder =
          item.placeholder ||
          `${inputArr.includes(item.el) ? "请输入" : "请选择"}${item.label}`;
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
      state.inConfig.defalt = { ...inConfig.defalt, ...props.config.defalt };
      state.inList = state.inList.map(value => {
        let { code, el = "input", label } = value;
        if (state.noEl.includes(el) || el == "slot") {
          return value;
        }
        value = { ...state.inConfig.defalt, ...value };
        // 基本参数
        let defaltValue = {
          disabled: state.inConfig.allDisabled,
          required: state.inConfig.allRequired,
          maxlength: el == "input" ? 60 : 255
          // size:
          //   value.size || (updateArr.includes(el) ? 1000 : state.inConfig.size)
        };
        if (updateArr.includes(el)) {
          value.size = backType(value.size, "Number") ? value.size : 1000;
        } else {
          value.size = value.size || state.inConfig.size;
        }

        value = Object.assign(defaltValue, value);
        if (value.preCheck) {
          state.inCheckItemObj[code] =
            state.inCheckItemObj[code] == undefined
              ? false
              : state.inCheckItemObj[code];
        }

        // 从elementplus继承的属性
        value.inherit = getInherit(value, el);
        // 外部赋值区
        pushValue(state, value, el, code);
        if (value.defalt) {
          state.defaltValue[code] = value.defalt;
        }

        // 统计最长的label
        let long = getlabelWidth(value.label);
        maxLabelWidth = long > maxLabelWidth ? long : maxLabelWidth;

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
    const reset = (bts = { name: "reset" }, keep = {}) => {
      ruleForm.value.resetFields();
      let inFormObj = {};
      state.inList.forEach(item => {
        inFormObj[item.code] = "";
      });
      inFormObj = { ...inFormObj, ...state.defaltValue, ...keep };
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
      // 下拉联动
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
                console.log(132123)
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
          // 对编辑器的监听
          let checkChangeArr = Object.keys(state.checkChangeObj);
          editerObjArr.forEach(key => {
            if (val[key] && val[key] == " ") {
              ruleForm.value.validateField(key);
            }
          });
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
      remoteMethod,
      remoteMethodSelect,
      searchTagsChange,
      selectChange,
      dateChange,
      cascaderTagsChange,
      cascaderTagsChangeClose,
      radioChange,
      checkboxChange,
      buttonsClick,
      addressHandleChange,
      formChange,
      resize,
      showButtom,
      inputChange,
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
