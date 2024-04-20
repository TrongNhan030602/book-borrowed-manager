<template>
  <div
    v-if="borrow"
    class="page"
  >
    <h4 class="text-center">Hiệu chỉnh Borrowing</h4>
    <BorrowForm
      :borrow="borrow"
      @submit:borrow="updateBorrowing"
      @delete:borrow="deleteBorrowing"
    />
    <p class="text-center mt-2 text-success">{{ message }}</p>

  </div>
</template>

<script>
import BorrowForm from "@/components/borrows/BorrowForm.vue";
import BorrowService from "@/services/borrow.service";
export default {
  components: {
    BorrowForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      borrow: null,
      message: "",
    };
  },
  methods: {
    async getBorrowing(id) {
      try {
        this.borrow = await BorrowService.get(id);
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
    async updateBorrowing(data) {
      try {
        await BorrowService.update(this.borrow._id, data);
        this.message = "Phiếu mượn được cập nhật thành công.";
      } catch (error) {
        console.log(error);
      }
    },
    async deleteBorrowing() {
      if (confirm("Bạn muốn xóa phiếu mượn hệ này?")) {
        try {
          await BorrowService.delete(this.borrow._id);
          this.$router.push({ name: "borrow" });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getBorrowing(this.id);
    this.message = "";
  },
};
</script>
