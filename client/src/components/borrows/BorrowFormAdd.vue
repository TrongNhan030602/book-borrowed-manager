<template>
    <Form @submit="submitBorrow" :validation-schema="borrowFormSchema" class="my-form">
      <div class="form-group">
        <label for="readerName">Reader</label>
        <Field name="readerName" type="text" class="form-control" v-model="borrowLocal.readerName" />
        <ErrorMessage name="readerName" class="error-feedback" />
      </div>
      <div class="form-group">
        <label for="bookName">Book Name</label>
        <Field name="bookName" type="text" class="form-control" v-model="borrowLocal.bookName" />
        <ErrorMessage name="bookName" class="error-feedback" />
      </div>
      
      <div class="form-group">
        <label for="returnDate">Return Date</label>
        <Field name="returnDate" type="date" class="form-control" v-model="borrowLocal.returnDate" />
        <ErrorMessage name="returnDate" class="error-feedback" />
      </div>
  
      <div class="form-group">
        <label for="status">Status</label>
        <Field name="status" type="text" class="form-control" v-model="borrowLocal.status" />
        <ErrorMessage name="status" class="error-feedback" />
      </div>
  
      <div class="form-group">
        <button class="btn btn-primary">Save</button>
        <button v-if="borrowLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteBorrow">
          Delete
        </button>
      </div>
    </Form>
  </template>
  
  <script>
  import * as yup from "yup";
  import { Form, Field, ErrorMessage } from "vee-validate";
  
  export default {
    components: {
      Form,
      Field,
      ErrorMessage,
    },
    emits: ["submit:borrow", "delete:borrow"],
    props: {
      borrow: { type: Object, required: true },
    },
    data() {
      const borrowLocal = { ...this.borrow };
  
      // Khởi tạo returnDate với một đối tượng ngày hợp lệ hoặc chuỗi
      if (!borrowLocal.returnDate) {
        borrowLocal.returnDate = new Date().toISOString().substr(0, 10); // Đặt là ngày hôm nay
      }
  
      const borrowFormSchema = yup.object().shape({
        readerName: yup
          .string()
          .required("Name is required.")
          .min(2, "Name must be at least 2 characters.")
          .max(50, "Name must be at most 50 characters."),
        bookName: yup
          .string()
          .required("Name is required.")
          .min(2, "Name must be at least 2 characters.")
          .max(50, "Name must be at most 50 characters."),
        returnDate: yup.date().nullable(),
      });
  
      return {
        borrowLocal,
        borrowFormSchema,
      };
    },
    methods: {
      submitBorrow() {
        console.log(this.borrowLocal);
        this.$emit("submit:borrow", this.borrowLocal);
      },
      deleteBorrow() {
        this.$emit("delete:borrow", this.borrowLocal._id);
      },
    },
    computed: {
      formatDate() {
        return (date) => {
          if (!date) return "";
          const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          };
          return new Date(date).toLocaleDateString("en-US", options);
        };
      },
    },
  };
  </script>
  
  <style scoped>
@import "../../assets/myForm.css";
</style>
  