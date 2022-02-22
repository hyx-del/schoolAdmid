<!--
 * @Author: 刘帝君
 * @Date: 2021-09-24 10:44:23
 * @LastEditors: zx
 * @LastEditTime: 2021-12-07 22:35:08
 * @Descripttion:
-->
<template>
  <emptyBox bottom="70">
    <div class="title">
      <formList
        :config="config"
        :itemList="itemList"
        :formInitData="formInitData"
        @buttonClick="button"
        @formChange="formChange"
        :hideList="hideList"
        :showList="showList"
      >
        <template v-slot:afterSlot2>
          <span> 天</span>
        </template>
        <template v-slot:slot1>
          <div
            class="categoryCourses"
            v-for="(val, index) in categoryCourses"
            :key="val.id"
          >
            <el-checkbox
              v-model="val.ids"
              :label="val.name"
              style="width:140px"
            ></el-checkbox>
            <el-input
              v-model="val.weight"
              style="width:200px;margin-left:20px"
              @change="changeData(val.weight, index)"
            />%
          </div>
        </template>
      </formList>
    </div>
  </emptyBox>
</template>

<script>
import emptyBox from "@/components/emptyBox/index.vue";
import { reactive, toRefs, computed, onMounted } from "vue";
import formList from "@/components/FormList/index.vue";
import { useRouter, useRoute } from "vue-router";
import { addFormBottom } from "@/utils/config";
import { semesterFactionListAPI } from "@/api/baseSet";
import { accSubtr } from "./components";
import { payOnlineList, registerModeList } from "@/utils/enum/select";
import {
  comprehensiveCurriculumAdd,
  comprehensiveCurriculumInfo,
  comprehensiveCurriculumEdit
} from "@/api/coursesManagement";
import { ElMessage } from "element-plus";

