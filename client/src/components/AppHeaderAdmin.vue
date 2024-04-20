<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark navbar-custom">
        <!-- Brand/logo -->
        <router-link to="/" class="navbar-brand">Quản lý mượn sách</router-link>

        <!-- Navbar collapse button -->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar links -->
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mr-auto">
                <!-- Liên kết đến quản lý sách -->
                <li class="nav-item">
                    <router-link to="/books" class="nav-link" :class="{ active: $route.path === '/books' }">
                        <i class="fa-solid fa-book"></i> Sách
                    </router-link>
                </li>
                <!-- Liên kết đến trang mượn sách -->
                <li class="nav-item">
                    <router-link to="/borrows" class="nav-link" :class="{ active: $route.path === '/borrows' }">
                        <i class="fas fa-book-reader"></i> Mượn sách
                    </router-link>
                </li>

                <!-- Liên kết đến trang độc giả -->
                <li class="nav-item">
                    <router-link to="/readers" class="nav-link" :class="{ active: $route.path === '/readers' }">
                        <i class="fas fa-users"></i> Độc giả
                    </router-link>
                </li>
                <!-- Liên kết đến trang nhà xuất bản -->
                <li class="nav-item">
                    <router-link to="/publishers" class="nav-link" :class="{ active: $route.path === '/publishers' }">
                        <i class="fas fa-building"></i> Nhà xuất bản
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin" class="nav-link" :class="{ active: $route.path === '/admin' }">
                        <i class="fas fa-user-cog"></i>
                        Nhân viên
                    </router-link>
                </li>
            </ul>

            <!-- Đăng nhập/Đăng xuất -->
            <div class="navbar-nav">
                <template v-if="isLoggedIn">
                    <button class="btn btn-outline-light" @click="logout"><i class="fas fa-sign-out-alt"></i> Đăng
                        xuất</button>
                </template>
                <template v-else>
                    <router-link to="/" class="nav-link"><i class="fas fa-sign-in-alt"></i> Đăng nhập</router-link>
                </template>
            </div>
        </div>
    </nav>
</template>

<script>
import AuthService from "@/services/auth.service";
import router from "@/router";

export default {
    data() {
        return {
            isLoggedIn: false,
        }
    },
    created() {
        this.checkLoginStatus(); // Kiểm tra thông tin đăng nhập khi trang được tải
    },

    methods: {
        async logout() {
            try {
                const authService = new AuthService();
                await authService.logout();
                localStorage.setItem('loggedIn',false); // Xóa thông tin đăng nhập khỏi Local Storage
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                this.updateLoginStatus(false); // Cập nhật trạng thái đăng nhập
                router.push('/');
            } catch (error) {
                console.error(error);
                alert('Đã xảy ra lỗi khi đăng xuất:', error);
                // Xử lý lỗi nếu cần thiết
            }
        },
        async checkLoginStatus() {

            const isLoggedIn = localStorage.getItem('loggedIn');
            this.updateLoginStatus(isLoggedIn === 'true'); // Cập nhật trạng thái đăng nhập
        },
        updateLoginStatus(status) {
            this.isLoggedIn = status;
        },

    },
    computed: {
      
    }
}

</script>

<style scoped>
/* Tùy chỉnh CSS cho header */
.navbar-brand {
    font-weight: bold;
}

.navbar-nav .nav-link {
    padding-right: 1rem;
}

.navbar-custom {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    height: 64px;
}

/* Hiệu ứng highlight */
.nav-item .active {
    background-color: rgba(243, 209, 75, 0.2);
    border-radius: 4px;
    /* Bo góc */
}
</style>
