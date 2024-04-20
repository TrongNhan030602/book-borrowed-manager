<template>
    <div>
        <h2 class="text-center mb-4">Danh sách Sách đã mượn</h2>
        <div v-if="borrowedBooks.length === 0" class="col-md-12">
            <p class="text-center">Bạn chưa mượn cuốn sách nào!!. <router-link to="/borrow-book">Mượn ngay
                    ?</router-link></p>
        </div>
        <div v-else class="card-container">
            <div v-for="(book, index) in borrowedBooks" :key="book.id" class="card custom-card">
                <div class="row book__content">
                    <div class="col-md-4">
                        <img :src="book.bookUrl" class="rounded-start book-image" alt="Book Cover">
                        <p class="mt-1 text-center"><strong>Trạng thái</strong></p>
                        <p class="mt-1 text-center"><strong :class="{ 'red-text': book.status === 'borrowed' }">{{
                            book.status === 'borrowed' ? 'Đang mượn' : 'Đã trả' }}</strong></p>
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">{{ book.bookName }}</h5>
                            <p class="card-text"><strong>Người mượn:</strong> {{ book.readerName }}</p>
                            <p class="card-text"><strong>Ngày mượn:</strong> <span class="text-success">{{
                                formatDate(book.borrowDate) }}</span></p>
                            <!-- Apply CSS class 'red-text' if return date has passed -->
                            <p class="card-text return-date"><strong>Ngày trả:</strong> <span
                                    :class="{ 'red-text': isReturnDatePassed(book.returnDate), 'text-success': !isReturnDatePassed(book.returnDate) }">{{
                                    formatDate(book.returnDate) }}</span></p>
                            <button @click="returnBook(book._id)" class="btn btn-danger">
                                <i class="fas fa-undo-alt"></i> Trả sách
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>





<script>
import BorrowService from '@/services/borrow.service';
import { format } from 'date-fns';

export default {
    data() {
        return {
            borrowedBooks: []
        };
    },
    methods: {
        formatPrice(price) {
            if (price != null && price !== '') {
                return Number(price).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                });
            } else {
                return '';
            }
        },
        formatDate(date) {
            if (!date || isNaN(new Date(date).getTime())) {
                return '';
            }
            return format(new Date(date), 'dd/MM/yyyy');
        },
        // Kiểm tra xem ngày trả đã vượt quá hay chưa
        isReturnDatePassed(returnDate) {
            if (!returnDate || isNaN(new Date(returnDate).getTime())) {
                return false;
            }
            return new Date(returnDate) < new Date();
        },
        async fetchBorrowedBooks() {
            try {
                const borrowedBooks = await BorrowService.getAllBorrowingsByReaderId(localStorage.getItem('userId'));
                this.borrowedBooks = borrowedBooks;
            } catch (error) {
                console.error('Error fetching borrowed books:', error);
            }
        },
        async returnBook(borrowID) {
            try {
                await BorrowService.returnBook(borrowID);
                await this.fetchBorrowedBooks(); // Làm mới danh sách sách đã mượn sau khi trả sách
            } catch (error) {
                console.error('Error returning book:', error);
            }
        },

    },
    mounted() {
        this.fetchBorrowedBooks();
    }
};
</script>


<style scoped>
@import "../../assets/css/borrowed.css";
</style>
