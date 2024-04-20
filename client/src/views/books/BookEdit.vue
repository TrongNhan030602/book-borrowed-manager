<template>
  <div
    v-if="book"
    class="page"
  >
    <h4 class="text-center">Hiệu chỉnh Book</h4>
    <BookForm
      :book="book"
      @submit:book="updateBook"
      @delete:book="deleteBook"
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
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      book: null,
      message: "",
    };
  },
  methods: {
    async getBook(id) {
      try {
        this.book = await BookService.get(id);
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
    async updateBook(data) {
      try {
        await BookService.update(this.book._id, data);
        this.message = "Sách được cập nhật thành công.";
      } catch (error) {
        console.log(error);
      }
    },
    async deleteBook() {
      if (confirm("Bạn muốn xóa sách này?")) {
        try {
          await BookService.delete(this.book._id);
          this.$router.push({ name: "book" });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getBook(this.id);
    this.message = "";
  },
};
</script>
