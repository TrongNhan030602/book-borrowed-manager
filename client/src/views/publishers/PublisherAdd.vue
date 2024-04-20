<template>
  <div
    v-if="publisher"
    class="page"
  >
    <h4 class="text-center">Thêm Nhà Xuất Bản</h4>
    <PublisherForm
      :publisher="publisher"
      @submit:publisher="createPublisher"
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
  data() {
    return {
      publisher: {},
      message: "",
    };
  },
  methods: {
    async createPublisher(data) {
      try {
        await PublisherService.create(data);
        this.message = "Nhà xuất bản được tạo thành công.";
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
