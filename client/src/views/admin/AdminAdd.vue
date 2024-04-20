<template>
  <div
    v-if="admin"
    class="page"
  >
    <h4 class="text-center">Thêm Admin</h4>
    <AdminForm
      :admin="admin"
      @submit:admin="createAdmin"
    />
    <p class="text-center mt-2 text-info">{{ message }}</p>
  </div>
</template>

<script>
import AdminForm from "@/components/admin/AdminForm.vue";
import AdminService from "@/services/admin.service";
export default {
  components: {
    AdminForm,
  },
  data() {
    return {
      admin: {},
      message: "",
    };
  },
  methods: {
    async createAdmin(data) {
      try {
        await AdminService.create(data);
        this.message = "Admin được thêm thành công.";
      } catch (error) {
        console.log(error);
        this.$router.push({
          name: "notfound",
          params: {
            pathMatch: this.$route.path.split("/").slice(1),
          },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },
  },
  created() {
    this.message = "";
  },
};
</script>
