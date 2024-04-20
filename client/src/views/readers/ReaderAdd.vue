<template>
  <div
    v-if="reader"
    class="page"
  >
    <h4 class="text-center">Thêm Độc giả</h4>
    <ReaderForm
      :reader="reader"
      @submit:reader="createReader"
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
  data() {
    return {
      reader: {},
      message: "",
    };
  },
  methods: {
    async createReader(data) {
      try {
        await ReaderService.create(data);
        this.message = "Độc giả được thêm thành công.";
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
