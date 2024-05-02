<template>
  <div class="container mt-5">
    <h2 class="mb-4">List of Books</h2>
    <div class="text-right mb-4 mt-0">
      <input type="text" class="form-control" placeholder="Search by name, author, or publication year" v-model="searchKeyword" @input="searchBooks">
    </div>
    <div class="text-right mb-4 mt-0">
      <label class="pr-2">Sort by:</label>
      <select v-model="sortKey">
        <option value="name">Book Name</option>
        <option value="originOrAuthor">Author</option>
        <option value="quantity">Quantity</option>
        <option value="publicationYear">Publication Year</option>
      </select>
      <button class="btn btn-sm btn-secondary ml-2" @click="toggleSortOrder">{{ sortDirIcon }}</button>
    </div>
    <div class="table-responsive">
      <table class="table table-striped custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Book Name</th>
            <th>Author</th>
            <th>Quantity</th>
            <th>Publication Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in filteredAndSortedBooks" :key="book.id">
            <td>{{ index + 1 }}</td>
            <td>{{ book.name }}</td>
            <td>{{ book.originOrAuthor }}</td>
            <td>{{ book.quantity }}</td>
            <td>{{ formatDate(book.publicationYear) }}</td>
            <td>
              <button class="btn btn-sm btn-info" @click="editBook(book)">Edit</button>
              <button class="btn btn-sm btn-danger ml-1" @click="deleteBook(book._id)">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredAndSortedBooks.length === 0">
            <td colspan="6" class="text-center">No book available</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-right mb-4 mt-0">
      <button class="btn btn-primary" @click="goAddBook"><i class="fa-solid fa-plus"></i> Add</button>
    </div>
  </div>
</template>

<script>
import BookService from '@/services/book.service';
import { format } from 'date-fns';

export default {
  data() {
    return {
      books: [],
      searchKeyword: '',
      sortKey: 'name',
      sortDir: 1
    };
  },
  methods: {
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
        this.sortBooks(); // Sort books after fetching
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    },
    async deleteBook(id) {
      if (confirm("Are you sure you want to delete this book?")) {
        try {
          await BookService.delete(id);
          await this.fetchBooks(); // Refetch books after deletion
        } catch (error) {
          console.error('Error deleting book:', error);
        }     
      }
    },
    editBook(book) {
      this.$router.push({
        name: "book.edit",
        params: {
          id: book._id
        }
      });
    },
    goAddBook() {
      this.$router.push({
        name: "book.add",
      });
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
    toggleSortOrder() {
      this.sortDir = this.sortDir === 1 ? -1 : 1;
      this.sortBooks(); // Sort books when toggling order
    },
    sortBooks() {
      const key = this.sortKey;
      const dir = this.sortDir;
      this.books.sort((a, b) => {
        let valueA = a[key];
        let valueB = b[key];
        // If sorting by 'publicationYear', parse as integers for numeric comparison
        if (key === 'publicationYear') {
          valueA = parseInt(valueA);
          valueB = parseInt(valueB);
        }
        // Sort based on field value and direction
        return dir * (valueA < valueB ? -1 : (valueA > valueB ? 1 : 0));
      });
    }
  },
  computed: {
    filteredAndSortedBooks() {
      const filteredBooks = this.books.filter(book => {
        return (
          book.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
          book.originOrAuthor.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
          this.formatDate(book.publicationYear).toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
      });
      // Use slice to create a copy of the filtered and sorted array
      return filteredBooks.slice().sort((a, b) => {
        let valueA = a[this.sortKey];
        let valueB = b[this.sortKey];
        // If sorting by 'publicationYear', parse as integers for numeric comparison
        if (this.sortKey === 'publicationYear') {
          valueA = parseInt(valueA);
          valueB = parseInt(valueB);
        }
        // Sort based on field value and direction
        return this.sortDir * (valueA < valueB ? -1 : (valueA > valueB ? 1 : 0));
      });
    },
    sortDirIcon() {
      return this.sortDir === 1 ? '▲' : '▼';
    }
  },
  mounted() {
    this.fetchBooks();
  }
};
</script>

<style scoped>
@import "../../assets/table.css";
</style>
