<template>
  <div
    v-if="reader"
    class="page"
  >
    <h4 class="text-center">Hiệu chỉnh Reader</h4>
    <ReaderForm
      :reader="reader"
      @submit:reader="updateReader"
      @delete:reader="deleteReader"
    />
    <p class="text-center mt-2 text-success">{{ message }}</p>

  </div>
</template>

<script>
import ReaderForm from "@/components/readers/ReaderForm.vue";
import ReaderService from "@/services/reader.service";
export default {
  components: {
    ReaderForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      reader: null,
      message: "",
    };
  },
  methods: {
    async getReader(id) {
      try {
        this.reader = await ReaderService.get(id);
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
    async updateReader(data) {
      try {
        await ReaderService.update(this.reader._id, data);
        this.message = "Thông tin độc giả được cập nhật thành công.";
      } catch (error) {
        console.log(error);
      }
    },
    async deleteReader() {
      if (confirm("Bạn muốn xóa Độc giả này?")) {
        try {
          await ReaderService.delete(this.reader._id);
          this.$router.push({ name: "reader" });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getReader(this.id);
    this.message = "";
  },
};
</script>
