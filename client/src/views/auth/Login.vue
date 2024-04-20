<template>
  <div class="login-form">
    <form class="form-content" @submit.prevent="login">
      <h1 class="form-heading">Login</h1>
      <label for="name">UserName</label>
      <input type="text" id="name" v-model="loginUsername">
      <label for="password">Password</label>
      <input type="password" id="password" v-model="loginPassword">
      <label for="role">Role</label>
      <select id="role" v-model="loginRole" class="role-select">
        <option value="admin">Admin</option>
        <option value="reader">Reader</option>
      </select>
      <button class="btn-submit">Submit</button>
    </form>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import router from "@/router";

export default {
  data() {
    return {
      loginUsername: '',
      loginPassword: '',
      loginRole: 'admin' // Mặc định chọn vai trò admin
    };
  },
  created() {
    this.checkLoginStatus(); // Kiểm tra trạng thái đăng nhập khi trang được tải
  },
  methods: {
    async login() {
  try {
    const authService = new AuthService();

    const response = await authService.login({
      name: this.loginUsername,
      password: this.loginPassword,
      role: this.loginRole // Truyền vai trò được chọn khi đăng nhập
    });

    // Kiểm tra phản hồi từ máy chủ
    if (response.message === "Login successful") {
      console.log('Đăng nhập thành công');

      // Lưu thông tin đăng nhập vào Local Storage
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('userId', response.userId); // Lưu ID của người dùng
      localStorage.setItem('username', response.name); // Lưu Tên của người dùng

      // Cập nhật biến loggedIn sang true
      this.$parent.loggedIn = true;

      // Chuyển hướng người dùng đến trang mong muốn sau khi đăng nhập thành công
      if (response.role === "admin") {
        router.push({ name: 'book' });
      } else {
        router.push({ name: 'borrow.book' });
      }
    } else {
      alert('Đăng nhập không thành công.');
    }
  } catch (error) {
    console.error('Đã xảy ra lỗi khi gửi yêu cầu đăng nhập:', error);
    alert('Đã xảy ra lỗi khi gửi yêu cầu đăng nhập. Vui lòng thử lại sau.');
  }
},

    async checkLoginStatus() {
      const isLoggedIn = localStorage.getItem('loggedIn');
      if (isLoggedIn === 'true') {
        // Nếu người dùng đã đăng nhập, chuyển hướng người dùng đến trang /books
        localStorage.setItem('loggedIn', 'true');
        
      }
    },
    async checkAdmin() {
      try {
        const authService = new AuthService();
        const { isLoggedIn, isAdmin } = await authService.checkAdmin();
        this.isAdmin = isLoggedIn && isAdmin; // Gán giá trị isAdmin từ kết quả trả về
      } catch (error) {
        console.error(error);
        // Xử lý lỗi nếu cần thiết
      }
    },
  }
}
</script>


<style scoped>
@import "../../assets/css/login.css";

.role-select {
  background: rgba(255, 255, 255, 0.3);
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  padding: 10px 20px;
  border: none;
  margin-bottom: 20px;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.role-select option {
  color: wheat;
  padding: 10px 0;
  background-color: #878a97;
  cursor: pointer;
  font-size: 16px;
}
</style>
