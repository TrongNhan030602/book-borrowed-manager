<template>
  <div class="container mt-5">
    <h2 class="mb-4">List of Readers</h2>
    <div class="text-right mb-4 mt-0">
      <input type="text" class="form-control" placeholder="Search by name or address" v-model="searchKeyword" @input="searchReaders">
    </div>
    <div class="text-right mb-4 mt-0">
      <!-- Dropdown for selecting the field to sort -->
      <label class="pr-2">Sort by:</label>
      <select v-model="sortKey">
        <option value="name">Name</option>
        <option value="gender">Gender</option>
        <option value="birthDate">Birth Date</option>
        <option value="phoneNumber">Phone</option>
        <option value="address">Address</option>
      </select>
      <!-- Button to toggle sort direction -->
      <button class="btn btn-sm btn-secondary ml-2" @click="toggleSortOrder">{{ sortDirIcon }}</button>
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
          <!-- Loop through filtered and sorted readers -->
          <tr v-for="(reader, index) in filteredAndSortedReaders" :key="reader.id">
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
          <!-- Display message when no readers are available -->
          <tr v-if="filteredAndSortedReaders.length === 0">
            <td colspan="7" class="text-center">No reader available</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-right mb-4 mt-0">
      <!-- Button to add a new reader -->
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
      searchKeyword: '',
      sortKey: 'name', // Default sort key
      sortDir: 1 // Default sort direction
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
    },
    toggleSortOrder() {
      // Toggle between ascending (1) and descending (-1) order
      this.sortDir = this.sortDir === 1 ? -1 : 1;
      // Sort readers when toggling order
      this.sortReaders();
    },
    sortReaders() {
      // Get the sort key and direction
      const key = this.sortKey;
      const dir = this.sortDir;
      // Sort readers array based on the specified key and direction
      this.readers.sort((a, b) => {
        let valueA = a[key];
        let valueB = b[key];
        // Convert birth date string to Date object for comparison
        if (key === 'birthDate') {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }
        // Determine sorting order based on direction
        return dir * (valueA < valueB ? -1 : (valueA > valueB ? 1 : 0));
      });
    }
  },
  computed: {
    filteredAndSortedReaders() {
      // Filter readers based on search keyword
      const keyword = this.searchKeyword.trim().toLowerCase();
      const filteredReaders = keyword ? this.readers.filter(reader => {
        return reader.name.toLowerCase().includes(keyword) || reader.address.toLowerCase().includes(keyword);
      }) : this.readers;
      // Sort filtered readers based on sort key and direction
      const sortedReaders = filteredReaders.slice().sort((a, b) => {
        let valueA = a[this.sortKey];
        let valueB = b[this.sortKey];
        // Convert birth date string to Date object for comparison
        if (this.sortKey === 'birthDate') {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }
        // Determine sorting order based on direction
        return this.sortDir * (valueA < valueB ? -1 : (valueA > valueB ? 1 : 0));
      });
      return sortedReaders;
    },
    sortDirIcon() {
      // Display up arrow (▲) for ascending order and down arrow (▼) for descending order
      return this.sortDir === 1 ? '▲' : '▼';
    }
  },
  mounted() {
    // Fetch readers when the component is mounted
    this.fetchReaders();
  }
};
</script>

<style scoped>
@import "../../assets/table.css";
</style>
