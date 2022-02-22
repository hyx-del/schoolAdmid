/*
 * @Author: aa
 * @Date: 2021-08-26 15:29:14
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-02 13:16:35
 * @Descripttion:
 */
/**
 * @name:   动态权限路由菜单
 * @description:
 * @param {*}
 * @return {*}
 */
import Layout from "@/layout";
const dynamicRouters = [
  // 学校管理
  {
    path: "/school",
    name: "school",
    redirect: "/school/manageSchool",
    meta: {
      code: ["a01"],
      title: "学校管理",
      icon: "iconfont icon-a-ziyuan3"
    },
    component: Layout,
    children: [
      {
        path: "manageSchool",
        name: "manageSchool",
        component: () => import("@/views/manageSchool/index"),
        meta: {
          title: "学校管理",
          code: ["a01"]
          // icon: "iconfont icon-icon-banji"
        }
      },

      {
        path: "addSchool",
        name: "addSchoolName",
        hidden: true,
        component: () => import("@/views/manageSchool/addSchool"),
        meta: {
          title: "新增学校"
        }
      },
      {
        path: "schooldetail",
        name: "schooldetailName",
        hidden: true,
        component: () => import("@/views/manageSchool/schooldetail"),
        meta: {
          title: "学校详情"
        }
      }
    ]
  },
  // 学期模板管理
  {
    path: "/termTemplate",
    name: "termTemplateName",
    meta: {
      code: ["a02"],
      title: "学期模板管理",
      icon: "iconfont icon-a-ziyuan1"
    },
    redirect: "/termTemplate/termTemplateManage",
    component: Layout,
    children: [
      {
        path: "termTemplateManage",
        name: "termTemplateManageName",
        component: () => import("@/views/tremtemplate/index"),
        meta: {
          title: "学期模板管理",
          code: ["a02"],
          icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "addtemplate",
        name: "addtemplate",
        hidden: true,
        component: () => import("@/views/tremtemplate/addtemplate"),
        meta: {
          title: "新增模板"
        }
      },
      {
        path: "templatedetail",
        name: "templatedetail",
        hidden: true,
        component: () => import("@/views/tremtemplate/templatedetail"),
        meta: {
          title: "模板详情"
        }
      }
    ]
  },
  // 课程管理
  {
    path: "/headquartersCurriculum",
    name: "headquartersCurriculum",
    meta: {
      code: ["a02"],
      title: "课程管理",
      icon: "iconfont icon-kecheng"
    },
    redirect: "/headquartersCurriculum/list",
    component: Layout,
    children: [
      {
        path: "list",
        name: "headquartersCurriculums",
        component: () => import("@/views/headquartersCurriculum/index"),
        meta: {
          title: "课程管理",
          code: ["a02"],
          icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "addCurriculum",
        name: "addCurriculum",
        hidden: true,
        component: () => import("@/views/headquartersCurriculum/addCourse"),
        meta: {
          title: "新增课程"
        }
      },
      {
        path: "detailsCurriculum",
        name: "detailsCurriculum",
        hidden: true,
        component: () => import("@/views/headquartersCurriculum/details"),
        meta: {
          title: "课程详情"
        }
      }
    ]
  },
  // 学员管理
  {
    path: "/student",
    name: "student",
    meta: {
      code: ["a07"],
      title: "学员管理",
      icon: "iconfont icon-a-ziyuan4"
    },
    redirect: "/student/stuManager",
    component: Layout,
    children: [
      {
        path: "stuManager",
        name: "stuManager",
        component: () => import("@/views/amanagestudent/index"),
        meta: {
          title: "学员管理",
          code: ["a0701"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "stuAdd",
        name: "stuAdd",
        hidden: true,
        component: () => import("@/views/amanagestudent/add"),
        meta: {
          title: "新增学员"
        }
      },
      {
        path: "stuDetaile",
        name: "stuDetaile",
        hidden: true,
        component: () => import("@/views/amanagestudent/detaile/index"),
        meta: {
          title: "学员详情"
        }
      },
      {
        path: "stuEditor",
        name: "stuEditor",
        hidden: true,
        component: () => import("@/views/amanagestudent/editor/index"),
        meta: {
          title: "学员编辑"
        }
      },
      {
        path: "stuFollowAdd",
        name: "stuFollowAdd",
        hidden: true,
        component: () =>
          import("@/views/amanagestudent/editor/followRecordAdd"),
        meta: {
          title: "学员跟进记录新增"
        }
      },
      {
        path: "resources",
        name: "resources",
        component: () => import("@/views/amanagestudent/resources"),
        meta: {
          title: "跟进资源池",
          code: ["a0702"]
          // icon: "iconfont icon-icon-banji"
        }
      }
    ]
  },
  // 教练管理
  {
    path: "/coach",
    name: "coach",
    meta: {
      code: ["a04"],
      title: "教练管理",
      icon: "iconfont icon-a-ziyuan7"
    },
    redirect: "/coach/manager",
    component: Layout,
    children: [
      {
        path: "manager",
        name: "managerName",
        component: () => import("@/views/managecoach/index"),
        meta: {
          title: "教练管理",
          code: ["a04"],
          icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "coachDetail",
        name: "coachDetail",
        hidden: true,
        component: () => import("@/views/managecoach/coachDetail"),
        meta: {
          title: "教练详情",
          icon: "iconfont icon-icon-banji"
        }
      }
    ]
  },
  // 员工管理
  {
    path: "/staff",
    name: "staff",
    meta: {
      code: ["a05", "s09", "c04"],
      title: "员工管理",
      icon: "iconfont icon-a-ziyuan12"
    },
    redirect: "staff",
    component: Layout,
    children: [
      {
        path: "manager",
        name: "manager",
        component: () => import("@/views/managestaff/index"),
        meta: {
          title: "员工",
          code: ["a0501", "s0901", "c0401"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "add",
        name: "managestaffadd",
        hidden: true,
        component: () => import("@/views/managestaff/add"),
        meta: {
          title: "员工新加",
          code: ["a0501a", "s0901a", "c0401a"],
          icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "detail",
        name: "managestaffdetail",
        hidden: true,
        component: () => import("@/views/managestaff/detail"),
        meta: {
          title: "员工详情",
          code: ["a0501c", "s0901c", "c0401c"],
          icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "managestaff/user",
        name: "user",
        component: () => import("@/views/managestaff/user"),
        meta: {
          title: "角色",
          code: ["a0502", "s0902", "c0402"]
          // icon: "iconfont icon-icon-banji"
        }
      }
    ]
  },
  // 基础设置
  {
    path: "/basicsettings",
    name: "basicsettings",
    meta: {
      code: ["a06"],
      title: "基础设置",
      icon: "iconfont icon-a-ziyuan8"
    },
    redirect: "/basicsettings/registertype",
    component: Layout,
    children: [
      {
        path: "registertype",
        name: "registertype",
        component: () => import("@/views/basicsettings/registertype"),
        meta: {
          title: "注册派别",
          code: ["a0601"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "studytarget",
        name: "studytarget",
        component: () => import("@/views/basicsettings/studytarget"),
        meta: {
          title: "学习目的",
          code: ["a0602"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "consulting",
        name: "consulting",
        component: () => import("@/views/basicsettings/consulting"),
        meta: {
          title: "咨询课程",
          code: ["a0603"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "communicate",
        name: "communicate",
        component: () => import("@/views/basicsettings/communicate"),
        meta: {
          title: "沟通方式",
          code: ["a0604"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "resourcetype",
        name: "resourcetype",
        component: () => import("@/views/basicsettings/resourcetype"),
        meta: {
          title: "资源类型",
          code: ["a0605"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "identity",
        name: "identity",
        component: () => import("@/views/basicsettings/identity"),
        meta: {
          title: "学员身份",
          code: ["a0606"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "paytype",
        name: "paytype",
        component: () => import("@/views/basicsettings/paytype"),
        meta: {
          title: "支付方式",
          code: ["a0607"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "semesterFaction",
        name: "semesterFaction",
        component: () => import("@/views/basicsettings/semesterFaction/index"),
        meta: {
          title: "学期派别",
          code: ["a0608"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "semesterFactionAdd",
        name: "semesterFactionAdd",
        hidden: true,
        component: () => import("@/views/basicsettings/semesterFaction/add"),
        meta: {
          title: "学期派别新增"
        }
      },
      {
        path: "semesterFactionDetails",
        name: "semesterFactionDetails",
        hidden: true,
        component: () =>
          import("@/views/basicsettings/semesterFaction/details"),
        meta: {
          title: "学期派别详情"
        }
      }
    ]
  },
  // 总部管理---学员报名
  {
    path: "/studentRegistration",
    name: "studentRegistration",
    meta: {
      code: ["a07"],
      title: "学员报名",
      icon: "iconfont icon-a-ziyuan4"
    },
    redirect: "/studentRegistration/lists",
    component: Layout,
    children: [
      {
        path: "lists",
        name: "studentRegistration",
        component: () => import("@/views/studentRegistration/index"),
        meta: {
          title: "学员报名",
          code: ["a07"],
          icon: "iconfont icon-icon-banji"
        }
      }
    ]
  },
  // 总部管理---全面课程管理
  {
    path: "/overall",
    name: "overall",
    meta: {
      code: ["a08", "a801", "a802", "a803"],
      title: "全面课程管理",
      icon: "iconfont icon-a-ziyuan10"
    },
    redirect: "overall",
    component: Layout,
    children: [
      {
        path: "comprehensiveCurriculum",
        name: "comprehensiveCurriculum",
        component: () =>
          import("@/views/coursesManagement/comprehensiveCurriculum/index"),
        meta: {
          title: "全面课程",
          code: ["a0801"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "addComprehensiveCurriculum",
        name: "addComprehensiveCurriculum",
        hidden: true,
        component: () =>
          import("@/views/coursesManagement/comprehensiveCurriculum/add"),
        meta: {
          title: "新增全面课程"
        }
      },
      {
        path: "detailsComprehensiveCurriculum",
        name: "detailsComprehensiveCurriculum",
        hidden: true,
        component: () =>
          import("@/views/coursesManagement/comprehensiveCurriculum/details"),
        meta: {
          title: "详情全面课程"
        }
      },
      {
        path: "packageRegistration",
        name: "packageRegistration",
        component: () =>
          import("@/views/coursesManagement/packageRegistration/index"),
        meta: {
          title: "套餐报名",
          code: ["a0802"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "addPackageReg",
        name: "addPackageReg",
        hidden: true,
        component: () =>
          import("@/views/coursesManagement/packageRegistration/add"),
        meta: {
          title: "新增报名"
        }
      },
      {
        path: "viewPermissions",
        name: "viewPermissions",
        hidden: true,
        component: () =>
          import("@/views/coursesManagement/packageRegistration/permissions"),
        meta: {
          title: "套餐报名查看权限"
        }
      },
      {
        path: "editorPackageReg",
        name: "editorPackageReg",
        hidden: true,
        component: () =>
          import("@/views/coursesManagement/packageRegistration/editor/index"),
        meta: {
          title: "套餐报名编辑"
        }
      },
      {
        path: "detailsPackageReg",
        name: "detailsPackageReg",
        hidden: true,
        component: () =>
          import("@/views/coursesManagement/packageRegistration/details/index"),
        meta: {
          title: "套餐报名详情"
        }
      },
      {
        path: "packageOrder",
        name: "packageOrder",
        component: () => import("@/views/coursesManagement/packageOrder/index"),
        meta: {
          title: "套餐订单",
          code: ["a0803"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "packageOrderDetails",
        name: "packageOrderDetails",
        hidden: true,
        component: () =>
          import("@/views/coursesManagement/packageOrder/details"),
        meta: {
          title: "订单详情"
        }
      }
    ]
  },
  // 总部管理---优惠管理
  {
    path: "/discount",
    name: "discount",
    meta: {
      code: ["a09", "a901", "a902"],
      title: "优惠管理",
      icon: "iconfont icon-a-ziyuan11"
    },
    redirect: "discount",
    component: Layout,
    children: [
      {
        path: "discountManagement",
        name: "discountManagement",
        component: () =>
          import("@/views/discountAdministration/discountManagement/index"),
        meta: {
          title: "折扣管理",
          code: ["a0901"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "couponManagement",
        name: "couponManagement",
        component: () =>
          import("@/views/discountAdministration/couponManagement/index"),
        meta: {
          title: "优惠券管理",
          code: ["a0902"]
          // icon: "iconfont icon-icon-banji"
        }
      }
    ]
  },
  // 学期管理
  {
    path: "/semester",
    name: "semester",
    meta: {
      code: ["s01"],
      title: "学期管理",
      icon: "iconfont icon-a-ziyuan1"
    },
    redirect: "/semester/manager",
    component: Layout,
    children: [
      {
        path: "manager",
        name: "managesemester",
        component: () => import("@/views/managesemester/index"),
        meta: {
          title: "学期信息管理",
          code: ["s0101"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "add",
        hidden: true,
        name: "managesemesterAdd",
        component: () => import("@/views/managesemester/add"),
        meta: {
          title: "学期信息管理新加",
          code: ["s0102"],
          icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "detail",
        hidden: true,
        name: "managesemesterDetail",
        component: () => import("@/views/managesemester/detail"),
        meta: {
          title: "学期详情",
          code: ["s0103"],
          icon: "iconfont icon-icon-banji"
        }
      }
    ]
  },
  // 报名管理
  {
    path: "/managesignup",
    name: "managesignupName",
    meta: {
      code: ["s02"],
      title: "报名管理",
      icon: "iconfont icon-a-ziyuan9"
    },
    component: Layout,
    children: [
      {
        path: "usersignup",
        name: "usersignup",
        component: () => import("@/views/managesignup/usersignup/index"),
        meta: {
          title: "学员报名",
          code: ["s0201"]
          // icon: "iconfont icon-icon-banji"
        }
      },

      {
        path: "addUsersignup",
        name: "addUsersignupName",
        hidden: true,
        component: () => import("@/views/managesignup/usersignup/addSchool"),
        meta: {
          title: "新增报名"
        }
      },
      {
        path: "Detaile",
        name: "Detaile",
        hidden: true,
        component: () =>
          import("@/views/managesignup/usersignup/detaile/index"),
        meta: {
          title: "报名详情",
          icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "editApply",
        name: "editApply",
        hidden: true,
        component: () => import("@/views/managesignup/usersignup/detaile/edit"),
        meta: {
          title: "编辑报名",
          icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "signuporder",
        name: "signuporder",
        component: () => import("@/views/managesignup/signuporder/index"),
        meta: {
          title: "报名订单",
          code: ["s0202"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "transfer",
        name: "transfer",
        component: () => import("@/views/managesignup/transfer/index"),
        meta: {
          title: "转学记录",
          code: ["s0203"]
          // icon: "iconfont icon-icon-banji"
        }
      }
    ]
  },
  // 班级管理
  {
    path: "/manageclass",
    name: "manageclass",
    meta: {
      code: ["s03"],
      title: "班级管理",
      icon: "iconfont icon-a-78"
    },
    redirect: "manageclassinfo",
    component: Layout,
    children: [
      {
        path: "manageclassinfo",
        name: "manageclassinfo",
        component: () => import("@/views/manageclass/manageclassinfo"),
        meta: {
          title: "班级信息管理",
          code: ["s0301"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "manageclassuser",
        name: "manageclassuser",
        component: () => import("@/views/manageclass/manageclassuser"),
        meta: {
          title: "学员分班管理",
          code: ["s0302"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "shiftDetails",
        name: "shiftDetails",
        hidden: true,
        component: () => import("@/views/manageclass/shiftDetails/index"),
        meta: {
          title: "学员分班详情"
        }
      },
      {
        path: "classesAdd",
        name: "classesAdd",
        hidden: true,
        component: () => import("@/views/manageclass/shiftDetails/classesAdd"),
        meta: {
          title: "班级新增学员"
        }
      }
    ]
  },
  // 学校---学期模板管理
  {
    path: "/schoolTermTemplate",
    name: "schoolTermTemplate",
    meta: {
      code: ["s08"],
      title: "学期模板管理",
      icon: "iconfont icon-a-ziyuan1"
    },
    redirect: "/schoolTermTemplate/termTemplateInfo",
    component: Layout,
    children: [
      {
        path: "termTemplateInfo",
        name: "termTemplateInfoName",
        component: () => import("@/views/schoolTermTemplate/index"),
        meta: {
          title: "学期模板管理",
          code: ["s0801"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "schoolAddtemplate",
        name: "schoolAddtemplate",
        hidden: true,
        component: () => import("@/views/schoolTermTemplate/addtemplate"),
        meta: {
          title: "新增模板"
        }
      },
      {
        path: "schoolTemplatedetail",
        name: "schoolTemplatedetail",
        hidden: true,
        component: () => import("@/views/schoolTermTemplate/templatedetail"),
        meta: {
          title: "模板详情"
        }
      }
    ]
  },
  // 教室管理
  {
    path: "/classroom",
    name: "classroom",
    meta: {
      code: ["s04"],
      title: "教室管理",
      icon: "iconfont icon-a-ziyuan7"
    },
    redirect: "/classroom/list",
    component: Layout,
    children: [
      {
        path: "list",
        name: "classroom",
        component: () => import("@/views/classroom/index"),
        meta: {
          title: "教室管理",
          code: ["s04"],
          icon: "iconfont icon-icon-banji"
        }
      }
    ]
  },
  // 宿舍管理
  {
    path: "/dormitory",
    name: "dormitory",
    meta: {
      code: ["s05"],
      title: "宿舍管理",
      icon: "iconfont icon-a-666"
    },
    redirect: "/dormitory/list",
    component: Layout,
    children: [
      {
        path: "list",
        name: "dormitory",
        component: () => import("@/views/dormitory/index"),
        meta: {
          title: "宿舍管理",
          code: ["s05"],
          icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "dormitoryDetail",
        name: "dormitoryDetail",
        hidden: true,
        component: () => import("@/views/dormitory/detail"),
        meta: {
          title: "添加学员"
        }
      }
    ]
  },
  // 学员管理
  {
    path: "/usermanage",
    name: "usermanage",
    meta: {
      code: ["s06"],
      title: "学员管理",
      icon: "iconfont icon-a-ziyuan4"
    },
    redirect: "/usermanage/list",
    component: Layout,
    children: [
      {
        path: "list",
        name: "usermanage",
        component: () => import("@/views/usermanage/index"),
        meta: {
          title: "学员管理",
          code: ["s0601"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "add",
        name: "add",
        hidden: true,
        component: () => import("@/views/usermanage/add"),
        meta: {
          title: "新增学员"
        }
      },
      {
        path: "detaile",
        name: "detaile",
        hidden: true,
        component: () => import("@/views/usermanage/detaile/index"),
        meta: {
          title: "学员详情"
        }
      },
      {
        path: "editor",
        name: "editor",
        hidden: true,
        component: () => import("@/views/usermanage/editor/index"),
        meta: {
          title: "学员编辑"
        }
      },
      {
        path: "followAdd",
        name: "followAdd",
        hidden: true,
        component: () => import("@/views/usermanage/editor/followRecordAdd"),
        meta: {
          title: "学员跟进记录新增"
        }
      }
    ]
  },
  // 课程管理
  {
    path: "/curriculum",
    name: "curriculum",
    meta: {
      code: ["s10"],
      title: "课程管理",
      icon: "iconfont icon-kecheng"
    },
    redirect: "/curriculum/list",
    component: Layout,
    children: [
      {
        path: "list",
        name: "curriculum",
        component: () => import("@/views/curriculum/index"),
        meta: {
          title: "课程管理",
          code: ["s1001"]
          // icon: "iconfont icon-icon-banji"
        }
      },
      {
        path: "addCourse",
        name: "addCourse",
        hidden: true,
        component: () => import("@/views/curriculum/addCourse"),
        meta: {
          title: "新增课程"
        }
      },
      {
        path: "details",
        name: "details",
        hidden: true,
        component: () => import("@/views/curriculum/details"),
        meta: {
          title: "课程详情"
        }
      }
    ]
  },
  // 成绩单
  // {
  //   path: "/schoolreport",
  //   name: "schoolreport",
  //   meta: {
  //     code: ["s08"],
  //     title: "成绩单",
  //     icon: "iconfont icon-icon-banji"
  //   },
  //   redirect: "/schoolreport/list",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "list",
  //       name: "schoolreport",
  //       component: () => import("@/views/schoolreport/index"),
  //       meta: {
  //         title: "成绩单",
  //         code: ["s08"],
  //         icon: "iconfont icon-icon-banji"
  //       }
  //     }
  //   ]
  // },
  // 学员管理
  {
    path: "/claasuser",
    name: "claasuser",
    meta: {
      code: ["c02"],
      title: "学员管理",
      icon: "iconfont icon-a-ziyuan4"
    },
    redirect: "/claasuser/list",
    component: Layout,
    children: [
      {
        path: "list",
        name: "claasuserList",
        component: () => import("@/views/claasuser/index"),
        meta: {
          title: "学员管理",
          code: ["c0102"]
          // icon: "iconfont icon-icon-banji"
        }
      }
    ]
  }, // 课表管理 schedule
  {
    path: "/schedule",
    name: "schedule",
    meta: {
      code: ["c01"],
      title: "课表管理",
      icon: "iconfont icon-kecheng"
    },
    redirect: "/schedule/index",
    component: Layout,
    children: [
      {
        path: "index",
        name: "schedule",
        component: () => import("@/views/schedule/index"),
        meta: {
          title: "课表管理",
          code: ["c0101"]
          // icon: "iconfont icon-icon-banji"
        }
      }
    ]
  }
  // 班级---成绩单
  // {
  //   path: "/claasreport",
  //   name: "claasreport",
  //   meta: {
  //     code: ["c03"],
  //     title: "成绩单",
  //     icon: "iconfont icon-icon-banji"
  //   },
  //   redirect: "/claasreport/list",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "list",
  //       name: "claasreport",
  //       component: () => import("@/views/claasreport/index"),
  //       meta: {
  //         title: "成绩单",
  //         code: ["c03"],
  //         icon: "iconfont icon-icon-banji"
  //       }
  //     }
  //   ]
  // }
];

export default dynamicRouters;
