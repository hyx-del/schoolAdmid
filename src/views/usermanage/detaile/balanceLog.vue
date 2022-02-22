<!--
 * @Author: 郑晶
 * @Date: 2021-10-13 14:05:47
 * @LastEditors: zx
 * @LastEditTime: 2021-11-04 13:38:34
 * @Descripttion: 学员管理-学员详情-储值余额记录
-->
<template>
  <div>
    <formList
      :config="tabelFormConfigs"
      :itemList="itemListSales"
      :formInitData="formInitDatas"
      @buttonClick="button"
    >
    </formList>
    <Table
      ref="salesTable"
      :loadData="getList"
      :column="columnSales"
      :params="formInitDatas"
      :showSortIndex="{ show: true, lable: '序号' }"
    />
    <!-- 查看凭证 -->
    <el-dialog v-model="isShow" title="查看凭证" width="50%">
      <div class="image_preview">
        <el-image
          v-for="url in images"
          :key="url"
          :src="url"
          :preview-src-list="images"
        ></el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  computed,
  ref
} from "vue";
import { addFormConfig } from "../../../utils/config";
import { getBalanceLogList } from "@/api/school";
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    formList,
    Table
  },
  name: "basicInfo",
  setup() {
    const url = ref(
      "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
    );
    const srcList = ref([
      "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
      "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg"
    ]);
    const salesTable = ref(null);
    // 学员id
    const id = useRoute().query.id;
    const state = reactive({
      //选项卡默认
      activeName: "first",
      formInitDatas: {
        studentId: id
      },
      tabelFormConfigs: {
        allRequired: false, // 是否全部必填
        inline: true, //行内
        colon: "",
        inputStyle: {
          width: "230px"
        },
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "查 询",
            size: "small"
          }
        ]
      },
      columnSales: [
        // { prop: "id", label: "序号", width: 80 },
        { prop: "money", label: "变动金额", width: 120 },
        { prop: "typeName", label: "类型" },
        { prop: "operatorName", label: "操作人" },
        { prop: "giveUserInfo", label: "转入用户", width: 200 },
        { prop: "reason", label: "操作原因", width: 200 },
        { prop: "payTypeName", label: "支付方式" },
        { prop: "createdAt", label: "操作时间", width: 180 },
        {
          prop: "action",
          label: "操作",
          width: 120,
          actives: [
            {
              name: row => (row.attatchs ? "查看凭证" : ""),
              method: row => {
                state.isShow = true;
                state.images = row.attatchs ? row.attatchs.split(",") : [];
              }
            }
          ]
        }
      ],
      itemListSales: [
        {
          code: "reason",
          label: "",
          placeholder: "原因搜索"
        }
      ],
      isShow: false,
      // 凭证列表
      images: []
    });
    // 页面载入后
    onMounted(() => {});
    //表单确定按钮
    const button = val => {
      salesTable.value.update({ ...val.value });
    };
    const getList = computed(() => {
      return getBalanceLogList;
    });
    return {
      ...toRefs(state),
      addFormConfig,
      button,
      getList,
      salesTable,
      url,
      srcList
    };
  }
});
</script>

<style lang="scss" scoped>
.image_preview {
  .el-image {
    max-width: 200px;
    margin-left: 10px;
  }
}
</style>