export default {
  components: {
    formList,
    emptyBox
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      itemList: [
        {
          code: "name",
          label: "套餐名称"
        },
        {
          code: "price",
          label: "套餐价格",
          lessCode: 0.01
        },
        {
          el: "select",
          code: "type",
          label: "类别",
          list: [
            {
              value: "1",
              label: "哈他综合班"
            },
            {
              value: "2",
              label: "高温瑜伽综合班"
            },
            {
              value: "3",
              label: "塑性综合班"
            }
          ]
        },
        {
          el: "img",
          code: "coverUrl",
          label: "封面图",
          size: 1024,
          limit: 1,
          ratio: "750/375"
        },
        {
          el: "img",
          code: "posterShareUrl",
          label: "海报分享图",
          size: 1024,
          limit: 1,
          ratio: "200/200"
        },
        {
          el: "img",
          code: "wxShareUrl",
          label: "微信分享图",
          size: 1024,
          limit: 1,
          ratio: "500/400"
        },
        {
          el: "slot",
          code: "categoryCourses",
          label: "套餐课程/权重",
          slotName: "slot1"
        },
        {
          code: "phone",
          type: "landline",
          label: "联系电话",
          maxlength: 12
        },
        {
          code: "trainValidDay",
          maxlength: 60,
          label: "培训有效期",
          afterSlot: "afterSlot2",
          lessCode: 0
        },
        {
          code: "trainFee",
          maxlength: 60,
          disabled: true,
          label: "培训费",
          placeholder: " "
        },
        {
          el: "radio",
          code: "registerMode",
          required: false,
          label: "报名方式",
          list: registerModeList,
          defalt: "10"
        },
        {
          code: "earnest",
          maxlength: 60,
          label: "定金",
          required: false,
          type: "numberPoint2"
        },
        {
          el: "radio",
          code: "payOnline",
          required: false,
          label: "尾款收取方式",
          defalt: "2",
          list: payOnlineList
        },
        {
          code: "sort",
          maxlength: 60,
          label: "顺序",
          required: false,
          lessCode: 0
        },
        {
          el: "editer",
          label: "学期介绍",
          code: "intro"
        }
      ],
      config: { ...addFormBottom, watchList: ["staffType"] },
      id: useRoute().query.id,
      categoryCourses: [],
      formInitData: {},
      copyDatas: {
        price: "",
        trainFee: "",
        earnest: ""
      },
      hideList: [],
      showList: [],
      // 验证权重
      changeData: (val, index) => {
        const str = ["0.00", "0.000", "0", "0.0"];
        if (val * 1 || str.includes(val)) {
          const str = /^[0-9]+(\.[0-9]{1,3})?$/;
          if (!str.test(val)) {
            ElMessage.error("最多输入三位小数！");
            const num = val.split(".");
            num[1] = num[1].slice(0, 3);
            state.categoryCourses[index].weight = num[0] + "." + num[1];
          }
        } else {
          ElMessage.error("权重格式不正确！");
          state.categoryCourses[index].weight = "";
        }
      }
    });

    // 套餐课程
    onMounted(async () => {
      await semesterFactionListAPI({
        enable: 1,
        size: 1000,
        mainCourseEnable: 1
      }).then(res => {
        console.log(res.data, "课程派别");
        let categoryArr = [];
        res.data.records.forEach(val => {
          categoryArr.push({
            ids: false,
            categoryId: val.id,
            name: val.name,
            weight: ""
          });
        });
        state.categoryCourses = categoryArr;
      });
      // 回显
      if (state.id) {
        await comprehensiveCurriculumInfo({ id: state.id }).then(
          ({ code, data }) => {
            if (code == 200) {
              console.log(data, "全面课程详情");
              //根据报名方式隐藏定金
              if (data.registerMode == 10) {
                state.showList = ["earnest", "payOnline"];
              } else if (data.registerMode == 20) {
                state.hideList = ["earnest", "payOnline"];
              }
              data.categoryCourses.forEach(vals => {
                state.categoryCourses.forEach(val => {
                  if (vals.categoryId == val.categoryId) {
                    val.ids = true;
                    val.weight = vals.weight;
                  }
                });
              });
              state.formInitData = data;
              state.copyDatas = data;
            }
          }
        );
      }
    });

    const button = val => {
      switch (val.text) {
        case "确认":
          const dataArr = [];
          state.categoryCourses.forEach(data => {
            if (data.ids == true) {
              dataArr.push(data);
              if (!data.weight) {
                val.value.num = 1;
              }
            }
          });
          if (val.value.num == 1) {
            ElMessage.warning("请输入课程派别权重！");
          } else {
            console.log(val.value, "dataArr");
            val.value.price = val.value.price * 1;
            val.value.categoryCourses = dataArr;
            val.value.earnest =
              val.value.registerMode == "20" ? 0 : val.value.earnest;
            //尾款支付方式
            if (val.value.registerMode == "20") {
              val.value.payOnline = "1";
            }
            if (state.id) {
              val.value.id = state.id;
              comprehensiveCurriculumEdit(val.value).then(res => {
                const { code } = res;
                if (code == 200) {
                  ElMessage.success("操作成功");
                  router.push({ path: "/overall/comprehensiveCurriculum" });
                }
              });
            } else {
              comprehensiveCurriculumAdd(val.value).then(res => {
                const { code } = res;
                if (code == 200) {
                  ElMessage.success("操作成功");
                  router.push({ path: "/overall/comprehensiveCurriculum" });
                }
              });
            }
          }
          break;
        case "取消":
          router.back();
          break;
        default:
          break;
      }
    };
    // 计算培训费
    const formChange = val => {
      console.log(val, "123");
      state.copyDatas[val.code] = val.value;
      // //套餐价格
      if (val.code == "price") {
        if (state.copyDatas.earnest == "") {
          state.copyDatas.trainFee = state.copyDatas.price;
        } else {
          state.copyDatas.trainFee = accSubtr(
            state.copyDatas.price,
            state.copyDatas.earnest
          );
          // state.copyDatas.price - state.copyDatas.earnest;
        }
        state.formInitData = JSON.parse(JSON.stringify(state.copyDatas));
      } else if (val.code == "earnest") {
        //定金
        if (state.copyDatas.price !== "") {
          state.copyDatas.trainFee = accSubtr(
            state.copyDatas.price,
            state.copyDatas.earnest
          );
          // state.copyDatas.price - state.copyDatas.earnest;
          state.formInitData = JSON.parse(JSON.stringify(state.copyDatas));
        }
      } else if (val.code == "registerMode") {
        // 点击报名方式
        if (val.allSelectCode.value == "10") {
          state.showList = ["earnest", "payOnline"];
        } else if (val.allSelectCode.value == "20") {
          state.copyDatas.trainFee = state.copyDatas.price;
          state.formInitData = JSON.parse(JSON.stringify(state.copyDatas));
          state.hideList = ["earnest", "payOnline"];
        }
      }
    };

    return {
      ...toRefs(state),
      button,
      formChange
    };
  }
};
</script>

<style lang="scss" scoped>
.categoryCourses {
  display: flex;
}
</style>
