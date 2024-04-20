<template>
  <div
    v-if="publisher"
    class="page"
  >
    <h4 class="text-center">Hiệu chỉnh Publisher</h4>
    <PublisherForm
      :publisher="publisher"
      @submit:publisher="updatePublisher"
      @delete:publisher="deletePublisher"
    />
    <p class="text-center mt-2 text-success">{{ message }}</p>

  </div>
</template>

<script>
import PublisherForm from "@/components/publishers/PublisherForm.vue";
import PublisherService from "@/services/publisher.service";
export default {
  components: {
    PublisherForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      publisher: null,
      message: "",
    };
  },
  methods: {
    async getPublisher(id) {
      try {
        this.publisher = await PublisherService.get(id);
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
    async updatePublisher(data) {
      try {
        await PublisherService.update(this.publisher._id, data);
        this.message = "NXB được cập nhật thành công.";
      } catch (error) {
        console.log(error);
      }
    },
    async deletePublisher() {
      if (confirm("Bạn muốn xóa NXB này?")) {
        try {
          await PublisherService.delete(this.publisher._id);
          this.$router.push({ name: "publisher" });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getPublisher(this.id);
    this.message = "";
  },
};
</script>
