<template>
  <div
    v-if="book"
    class="page"
  >
    <h4 class="text-center">Thêm Sách</h4>
    <BookForm
      :book="book"
      @submit:book="createBook"
    />
    <p class="text-center mt-2 text-success">{{ message }}</p>
    

  </div>
</template>

<script>
import BookForm from "@/components/books/BookForm.vue";
import BookService from "@/services/book.service";
export default {
  components: {
    BookForm,
  },
  data() {
    return {
      book: {},
      message: "",
    };
  },
  methods: {
    async createBook(data) {
      try {
        await BookService.create(data);
        this.message = "Sách được tạo thành công.";
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
