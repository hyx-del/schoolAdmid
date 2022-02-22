<!--
 * @Author: tianhao
 * @Date: 2020-06-12 12:09:22
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-22 10:30:14
 * @Descripttion:
params:
-->

<template>
  <div>
    <el-upload
      class="lt_uploader"
      action=""
      :show-file-list="false"
      :data="parameters"
      :before-upload="beforeAvatarUpload"
      :http-request="fnUploadRequest"
      :file-list="fileList"
      list-type="picture-card"
      :limit="limit"
      :disabled="disabled"
    >
      <div class="upload_comp">
        <div
          class="upload_img_item"
          v-for="(item, index) in fileList"
          :key="item.name"
        >
          <img :src="item.url" class="img_item" />
          <span class="img_item_action" v-if="!disabled">
            <i class="el-icon-delete" @click="delUploadImg($event, index)"></i>
          </span>
        </div>
      </div>
      <!-- 上传按钮 -->
      <div
        class="upload_btn"
        v-if="fileList.length != limit && !disabled"
        slot="trigger"
      >
        <i class="el-icon-plus"></i>
      </div>
      <template #tip>
        <div class="tips">
          {{
            tips ||
              `${
                fileList.length
              }/${limit},请上传不超过${size}KB的JPEG、JPG、PNG格式的图片${
                ratio != ""
                  ? `,上传比例${parseInt(
                      Number(
                        ratio.split("/")[0] / Number(ratio.split("/")[1])
                      ) * 100
                    ) / 100},建议尺寸${ratio}`
                  : ""
              }`
          }}
        </div>
      </template>
    </el-upload>
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  onCreated,
  watch
} from "vue";
const OSS = require("ali-oss");
import draggable from "vuedraggable";
import { url } from "@/config/index";
import { GUID } from "@/utils/guid.js";
import store from "@/store";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "LTQNUpload",
  components: { draggable },
  props: {
    // 标识
    code: {
      type: String
    },
    value: {
      // 初始化图片
      type: [String, Array]
    },
    defaultUrl: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      // 如果值为true 那么只能显示，不会有上传功能
      type: Boolean,
      default: false
    },
    size: {
      // 现在单张图片大小
      type: Number,
      default: 500
    },
    limit: {
      // 限制数量
      type: Number,
      default: 1
    },
    ratio: {
      type: String,
      default: ""
    },
    isGif: {
      // 是不是gif
      type: Boolean,
      default: false
    },
    ImgType: {
      //限制图片格式
      type: Array,
      default() {
        return ["png", "jpg", "jpeg"];
      }
    },
    maxImgSize: {
      type: Number,
      default: 1000
    },
    tips: {
      //底部提示
      type: String,
      default() {
        return "";
      }
    }
  },
  setup(props, ctx) {
    let ossClient = null;
    const state = reactive({
      parameters: {
        key: ""
      },
      parentVal: props.value,
      qiniuUpLoadUrl: url.qiniuUrl,
      dialogVisible: false,
      option: {
        outputType: "",
        imgUrl: props.defaultUrl
      },
      fileList: [],
      loading: false
    });
    const dragOnEnd = info => {
      syncFileListToParentVal();
    };
    const syncFileListToParentVal = () => {
      let tempParentVal = [];
      (state.fileList || []).forEach(item => {
        // 将全路径转换为相对路径,数据新旧适配需要
        // 例如：https://fanyin-oss-test.oss-cn-beijing.aliyuncs.com/admin/school/jy5778e982b13465_1634111391.png  => school/jy5778e982b13465_1634111391.png
        tempParentVal.push(item.url.split("/admin/")[1]);
      });
      state.parentVal = tempParentVal;
    };
    const transFormValueToFileList = () => {
      let tempStr;
      if (props.value) {
        let _tempArray = [];
        // debugger;
        if (Array.isArray(props.value)) {
          props.value.forEach(item => {
            if (item) {
              tempStr = item.split("/");
              // 当这个值有上传组件上传后同步给 父级  父级同步给 子级 的时候会出现  没有拼接好 url 的时候
              if (!item.includes("://")) {
                item = url.OSSUrl + "/admin/" + item;
              }
              _tempArray.push({
                name: tempStr[tempStr.length - 1],
                url: item
              });
            }
          });
          state.fileList = _tempArray;
          syncFileListToParentVal();
        } else {
          let _tempItem = props.value;
          tempStr = _tempItem.split("/");
          if (!_tempItem.includes("://")) {
            _tempItem = url.OSSUrl + "/admin/" + _tempItem;
          }
          state.fileList = [
            { name: tempStr[tempStr.length - 1], url: _tempItem }
          ];
          syncFileListToParentVal();
        }
        //
      } else {
        state.fileList = [];
      }
    };
    // 删除 图片上传的图片
    const delUploadImg = (event, index) => {
      event.stopPropagation();
      state.fileList.splice(index, 1);
      syncFileListToParentVal();
    };
    const handleAvatarSuccess = (res, file) => {
      if (props.limit > 1) {
        state.fileList = [
          ...state.fileList,
          {
            name: res.name,
            key: res.name,
            url: file
          }
        ];
        syncFileListToParentVal();
      } else {
        state.fileList = [
          {
            name: res.name,
            key: res.name,
            url: file
          }
        ];
        state.parentVal = file.split("/admin/")[1];
      }
      // this.fileList = fileList
      state.dialogVisible = true;
    };
    const beforeAvatarUpload = file => {
      if (file.type === "image/png") {
        state.option.outputType = "png";
      } else if (file.type === "image/jpeg") {
        state.option.outputType = "jpg";
      } else if (file.type === "image/gif") {
        state.option.outputType = "gif";
      }

      // 生成文件名称
      let guid = new GUID();
      state.parameters.key = `${guid.newGUID()}.${state.option.outputType}`;
      const isLt = file.size / 1024 > props.size;

      if (props.isGif) {
        if (state.option.outputType !== "gif") {
          ElMessage.error("上传图片只能是 gif 格式!");
          return false;
        }
      } else if (file.type) {
        const _tempType = (file.type + "").split("/");
        if (!props.ImgType.includes(_tempType[1])) {
          ElMessage.error(`上传图片只能是 ${props.ImgType.join(",")} 格式!`);
          return false;
        }
      } else {
        ElMessage.error(`上传图片只能是 ${props.ImgType.join(",")} 格式!`);
        return false;
      }

      if (isLt) {
        ElMessage.error(`上传图片大小不能超过${props.size}KB!`);
        return false;
      }

      if (props.width || props.height || props.ratio) {
        return new Promise((resolve, reject) => {
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.src = _URL.createObjectURL(file);
          img.onload = () => {
            if (props.width) {
              if (img.width > props.width) {
                ElMessage.warning({
                  message: `上传文件宽最大为${props.width}`
                });
                reject();
              }
            }
            if (props.height) {
              if (img.height > props.height) {
                ElMessage.warning({
                  message: `上传文件高最大为${props.height}`
                });
                reject();
              }
            }
            if (props.ratio) {
              let wh = parseInt((img.width / img.height) * 100) / 100;
              let ratArr = props.ratio.split("\/");
              let rat = parseInt((ratArr[0] / ratArr[1]) * 100) / 100;
              if (wh != rat) {
                ElMessage.warning({
                  message: `图片宽/高 尺寸比例要求为${rat},建议尺寸${props.ratio}`
                });
                reject();
              }
            }
            resolve();
          };
        });
      } else {
        return true;
      }
    };
    const fnUploadRequest = file => {
      let guid = new GUID();
      let files = file.file,
        point = files.name.lastIndexOf("."),
        suffix = files.name.substr(point),
        fileName = files.name.substr(0, point),
        date = parseInt(+new Date() / 1000),
        tempGuid = guid.newGUID().substring(0, 16),
        fileNames = `/admin/school/${tempGuid}_${date}${suffix}`;

      //fileNames上传文件的名称
      //file.file上传文件的内容

      ossClient
        .multipartUpload(fileNames, file.file, {
          progress: function(p, checkpoint) {
            // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
          },
          meta: {
            guid: tempGuid,
            "Content-Type": `image/${suffix.split(".")[1]}`
          },
          "Content-Type": `image/${suffix.split(".")[1]}`,
          mime: `image/${suffix.split(".")[1]}`
        })
        .then(result => {
          handleAvatarSuccess(result, url.OSSUrl + result.name);
          ElMessage.success({
            message: `上传成功`
          });
        })
        .catch(err => {
          ElMessage.error("上传失败");
        });
    };

    onMounted(() => {
      let client = new OSS({
        accessKeyId: store.getters.upLoadToken.accessKeyId,
        accessKeySecret: store.getters.upLoadToken.accessKeySecret,
        stsToken: store.getters.upLoadToken.securityToken,
        bucket: url.OSSBucket,
        region: url.OSSRegion,
        endpoint: url.OSSUrl,
        cname: url.OSSUrl
      });

      ossClient = client;

      transFormValueToFileList();
    });
    watch(
      () => props.value,
      (newValue, oldVal) => {
        oldVal = oldVal ? oldVal : [];
        if (newValue != oldVal && newValue.toString() != oldVal.toString()) {
          state.parentVal = props.value;
          transFormValueToFileList();
        }
      }
    );
    watch(
      () => state.parentVal,
      (newVal, oldVal) => {
        oldVal = oldVal ? oldVal : [];
        if (newVal != oldVal && newVal.toString() != oldVal.toString()) {
          // debugger;
          ctx.emit("update:value", state.parentVal);
          ctx.emit("fileChange", state.parentVal);
        }
      }
    );
    return {
      ...toRefs(state),
      ...toRefs(props),
      syncFileListToParentVal,
      transFormValueToFileList,
      handleAvatarSuccess,
      beforeAvatarUpload,
      fnUploadRequest,
      delUploadImg
    };
  }
});
</script>
<style lang="scss" scope>
// 覆盖样式
.upload_btn .el-icon-plus {
  text-align: center;
}
.lt_uploader {
  position: relative;
  display: flex;
  padding-bottom: 20px;
  min-height: 148px;
  .tips {
    position: absolute;
    bottom: 0%;
    left: 0;
    line-height: 20px;
    font-size: 12px;
    color: #aaa;
    min-width: 400px;
  }
}
.el-upload--picture-card {
  width: auto;
  border: none;
  height: auto;
  text-align: left;
  .el-icon-plus {
    width: 148px;
    height: 148px;
    line-height: 148px;
    border: 1px dashed #c0ccda;
  }
}
.upload_btn {
  display: inline-block;
  vertical-align: top;
  margin: 0 10px 10px 0 !important;
  // margin-top: 10px;
  // margin-left: 10px;
  .el-icon-plus {
    vertical-align: middle;
  }
}
.upload_comp {
  display: inline;
  vertical-align: top;
  min-height: 148px;
  .upload_comp_draggable {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .upload_img_item {
    //display: inline-block;
    position: relative;
    display: flex;
    min-width: 148px;
    // min-height: 148px;
    justify-content: center;
    align-items: center;
    padding: 4px;

    width: 148px;
    height: 148px;
    margin: 0 10px 10px 0 !important;
    border: 1px solid #eee;
    vertical-align: top;
    overflow: hidden;
    .img_item {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      transform: translate(0, -50%);
    }
    .img_item_action {
      position: absolute;
      top: 0;
      left: 0;
      width: 148px;
      height: 148px;
      line-height: 148px;
      opacity: 0.01;
      font-size: 20px;
      text-align: center;
      &:hover {
        cursor: default;
        color: #fff;
        opacity: 0.7;
        background-color: rgba(0, 0, 0, 0.7);
        transition: opacity 0.3s;
      }
      .el-icon-delete {
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
.img_uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
.img_uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.avatar {
  height: 100%;
  width: 100%;
}
.cropper-content .cropper {
  width: auto;
  height: 300px;
}
.tips {
  line-height: 20px;
  font-size: 12px;
  color: #aaa;
}
</style>
