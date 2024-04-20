<template>
  <div class="container mt-5">
    <h2 class="mb-4">List of Borrowing</h2>
    <div class="text-right mb-4 mt-0">
      <input type="text" class="form-control" placeholder="Search by reader name or book name" v-model="searchKeyword" @input="searchBorrows">
    </div>
    <div class="table-responsive">
      <table class="table table-striped custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Reader Name</th>
            <th>Book Name</th>
            <th>BorrowDate</th>
            <th>Status</th>
            <th>Return Date </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(borrow, index) in filteredBorrows" :key="borrow.id">
            <td>{{ index + 1 }}</td>
            <td>{{ borrow.readerName }}</td>
            <td>{{ borrow.bookName }}</td>
            <td>{{ formatDate(borrow.borrowDate) }}</td>
            <td>{{ borrow.status }}</td>
            <td>{{ formatDate(borrow.returnDate) }}</td>
            <td>
              <button class="btn btn-sm btn-info" @click="editBorrow(borrow)">Edit</button>
              <button class="btn btn-sm btn-danger ml-1" @click="deleteBorrow(borrow._id)">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredBorrows.length === 0">
            <td colspan="7" class="text-center">No borrowing available</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import BorrowService from '@/services/borrow.service';
import { format } from 'date-fns';

export default {
  data() {
    return {
      borrows: [],
      searchKeyword: ''
    };
  },
  methods: {
    formatDate(date) {
      // Check if the date is valid
      if (!date || isNaN(new Date(date).getTime())) {
        return ''; // Return an empty string if the date is invalid or null
      }

      // Format the valid date
      return format(new Date(date), 'dd/MM/yyyy');
    },
    async fetchBorrows() {
      try {
        const borrows = await BorrowService.getAll();
        this.borrows = borrows;
      } catch (error) {
        console.error('Error fetching borrows:', error);
      }
    },
    async deleteBorrow(id) {
      if (confirm("Are you sure you want to delete this borrowing?")) {
        try {
          await BorrowService.delete(id);
          // After deletion, update the list of borrows
          await this.fetchBorrows();
        } catch (error) {
          console.error('Error deleting borrow:', error);
        }
      }
    },
    editBorrow(borrow) {
      // Navigate or display the borrow edit form
      this.$router.push({
        name: "borrow.edit",
        params: {
          id: borrow._id
        }
      });
    },
    async searchBorrows() {
      try {
        if (!this.searchKeyword.trim()) {
          await this.fetchBorrows();
          return;
        }

        const filteredBorrows = this.borrows.filter(borrow => {
          return (
            borrow.readerName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
            borrow.bookName.toLowerCase().includes(this.searchKeyword.toLowerCase())
          );
        });

        this.borrows = filteredBorrows;
      } catch (error) {
        console.error('Error searching borrows:', error);
      }
    }
  },
  computed: {
    filteredBorrows() {
      return this.borrows.filter(borrow => {
        return (
          borrow.readerName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
          borrow.bookName.toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
      });
    }
  },
  mounted() {
    // When the component is mounted, fetch the list of borrows
    this.fetchBorrows();
  }
};
</script>

<style scoped>
@import "../../assets/table.css";
</style>
