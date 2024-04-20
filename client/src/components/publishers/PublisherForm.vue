<template>
    <Form @submit="submitPublisher" :validation-schema="publisherFormSchema" class="my-form">
        <div class="form-group">
            <label for="name">Publisher Name</label>
            <Field name="name" type="text" class="form-control" v-model="publisherLocal.name" />
            <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="address">Address</label>
            <Field name="address" type="text" class="form-control" v-model="publisherLocal.address" />
            <ErrorMessage name="address" class="error-feedback" />
        </div>        

        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="publisherLocal._id" type="button" class="ml-2 btn btn-danger" @click="deletePublisher">
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
    emits: ["submit:publisher", "delete:publisher"],
    props: {
        publisher: { type: Object, required: true }
    },
    data() {
        const publisherFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
          
            address: yup.string().max(100, "Địa chỉ tối đa 100 ký tự."),
           
           
        });
        return {
            // Chúng ta sẽ không muốn hiệu chỉnh props, nên tạo biến cục bộ
            // publisherLocal để liên kết với các input trên form
            publisherLocal: this.publisher,
            publisherFormSchema,
        };
    },
    methods: {
        submitPublisher() {
            this.$emit("submit:publisher", this.publisherLocal);
        },
        deletePublisher() {
            this.$emit("delete:publisher", this.publisherLocal.id);
        },
    },
};
</script>
<style scoped>
@import "../../assets/myForm.css";
</style>