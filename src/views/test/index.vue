<!--
 * @Author: aa
 * @Date: 2021-08-20 13:24:29
 * @LastEditors: zx
 * @LastEditTime: 2021-09-02 17:03:49
 * @Descripttion:
-->
<template>
  <div>
    <el-autocomplete
      v-model="state1"
      :fetch-suggestions="querySearch"
      @change="change"
      @select="handleSelect"
    />
    <formList
      :itemList="itemList"
      :formInitData="formInitData"
      :config="config"
      @buttonClick="button"
      @formChange="formChange"
    >
      <template v-slot:afterSlot2>
        <span>afterSlot2</span>
      </template>
      <template v-slot:slot1>
        <span @click="testClick">dfgsfdsgsd</span>
      </template>
      <template v-slot:slot2>
        <span @click="testClick">2416515641563</span>
      </template>
    </formList>
    <!--    <detailShow :itemList="itemList" :formInitData="formInitData"></detailShow>-->
  </div>
</template>

<script>
import formList from "@/components/FormList/index2.vue";
import detailShow from "@/components/FormList/detailShow.vue";
import { toRefs, ref, reactive } from "vue";
import { getSalesRoomTree } from "../../api/admin";
import { roleList } from "@/api/role";
import { coachList } from "@/api/coach";

export default {
  components: {
    detailShow,
    formList
  },
  setup(props) {
    const itemList = [
      {
        label: "双方各 das sda 好",
        code: "input",
        lessCode: 12,
        autocomplete: "on",
        afterSlot: "afterSlot2",
        inputStyle: {
          width: "100px"
        }
      },
      // {
      //   // el: "slot",
      //   slotName: "slot1",
      //   label: "slot",
      //   code: "input",
      //   // lessCode: 12,
      //   // showPassword: true,
      //   icon: "icon-jiajianzujianjiahao",
      //   append: {
      //     text: "经纬度 &#xe726;",
      //     style: {
      //       color: "red"
      //     },
      //     class: "iconfont"
      //   },
      //   appendClick: val => window.open("https://lbs.qq.com/getPoint/")
      // },
      // {
      //   el: "textArea",
      //   label: "123 大公司",
      //   code: "input2",
      //   maxlength: 300,
      //   prepend: "查找经纬度",
      //   prependClicK: val => window.open("https://lbs.qq.com/getPoint/")
      // },
      {
        el: "date",
        code: "startTime",
        label: "开始时间",
        endCode: "endTime",
        timeError: "开始时间要小于结束时间",
        required: false
      },
      {
        el: "date",
        code: "endTime",
        label: "结束时间",
        required: false,
        timeError: "开始时间要小于结束时间",
        starCode: "startTime"
      },
      // {
      //   el: "searchTags",
      //   label: "下拉",
      //   otherBack: "select_label",
      //   code: "input3",
      //   searchCode: "name",
      //   labelCode: "name", // 指定的label名
      //   valueCode: "id", // 指定的value名
      //   fun: roleList
      // },
      {
        el: "select",
        label: "下拉选择",
        code: "testcode",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id", // 指定的value名
        fun: coachList, //使用的表格返回函数
        filterable: true, // 可搜索
        multiple: true,
        remoteMethod: name => ({ name }), //输入后拿到输入值后执行搜索功能,remote和filterable都要true
        remote: true // 可接收
      },
      // {
      //   el: "cascaderTags",
      //   back: true,
      //   code: "saleRoomId",
      //   label: "所属门店",
      //   labelCode: "name",
      //   valueCode: "id",
      //   fun: getSalesRoomTree,
      //   funMode: 3,
      //   cascaderValue: "end",
      //   firstCode: "cityName"
      // },
      // {
      //   code: "tips",
      //   label: "tips"
      // },
      // {
      //   el: "img",
      //   code: "imgs",
      //   label: "tips",
      //   size: 1024,
      //   limit: 12
      // },
      // {
      //   el: "video",
      //   code: "video",
      //   label: "视频"
      // },
      // {
      //   el: "mp3",
      //   code: "mp3",
      //   label: "音乐"
      // },
      {
        el: "area",
        code: "area",
        label: "地区"
      },
      // {
      //   el: "area2",
      //   code: "area2",
      //   label: "省市"
      // },
      // {
      //   el: "editer",
      //   code: "editer",
      //   label: "editer"
      // },
      // {
      //   el: "editer",
      //   code: "editer2",
      //   label: "editer2"
      // },
      {
        el: "radio",
        code: "courseType",
        label: "课程类型",
        allSelectCode: "Allradiolabel",
        list: [
          {
            label: "普通",
            value: 1
          },
          {
            label: "特殊",
            value: 2
          },
          {
            label: "测试",
            value: 3
          },
          {
            label: "发的说说",
            value: 4
          },
          {
            label: "大萨达",
            value: 5
          },
          {
            label: "大额",
            value: 6
          },
          {
            label: "方式对的人",
            value: 7
          }
        ]
      },
      {
        el: "checkbox",
        code: "courseType2",
        label: "课程类型",
        allSelectCode: "allSelectCode",
        list: [
          {
            label: "普通",
            value: "1"
          },
          {
            label: "特殊",
            value: 2
          },
          {
            label: "测试",
            value: 3
          },
          {
            label: "算法",
            value: 4
          }
        ]
      }
      // {
      //   el: "slot",
      //   slotName: "slot2",
      //   label: "slot2"
      // }
    ];
    const button = val => {
      // console.log(val);
    };
    const testClick = val => {
      console.log(1234);
    };
    // 监听值的变化
    const formChange = val => {
      // console.log(val);
    };
    const state = reactive({
      state1: "",
      links: [
        { label: "vue", value: "vue" },
        { value: "element" },
        { value: "cooking", link: "https://github.com/ElemeFE/cooking" },
        { value: "mint-ui", link: "https://github.com/ElemeFE/mint-ui" },
        { value: "vuex", link: "https://github.com/vuejs/vuex" }
      ],
      querySearch: (queryString, cb) => {
        const results = queryString
          ? state.links.filter(v => v.value.indexOf(queryString) >= 0)
          : state.links;
        cb(results);
      },
      change: val => {
        console.log(val);
      },
      handleSelect: val => {
        console.log(val);
      },
      createFilter: queryString => {
        return restaurant => {
          console.log("restaurant", restaurant);
          return restaurant.indexOf(queryString) === 0;
        };
      },
      formInitData: {
        editer: "<p>213</p><p>213</p>",
        input: "19940707697",
        imgs:
          "http://oss.faceinner.com/img/jyd125de12913464_1629879855.jpg,http://oss.faceinner.com/img/jyd125de12913464_1629879855.jpg,http://oss.faceinner.com/img/jyd125de12913464_1629879855.jpg,http://oss.faceinner.com/img/jyd125de12913464_1629879855.jpg",
        mp3: "http://oss.faceinner.com/audio/jy553e5d63313464_1629877737.mp3",
        video: "http://oss.faceinner.com/video/jy6705c6c4613464_1629877724.mp4",
        area: "110000,110100,110101",
        courseType2: "1,2,3,4",
        courseType: 2
      },
      config: {
        buttons: []
      }
    });

    return {
      ...toRefs(state),
      itemList,
      testClick,
      formChange,
      button
    };
  }
};
</script>

<style lang="scss" scoped></style>
