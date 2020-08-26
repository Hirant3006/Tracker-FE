<template>
    <div class="auth">
        <div class="auth__container">
            <div class="auth__body">
                <a-form class="auth__form" @submit.stop.prevent="onLogin()">
                    <a-form-item
                        label="Tên"
                        :validate-status="isError && !$v.form.username.required ? 'error' : ''"
                    >
                        <a-input
                            v-model="form.username"
                            v-decorator="['Tên', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                        />
                    </a-form-item>
                    <div class="auth__error-text" v-if="isError">
                        <span v-if="!$v.form.username.required">*Tên không được bỏ trống</span>
                    </div>
                    <a-form-item
                        label="Mật khẩu"
                        :validate-status="isError && !$v.form.password.required ? 'error' : ''"
                    >
                        <a-input
                            v-model="form.password"
                            type="password"
                            name="password"
                            autocomplete="on"
                            v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                        />
                    </a-form-item>
                    <div class="auth__error-text" v-if="isError && !$v.form.password.required">
                        <span v-if="!$v.form.password.required">*Mật khẩu không được bỏ trống</span>
                    </div>

                    <div class="auth__error-text" v-if="isError && message">
                        <span>*{{message}}</span>
                    </div>

                    <a-button
                        class="m-b-25 m-t-16"
                        type="primary"
                        size="large"
                        block
                        html-type="submit"
                        :loading="isLoading"
                    >Đăng nhập</a-button>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
    name: "Login",
    data() {
        return {
            isLoading: false,
            form: {
                username: "",
                password: "",
            },
            isError: false,
            message: "",
        };
    },
    validations: {
        form: {
            username: {
                required,
            },
            password: {
                required,
            },
        },
    },
    mounted() {},
    methods: {
        ...mapActions({
            login: "auth/login",
        }),
        async onLogin() {
            this.isError = false;
            this.message = "";

            const { username, password } = this.form;
            if (username && password) {
                this.isLoading = true;
                const login = await this.login({ username, password });
                const { header } = login.data;
                if (!header.isSuccessful) {
                    this.isError = true;
                    header.resultMessage === "Wrong username or password!" &&
                        (this.message =
                            "Tên tài khoản hoặc mật khẩu không đúng");
                }
            } else {
                this.isError = true;
            }
            this.isLoading = false;
        },
    },
};
</script>

<style lang="scss">
.auth {
    .ant-form-item {
        margin-bottom: 8px;
    }
    font-size: 16px;
    &__container {
        width: 440px;
    }
    &__body {
        height: 345px;
        label {
            font-weight: 600;
            font-size: 16px;
        }
        transform: translateY(70%);
        width: 100%;
        background: #fff;
        padding: 35px 30px;
        border-radius: 8px;
        border: 1px solid #ddd;
        position: relative;
    }
    &__error-text {
        color: $danger-color;
    }
}
</style>