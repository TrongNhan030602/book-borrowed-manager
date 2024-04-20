<template>
  <div
    v-if="admin"
    class="page"
  >
    <h4 class="text-center ">Hiệu chỉnh thông tin Admin</h4>
    <AdminForm
      :admin="admin"
      @submit:admin="updateAdmin"
      @delete:admin="deleteAdmin"
    />
    <p class="text-center mt-2 text-success">{{ message }}</p>
  </div>
</template>

<script>
import AdminForm from "@/components/admin/AdminForm.vue";
import AdminService from "@/services/admin.service";
export default {
  components: {
    AdminForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      admin: null,
      message: "",
    };
  },
  methods: {
    async getAdmin(id) {
      try {
        this.admin = await AdminService.get(id);
      } catch (error) {
        console.log(error);
        // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
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
    async updateAdmin(data) {
      try {
        await AdminService.update(this.admin._id, data);
        this.message = "Thông tin Admin được cập nhật thành công.";
      } catch (error) {
        console.log(error);
      }
    },
    async deleteAdmin() {
      if (confirm("Bạn muốn xóa Admin  này?")) {
        try {
          await AdminService.delete(this.admin._id);
          this.$router.push({ name: "admin" });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getAdmin(this.id);
    this.message = "";
  },
};
</script>
