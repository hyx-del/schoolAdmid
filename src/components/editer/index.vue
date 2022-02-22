<template>
  <!--富文本editer-->
  <div v-show="show" :style="inStyle">
    <div @mouseleave="leave()" class="editer" :id="code"></div>
  </div>
</template>

<script>
/*
 * index组件说明
 *
 * */
import { toRefs, ref, reactive, onMounted, watch, computed } from "vue";
import { wangEditorConfig } from "@/components/FormList/config";
import store from "@/store";
import { url } from "@/config";
import { GUID } from "@/utils/guid";
import { fileDownloadPost } from "@/api/download";
import { ElMessage, ElLoading } from "element-plus";

const OSS = require("ali-oss");

export default {
  name: "index",
  props: {
    value: {
      type: String,
      defalt: ""
    },
    disabled: {
      type: Boolean,
      defalt: false
    },
    show: {
      type: Boolean,
      defalt: true
    },
    code: {
      defalt: "editer"
    },
    style: {
      defalt: {
        width: "500px"
      }
    },
    class: {
      defalt: ["aaa"]
    }
  },
  setup(props, context) {
    const { emit, slots, attrs } = context;
    const state = reactive({
      inClass: computed(() => ""),
      inStyle: computed(() => props.style),
      editerObj: {}
    });
    // 递归上传
    const recurUp = (urls, index, mideStr, loading, allArr) => {
      fileDownloadPost({ urls: urls[index] }).then(res => {
        urls[index] = res.data;
        if (index < urls.length - 1) {
          recurUp(urls, index + 1, mideStr, loading, allArr);
        } else {
          let endArr = urls.flat(1);
          allArr.forEach((src, index) => {
            mideStr = mideStr.replace(src, `${endArr[index]}`);
          });
          state.editerObj.txt.html(mideStr);
          loading.close();
        }
      });
    };
    // 初始化富文本
    const initEditer = () => {
      //cdn引入优化
      const E = window.wangEditor;
      state.editerObj = new E(`#${props.code}`);
      state.editerObj.config.height = 1528;
      state.editerObj.config.width = 1200;
      state.editerObj.config.showLinkImg = false;
      state.editerObj.config.showLinkVideo = false;
      state.editerObj.config.showFullScreen = false;
      state.editerObj.config.pasteFilterStyle = false;
      state.editerObj.config.uploadImgShowBase64 = false;
      state.editerObj.config.menus = wangEditorConfig.menus;
      state.editerObj.config.pasteTextHandle = pasteStr => {
        let imgReg = /<img.*?(?:>|\/>)/gi;
        let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        let imgHtml = pasteStr.match(imgReg);
        let urls = [];
        let mideStr = pasteStr;
        imgHtml &&
          imgHtml.map(img => {
            let src = img.match(srcReg);
            let u = src[1].split("?");
            if (!u[0].includes(url.OSSUrl) && !u[0].includes(url.IMGCDN)) {
              src[1] && u[0] && urls.push(u[0]);
            }
          });
        if (urls.length > 0) {
          const loading = ElLoading.service({
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          let step = 6,
            midArr = [];
          for (let i = 0; i < urls.length; i++) {
            let j = Math.floor(i / step);
            if (i % step == 0) {
              midArr[j] = [urls[i]];
            } else {
              midArr[j].push(urls[i]);
            }
          }
          recurUp(midArr, 0, mideStr, loading, urls);
        }
        return pasteStr;
      };
      let client;
      try {
        client = new OSS({
          accessKeyId: store.getters.upLoadToken.accessKeyId,
          accessKeySecret: store.getters.upLoadToken.accessKeySecret,
          stsToken: store.getters.upLoadToken.securityToken,
          bucket: url.OSSBucket,
          region: url.OSSRegion,
          endpoint: url.OSSUrl,
          cname: url.OSSUrl
        });
        state.editerObj.config.customUploadImg = function(
          resultFiles,
          insertImgFn
        ) {
          // resultFiles 是 input 中选中的文件列表
          // insertImgFn 是获取图片 url 后，插入到编辑器的方法
          let guid = new GUID();
          let name = guid.newGUID();
          let files = resultFiles[0],
            point = files.name.lastIndexOf("."),
            suffix = files.name.substr(point),
            imgType = suffix.split(".")[1];
          client
            .put(name + "." + imgType, resultFiles[0])
            .then(function(res) {
              // 上传图片，返回结果，将图片插入到编辑器中
              insertImgFn(res.url);
            })
            .catch(function(err) {
              console.log(err);
            });
        };
        // state.editerObj.i18next = window.i18next
        state.editerObj.create();
      } catch (err) {
        console.log(err);
      }
    };
    onMounted(() => {
      initEditer();
    });
    //
    const leave = () => {
      let value = state.editerObj.txt.html();
      emit("update:value", value);
      emit("change", value);
    };

    watch(
      () => props.value,
      (val, oldVal) => {
        if (val != oldVal) {
          state.editerObj.txt.html(val);
        }
      },
      { deep: true }
    );
    watch(
      () => props.disabled,
      (val, oldVal) => {
        if (val != oldVal) {
          if (val) {
            state.editerObj.disable();
          } else {
            state.editerObj.enable();
          }
        }
      }
    );
    return {
      leave,
      ...toRefs(props),
      ...toRefs(state)
    };
  }
};
</script>

<style scoped>
.editer {
  position: relative;
  z-index: 5;
}
</style>
