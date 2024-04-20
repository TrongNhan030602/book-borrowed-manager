<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark navbar-custom">
        <!-- Brand/logo -->
        <router-link to="/borrow-book" class="navbar-brand">Quản lý mượn sách</router-link>

        <!-- Navbar collapse button -->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar links -->
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mr-auto">
                <!-- Liên kết đến trang mượn sách -->
                <li class="nav-item">
                    <router-link to="/borrow-book" class="nav-link" :class="{ active: $route.path === '/borrow-book' }">
                        <i class="fas fa-book-reader"></i> Mượn sách
                    </router-link>
                </li>

                <!-- Liên kết đến trang độc giả -->
                <li class="nav-item">
                    <router-link to="/borrowed-books" class="nav-link" :class="{ active: $route.path === '/borrowed-books' }">
                        <i class="fa-solid fa-book"></i> Sách đã mượn
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
                localStorage.removeItem('loggedIn'); // Xóa thông tin đăng nhập khỏi Local Storage
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
    z-index: 10;
}

/* Hiệu ứng highlight */
.nav-item .active {
    background-color: rgba(243, 209, 75, 0.2);
    border-radius: 4px;
    /* Bo góc */
}
</style>
