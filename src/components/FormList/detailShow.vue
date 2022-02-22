<template>
  <div
    ref="formListMadia"
    v-resize="resize"
    class="listShow"
    :class="{ column: inConfig.inline }"
  >
    <div
      v-for="(item, index) in inList"
      :key="index"
      class="listShowItem"
      :style="{
        ...{ width: itemWidth ? itemWidth : null },
        ...inConfig.itemStyle,
        ...item.style
      }"
      :class="{
        listShowlineIn: item.el == 'line',
        editers: item.el == 'editer'
      }"
    >
      <div
        v-if="!noEl.includes(item.el)"
        :style="{ ...{ paddingLeft: inLabelWidth } }"
      >
        <div class="listShowLabel" :style="{ ...{ width: inLabelWidth } }">
          {{ item.label }}{{ inConfig.colon }}
        </div>
        <div class="listShowValue" :style="{ ...inConfig.rightStyle }">
          <div class="span" v-if="spanArr.includes(item.el)">
            <div v-if="item.type == 'Array'">
              <div v-for="(i, index) in inFormObj[item.code]" :key="index">
                {{ i[item.labelCode] || i }}
              </div>
            </div>
            <div v-else>
              {{ inFormObj[item.code] || item.default || "未选填" }}
            </div>
          </div>
          <div
            class="editer"
            v-if="item.el == 'editer'"
            v-html="inFormObj[item.code]"
          ></div>
          <div class="imgShow" v-if="item.el == 'img'">
            <div
              class="img_item"
              v-for="(img, i) in inFormObj[item.code]"
              :key="i"
            >
              <el-image
                :style="{
                  width: item.width || '150px',
                  minHeight: item.height || '100px'
                }"
                :src="img"
                :preview-src-list="inFormObj[item.code]"
              >
                <template #error>
                  <el-image
                    :style="{
                      width: item.width || '150px',
                      minHeight: item.height || '100px'
                    }"
                    :src="img"
                    :preview-src-list="inFormObj[item.code]"
                  >
                    <template #error>
                      <div class="imgError">
                        <img
                          src="https://file.jiayu.world/common/imgError.png"
                          alt=""
                        />
                      </div>
                    </template>
                  </el-image>
                </template>
              </el-image>
            </div>
          </div>
          <div class="video" v-if="item.el == 'video'">
            <video
              v-if="inFormObj[item.code]"
              class="inVideo"
              :src="inFormObj[item.code]"
              controls="controls"
            >
              您的浏览器不支持视频播放
            </video>
            <div v-else>{{ item.none || "没有上传" }}</div>
          </div>
          <div class="audio" v-if="item.el == 'mp3'">
            <audio
              v-if="inFormObj[item.code]"
              class="inAudio"
              :src="inFormObj[item.code]"
              controls="controls"
            >
              您的浏览器不支持视频播放
            </audio>
            <div v-else>{{ item.none || "没有上传" }}</div>
          </div>
          <!-- slot插槽  -->
          <slot v-if="item.el == 'slot'" :name="item.slotName"></slot>
          <slot v-if="item.afterSlot" :name="item.afterSlot"></slot>
        </div>
      </div>
      <div v-if="item.el == 'line'" class="listShowline"></div>
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
import { backType, differenceArray, farmatDate } from "./utils";
import { log } from "@/utils";
import { pushValue } from "@/components/FormList/pushValue";
import { getInherit, stateListChange } from "@/components/FormList/selfTools";
let dethArr = ["Array", "ArrayString", "ArrayStringNumber"];

