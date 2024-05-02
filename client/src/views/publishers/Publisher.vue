<template>
  <div class="container mt-5">
    <h2 class="mb-4">List of Publishers</h2>
    <div class="text-right mb-4 mt-0">
      <input type="text" class="form-control" placeholder="Search by name or address" v-model="searchKeyword" @input="searchPublishers">
    </div>
    <div class="text-right mb-4 mt-0">
      <!-- Dropdown for selecting the field to sort -->
      <label class="pr-2">Sort by:</label>
      <select v-model="sortKey">
        <option value="name">Name</option>
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
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loop through filtered and sorted publishers -->
          <tr v-for="(publisher, index) in filteredAndSortedPublishers" :key="publisher.id">
            <td>{{ index + 1 }}</td>
            <td>{{ publisher.name }}</td>
            <td>{{ publisher.address }}</td>
            <td>
              <button class="btn btn-sm btn-info" @click="editPublisher(publisher)">Edit</button>
              <button class="btn btn-sm btn-danger ml-1" @click="deletePublisher(publisher._id)">Delete</button>
            </td>
          </tr>
          <!-- Display message when no publishers are available -->
          <tr v-if="filteredAndSortedPublishers.length === 0">
            <td colspan="4" class="text-center">No publishers available</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-right mb-4 mt-0">
      <!-- Button to add a new publisher -->
      <button class="btn btn-primary" @click="goAddPublisher"><i class="fa-solid fa-plus"></i> Add</button>
    </div>
  </div>
</template>

<script>
import PublisherService from '@/services/publisher.service';

export default {
  data() {
    return {
      publishers: [],
      searchKeyword: '',
      sortKey: 'name', // Default sort key
      sortDir: 1 // Default sort direction
    };
  },
  methods: {
    async fetchPublishers() {
      try {
        const publishers = await PublisherService.getAll();
        this.publishers = publishers;
      } catch (error) {
        console.error('Error fetching publishers:', error);
      }
    },
    async deletePublisher(id) {
      if (confirm("Are you sure you want to delete this publisher?")) {
        try {
          await PublisherService.delete(id);
          // After deleting, update the publisher list
          await this.fetchPublishers();
        } catch (error) {
          console.error('Error deleting publisher:', error);
        }     
      }
    },
    editPublisher(publisher) {
      // Navigate or display the edit publisher form
      this.$router.push({
        name: "publisher.edit",
        params: {
          id: publisher._id
        }
      });
    },
    goAddPublisher() {
      // Navigate to the add publisher form
      this.$router.push({
        name: "publisher.add",
      });
    },
    searchPublishers() {
      const keyword = this.searchKeyword.trim().toLowerCase();
      if (!keyword) {
        return this.publishers;
      }
      this.filteredPublishers = this.publishers.filter(publisher => {
        return publisher.name.toLowerCase().includes(keyword) || publisher.address.toLowerCase().includes(keyword);
      });
    },
    toggleSortOrder() {
      // Toggle between ascending (1) and descending (-1) order
      this.sortDir = this.sortDir === 1 ? -1 : 1;
      // Sort publishers when toggling order
      this.sortPublishers();
    },
    sortPublishers() {
      // Get the sort key and direction
      const key = this.sortKey;
      const dir = this.sortDir;
      // Sort publishers array based on the specified key and direction
      this.publishers.sort((a, b) => {
        let valueA = a[key];
        let valueB = b[key];
        // Determine sorting order based on direction
        return dir * (valueA < valueB ? -1 : (valueA > valueB ? 1 : 0));
      });
    }
  },
  computed: {
    filteredAndSortedPublishers() {
      // Sort publishers based on sort key and direction
      const sortedPublishers = this.publishers.slice().sort((a, b) => {
        let valueA = a[this.sortKey];
        let valueB = b[this.sortKey];
        // Determine sorting order based on direction
        return this.sortDir * (valueA < valueB ? -1 : (valueA > valueB ? 1 : 0));
      });
      // Filter publishers based on search keyword
      const keyword = this.searchKeyword.trim().toLowerCase();
      return keyword ? sortedPublishers.filter(publisher => {
        return publisher.name.toLowerCase().includes(keyword) || publisher.address.toLowerCase().includes(keyword);
      }) : sortedPublishers;
    },
    sortDirIcon() {
      // Display up arrow (▲) for ascending order and down arrow (▼) for descending order
      return this.sortDir === 1 ? '▲' : '▼';
    }
  },
  mounted() {
    // Fetch publishers when the component is mounted
    this.fetchPublishers();
  }
};
</script>

<style scoped>
@import "../../assets/table.css";
</style>
