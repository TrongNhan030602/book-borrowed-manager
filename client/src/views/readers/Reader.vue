<template>
  <div class="container mt-5">
    <h2 class="mb-4">List of Readers</h2>
    <div class="text-right mb-4 mt-0">
      <input type="text" class="form-control" placeholder="Search by name or address" v-model="searchKeyword" @input="searchReaders">
    </div>
    <div class="table-responsive">
      <table class="table table-striped custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Birth Date</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reader, index) in filteredReaders" :key="reader.id">
            <td>{{ index + 1 }}</td>
            <td>{{ reader.name }}</td>
            <td>{{ reader.gender }}</td>
            <td>{{ formatDate(reader.birthDate) }}</td>
            <td>{{ reader.phoneNumber }}</td>
            <td>{{ reader.address }}</td>
            <td>
              <button class="btn btn-sm btn-info" @click="editReader(reader)">Edit</button>
              <button class="btn btn-sm btn-danger ml-1" @click="deleteReader(reader._id)">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredReaders.length === 0">
            <td colspan="8" class="text-center">No reader available</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-right mb-4 mt-0">
      <button class="btn btn-primary" @click="goAddReader"><i class="fa-solid fa-plus"></i> Add</button>
    </div>
  </div>
</template>

<script>
import ReaderService from '@/services/reader.service';
import { format } from 'date-fns';

export default {
  data() {
    return {
      readers: [],
      searchKeyword: ''
    };
  },
  methods: {
    formatDate(date) {
      if (!date || isNaN(new Date(date).getTime())) {
        return '';
      }
      return format(new Date(date), 'dd/MM/yyyy');
    },
    async fetchReaders() {
      try {
        const readers = await ReaderService.getAll();
        this.readers = readers;
      } catch (error) {
        console.error('Error fetching readers:', error);
      }
    },
    async deleteReader(id) {
      if (confirm("Are you sure you want to delete this reader?")) {
        try {
          await ReaderService.delete(id);
          await this.fetchReaders();
        } catch (error) {
          console.error('Error deleting reader:', error);
        }
      }
    },
    editReader(reader) {
      this.$router.push({
        name: "reader.edit",
        params: {
          id: reader._id
        }
      });
    },
    goAddReader() {
      this.$router.push({
        name: "reader.add",
      });
    },
    searchReaders() {
      const keyword = this.searchKeyword.trim().toLowerCase();
      if (!keyword) {
        return this.readers;
      }
      this.filteredReaders = this.readers.filter(reader => {
        return reader.name.toLowerCase().includes(keyword) || reader.address.toLowerCase().includes(keyword);
      });
    }
  },
  computed: {
    filteredReaders() {
      const keyword = this.searchKeyword.trim().toLowerCase();
      if (!keyword) {
        return this.readers;
      }
      return this.readers.filter(reader => {
        return reader.name.toLowerCase().includes(keyword) || reader.address.toLowerCase().includes(keyword);
      });
    }
  },
  mounted() {
    this.fetchReaders();
  }
};
</script>

<style scoped>
@import "../../assets/table.css";
</style>