const defaultConfig = {
  required: false,
  colon: "：",
  itemStyle: {
    marginBottom: "10px"
  },
  rightStyle: {
    width: "400px"
  }
};
export default {
  props: {
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
    formState: {
      type: Array,
      required: false
    },
    itemList: {
      type: Array,
      required: true
    },
    formInitData: {
      type: Object,
      required: false
    },
    config: {
      type: Object,
      default: () => {
        return {
          labelWidth: 0,
          inline: false,
          column: [1, 1, 1, 1], //每行几个,可数字可数组[],
          media: [0, 800, 1200, 1400]
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
    const formListMadia = ref(null);
    const state = reactive({
      noEl: ["line"],
      itemWidth: "",
      spanArr: [
        "span",
        "input",
        "select",
        "radio",
        "checkBox",
        "checkbox",
        "date",
        "area",
        "area2",
        "textArea"
      ],
      inConfig: {
        clearHideShow: false,
        buttonsArea: "",
        enter: true,
        allRequired: true, // 是否全部必填
        labelShow: true,
        inline: false, //行内
        hasLoading: false, //行内
        itemStyle: {
          // marginBottom: '24px'
        },
        rightStyle: {
          width: "100%"
        },
        inputStyle: {
          width: "360px"
        },
        radioStyle: {
          marginLeft: "0",
          marginRight: "30px"
        },
        checkboxStyle: {
          marginLeft: "0",
          marginRight: "10px"
        },
        editerStyle: {
          width: "600px"
        },
        size: "small",
        colon: "：", // 冒号
        mainStyle: {}
      },
      formListObj: {}, //全部对象
      inList: [],
      inLabelWidth: 4,
      inFormObj: {},
      editerReq: false, //editer是否通过验证，
      inHideList: [],
      inShowList: [],
      inItemList: []
    });
    // 获取元素变化
    const resize = val => {
      formSize();
    };
    onMounted(() => {
      formSize();
    });
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

    const artFnc = (str = "") => {
      if (str == "") return "";
      let img = `width:100%;`;
      str = str.replace(/<img src/gi, `<img style="${img}" src`);
      return str;
    };
    // 传入下面的list，返回结果
    const getListObj = (list, value) => {
      let backArr = list.filter(item => item.value == value);
      if (backArr.length > 0) {
        return backArr[0].label;
      } else {
        return "";
      }
    };
    // 初始化组件
    const start = () => {
      state.inItemList = state.inItemList.map(item => {
        item.show =
          item.show == undefined
            ? true
            : item.showType != 1 && item.show
            ? true
            : false;
        return item;
      });
      state.inList = state.inItemList.filter(item => item.show);
      // 获取最大label长度
      let maxLabelWidth = 0;
      let hasRequired = state.inItemList.some(item => item.required); //是否有必选
      state.inConfig = Object.assign(state.inConfig, props.config);
      state.inList = state.inList.map(value => {
        let { el, code, label } = value;
        if (value.showType == 1) {
          return null;
        }
        if (value.detailCode) {
          state.inFormObj[code] = state.inFormObj[value.detailCode];
        }
        value.oldLabel = value.oldLabel || label;
        // 基本参数
        let defalt = {
          el: "span",
          required: state.inConfig.allRequired || false
        };
        let spanArr = ["checkbox", "input", "radio", "area"];
        if (spanArr.includes(el)) {
          value.el = "span";
        }
        value.inherit = getInherit(value, el);

        // 外部赋值区
        // otherCodeArr,时间和日期的区间赋值
        if (value.otherCodeArr) {
          let midArr = [];
          let now = farmatDate();
          if (el == "timePicker") {
            value.otherCodeArr.map(v => {
              midArr.push(
                state.inFormObj[v]
                  ? `${now.date} ${state.inFormObj[v] || ""}`
                  : ""
              );
            });
          }
          if (el == "date") {
            value.otherCodeArr.map(v => {
              midArr.push(state.inFormObj[v]);
            });
          }
          midArr = midArr.filter(v => v);
          state.inFormObj[code] = [...midArr].join("~");
        }

        // defaltValueSort 取值序列
        if (
          value.defaltValueSort &&
          (!state.inFormObj[code] || state.inFormObj[code].length == 0)
        ) {
          let spliteArr = backType(value.defaltValueSort, "String")
            ? value.defaltValueSort.split(",")
            : value.defaltValueSort;
          spliteArr.some(v => {
            if (state.inFormObj[v]) {
              state.inFormObj[code] = state.inFormObj[v];
              return true;
            }
          });
        }

        if (
          value.list &&
          value.list.length > 0 &&
          state.inFormObj[code] &&
          !isNaN(Number(state.inFormObj[code]))
        ) {
          state.inFormObj[code] = getListObj(
            value.list,
            state.inFormObj[code],
            "label"
          );
        }
        if (el == "img") {
          if (backType(state.inFormObj[code], "String")) {
            state.inFormObj[code] = state.inFormObj[code].split(",");
          }
          if (backType(state.inFormObj[code], "Undefined")) {
            state.inFormObj[code] = [];
          }
          // value.label=value.oldLabel+(state.inFormObj[code].length>0?`(${state.inFormObj[code].length})`:'')
        }
        if (el == "editer") {
          try {
            state.inFormObj[code] = artFnc(state.inFormObj[code]);
          } catch (err) {
            state.inFormObj[code] = value.defalt || "未填写";
          }
        }
        let rex = /[\u4e00-\u9fa5]+/gi;
        let long;
        if (rex.test(value.label)) {
          let zhStr = value.label.match(rex).join("");
          long = zhStr.length + value.label.length;
        } else {
          long = value.label.length;
        }
        long = Math.ceil(long / 2);
        maxLabelWidth = long > maxLabelWidth ? long : maxLabelWidth;
        value = Object.assign(defalt, value);
        hasRequired = value.required ? true : hasRequired;
        state.formListObj[code] = value;
        return value;
      });
      state.inFormObj = JSON.parse(JSON.stringify(state.inFormObj));
      state.inList = state.inList.filter(v => v);
      // 根据 配置labelWidth>label最大长度+冒号的长度+是否含有必选项  得到labelWidth
      state.inLabelWidth =
        (props.config && props.config.labelWidth) || 0
          ? state.config.labelWidth
          : maxLabelWidth +
            state.inConfig.colon.length +
            (hasRequired ? 1 : 0) +
            "em";
    };
    watch(
      () => props.formInitData,
      (newV, oldV) => {
        // 防止有些数字导致无限循环
        if (newV != oldV) {
          state.inFormObj = { ...state.inFormObj, ...newV };
          // 检查传入的值是否需要更新dom
          for (let key in state.inFormObj) {
            let item = state.formListObj[key];
            // 如果可以是内部的对象且有返回valueChange且返回值是数组
            if (
              item &&
              item.show &&
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
          }
          start();
        }
      },
      { immediate: true, deep: true }
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
              state.inHideList.includes(item.code) || item.showType == 1
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
          state.inShowList = Array.from(
            new Set([...state.inShowList, ...newValue])
          );
          state.inHideList = differenceArray(newValue, state.inHideList);
          state.inItemList = state.inItemList.map(item => {
            item.show = state.inShowList.includes(item.code)
              ? true
              : state.inHideList.includes(item.code) || item.showType == 1
              ? false
              : item.show;
            return item;
          });
          start();
        }
      },
      { immediate: true }
    );
    // 改变某些元素的状态
    watch(
      () => props.formState,
      (newValue, oldValue) => {
        if (newValue != oldValue) {
          if (state.inConfig.clearHideShow) {
            state.inHideList = [];
            state.inShowList = [];
          }
          let codeObj = {};
          let codeList = newValue.map(item => {
            codeObj[item.code] = item;
            return item.code;
          });
          codeList = codeList.filter(v => v);
          state.inItemList = state.inItemList.map(item => {
            if (codeList.includes(item.code)) {
              item = { ...item, ...codeObj[item.code] };
            }
            return item;
          });
          start();
        }
      },
      { deep: true, immediate: true }
    );
    start();
    return {
      resize,
      formListMadia,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped>
.imgError {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background: #eee;
  img {
    width: 122px;
    height: 77px;
  }
}
.listShow {
  $lh: 42px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  &.column {
    display: block;
    .listShowItem {
      width: 100%;
    }
  }
  .listShowItem {
    display: flex;
    //align-items: center;
    position: relative;
    box-sizing: border-box;
    width: 33%;
    min-height: 24px;
    margin-bottom: 24px;
  }
  .listShowlineIn {
    flex-shrink: 0;
    width: 100% !important;
    height: 0;
    min-height: 0;
    margin: 12px 0 36px;
    border-bottom: 1px solid #f0f0f0;
  }
  .listShowline {
  }
  .listShowLabel {
    position: absolute;
    left: 0;
    top: 0;
    line-height: 24px;
    text-align: right;
  }
  .listShowValue {
    display: flex;
    flex-wrap: wrap;
  }
  .span {
    min-width: 200px;
    line-height: 24px;
    word-wrap: break-word;
    word-break: break-all;
  }
  .editer {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
    line-height: 22px;
    background: #f5f5f5;
    color: #262626;
  }
  .imgShow {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    .img_item {
      margin-right: 10px;
    }
  }
  .video,
  .inVideo,
  .audio,
  .inAudio {
    width: 400px;
  }
  .inAudio,
  .inVideo {
    &:focus {
      border: none;
      outline: none;
    }
  }
  & >>> .el-image-viewer__close {
    color: #fff;
  }
  @media only screen and (min-width: 1400px) {
    .listShowItem {
      width: 20%;
    }
  }
  @media only screen and (max-width: 1400px) {
    .listShowItem {
      width: 33%;
    }
  }
  @media only screen and (max-width: 1200px) {
    .listShowItem {
      width: 50%;
    }
  }
  @media only screen and (max-width: 800px) {
    .listShowItem {
      width: 100%;
    }
  }
}
.listShowItem.editers {
  width: 100% !important;
  & > div {
    width: 100%;
  }
}
</style>
