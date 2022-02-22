<template>
  <div class="emptyBox" ref="emptyBox" v-resize="resize" :style="emptyBoxStyle">
    <div class="emptyBoxIn">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { watch, reactive, ref, toRefs } from "vue";
// 空盒子
// import emptyBox from "@/components/emptyBox/index.vue";

export default {
  props: {
    // 距离窗口头部位置
    top: {
      type: Number
    },
    // 距离窗口底部位置
    bottom: {
      type: [Number, String],
      default: 150
    },
    style: {
      default: {}
    },
    // 距离窗口底部位置
    paddingBottom: {
      type: Number,
      default: 0
    },
    // 是否铺满
    full: {
      type: Boolean,
      default: true
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
  setup(porps, context) {
    const emptyBox = ref(null);
    const state = reactive({
      emptyBoxStyle: {}
    });
    // 获取元素变化
    const resize = val => {
      if (!porps.full) return;
      //窗口高
      let windowHeight = document.documentElement.clientHeight;
      let emptyBoxInfo = emptyBox.value.getBoundingClientRect();
      let top = porps.top || emptyBoxInfo.top;
      let bottom = porps.bottom || emptyBoxInfo.bottom;
      let maxHeight = windowHeight - bottom - top;
      let selfHeight = emptyBoxInfo.height;
      let height = selfHeight > maxHeight ? maxHeight : selfHeight;
      state.emptyBoxStyle = {
        height: height + "px",
        ...porps.style
      };
    };
    return {
      ...toRefs(state),
      resize,
      emptyBox
    };
  }
};
</script>

<style lang="scss" scoped>
.emptyBox {
  width: 100%;
  .emptyBoxIn {
    height: 100%;
    overflow: auto;
  }
}
</style>
