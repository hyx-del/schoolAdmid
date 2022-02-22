<!--
 * @Author: wei.chen
 * @Date: 2020-06-19 11:37:13
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-22 14:00:30
 * @Descripttion:  图片剪切
-->

<template>
  <div>
    <div class="lt_upload_img_list">
      <div class="lt_cropper_input">
        <div
          class="upload_img_content"
          v-for="(imgItem, index) in fileList"
          :key="imgItem.name"
        >
          <img class="lt_img_item" alt="上传图片" :src="imgItem.url" />
          <span class="img_item_action" v-if="!disabled">
            <i class="el-icon-delete" @click="delUploadImg(index)"></i>
          </span>
        </div>
        <input
          v-if="limit == fileList.length && !disabled"
          title=""
          ref="inputerRef"
          type="file"
          name="file"
          accept="jpg"
          @change="handleImgChange"
          class="lt_cropper_input_file"
        />
      </div>

      <div
        v-if="limit != fileList.length"
        class="lt_cropper_input lt_cropper_upload_item el-upload--picture-card"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
        <input
          ref="inputerRef"
          v-if="!disabled"
          title=""
          type="file"
          name="file"
          accept="jpg"
          @change="handleImgChange"
          class="lt_cropper_input_file"
        />
      </div>
      <div class="tips">
        {{
          tips ||
            `${
              fileList.length
            }/${limit},请上传不超过${size}KB的JPEG、JPG、PNG格式的图片${
              ratio != "" ? `,上传比例${ratioNumber},建议尺寸${ratio}` : ""
            }`
        }}
      </div>
    </div>
    <el-dialog
      title="图片剪切"
      v-model="cropperImgVisible"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
    >
      <div class="cropper-content" v-if="cropperImgVisible">
        <div class="cropper" style="text-align:center">
          <VueCropper
            ref="vueCropperRef"
            :img="option.cropperImgObj"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="option.info"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
            :maxImgSize="option.maxImgSize"
          ></VueCropper>
        </div>
        <!-- {{ option }} -->
      </div>
      <template #footer class="dialog-footer">
        <el-button
          size="small"
          class="dialog-footer-but"
          @click="cancelCropper"
        >
          取 消
        </el-button>
        <el-button
          size="small"
          type="primary"
          class="dialog-footer-but"
          @click="cropperImgMark"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  defineComponent,
  computed,
  reactive,
  ref,
  toRefs,
  onMounted,
  onCreated,
  watch
} from "vue";
const OSS = require("ali-oss");
// import axios from 'axios';
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import { url } from "@/config/index";
import { GUID } from "@/utils/guid.js";
import store from "@/store";
import { ElMessage } from "element-plus";

