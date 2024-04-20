<template>
    <Form @submit="submitAdmin" :validation-schema="adminFormSchema" class="my-form">
      <div class="form-group">
        <label for="name">Name</label>
        <Field name="name" type="text" class="form-control" v-model="adminLocal.name" />
        <ErrorMessage name="name" class="error-feedback" />
      </div>
  
      <div class="form-group">
        <label for="phoneNumber">Phone Number</label>
        <Field name="phoneNumber" type="tel" class="form-control" v-model="adminLocal.phoneNumber" />
        <ErrorMessage name="phoneNumber" class="error-feedback" />
      </div>
  
      <div class="form-group">
        <label for="address">Address</label>
        <Field name="address" type="text" class="form-control" v-model="adminLocal.address" />
        <ErrorMessage name="address" class="error-feedback" />
      </div>
  
      <div class="form-group">
        <label for="position">Position</label>
        <Field name="position" as="select" class="form-control" v-model="adminLocal.position">
          <option disabled value="">Choose position</option>
          <option v-for="position in positions" :key="position" :value="position">{{ position }}</option>
        </Field>
        <ErrorMessage name="position" class="error-feedback" />
      </div>
  
      <div class="form-group">
        <label for="password">Password</label>
        <Field name="password" type="password" class="form-control" v-model="adminLocal.password" />
        <ErrorMessage name="password" class="error-feedback" />
      </div>
  
      <div class="form-group button-group">
        <button class="btn btn-primary">Save</button>
        <button v-if="adminLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteAdmin">Delete</button>
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
    emits: ["submit:admin", "delete:admin"],
    props: {
        admin: { type: Object, required: true }
    },
    data() {
        const adminFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),

            phoneNumber: yup
                .string()
                .required("Số điện thoại không được để trống.")
                .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ."),
            address: yup.string().max(100, "Địa chỉ tối đa 100 ký tự."),
            password: yup
                .string()
                .required("Mật khẩu không được để trống.")
                .min(6, "Mật khẩu phải ít nhất 6 ký tự."),
                position: yup
                .string()
                .required("Vui lòng chọn vị trí.")
        });

        return {
            // Chúng ta sẽ không muốn hiệu chỉnh props, nên tạo biến cục bộ
            // adminLocal để liên kết với các input trên form
            adminLocal: this.admin,
            adminFormSchema,
            positions: ["Manager", "Mannager Staff", "Direction"] // Danh sách các vị trí
        };
    },

    methods: {
        submitAdmin() {
            this.$emit("submit:admin", this.adminLocal);
        },
        deleteAdmin() {
            this.$emit("delete:admin", this.adminLocal.id);
        },
    },
};
</script>
<style scoped>
@import "../../assets/myForm.css";
</style>