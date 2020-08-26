<template>
    <div class="auth">
        <div class="auth__container">
            <div class="auth__body">
                <a-form class="auth__form" @submit.stop.prevent="onLogin()">
                    <a-form-item label="Tên">
                        <a-input
                            v-model="form.username"
                            v-decorator="['Tên', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                        />
                    </a-form-item>
                    <a-form-item label="Mật khẩu">
                        <a-input
                            v-model="form.password"
                            type="password"
                            name="password"
                            autocomplete="on"
                            v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                            @keydown.enter="onLogin"
                        />
                    </a-form-item>
                    <a-button
                        class="m-b-25"
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

export default {
    name: "Login",
    data() {
        return {
            isLoading: false,
            form: {
                username: "",
                password: "",
            },
        };
    },
    mounted() {
    },
    methods: {
        ...mapActions({
            login: "auth/login",
        }),
        async onLogin() {
            console.log('lốc in nè')
            const {username,password} = this.form
            if (username && password) {
                this.isLoading = true;
                const login = await this.login({username,password});
                console.log('data ',login)
            }
        },
    },
};
</script>

<style lang="scss">
.auth {
    font-size: 16px;
    &__container {
        width: 440px;
    }
    &__body {
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
}
</style>