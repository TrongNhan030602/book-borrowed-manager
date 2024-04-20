<template>
  <div class="container mt-5">
    <h2 class="mb-4">List of Publishers</h2>
    <div class="text-right mb-4 mt-0">
      <input type="text" class="form-control" placeholder="Search by name or address" v-model="searchKeyword" @input="searchPublishers">
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
          <tr v-for="(publisher, index) in filteredPublishers" :key="publisher.id">
            <td>{{ index + 1 }}</td>
            <td>{{ publisher.name }}</td>
            <td>{{ publisher.address }}</td>
            <td>
              <button class="btn btn-sm btn-info" @click="editPublisher(publisher)">Edit</button>
              <button class="btn btn-sm btn-danger ml-1" @click="deletePublisher(publisher._id)">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredPublishers.length === 0">
            <td colspan="4" class="text-center">No publishers available</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-right mb-4 mt-0">
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
      searchKeyword: ''
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
    }
  },
  computed: {
    filteredPublishers() {
      const keyword = this.searchKeyword.trim().toLowerCase();
      if (!keyword) {
        return this.publishers;
      }
      return this.publishers.filter(publisher => {
        return publisher.name.toLowerCase().includes(keyword) || publisher.address.toLowerCase().includes(keyword);
      });
    }
  },
  mounted() {
    // When the component is mounted, fetch the publisher list
    this.fetchPublishers();
  }
};
</script>

<style scoped>
@import "../../assets/table.css";
</style>
