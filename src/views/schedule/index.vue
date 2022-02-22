<template>
  <div>
    <div class="title">
      <formList
        :config="config"
        :itemList="itemList"
        :formInitData="formInitData"
        :hideList="hideList"
        :showList="showList"
        @buttonClick="button"
      />
    </div>
    <div class="calendarCard" v-show="!mode">
      <calendarCard
        :list="calendarList"
        @changeTime="changeTime"
        @headItem="headItem"
        @details="details"
      />
    </div>
    <div class="table" v-show="mode">
      <Table
        ref="TableList"
        :loadData="getList"
        :column="column"
        :select="columnSelect"
        :params="formInitData"
        :showSortIndex="{ show: true, lable: '序号' }"
      >
      </Table>
    </div>
    <!--  新加  -->
    <el-dialog
      v-if="dialogAdd"
      v-model="dialogAdd"
      title="新增课程"
      width="500px"
    >
      <formList
        :config="configAdd"
        :itemList="itemListAdd"
        :formInitData="formInitDataAdd"
        @buttonClick="buttonAdd"
        @formChange="formChangeAdd"
      >
      </formList>
    </el-dialog>
    <!--  编辑  -->
    <el-dialog
      v-if="dialogEdit"
      v-model="dialogEdit"
      title="编辑课程"
      width="500px"
    >
      <formList
        :config="configEdit"
        :itemList="itemListEdit"
        :formInitData="formInitDataEdit"
        :formState="formStateEdit"
        @buttonClick="buttonEdit"
        @formChange="formChangeEdit"
      >
      </formList>
    </el-dialog>
    <!--  课程详情 审核  -->
    <el-dialog
      v-if="dialogDetail"
      v-model="dialogDetail"
      title="课程详情"
      width="500px"
    >
      <formList
        :config="configDetail"
        :itemList="itemListDetail"
        :formInitData="formInitDataDetail"
        @buttonClick="buttonDetail"
        @formChange="formChangeDetail"
      >
      </formList>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import calendarCard from "@/components/calendarCard/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  arrangingList,
  auditList,
  genderList,
  getListHtml,
  jobsStateList,
  staffEnableList,
  weekList
} from "@/utils/enum/select";
import { deleteItem, farmatDate } from "@/utils/tools";
import { popConfig, tabelFormConfig } from "@/utils/config";
import {
  coursePlanCancelPut,
  courseplanDeleteDelete,
  courseplanDetail,
  courseplanList,
  courseplanReviewbatchPut,
  courseplanSavePost,
  courseplanTable,
  schoolCourseplanPut
} from "@/api/schedule";
import { courseBoxlist, courseListClass } from "@/api/school";
import { coachBoxlist } from "@/api/coach";
import { classroomBoxlist } from "@/api/classroom";
import { log } from "@/utils";
export default {
  components: {
    calendarCard,
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null);
    let config = {
      ...JSON.parse(JSON.stringify(tabelFormConfig)),
      buttons: [
        {
          funType: "confirm",
          type: "primary",
          name: "查 询",
          size: "small"
        },
        {
          perCode: "c0101a",
          funType: "add",
          name: "新 增",
          size: "small"
        }
      ]
    };
    let batch = {
      perCode: "c0101b",
      funType: "batch",
      type: "primary",
      name: "批量审核",
      size: "small"
    };
    config.buttons[2] = {
      funType: "switch",
      type: "primary",
      name: "切换模式",
      size: "small"
    };
    config.buttons[3] = batch;
    let commonList = [
      {
        el: "select",
        code: "courseId",
        label: "课程名称",
        fun: courseBoxlist,
        funMode: "one",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id" // 指定的value名
      },
      {
        el: "select",
        code: "coachId",
        label: "教练",
        fun: coachBoxlist,
        funMode: "one",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id", // 指定的value名
        filterable: true,
        disabled: true
      },
      {
        el: "select",
        code: "classroomId",
        label: "教室",
        fun: classroomBoxlist,
        funMode: "one",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id" // 指定的value名
      }
    ];
    let single = [
      {
        el: "date",
        code: "startDate",
        label: "日期",
        dateType: "date"
      },
      {
        el: "timePicker",
        code: "time",
        otherCodeArr: ["startTime", "endTime"],
        label: "时间",
        isRange: true
      }
    ];
    let cycle = [
      {
        el: "date",
        code: "date",
        otherCodeArr: ["startDate", "endDate"],
        label: "选择日期段",
        dateType: "daterange"
      },
      {
        el: "timePicker",
        code: "time",
        otherCodeArr: ["startTime", "endTime"],
        label: "时间",
        isRange: true
      },
      // 设置周期
      {
        el: "select",
        code: "cycle",
        label: "周期",
        list: weekList
      }
    ];
    let saveLoading = false;
    const state = reactive({
      // 是否是表格模式
      mode: true,
      hideList: [],
      showList: [],
      // 日历相关
      calendarList: [],
      changeTime: val => state.getCalen(val.date),
      headItem: val => {
        //新加课程
        state.dialogAdd = true;
        state.formInitDataAdd = { date: val.date };
      },
      getCalen: (time = new Date()) => {
        let { date } = farmatDate(time);
        courseplanTable({ ...state.formInitData, date }).then(res => {
          let calendarList = res.data.coursePlanDateVOList || [];
          state.calendarList = calendarList.map(
            item => item.coursePlanDetailVOList
          );
        });
      },
      // 搜索表单
      itemList: [
        {
          el: "select",
          code: "courseId",
          label: "课程名称",
          fun: courseBoxlist,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id" // 指定的value名
        },
        {
          el: "select",
          code: "coachId",
          label: "教练",
          fun: coachBoxlist,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          filterable: true,
          tips: "可输入名称检索"
        },
        {
          el: "select",
          label: "状态",
          code: "status",
          list: auditList
        },
        {
          el: "date",
          code: "scheduleData",
          label: "课程日期",
          otherCodeArr: ["startDate", "endDate"],
          dateType: "daterange"
        }
      ],
      config,
      formInitData: {},
      formChange: val => {
        state.formInitData[val.code] = val.value;
      },
      button: val => {
        // 切换日历模式
        if (val.name == "switch") {
          state.formInitData = {};
          state.mode = !state.mode;
          if (state.mode) {
            state.showList = ["scheduleData"];
            TableList.value.update({ ...state.formInitData });
            state.config.buttons.push(batch);
          } else {
            // 隐藏日期查询条件
            state.hideList = ["scheduleData"];
            state.config.buttons.pop();
            state.getCalen();
          }
        }
        if (val.name == "add") {
          state.dialogAdd = true;
          state.isAdd = true;
        }
        if (val.name == "confirm" && val.valid) {
          let _parData = { ...val.value };
          if (val.value.scheduleData) {
            _parData.date = `${_parData.startDate}~${_parData.endDate}`;
          }
          // console.log(_parData);
          // return false;
          if (state.mode) {
            TableList.value.update({ ..._parData });
          } else {
            state.getCalen();
          }
        }
        if (val.name == "batch") {
          if (state.columnSelectArr.length > 0) {
            let data = state.columnSelectArr.map(v => v.id);
            courseplanReviewbatchPut({ coursePlanIds: data }).then(res => {
              ElMessage.success("审核成功");
              TableList.value.update();
              state.dialogDetail = false;
            });
          } else {
            ElMessage.warning("请勾选");
          }
        }
      },
      // table表单
      getList: courseplanList,
      column: [
        {
          prop: "className",
          label: "班级"
          // html: (row, val) => `<span class="fy_a">${val}</span>`,
          // click: row => {
          //
          // }
        },
        { prop: "classroomName", label: "教室" },
        { prop: "courseName", label: "课程" },
        { prop: "coachName", label: "教练" },
        { prop: "date", label: "日期" },
        { prop: "startTime", label: "开始时间" },
        { prop: "endTime", label: "结束时间" },
        {
          prop: "status",
          label: "状态",
          html: (row, val) => getListHtml(auditList, val)
        },
        {
          prop: "action",
          label: "操作",
          fixed: "right",
          width: 200,
          actives: [
            {
              perCode: "c0101c",
              name: "编辑",
              method: (row, val) => {
                state.dialogEdit = true;
                state.formInitDataEdit = { ...row };
                setTimeout(() => {
                  state.formStateEdit = [
                    {
                      code: "date",
                      disabled: row.status != 20
                    },
                    {
                      code: "time",
                      disabled: row.status != 20
                    },
                    {
                      code: "coachId",
                      disabled: row.status != 20
                    }
                  ];
                });
              }
            },
            {
              // name: val => '审核',
              perCode: "c0101b",
              name: val => (val.status == 20 ? "审核" : ""),
              method: val => {
                state.configDetail.buttons = [
                  {
                    perCode: "c0101e",
                    funType: "cancel",
                    type: null,
                    name: "取消课程",
                    size: "small"
                  },
                  {
                    perCode: "c0101b",
                    funType: "confirm",
                    type: "primary",
                    name: "审核课程",
                    size: "small"
                  }
                ];
                state.formInitDataDetail = val;
                state.dialogDetail = true;
              }
            },
            {
              perCode: "c0101e",
              name: row => (row.status != 30 ? "取消" : ""),
              method: val =>
                deleteItem(val, coursePlanCancelPut, TableList, {
                  title: "确定取消课程？"
                })
            }
          ]
        }
      ],
      columnSelect: val => {
        state.columnSelectArr = val;
      },
      columnSelectArr: [],
      // 新加编辑弹窗
      isAdd: false,
      dialogAdd: false,
      dialogTitle: "新增课程",
      configAdd: popConfig,

      itemListAdd: [
        {
          el: "select",
          code: "courseId",
          label: "课程名称",
          fun: courseBoxlist,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id" // 指定的value名
        },
        {
          el: "select",
          code: "coachId",
          label: "教练",
          fun: coachBoxlist,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          filterable: true,
          tips: "可输入名称检索"
        },
        {
          el: "select",
          code: "classroomId",
          label: "教室",
          fun: classroomBoxlist,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id" // 指定的value名
        },
        {
          el: "radio",
          code: "type",
          label: "排课方式",
          list: arrangingList
        },
        ...single
      ],
      formInitDataAdd: {},
      formChangeAdd: val => {
        if (val.code == "type") {
          let list = [...state.itemListAdd];
          list.splice(4, 4);
          list = val.value == 1 ? [...list, ...single] : [...list, ...cycle];
          state.itemListAdd = [...list];
        }
      },
      buttonAdd: val => {
        if (val.name == "confirm" && val.valid) {
          if (saveLoading) {
            return;
          }
          val.value.endDate = val.value.endDate || val.value.startDate;

          const _par = { ...val.value };

          delete _par.time;
          saveLoading = true;
          courseplanSavePost(_par)
            .then(({ code }) => {
              if (code === 200) {
                TableList.value.update();
                state.dialogAdd = false;
              }
              saveLoading = false;
            })
            .catch(error => {
              saveLoading = false;
            });
        } else {
          state.dialogAdd = false;
        }
      },
      //  编辑课程
      dialogEdit: false,
      configEdit: { ...popConfig },
      formStateEdit: [],
      itemListEdit: [
        ...commonList,
        {
          el: "date",
          code: "date",
          label: "日期",
          dateType: "date",
          disabled: true
        },
        {
          el: "timePicker",
          code: "time",
          otherCodeArr: ["startTime", "endTime"],
          label: "时间",
          isRange: true,
          disabled: true
        }
      ],
      formInitDataEdit: {},
      formChangeEdit: val => {
        if (val.code == "type") {
          let list = [...state.itemListEdit];
          list.splice(4, 4);
          list = val.value == 1 ? [...list, ...single] : [...list, ...cycle];
          state.itemListEdit = [...list];
        }
      },
      buttonEdit: val => {
        if (val.name == "confirm" && val.valid) {
          if (saveLoading) {
            return;
          }
          const _par = { ...val.value };

          delete _par.time;
          saveLoading = true;
          schoolCourseplanPut(_par).then(res => {
            ElMessage.success("编辑成功");
            state.dialogEdit = false;
            saveLoading = false;
            TableList.value.update();
          });
        } else {
          TableList.value.update();
          state.dialogEdit = false;
        }
      },
      //  课程详情 审核课程 取消课程
      isDetail: false,
      dialogDetail: false,
      configDetail: {
        ...popConfig,
        allDisabled: true,
        buttons: [
          {
            funType: "close",
            name: "关闭",
            size: "small"
          }
        ]
      },
      itemListDetail: [
        ...commonList,
        // {
        //   code: "maxNumber",
        //   label: "容纳人数",
        //   type: "number"
        // },
        {
          el: "date",
          code: "date",
          label: "日期",
          dateType: "date",
          config: {
            disabled: true
          }
        },
        {
          el: "timePicker",
          code: "time",
          otherCodeArr: ["startTime", "endTime"],
          label: "时间",
          isRange: true,
          disabled: true
        }
      ],
      formInitDataDetail: {},
      formChangeDetail: val => {
        if (val.code == "type") {
          let list = [...state.itemListDetail];
          list.splice(4, 4);
          list = val.value == 1 ? [...list, ...single] : [...list, ...cycle];
          state.itemListDetail = [...list];
        }
      },
      buttonDetail: val => {
        if (val.name == "confirm" && val.valid) {
          courseplanReviewbatchPut({
            coursePlanIds: [state.formInitDataDetail.id]
          }).then(res => {
            ElMessage.success("审核成功");
            TableList.value.update();
            state.dialogDetail = false;
          });
        }
        if (val.name == "cancel") {
          deleteItem(
            state.formInitDataDetail,
            courseplanDeleteDelete,
            TableList,
            null,
            () => (state.dialogDetail = false)
          );
        }
        if (val.name == "close") {
          state.dialogDetail = false;
        }
      },
      details: val => {
        state.formInitDataDetail = val;
        state.dialogDetail = true;
      }
    });
    state.getCalen();
    return {
      ...toRefs(state),
      TableList
    };
  }
};
</script>

<style lang="scss" scoped>
.name {
  cursor: pointer;
  color: #2e8de6;
}
.find {
  margin-left: 10px;
  cursor: pointer;
  color: #2e8de6;
}
</style>
