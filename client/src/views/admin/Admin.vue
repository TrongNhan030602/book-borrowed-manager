<template>
  <div class="container mt-5">
    <h2 class="mb-4">List of Admin</h2>
    <div class="text-right mb-4 mt-0">
      <input type="text" class="form-control" placeholder="Search by name or address" v-model="searchKeyword" @input="searchAdmin">
    </div>
    <div class="text-right mb-4 mt-0">
      <!-- Dropdown for selecting the field to sort -->
      <label class="pr-2">Sort by:</label>
      <select v-model="sortKey">
        <option value="name">Name</option>
        <option value="phoneNumber">Phone</option>
        <option value="address">Address</option>
        <option value="position">Position</option>
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
            <th>Phone</th>
            <th>Address</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loop through filtered and sorted admins -->
          <tr v-for="(admin, index) in filteredAndSortedAdmin" :key="admin.id">
            <td>{{ index + 1 }}</td>
            <td>{{ admin.name }}</td>
            <td>{{ admin.phoneNumber }}</td>
            <td>{{ admin.address }}</td>
            <td>{{ admin.position }}</td>
            <td>
              <button class="btn btn-sm btn-info" @click="editAdmin(admin)">Edit</button>
              <button class="btn btn-sm btn-danger ml-1" @click="deleteAdmin(admin._id)">Delete</button>
            </td>
          </tr>
          <!-- Display message when no admins are available -->
          <tr v-if="filteredAndSortedAdmin.length === 0">
            <td colspan="6" class="text-center">No admin available</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-right mb-4 mt-0">
      <!-- Button to add a new admin -->
      <button class="btn btn-primary" @click="goAddAdmin"><i class="fa-solid fa-plus"></i> Add</button>
    </div>
  </div>
</template>

<script>
import AdminService from '@/services/admin.service';
import { format } from 'date-fns';

export default {
  data() {
    return {
      admin: [],
      searchKeyword: '',
      sortKey: 'name', // Default sort key
      sortDir: 1 // Default sort direction
    };
  },
  methods: {
    async fetchAdmin() {
      try {
        const admin = await AdminService.getAll();
        this.admin = admin;
      } catch (error) {
        console.error('Error fetching admin:', error);
      }
    },
    async deleteAdmin(id) {
      if (confirm("Are you sure you want to delete this admin?")) {
        try {
          await AdminService.delete(id);
          // After deleting, update the admin list
          await this.fetchAdmin();
        } catch (error) {
          console.error('Error deleting admin:', error);
        }
      }
    },
    editAdmin(admin) {
      // Navigate or display the edit admin form
      this.$router.push({
        name: "admin.edit",
        params: {
          id: admin._id
        }
      });
    },
    goAddAdmin() {
      // Navigate to the add admin form
      this.$router.push({
        name: "admin.add",
      });
    },
    searchAdmin() {
      const keyword = this.searchKeyword.trim().toLowerCase();
      if (!keyword) {
        return this.admin;
      }
      this.filteredAdmin = this.admin.filter(admin => {
        return admin.name.toLowerCase().includes(keyword) || admin.address.toLowerCase().includes(keyword);
      });
    },
    toggleSortOrder() {
      // Toggle between ascending (1) and descending (-1) order
      this.sortDir = this.sortDir === 1 ? -1 : 1;
      // Sort admins when toggling order
      this.sortAdmin();
    },
    sortAdmin() {
      // Get the sort key and direction
      const key = this.sortKey;
      const dir = this.sortDir;
      // Sort admins array based on the specified key and direction
      this.admin.sort((a, b) => {
        let valueA = a[key];
        let valueB = b[key];
        // Determine sorting order based on direction
        return dir * (valueA < valueB ? -1 : (valueA > valueB ? 1 : 0));
      });
    }
  },
  computed: {
    filteredAndSortedAdmin() {
      // Sort admins based on sort key and direction
      const sortedAdmin = this.admin.slice().sort((a, b) => {
        let valueA = a[this.sortKey];
        let valueB = b[this.sortKey];
        // Determine sorting order based on direction
        return this.sortDir * (valueA < valueB ? -1 : (valueA > valueB ? 1 : 0));
      });
      // Filter admins based on search keyword
      const keyword = this.searchKeyword.trim().toLowerCase();
      return keyword ? sortedAdmin.filter(admin => {
        return admin.name.toLowerCase().includes(keyword) || admin.address.toLowerCase().includes(keyword);
      }) : sortedAdmin;
    },
    sortDirIcon() {
      // Display up arrow (▲) for ascending order and down arrow (▼) for descending order
      return this.sortDir === 1 ? '▲' : '▼';
    }
  },
  mounted() {
    // Fetch admins when the component is mounted
    this.fetchAdmin();
  }
};
</script>

<style scoped>
@import "../../assets/table.css";
</style>
