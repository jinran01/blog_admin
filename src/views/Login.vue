<template>
  <div class="login-page">
    <div class="login-card">
      <h2>欢迎登录</h2>

      <!-- 登录方式切换 -->
      <div class="tab-switch">
        <button :class="{active: stat.mode==='username'}" @click="stat.mode='username'">用户名登录</button>
        <button :class="{active: stat.mode==='phone'}" @click="stat.mode='phone'">手机号登录</button>
        <button :class="{active: stat.mode==='email'}" @click="stat.mode='email'">邮箱登录</button>
      </div>

      <form @submit.prevent="login">
        <!-- 用户名登录 -->
        <div v-if="stat.mode==='username'" class="input-group">
          <input type="text" v-model="stat.username" required placeholder=" " />
          <label>用户名</label>
        </div>
        <div v-if="stat.mode==='username'" class="input-group">
          <input type="password" v-model="stat.password" required placeholder=" " />
          <label>密码</label>
        </div>

        <!-- 手机号登录 -->
        <div v-if="stat.mode==='phone'" class="input-group">
          <input type="tel" v-model="stat.phone" required placeholder=" " />
          <label>手机号</label>
        </div>

        <!-- 邮箱登录 -->
        <div v-if="stat.mode==='email'" class="input-group">
          <input type="email" v-model="stat.email" required placeholder=" " />
          <label>邮箱</label>
        </div>

        <!-- 验证码输入（手机号和邮箱） -->
        <div v-if="stat.mode==='phone'||stat.mode==='email'" class="input-group code-group">
          <input type="text" v-model="stat.code" required placeholder=" " />
          <label>验证码</label>
          <button type="button" class="send-code" @click="sendCode" :disabled="stat.countdown>0">
            {{ stat.countdown>0 ? stat.countdown + 's' : '发送验证码' }}
          </button>
        </div>

        <button type="submit" class="login-btn" >登录</button>
      </form>
    </div>

    <!-- 背景科技线条 -->
    <div class="background-lines">
      <span v-for="n in 50" :key="n" :style="lineStyle(n)"></span>
    </div>
    <div class="modal-mask" v-show="stat.visible">
      <div class="modal" :class="stat.type">
        <div class="scan-line"></div>
        <h3>{{ stat.title }}</h3>
        <p>{{ stat.message }}</p>
        <button class="modal-btn" @click="closeModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeUnmount, reactive, ref } from 'vue';
import { loginByUsername } from '../network/login';
import { getMenuTree } from '../network/menu';
import { addMenusToRouter } from '../router/routerUtils';
import { useMenuStore } from '../store/menu';
import { useRouter } from 'vue-router';
import { sendEamilCode, sendPhoneCode } from '../network/common';
export default {
  name: "Login",
  setup() {
    let timer = null
    const router = useRouter()
    const stat = reactive({
      mode: "username", // username / phone / email
      username: "",
      password: "",
      phone: "",
      email: "",
      code: "",
      countdown: 0,
      visible: false,
      type: "success"
    })    
    const showSuccess = (title,msg) => {
      stat.type = 'success'
      stat.title = title
      stat.message = msg
      stat.visible = true
    }

    const showError = (title,msg) => {
      stat.type = 'error'
      stat.title = title
      stat.message = msg
      stat.visible = true
    }

    const closeModal = () => {
      stat.visible = false
    }
    const login = async ()=> {
      let account;
      //用户名、手机、邮箱登录
      if(stat.mode === 'username') {
        //用户名密码登录
        account=stat.username;
        loginByUsername(account,stat.password).then(res=>{
          // 登录成功
          if(res.flag === true){
            localStorage.setItem('Token',res.data)
            const menuStore = useMenuStore()
            // 获取菜单并持久化
            menuStore.loadMenu()
            // getMenuTree().then(res=>{
            //   addMenusToRouter(res.data)
            // })
            setTimeout(() => {
              router.push({path:'/home'})
            }, 1000);
          }else{
            //登陆失败
            showError('登录失败',res.message)
          }
        })
      }else if(stat.mode==='phone') {
        //手机验证码登录
        account=stat.phone;
      }else {
        //邮箱登录
        account=stat.email;
      }
      // 后端登录逻辑在这里处理
    }
    const sendCode = ()=> {
      if (stat.countdown > 0) return;
      let account = stat.mode ==='phone'?stat.phone:stat.email;
      if (account === '' || account == null){
          showError('发送失败',stat.mode ==='phone'?'手机号不能为空!':'邮箱不能为空!')
          return;
        }
      if (stat.mode ==='phone'){
        //发送手机验证码
        sendPhoneCode(account).then(res=>{
          if(res.flag === true){            
            showSuccess('发送成功','验证码发送成功,五分钟内有效!')
          }else{
            showError('发送失败',res.message)
          }
        })
      }else{
        //发送邮箱验证码
        sendEamilCode(account).then(res=>{
          if(res.flag === true){
            showSuccess('发送成功','验证码发送成功,五分钟内有效!')
          }else{
            showError('发送失败',res.message)
          }
        })
      }
      stat.countdown = 60;
      timer = setInterval(() => {
        if (stat.countdown > 0) stat.countdown--;
        else clearInterval(timer);
      }, 1000);
    }
    const lineStyle = (n)=> {
      const top = Math.random()*100+'%';
      const left = Math.random()*100+'%';
      const width = (1+Math.random()*2)+'px';
      const height = (20+Math.random()*50)+'px';
      const delay = Math.random()*5+'s';
      return {
        top, left, width, height, animationDelay: delay
      }
    }
    onBeforeUnmount(()=>{
      clearInterval(timer);
    })
    return {
      stat,
      showError,
      showSuccess,
      closeModal,
      login,
      sendCode,
      lineStyle,
    }
  }
}
</script>

