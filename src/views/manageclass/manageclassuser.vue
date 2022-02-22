<!--
 * @Author: aa
 * @Date: 2021-08-27 13:33:29
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-10-25 16:11:19
 * @Descripttion:
-->
<template>
  <div>
    <formList
      :config="config"
      :itemList="queryList"
      :formInitData="formInitData"
      @buttonClick="buttonCallBack"
    />
    <div class="card">
      <el-card
        class="box-card"
        v-for="val in dataList"
        :key="val.id"
        @click="shiftDetails(val)"
      >
        <div class="cardText">
          <div
            class="image"
            :style="{
              'background-color':
                colorlists[Math.floor(Math.random() * colorlists.length)]
            }"
          >
            {{ intercept(val.name) }}
          </div>
          <div class="cardTeam">
            <div class="first">{{ val.name }}</div>
            <div>{{ val.semesterName }}</div>
          </div>
        </div>
        <div>学员：{{ val.count }}人</div>
      </el-card>
    </div>
    <div style="text-align: right;">
      <el-pagination
        :page-size="size"
        :current-page="page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="sizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import { toRefs, ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { classManagementList } from "@/api/classManagement";
import store from "@/store";

export default {
  components: {
    formList
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      formInitData: {},
      dataList: [],
      colorlists: [
        "hsl(42, 48%, 54%)",
        "hsl(138, 24%, 48%)",
        "rgb(200, 138, 131)",
        "rgb(20, 138, 131)",
        "rgb(84, 221, 226)",
        "rgb(84, 221, 296)",
        "rgb(178, 199, 168)",
        "rgb(16, 195, 195)",
        "hsl(0, 21%, 68%)",
        "rgb(226, 166, 198)",
        "hsl(278, 17%, 66%)",
        "rgb(153, 199, 235)",
        "rgb(153, 159, 235)",
        "blueviolet"
      ],
      sizes: [5, 10, 20, 30, 50],
      size: 0,
      total: 0,
      page: 0,
      nameSearch: ""
    });

    const queryList = [
      {
        code: "name",
        label: "搜索",
        placeholder: "搜索班级"
      }
    ];

    const config = {
      allRequired: false, // 是否全部必填
      inline: true, //行内
      colon: "",
      inputStyle: {
        width: "200px"
      },
      buttons: [
        {
          funType: "confirm",
          type: "primary",
          name: "查 询",
          size: "small"
        }
      ]
    };

    const buttonCallBack = val => {
      state.nameSearch = val.value.name;
      classManagementList({
        name: val.value.name,
        status: 1,
        schoolId: store.getters.activeSchoolId
      }).then(res => {
        state.dataList = res.data.records;
        state.total = res.data.total;
        state.size = res.data.size;
        state.page = res.data.current;
      });
    };

    const shiftDetails = val => {
      console.log(val, "学员");
      router.push({
        path: "/manageclass/shiftDetails",
        query: {
          id: val.id,
          semesterId: val.semesterId
        }
      });
    };

    onMounted(() => {
      classManagementList({
        status: 1,
        schoolId: store.getters.activeSchoolId
      }).then(res => {
        state.dataList = res.data.records;
        state.total = res.data.total;
        state.size = res.data.size;
        state.page = res.data.current;
      });
    });

    const intercept = computed(() => {
      return function(val) {
        val = val.substring(0, 1);
        return val;
      };
    });
    // 分页
    const handleSizeChange = val => {
      classManagementList({
        current: state.page,
        size: val,
        status: 1,
        schoolId: store.getters.activeSchoolId
      }).then(res => {
        state.dataList = res.data.records;
        state.total = res.data.total;
        state.size = res.data.size;
        state.page = res.data.current;
      });
    };
    // 分页
    const handleCurrentChange = val => {
      classManagementList({
        current: val,
        size: state.size,
        status: 1,
        schoolId: store.getters.activeSchoolId
      }).then(res => {
        state.dataList = res.data.records;
        state.total = res.data.total;
        state.size = res.data.size;
        state.page = res.data.current;
      });
    };

    return {
      ...toRefs(state),
      queryList,
      config,
      buttonCallBack,
      shiftDetails,
      intercept,
      handleSizeChange,
      handleCurrentChange
    };
  }
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;

  .cardText {
    margin-bottom: 20px;
    display: flex;
    .cardTeam {
      width: 180px;
      margin-left: 20px;
      text-align: center;
      div {
        height: 40px;
      }
    }
  }

  .image {
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    font-size: 20px;
    color: #fff;
    border-radius: 50px;
  }

  .box-card {
    width: 312px;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }
}
</style>
