<template>
    <Form @submit="submitReader" :validation-schema="readerFormSchema" class="my-form">
        <div class="form-group">
            <label for="name">Name</label>
            <Field name="name" type="text" class="form-control" v-model="readerLocal.name" />
            <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="gender">Gender</label>
            <Field name="gender" as="select" class="form-control" v-model="readerLocal.gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </Field>
            <ErrorMessage name="gender" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="birthDate">Birth Date</label>
            <Field name="birthDate" type="date" class="form-control" v-model="readerLocal.birthDate" />
            <ErrorMessage name="birthDate" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <Field name="phoneNumber" type="tel" class="form-control" v-model="readerLocal.phoneNumber" />
            <ErrorMessage name="phoneNumber" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="address">Address</label>
            <Field name="address" type="text" class="form-control" v-model="readerLocal.address" />
            <ErrorMessage name="address" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <Field name="password" type="password" class="form-control" v-model="readerLocal.password" />
            <ErrorMessage name="password" class="error-feedback" />
        </div>
        <!-- <div class="form-group">
            <label for="role">Role</label>
            <Field name="role" as="select" class="form-control" v-model="readerLocal.role">
                <option value="admin">Admin</option>
                <option value="reader">Reader</option>
            </Field>
            <ErrorMessage name="role" class="error-feedback" />
        </div> -->

        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="readerLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteReader">
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
    emits: ["submit:reader", "delete:reader"],
    props: {
        reader: { type: Object, required: true }
    },
    data() {
        const readerFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            gender: yup
                .string()
                .required("Vui lòng chọn giới tính.")
                .oneOf(['male', 'female', 'other'], "Giới tính không hợp lệ."),
            birthDate: yup
                .date()
                .nullable()
                .max(new Date(), "Ngày sinh không thể lớn hơn ngày hiện tại."),
            phoneNumber: yup
                .string()
                .required("Số điện thoại không được để trống.")
                .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ."),
            address: yup.string().max(100, "Địa chỉ tối đa 100 ký tự."),
            password: yup
                .string()
                .required("Mật khẩu không được để trống.")
                .min(6, "Mật khẩu phải ít nhất 6 ký tự."),
            // role: yup
            //     .string()
            //     .required("Vui lòng chọn vai trò của người dùng.")
            //     .oneOf(['admin', 'reader'], "Vai trò không hợp lệ.")
        });

        return {
            // Chúng ta sẽ không muốn hiệu chỉnh props, nên tạo biến cục bộ
            // readerLocal để liên kết với các input trên form
            readerLocal: this.reader,
            readerFormSchema,
        };
    },

    methods: {
        submitReader() {
            this.$emit("submit:reader", this.readerLocal);
        },
        deleteReader() {
            this.$emit("delete:reader", this.readerLocal.id);
        },
    },
};
</script>
<style scoped>
@import "../../assets/myForm.css";
</style>