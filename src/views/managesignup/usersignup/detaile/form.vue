<!--
 * @Author: jiu yin
 * @Date: 2021-09-23 09:51:25
 * @LastEditTime: 2021-10-28 15:58:46
 * @LastEditors: zx
 * @Description: 666
 * @FilePath: \school_admin\src\views\managesignup\usersignup\detaile\form.vue
 *  “jiu”
-->
<template>
  <div>
    <el-form
      :model="paymentData"
      ref="combinationForm"
      class="form"
      :rules="rules"
    >
      <el-form-item
        v-for="(item, index) in paymentData.combination"
        :key="item.id"
        :inline="true"
      >
        <el-form
          :model="item"
          label-width="82px"
          class="demo-dynamic"
          :inline="true"
          size="mini"
        >
          <el-form-item label="支付方式：">
            <el-select
              v-model="item.channel"
              placeholder="请选择支付方式"
              style="width: 150px;"
            >
              <el-option
                v-for="v in payChannel"
                :label="v.label"
                :value="v.value"
                :key="v.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付金额："
            ><el-input v-model="item.amount" style="width: 88px;"></el-input>
          </el-form-item>
          <el-form-item label="交易号："
            ><el-input v-model="item.tradeNo" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="付款时间：">
            <el-date-picker
              v-model="item.paymentTime"
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <i
            class="el-icon-circle-plus-outline elIcon colorbule"
            @click="addDomain(index)"
            v-if="index == paymentData.combination.length - 1"
          ></i>
          <i
            class="el-icon-delete elIcon colorred"
            @click.prevent="removeDomain(item)"
            v-if="(index != 0) & (index == paymentData.combination.length - 1)"
          ></i>
        </el-form>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch
} from "vue";
//import { ElMessage } from 'element-plus';
import upLoad from "@/components/upload/index.vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { payChannel } from "@/utils/enum/select";
export default defineComponent({
  components: { upLoad },
  props: {
    paymentData: {
      type: Object
    }
  },
  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    //逻辑层主体
    const State = reactive({
      payChannel: payChannel(),
      rules: {
        img: [{ required: true, message: "请上传凭证", trigger: "blur" }]
      }
    });
    //删除
    const removeDomain = item => {
      var index = props.paymentData.combination.indexOf(item);
      if (index !== -1) {
        props.paymentData.combination.splice(index, 1);
      }
    };
    //新 增
    const addDomain = index => {
      props.paymentData.combination.push({
        type: 20,
        id: index + 1
      });
    };
    const combinationForm = ref(null);
    const ruless = () => {
      combinationForm.value.validate(valid => {
        if (valid) {
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    computed(() => {});
    onMounted(() => {});
    onBeforeUnmount(() => {});
    return {
      ...toRefs(State),
      removeDomain,
      addDomain,
      combinationForm,
      ruless
    };
  }
});
</script>
<style lang="scss" scoped></style>
<style lang="scss" scoped>
.el-input {
  width: 350px;
}
.elIcon {
  width: 30px;
  display: inline-block;
  font-size: 25px;
  text-align: center;
  transform: translateY(5px);
  cursor: pointer;
}
.colorred {
  color: red;
}
.colorbule {
  color: #38f;
}

.imgs {
  position: absolute;
  top: 82px;
  left: 437px;
}
</style>
