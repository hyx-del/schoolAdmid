<!--
 * @Author: jiu yin
 * @Date: 2021-09-06 11:36:36
 * @LastEditTime: 2021-11-01 13:30:46
 * @LastEditors: 刘帝君
 * @Description: 666
 * @FilePath: \school_admin\src\views\managesignup\usersignup\detaile\costInfo.vue
 *  “jiu”
-->
<template>
  <div class="box">
    <div>
      <p class="f14">
        <span>
          <span class="wdt"> 定金：</span>
          <span class="wdl"> {{ dataExpenses.earnest }}</span>
        </span>
        <span>
          <span class="wdt">已付：</span>
          <span class="wdl"> {{ dataExpenses.earnestPaid }}</span>
        </span>
        <span>
          <span class="wdt">待付：</span>
          <span class="wdl"> {{ dataExpenses.earnestNeed }}</span>
        </span>
        <span>
          <span class="wdt">已退：</span>
          <span class="wdl"> {{ dataExpenses.earnestRefund }}</span>
        </span>
      </p>
      <el-divider></el-divider>
    </div>
    <div>
      <p class="f14">
        <span>
          <span class="wdt"> 学费：</span>
          <span class="wdl"> {{ dataExpenses.trainFee }}</span>
        </span>
        <span>
          <span class="wdt"> 已付：</span>
          <span class="wdl"> {{ dataExpenses.trainFeePaid }}</span>
        </span>
        <span>
          <span class="wdt"> 待付：</span>
          <span class="wdl"> {{ dataExpenses.trainFeeNeed }}</span>
        </span>
        <span>
          <span class="wdt"> 已退：</span>
          <span class="wdl"> {{ dataExpenses.trainFeeRefund }}</span>
        </span>
      </p>
      <el-divider></el-divider>
    </div>
    <!-- 总额 -->
    <div>
      <p class="f14">
        <span>
          <span class="wdt"> 报名费：</span>
          <span class="wdl"> {{ dataExpenses.totalFee }}</span>
        </span>
        <span>
          <span class="wdt"> 已付报名费：</span>
          <span class="wdl"> {{ dataExpenses.totalFeePaid }}</span>
        </span>
        <span>
          <span class="wdt"> 待付报名费：</span>
          <span class="wdl"> {{ dataExpenses.totalFeeNeed }}</span>
        </span>
      </p>
      <el-divider></el-divider>
    </div>

    <!-- 计入提成 -->
    <div>
      <p class="f14 costInfoPs">
        <span>
          <span class="wdt"> 计入提成：</span>
          <span class="wdl"> {{ dataExpenses.pushMoney }}</span>
        </span>
      </p>
      <el-divider></el-divider>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";
export default defineComponent({
  props: {
    formData: {
      type: Object
    }
  },
  setup(props) {
    //逻辑层主体
    const State = reactive({
      // 数据
      dataExpenses: {}
    });

    // 监听
    watch(
      () => props.formData,
      (newValue, oldValue) => {
        State.dataExpenses = newValue;
      },
      { immediate: true }
    );

    return {
      ...toRefs(State)
    };
  }
});
</script>
<style lang="scss" scoped>
.wdt {
  width: 100px;
  display: inline-block;
  text-align: right;
}
.wdl {
  width: 70px;
  display: inline-block;
  text-align: left;
}
.f14 {
  font-size: 14px;
}
.costInfoP {
  font: 14px Helvetica Neue, Helvetica;
  min-width: 526px;
  max-height: 28px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    height: 27px;
  }
}
.dialogBody {
  position: relative;
  display: flex;
  min-width: 280px;
  line-height: 40px;
  flex-direction: column;
  p {
    height: 62px;
  }
  .checkSpan {
    display: inline-block;
    width: 70px;
  }
  .marginP {
    margin: 0 0 0 25px;
  }
  .chebox {
    width: 220px;
    height: 30px;
    padding: 0 30px 0 15px;
    border: 1px solid #c0c4cc;
    outline: 0;
    border-radius: 4px;
    &:focus {
      border: 1px solid #2e8de6;
    }
  }
}
.costInfoPs {
  justify-content: flex-start;
  input {
    margin: 0 35px 0 13px;
  }
  button {
    margin-left: 30px;
  }
}
.combination {
  span {
    display: inline-block;
    width: 70px;
  }
  input {
    width: 220px;
    height: 30px;
    padding: 0 30px 0 15px;
    border: 1px solid #c0c4cc;
    outline: 0;
    border-radius: 4px;
    &:focus {
      border: 1px solid #2e8de6;
    }
  }
}
</style>
<style lang="scss" scoped></style>