export default {
  components: {
    VueCropper
  },
  name: "FYCropperImg",
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
    width: {
      type: Number,
      default: 800
    },
    limit: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    ratio: {
      type: String,
      default: "500/500"
    },
    size: {
      type: Number, //	size: props.size, // 图片默认大小限制  400kb
      default: 500
    },
    maxImgSize: {
      type: Number,
      default: 1000
    },
    ImgType: {
      //限制图片格式
      type: Array,
      default() {
        return ["png", "jpg", "jpeg"];
      }
    },
    tips: {
      type: String,
      default: ""
    }
  },
  setup(props, ctx) {
    let ossClient = null;
    const vueCropperRef = ref(null);
    const inputerRef = ref(null);
    const ratioNumber = ref(
      computed(() => {
        let ratio = props.ratio;
        ratio = ratio.replace(/(\*|\\|\-|\*)/gi, "/");
        let ratioArr = ratio.split("/");
        return (
          parseInt(Number(Number(ratioArr[1] / ratioArr[0])) * 100) / 100 || 1
        );
      })
    );
    const state = reactive({
      cropperImgVisible: false, // 剪切图片模态窗
      parentVal: props.value, // 同步父节点传递进来的 默认数据
      fileList: [], // 存储图片数据列表
      parameters: {
        token: store.getters.upLoadToken, //  图片上传到七牛的token
        key: "" // 图片上传的时候 图片名称
      },
      // 裁剪组件的基础配置option
      option: {
        limit: props.limit, // 限制图片上传的数量
        size: 1,
        outputType: "jpeg", // 裁剪生成图片的格式
        imgUrl: props.defaultUrl,
        cropperImgObj: null, // 图片剪切后的本地图片对象
        info: true,
        full: true, // 是否输出原图比例的截图
        fixed: true, // 是否开启截图框宽高固定比例
        canScale: true, // 是否默认生成截图框
        canMove: true, // 上传图片是否可以移动
        fixedBox: false, // 不允许修改比例
        original: false, // 上传图片按照原始比例渲染
        canMoveBox: true, // 上传图片是否可以移动
        autoCrop: true, // 是否默认生成截图框
        mode: "cover", //图片默认渲染方式
        autoCropWidth: props.width, // 只有自动截图开启 宽度高度才生效
        autoCropHeight: props.width * ratioNumber.value,
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        fixedNumber: [1, ratioNumber.value] // 截图框的宽高比例
      },

      // 防止重复提交
      loading: false
    });
    //  watch=================
    watch(
      () => state.ratioNumber,
      (newValue, oldVal) => {
        // console.log("newValue", newValue);
        if (newValue != oldVal && newValue.toString() != oldVal.toString()) {
          // debugger;
          state.option.fixedNumber = [1, newValue.value];
          state.option.autoCropHeight = props.width * newValue.value;
          ctx.forceUpdate();
        }
      }
    );
    watch(
      () => props.value,
      (newValue, oldVal) => {
        if (newValue != oldVal && newValue.toString() != oldVal.toString()) {
          // debugger;
          state.parentVal = props.value;
          transFormValueToFileList();
        }
      }
    );
    watch(
      () => state.parentVal,
      (newValue, oldVal) => {
         oldVal = oldVal ? oldVal : [];
        if (newValue != oldVal && newValue.length != oldVal.length) {
          // debugger;
          try {
            ctx.emit("input", state.parentVal);
            ctx.emit("update:value", state.parentVal);
            ctx.emit("fileChange", state.parentVal);
          } catch (error) {}
        }
      }
    );
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
            {
              name: tempStr[tempStr.length - 1],
              url: _tempItem
            }
          ];
          syncFileListToParentVal();
        }
        //
      } else {
        state.fileList = [];
      }
    };

    // 图片上传的函数

    // 同步  fileList 到  parentVal 返回给父组件里面
    const syncFileListToParentVal = () => {
      let tempParentVal = [];
      (state.fileList || []).forEach(item => {
        tempParentVal.push(item.url.split("/admin/")[1]);
      });

      state.parentVal = tempParentVal;
    };

    // 用户选择图片的回调函数 ,上传成功也会触发 change 事件
    const handleImgChange = e => {
      // debugger
      // debugger;
      let reader = new FileReader();
      let inputDOM = inputerRef.value;

      reader.onload = e => {
        // 把Array Buffer转化为blob 如果是base64不需要
        if (typeof e.target.result === "object") {
          // state.option.cropperImgObj='http://img1.vued.vanthink.cn/vued751d13a9cb5376b89cb6719e86f591f3.png';
          state.option.cropperImgObj = window.URL.createObjectURL(
            new Blob([e.target.result])
          );
        } else {
          state.option.cropperImgObj = e.target.result;
        }

        state.cropperImgVisible = true;
        inputDOM.value = "";
      };

      // 转化为blob
      reader.readAsArrayBuffer(inputDOM.files[0]);
    };

    // realTime(data) {
    // 	this.previews=data;
    // },

    // 上传前做 大小检查  同时生成唯一的图片名称
    const beforeAvatarUpload = file => {
      // 检查图片格式

      // if (file.type) {
      //   const _tempType = (file.type + "").split("/");
      //   if (!props.ImgType.includes(_tempType[1])) {
      //     ElMessage.error(`上传图片只能是 ${props.ImgType.join(",")} 格式!`);
      //     return false;
      //   }
      // } else {
      //   ElMessage.error(`上传图片只能是 ${props.ImgType.join(",")} 格式!`);
      //   return false;
      // }
      let guid = new GUID();

      state.parameters.key = `${guid.newGUID()}.jpg`;

      const isLt = file.size / 1024 < props.size;

      vueCropperRef.value.getCropBlob(blob => {
        // 调用图片上传
        let that = this;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function(e) {
          state.option.imgUrl = e.target.result;
          // that.fileList = [{ name: that.parameters.key, url: e.target.result }]
          state.cropperImgVisible = false;
          let guid = new GUID();
          state.parameters.key = `${guid.newGUID()}.jpg`;
          let tempFile = new window.File([blob], state.parameters.key, {
            type: "jpg"
          });
          // todo
          // upLoadImgToAliOSS(tempFile);
          // that.$refs.imgUpload.submit()
        };
      });
    };

    // 取消剪切图片
    const cancelCropper = () => {
      state.option.cropperImgObj = null;
      state.cropperImgVisible = false;
    };

    // 删除 图片上传的图片
    const delUploadImg = index => {
      // console.log(index)
      state.fileList.splice(index, 1);
      state.syncFileListToParentVal();
    };

    // 确定剪切图片
    const cropperImgMark = () => {
      // 获取图片剪切的内容

      vueCropperRef.value.getCropBlob(blob => {
        // 调用图片上传
        let that = this;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function(e) {
          state.option.imgUrl = e.target.result;
          // that.fileList = [{ name: that.parameters.key, url: e.target.result }]
          state.cropperImgVisible = false;
          let guid = new GUID();
          state.parameters.key = `${guid.newGUID()}.jpg`;
          let tempFile = new window.File([blob], state.parameters.key, {
            type: "jpg"
          });
          upLoadImgToAliOSS(state.parameters.key, tempFile);
          // that.$refs.imgUpload.submit()
        };
      });
    };

    const handleAvatarSuccess = (res, file) => {
      // debugger;
      if (props.limit > 1) {
        state.fileList = [
          ...state.fileList,
          {
            name: res.name,
            key: res.name,
            url: file
          }
        ];
        // console.log(state.fileList);
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
        // debugger;
      }
      // state.fileList = fileList
      state.dialogVisible = true;
    };
    const upLoadImgToAliOSS = (fileName, file) => {
      // debugger;
      fileName = "/admin/school/" + fileName;

      // debugger;
      ossClient
        .multipartUpload(fileName, file, {
          progress: function(p, checkpoint) {
            // console.log(p, checkpoint);
            // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
          },
          meta: {
            guid: fileName,
            "Content-Type": `image/${fileName.split(".")[1]}`
          },
          "Content-Type": `image/${fileName.split(".")[1]}`,
          mime: `image/${fileName.split(".")[1]}`
        })
        .then(result => {
          console.log(url.OSSUrl);
          handleAvatarSuccess(result, url.OSSUrl + result.name);

          ElMessage.success({
            message: `上传成功`
          });
        })
        .catch(err => {
          console.log(err);
          ElMessage.error("上传失败");
        });
    };

    return {
      ...toRefs(props),
      ...toRefs(state),
      ratioNumber,
      vueCropperRef,
      inputerRef,
      cropperImgMark,
      delUploadImg,
      cancelCropper,
      handleImgChange
    };
  }
};
</script>
<style lang="scss" scoped>
.tips {
  position: absolute;
  bottom: 0%;
  left: 0;
  line-height: 20px;
  font-size: 12px;
  color: #aaa;
  min-width: 400px;
}
.img_uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.lt_upload_img_list {
  padding-bottom: 20px;
  .lt_img_item {
    width: 148px;
    // height: 148px;
    margin-right: 20px;
  }
}

