<template>
  <div class="calendarCard">
    <div class="calendarCard_title">
      <div class="calendarCard_left">
        <div
          class="calendarCard_pre iconfont icon-31fanhui1"
          @click="changeDate(-7)"
        ></div>
        <el-button size="small" class="calendarCard_now" @click="changeDate()"
          >今天</el-button
        >
        <div
          class="calendarCard_next iconfont icon-31fanhui2"
          @click="changeDate(7)"
        ></div>
      </div>
      <div class="calendarCard_head_cen">{{ head }}</div>
    </div>
    <div class="calendarCard_body">
      <div class="calendarCard_head">
        <div
          class="time"
          v-for="i in timeArr"
          @click="addItem(i)"
          :key="i.monthWeek"
        >
          <i class="add iconfont icon-jiajianzujianjiahao"></i>
          {{ i.monthWeek }}
        </div>
      </div>
      <div class="calendarCard_str" v-if="inList && inList.length > 0">
        <div
          class="calendarCard_item"
          v-for="(it, index) in inList"
          :key="index"
        >
          <div v-if="it && it.length > 0">
            <div
              class="calendarCard_item_in"
              @click="addDetails(i)"
              v-for="i in it"
              :key="i"
            >
              <div class="calendarCard_item_p">{{ i.courseName }}</div>
              <div class="calendarCard_item_p">
                {{ i.startTime }}~ {{ i.endTime }}
              </div>
              <div class="calendarCard_item_p">{{ i.coachName }}</div>
              <div class="tips" v-if="i.status == 20">未审核</div>
            </div>
          </div>
          <div class="no" v-else>没有排课</div>
        </div>
      </div>
      <div class="calendarCard_nodate" v-else>
        没有排课
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs, ref, reactive, toRef, isRef, watch, computed } from "vue";
import { farmatDate, getFormatDateWeek } from "@/utils/tools";

export default {
  name: "index",
  props: {
    // 赋值默认值
    list: {
      type: Array
    },
    itemList: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  setup(props, context) {
    const { emit, slots, attrs } = context;
    const state = reactive({
      head: computed(
        () =>
          `${state.timeArr[0].dateStr}~${
            state.timeArr[0].year == state.timeArr[6].year
              ? state.timeArr[6].yearMonth
              : state.timeArr[6].dateStr
          }`
      ),
      currentDay: new Date(),
      timeArr: computed(() => getFormatDateWeek(state.currentDay)),
      inList: [],
      changeDate: time => {
        state.currentDay = time
          ? new Date(state.currentDay.getTime() + time * 24 * 60 * 60 * 1000)
          : new Date();
        emit("changeTime", farmatDate(state.currentDay));
      },
      addDetails: val => {
        emit("details", val);
      },
      addItem: item => {
        emit("headItem", item);
      }
    });
    watch(
      () => props.list,
      val => {
        state.inList = val;
      },
      {
        deep: true,
        immediate: true
      }
    );
    return {
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped>
@import "./index";
</style>
