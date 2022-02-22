<template>
  <div class="login-body" @keyup.enter="submitForm">
    <div class="login_left">
      <img
        src="https://file.jiayu.world/image/school_admin/loginImg.jpg"
        alt=""
      />
      <div class="text">
        <p>COACH TRAINING BACKGROUND</p>
        <p>梵音教培系统</p>
      </div>
      <div class="logo">
        <img
          src="https://file.jiayu.world/image/school_admin/logo.png"
          alt=""
        />
      </div>
    </div>
    <div class="login_right">
      <div class="login-container">
        <p class="p pr">欢迎登录<span></span></p>
        <p class="p">教培系统管理后台</p>
        <el-form
          :rules="rules"
          :model="ruleForm"
          ref="loginForm"
          class="login-form"
        >
          <el-form-item label="" prop="username" class="username">
            <el-input
              type="text"
              :maxlength="11"
              v-model.trim="ruleForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="password" class="password">
            <div>
              <el-input
                type="password"
                v-model.trim="ruleForm.password"
              ></el-input>
            </div>
<!--            <p class="amend" @click="dialogFormVisible = true">修改密码</p>-->
          </el-form-item>
          <el-form-item>
            <el-button
              style="width: 100%;"
              :loading="btnLoading"
              type="primary"
              class="loginBut"
              @click="submitForm"
            >
              立即登录
            </el-button>
            <!-- <el-checkbox v-model="checked" @change="!checked">下次自动登录</el-checkbox> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
    <popupForm
      v-model:show="dialogFormVisible"
      :formInitData="form"
      title="修改密码"
      :itemList="itemList"
      @confirm="confirm"
    />
  </div>
</template>

<script>
import { reactive, ref, toRefs, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  getAliOSSToken,
  getPermissionOfSchoolQue,
  getPhpAdminToken
} from "@/api/common";
import { staffGetPermission } from "@/api/managerStaff";
import store from "@/store";
import { removeToken, getOtherToken, setOtherToken } from "@/utils/auth";
import popupForm from "@/components/FormList/popupForm.vue";
import getRouterList from "@/utils/router";
import md5 from "js-md5";
import { encryption } from "@/utils/util";
import { ElMessage } from "element-plus";
import { staffUpdatePasswordPost } from "@/api/user";
import { log } from "@/utils";