.lt_cropper_input {
  position: relative;
  display: inline-block;
  text-align: left;
  .avatar-uploader-icon:hover {
    cursor: pointer;
  }
  .upload_img_content {
    display: inline-block;
    position: relative;
    border: 1px solid #eee;
    width: 148px;
    height: 148px;
    .img_item_action {
      position: absolute;
      top: 0;
      left: 0;
      width: 148px;
      // height: 148px;
      // line-height: 148px;
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
  .lt_cropper_input_file {
    position: absolute;
    left: 0;
    top: 0;
    width: 148px;
    height: 148px;
    opacity: 0.01;
    // visibility: hidden;
    display: inline-block;
    &:hover {
      cursor: pointer;
    }
  }
}
.lt_cropper_upload_item {
  text-align: center;
}
.img_uploader .el-upload:hover {
  border-color: #409eff;
}
.img_uploader-icon {
  font-size: 28px;
  color: #8c939d;
  // width: 178px;
  // height: 178px;
  // line-height: 178px;
  text-align: center;
}
.avatar {
  // width: 178px;
  // height: 178px;
  display: block;
}
.cropper-content .cropper {
  width: auto;
  height: 500px;
}
.dialog-footer {
  margin-top: 20px;
  display: flex;
  flex-flow: row-reverse;
  .dialog-footer-but {
    margin-left: 10px;
  }
}
</style>
