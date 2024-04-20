<template>
  <div>
    <div class="row p-4">
      <div class="col-md-12 mb-4">
        <!-- Form tìm kiếm -->
        <form @submit.prevent="searchBooks">
          <div class="input-group">
            <input type="text" v-model="searchKeyword" class="form-control" placeholder="Nhập từ khóa...">
            <div class="input-group-append">
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-search"></i> Tìm kiếm
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Hiển thị sách -->
      <div v-if="filteredBooks.length === 0" class="col-md-12">
        <p class="text-center">Không tìm thấy cuốn sách nào phù hợp.</p>
      </div>
      <div v-else v-for="(book, index) in filteredBooks" :key="book.id" :class="cardClass" class="mb-4">
        <div class="card custom-card mb-3">
          <div class="row  book__content">
            <div class="col-md-4">
              <img :src="book.imageUrl" class="card-img" alt="Book Cover">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">{{ book.name }}</h5>
                <p class="card-text"><strong>Tác giả:</strong> {{ book.originOrAuthor }}</p>
                <p class="card-text"><strong>Nhà xuất bản:</strong> {{ book.publisherName }}</p>
                <p class="card-text"><strong>Giá:</strong> {{ formatPrice(book.price) }}</p>
                <p class="card-text"><strong>Năm xuất bản:</strong> {{ formatDate(book.publicationYear) }}</p>
                <button v-if="!book.borrowed" @click="BorrowBook(book._id, book.name,book.imageUrl)" class="btn btn-primary">
                  <i class="fas fa-book-reader"></i> Mượn sách
                </button>
                <h5 v-else class="text-success">Đã mượn</h5>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookService from '@/services/book.service';
import BorrowService from '@/services/borrow.service';
import { format } from 'date-fns';

export default {
  data() {
    return {
      books: [],
      searchKeyword: ''
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
      return format(new Date(date), 'yyyy');
    },
    async fetchBooks() {
      try {
        const books = await BookService.getAll();
        this.books = books;
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    },

    async BorrowBook(bookId, bookName, imageUrl) {
      try {
        // Lấy userId từ Local Storage
        const userId = localStorage.getItem('userId');
        const readerName = localStorage.getItem('username'); // Lấy tên người mượn từ Local Storage
        if (!userId || !readerName) {
          throw new Error('User ID or reader name not found in localStorage');
        }

        // Gọi BorrowService để mượn sách
        await BorrowService.create({
          readerId: userId,
          bookId: bookId,
          bookUrl: imageUrl,
          borrowDate: new Date(), // Thời gian mượn sách là thời điểm hiện tại
          bookName: bookName,
          readerName: readerName,
          status: 'borrowed' // Trạng thái mượn sách
        });

        // Thực hiện làm mới danh sách sách sau khi mượn sách thành công
        await this.fetchBooks();
        console.log('Đã mượn sách thành công');
        alert(`Bạn đã mượn sách '${bookName}' thành công!`);

        // Đánh dấu sách đã mượn
        const bookIndex = this.books.findIndex(book => book._id === bookId);
        if (bookIndex !== -1) {
          this.books[bookIndex].borrowed = true;
        }

      } catch (error) {
        console.error('Bạn cần trả sách này để tiếp tục !', error);
        alert('Bạn đã mượn sách này trước đó !');
      }
    },


    async searchBooks() {
      try {
        if (!this.searchKeyword.trim()) {
          await this.fetchBooks();
          return;
        }

        const filteredBooks = this.books.filter(book => {
          return (
            book.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
            book.originOrAuthor.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
            this.formatDate(book.publicationYear).toLowerCase().includes(this.searchKeyword.toLowerCase())
          );
        });

        this.books = filteredBooks;
      } catch (error) {
        console.error('Error searching books:', error);
      }
    },

  },
  computed: {
    filteredBooks() {
      return this.books.filter(book => {
        return (
          book.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
          book.originOrAuthor.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
          this.formatDate(book.publicationYear).toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
      });
    },
    cardClass() {
      const numCols = this.filteredBooks.length >= 3 ? 4 : 12 / this.filteredBooks.length;
      return `col-md-${numCols} mb-4`;
    }
  },
  mounted() {
    this.fetchBooks();
  }
};
</script>

<style scoped>
@import "../../assets/css/card.css"

</style>
