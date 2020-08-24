<template>
    <div class="auth">
        <div class="auth__container">
            <div class="auth__body">
                <a-form class="auth__form" @submit.stop.prevent="onLogin()" novalidate>
                    <a-form-item label="Tên">
                        <a-input
                            v-decorator="['Tên', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                        />
                    </a-form-item>
                    <a-form-item label="Mật khẩu">
                        <a-input
                            v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]"
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
export default {
    name: "Login",
    data() {
        return {
            isLoading: false,
        };
    },
    methods: {
        onLogin() {
            this.isLoading = true
        }
    }
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