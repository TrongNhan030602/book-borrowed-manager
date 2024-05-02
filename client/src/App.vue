
<script>
import AppHeaderAdmin from "@/components/AppHeaderAdmin.vue";
import AppHeaderReader from "@/components/AppHeaderReader.vue";
import AppFooter from "@/components/AppFooter.vue";
import AuthService from "@/services/auth.service";

export default {
  components: {
    AppHeaderAdmin,
    AppHeaderReader,
    AppFooter,
  },
  data() {
    return {
      isAdmin: false,
    };
  },
  created() {
    this.checkAdmin(); // Gọi phương thức checkAdmin khi thành phần được tạo
  },
  methods: {
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
  },
};
</script>


<!-- Chọn Template -->
<template>
  <div id="app" className="container-fluid">
    <!-- Sử dụng header khác nhau dựa trên vai trò của người dùng -->
    <component :is="isAdmin ? 'AppHeaderAdmin' : 'AppHeaderReader'" />
    <div className="row app__content mt-3 mb-5">
      <router-view />
    </div>
    <AppFooter />
  </div>
</template>





<style>
.page {
  max-width: 800px;
  margin: auto;
  width: 600px;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app__content {
  flex: 1;
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.app__footer {
  width: 100%;
}
</style>