<style scoped>
@import '../assets/css/login.css';
/* 页面背景 */
.login-page {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0f0f1f;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 登录卡片 */
.login-card {
  position: relative;
  z-index: 10;
  background: rgba(15,15,31,0.8);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 40px 30px;
  width: 400px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,255,255,0.3);
  color: #0ff;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,100%{transform: translateY(0);}
  50%{transform: translateY(-12px);}
}

.login-card h2 {
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: bold;
  color: #0ff;
}

/* 登录方式切换 */
.tab-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.tab-switch button {
  flex: 1;
  margin: 0 5px;
  padding: 8px 0;
  border: 1px solid #0ff;
  border-radius: 30px;
  background: transparent;
  color: #0ff;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.tab-switch button.active {
  background: #0ff;
  color: #0f0f1f;
  box-shadow: 0 5px 15px #0ff;
}

/* 输入框 */
.input-group {
  position: relative;
  margin-bottom: 25px;
}

.input-group input {
  width: 100%;
  padding: 10px 10px 10px 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid rgba(0,255,255,0.5);
  color: #0ff;
  font-size: 16px;
  outline: none;
}

.input-group label {
  position: absolute;
  top: 10px;
  left: 0;
  color: rgba(0,255,255,0.6);
  pointer-events: none;
  transition: 0.3s;
}

.input-group input:focus ~ label,
.input-group input:not(:placeholder-shown) ~ label {
  top: -15px;
  font-size: 12px;
  color: #0ff;
  font-weight: bold;
}

.input-group input:focus {
  border-bottom: 2px solid #0ff;
}

/* 验证码按钮 */
.code-group {
  display: flex;
  align-items: center;
}

.code-group input { flex:1; }

.send-code {
  margin-left: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 30px;
  background: #0ff;
  color: #0f0f1f;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.send-code:disabled {
  background: rgba(0,255,255,0.3);
  cursor: not-allowed;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 50px;
  background: linear-gradient(45deg, #0ff, #0ff7);
  color: #0f0f1f;
  font-size: 18px;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 5px 15px rgba(0,255,255,0.3);
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,255,255,0.5);
}

/* 背景科技线条 */
.background-lines span {
  position: absolute;
  display: block;
  background: #0ff;
  opacity: 0.2;
  animation: float-line 5s linear infinite;
}

@keyframes float-line {
  0% { transform: translateY(0); }
  50% { transform: translateY(-50px); }
  100% { transform: translateY(0); }
}
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

/* ===== 弹窗主体 ===== */
.modal {
  position: relative;
  width: 320px;
  padding: 30px;
  border-radius: 18px;
  background: rgba(15,15,31,.95);
  text-align: center;
  transform: scale(.85);
  animation: pop .3s ease forwards;
  overflow: hidden;
}

@keyframes pop {
  to { transform: scale(1); }
}

/* ===== 成功 / 失败样式 ===== */
.modal.success {
  color: #0ff;
  border: 1px solid #0ff;
  box-shadow: 0 0 30px rgba(0,255,255,.6);
}

.modal.error {
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
  box-shadow: 0 0 30px rgba(255,77,79,.6);
}

/* ===== 扫描线 ===== */
.scan-line {
  position: absolute;
  left: -20%;
  top: 0;
  width: 140%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    currentColor,
    transparent
  );
  animation: scan 2s linear infinite;
}

@keyframes scan {
  from { transform: translateY(-20px); }
  to   { transform: translateY(260px); }
}

.modal-btn {
  margin-top: 20px;
  padding: 8px 24px;
  border-radius: 30px;
  border: none;
  color: #0f0f1f;
  font-weight: bold;
  cursor: pointer;
}
@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
</style>