const router = useRouter();
export default {
  components: {
    popupForm
  },
  name: "Login",
  setup() {
    const { proxy } = getCurrentInstance();
    const router = useRouter();
    const loginForm = ref(null);
    let clearTimeoutId = null;
    onMounted(() => {
      removeToken();
      const _tempQuery = useRoute().query;
      if (_tempQuery && _tempQuery.refreshPage) {
        clearTimeoutId = setTimeout(() => {
          clearTimeout(clearTimeoutId);
          clearTimeoutId = null;
          router.push({ path: "/login" });
        }, 2000);
      }
    });
    const state = reactive({
      dialogFormVisible: false,
      btnLoading: false,
      form: {},
      itemList: [
        {
          code: "username",
          label: "手机号"
        },
        {
          code: "password",
          label: "原密码",
          showPassword: true
        },
        {
          code: "newPassword",
          label: "新密码",
          showPassword: true
        },
        {
          code: "newPassword2",
          label: "确认密码",
          showPassword: true
        }
      ],
      ruleForm: {
        username: "",
        password: ""
      },
      confirm: value => {
        console.log(value);
        if (value.newPassword != value.newPassword2) {
          ElMessage.error("两次密码不一致");
          return;
        }
        console.log('login(value);1212121212121212121212121212121212')
        login(value, () => {
          const data = encryption({
            data: value,
            key: "4d3247ec362343b5acd489c327af7ada",
            iv: "acd489c327af7ade",
            param: ["newPassword"]
          });
          staffUpdatePasswordPost(data).then(res => {
            ElMessage.success("修改成功！");
            state.dialogFormVisible = false;
            router.go(0);
          });
        });
      },
      carouselUrls: "",
      checked: true,
      url: "",
      rules: {
        username: [
          { required: "true", message: "账户不能为空", trigger: "blur" }
        ],
        password: [
          { required: "true", message: "密码不能为空", trigger: "blur" }
        ]
      }
    });
    const submitForm = async () => {
      loginForm.value.validate(valid => {
        if (valid) {
          const _par = { ...state.ruleForm };
          // _par.password=md5(_par.password);
          _par.password = _par.password;
          state.btnLoading = true;
          login(_par);
        } else {
          return false;
        }
      });
    };
    // 登录
    const login = (_par, fun) => {
      // 密码加密处理
      const user = encryption({
        data: _par,
        key: "4d3247ec362343b5acd489c327af7ada",
        iv: "acd489c327af7ade",
        param: ["password"]
      });
      let _formData = new FormData();
      _formData.append("grant_type", "password");
      _formData.append("username", user.username);
      _formData.append("password", user.password);
      store
        .dispatch("user/login", _formData)
        .then(() => {
          state.btnLoading = false;
          if (fun) {
            fun();
          }else{
            // 登录后默认获取第一次阿里的token
            getAliOSSToken().then(res => {
              if (res.code === 200) {
                store.dispatch("app/updateOSSToken", res.data);
              } else {
                Message.error(res.msg);
              }
            });
            // 默认获取外包token
            getPhpAdminToken().then(({ data }) => {
              data && setOtherToken(data.access_token);
            });
            // 获取用户总部和 所有学校列表
            getPermissionOfSchoolQue({}).then(res2 => {
              if (res2.code == 200) {
                // 获取总部菜单相应权限
                store.dispatch("user/setHeadquarters", res2.data.hasTeaching);
                // 获取第一个学校下面的班级列表，并获取第一个班级的菜单与按钮权限
                store.dispatch("user/setAllSchoolList", res2.data.schools);
                setTimeout(() => {
                  router.push({ path: "/" });
                }, 500);
              }
            });
          }
        })
        .catch(res => {
          state.btnLoading = false;
        });
    };
    const resetForm = () => {
      loginForm.value.resetFields();
    };
    return {
      ...toRefs(state),
      loginForm,
      submitForm,
      resetForm
    };
  }
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
@mixin imgWh {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.login-body {
  display: flex;
  width: 100%;
  background-color: #fff;
  height: 100vh;
  .login_left {
    position: relative;
    width: 70%;
    height: 100vh;
    img {
      @include imgWh;
    }
    .logo {
      position: absolute;
      top: 40px;
      left: 44px;
      width: 19%;
      img {
        @include imgWh;
      }
    }
    .text {
      position: absolute;
      right: 56px;
      bottom: 140px;
      white-space: nowrap;
      :first-child {
        color: #ffffff;
        font: 32px/54px "ArialMT";
      }
      :last-child {
        color: #ffffff;
        font: 22px "微软雅黑";
        text-align: right;
      }
    }
  }
  .login_right {
    width: 30%;
    min-width: 400px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-container {
      min-width: 388px;
      .p {
        font-size: 24px;
        font-family: "微软雅黑";
        font-weight: bold;
        color: #333333;
      }
      .pr {
        position: relative;
        margin-bottom: 18px;
        span {
          position: absolute;
          bottom: 0;
          left: 0;
          display: block;
          width: 96px;
          height: 11px;
          opacity: 0.3;
          background: #2e8de6;
        }
      }
      .login-form {
        margin-top: 90px;
        .password {
          div {
            position: relative;
            p {
              position: absolute;
              right: 5px;
              bottom: -40px;
            }
          }
        }
      }
      .amend {
        font-size: 14px;
        font-family: "微软雅黑";
        text-align: right;
        color: #616161;
        cursor: pointer;
        &:hover {
          color: #2e8de6;
        }
      }
    }
  }
}
</style>
}
<style lang="scss">
.el-form--label-top .el-form-item__label {
  padding: 0;
}
.login-form .el-form-item {
  margin-bottom: 46px;
}
@mixin el_input {
  padding-left: 42px;
  height: 62px;
  font-size: 16px;
  font-family: SourceHanSans;
  outline: none;
  font-weight: bold;
  border: 0;
  border-bottom: 1px solid #ccc;
  border-bottom-left-radius: 1px;
  border-bottom-right-radius: 1px;
}
.username .el-input__inner {
  @include el_input;
  background: url("~@/assets/login/user.png") no-repeat left center;
  background-size: 22px;
  &:focus {
    background: url("~@/assets/login/userFoucs.png") no-repeat left center;
    background-size: 22px;
    color: #2e8de6;
  }
}
.password .el-input__inner {
  @include el_input;
  background: url("~@/assets/login/password.png") no-repeat left center;
  background-size: 22px;
  &:focus {
    background: url("~@/assets/login/passwordFoucs.png") no-repeat left center;
    background-size: 22px;
    color: #2e8de6;
  }
}
.loginBut {
  border: 0;
  height: 48px;
  box-shadow: 0px 4px 6px 0px rgba(22, 121, 213, 0.28);
  font-family: "微软雅黑";
  font-weight: 500;
  margin-top: 36px;
}
</style>
