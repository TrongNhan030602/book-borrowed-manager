<template>
  <div class="container mt-5">
    <h2 class="mb-4">List of Admin</h2>
    <div class="text-right mb-4 mt-0">
      <input type="text" class="form-control" placeholder="Search by name or address" v-model="searchKeyword" @input="searchAdmin">
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
          <tr v-for="(admin, index) in filteredAdmin" :key="admin.id">
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
          <tr v-if="filteredAdmin.length === 0">
            <td colspan="6" class="text-center">No admin available</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-right mb-4 mt-0">
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
          await this.fetchAdmin();
        } catch (error) {
          console.error('Error deleting admin:', error);
        }
      }
    },
    editAdmin(admin) {
      this.$router.push({
        name: "admin.edit",
        params: {
          id: admin._id
        }
      });
    },
    goAddAdmin() {
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
    }
  },
  computed: {
    filteredAdmin() {
      const keyword = this.searchKeyword.trim().toLowerCase();
      if (!keyword) {
        return this.admin;
      }
      return this.admin.filter(admin => {
        return admin.name.toLowerCase().includes(keyword) || admin.address.toLowerCase().includes(keyword);
      });
    }
  },
  mounted() {
    this.fetchAdmin();
  }
};
</script>

<style scoped>
@import "../../assets/table.css";
</style>
