<template>
    <Form @submit="submitBook" :validation-schema="bookFormSchema" class="my-form">
        <div class="form-group">
            <label for="name">Name</label>
            <Field name="name" type="text" class="form-control" v-model="bookLocal.name" />
            <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="author">OriginOrAuthor</label>
            <Field name="author" type="text" class="form-control" v-model="bookLocal.originOrAuthor" />
            <ErrorMessage name="author" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="price">Price</label>
            <Field name="price" type="text" class="form-control" v-model="bookLocal.price" />
            <ErrorMessage name="price" class="error-feedback" />
        </div>
      
        <div class="form-group">
            <label for="publicationYear">Publication Year</label>
            <Field name="publicationYear" type="date" class="form-control" v-model="bookLocal.publicationYear" />
            <ErrorMessage name="publicationYear" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="quantity">Quantity</label>
            <Field name="quantity" type="number" class="form-control" v-model="bookLocal.quantity" />
            <ErrorMessage name="quantity" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="imageUrl">Image Url</label>
            <Field name="imageUrl" type="text" class="form-control" v-model="bookLocal.imageUrl" />
            <ErrorMessage name="imageUrl" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="publisherName">Publisher Name</label>
            <Field name="publisherName" type="text" class="form-control" v-model="bookLocal.publisherName" />
            <ErrorMessage name="publisherName" class="error-feedback" />
        </div>

        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="bookLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteBook">
                Xóa
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
    // định nghĩa các sự kiện mà thành phần này có thể phát ra đến tp cha
    emits: ["submit:book", "delete:book"],
    props: {
        book: { type: Object, required: true }
    },
    data() {
        const bookFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(66, "Tên có nhiều nhất 66 ký tự."),
            author: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            publisherName: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            email: yup
                .string()
                .email("E-mail không đúng.")
                .max(50, "E-mail tối đa 50 ký tự."),

            price: yup
                .number()
                .required("Giá phải có giá trị.")
                .min(0, "Giá không thể âm."),
            publicationYear: yup
                .date()
                .nullable()
                .max(new Date(), "Năm xuất bản không hợp lệ."),
            quantity: yup
                .number()
                .integer("Số lượng phải là số nguyên.")
                .min(1, "Số lượng phải lớn hơn 0."),
            address: yup.string().max(100, "Địa chỉ tối đa 100 ký tự."),
           
            imageUrl: yup.string().url("URL hình ảnh không hợp lệ."),
        });
        return {
            // Chúng ta sẽ không muốn hiệu chỉnh props, nên tạo biến cục bộ
            // bookLocal để liên kết với các input trên form
            bookLocal: this.book,
            bookFormSchema,
        };
    },
    methods: {
        submitBook() {
            this.$emit("submit:book", this.bookLocal);
        },
        deleteBook() {
            this.$emit("delete:book", this.bookLocal.id);
        },
    },
};
</script>
<style scoped>
@import "../../assets/myForm.css";
</style>