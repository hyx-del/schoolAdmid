<!--
 * @Author: 刘帝君
 * @Date: 2021-10-15 16:29:04
 * @LastEditors: zx
 * @LastEditTime: 2021-12-07 21:52:32
 * @Descripttion: 
-->
<template>
  <div>
    <formShow
      ref="formShow"
      :formInitData="formInitData"
      :itemList="itemList"
      :hideList="hideList"
      :showList="showList"
    >
      <template v-slot:slot1>
        <div>
          <div
            class="categoryCourses"
            v-for="val in categoryCourses"
            :key="val.id"
          >
            {{ val.name }}（{{ val.weight }} %）
          </div>
        </div>
      </template>
    </formShow>
  </div>
</template>

<script>
import { toRefs, ref, reactive, onMounted } from "vue";
import formShow from "@/components/FormList/detailShow";
import { getCoachDetailAPI } from "@/api/coach";
import { useRoute } from "vue-router";
import { showGender } from "@/utils/enum/select";
import { comprehensiveCurriculumInfo } from "@/api/coursesManagement";
import { semesterFactionListAPI } from "@/api/baseSet";

export default {
  components: { formShow },
  setup() {
    const itemList = [
      {
        code: "name",
        label: "套餐名称"
      },
      {
        code: "price",
        label: "套餐价格"
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
        label: "封面图"
      },
      {
        el: "img",
        code: "posterShareUrl",
        label: "海报分享图"
      },
      {
        el: "img",
        code: "wxShareUrl",
        label: "微信分享图"
      },
      {
        el: "slot",
        code: "categoryCourses",
        label: "套餐课程/权重",
        slotName: "slot1"
      },
      {
        code: "phone",
        label: "联系电话"
      },
      {
        code: "trainValidDay",
        label: "培训有效期"
      },
      {
        code: "trainFee",
        label: "培训费"
      },
      {
        el: "radio",
        code: "registerMode",
        label: "报名方式",
        list: [
          {
            value: "10",
            label: "定金"
          },
          {
            value: "20",
            label: "全款"
          }
        ]
      },
      {
        code: "earnest",
        label: "定金"
      },
      {
        el: "radio",
        code: "payOnline",
        label: "尾款收取方式",
        list: [
          {
            value: "1",
            label: "线上支付"
          },
          {
            value: "2",
            label: "线下支付"
          }
        ]
      },
      {
        code: "sort",
        label: "顺序"
      },
      {
        el: "editer",
        label: "学期介绍",
        code: "intro"
      }
    ];
    const id = useRoute().query.id;
    const state = reactive({
      formInitData: {},
      categoryCourses: [],
      hideList: [],
      showList: []
    });

    onMounted(async () => {
      await semesterFactionListAPI({
        enable: 1,
        size: 1000,
        mainCourseEnable: 1
      }).then(res => {
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

      await comprehensiveCurriculumInfo({ id }).then(res => {
        const { code, data } = res;
        if (code == 200) {
          let arr = [];
          if (data.registerMode == 10) {
            state.showList = ["earnest"];
          } else if (data.registerMode == 20) {
            state.hideList = ["earnest"];
          }
          // 回显权重
          data.categoryCourses.forEach(vals => {
            state.categoryCourses.forEach(val => {
              if (vals.categoryId == val.categoryId) {
                val.ids = true;
                val.weight = vals.weight;
                arr.push(val);
              }
            });
          });
          state.categoryCourses = arr;
          state.formInitData = data;
          console.log(data, "这是详情数据");
        }
      });
    });

    return {
      itemList,
      id,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped>
.categoryCourses {
  margin-bottom: 10px;
}
</style>
