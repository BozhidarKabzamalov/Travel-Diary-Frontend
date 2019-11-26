<template>
    <div class="signup-container">
        <p class='signup-title'>Sign Up</p>
        <form @submit.prevent="onSubmit">
            <div class="form-group">
                <label class='label-control' for="">Username</label>
                <input class='input-control' v-model="username" placeholder="Your Username...">
            </div>
            <div class="form-group">
                <label class='label-control' for="">Password</label>
                <input class='input-control' v-model="password" placeholder="Your Password...">
            </div>
            <div class="form-group">
                <label class='label-control' for="">Email</label>
                <input class='input-control' v-model="email" placeholder="Your Email...">
            </div>
            <button class='submit-btn' type="submit" name="submit">Sign up</button>
            <router-link class='signUpInA' to="/signin">Already have an account? Sign in!</router-link>
        </form>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                username: '',
                password: '',
                email: ''
            }
        },
        methods: {
            onSubmit () {
                const formData = {
                    username: this.username,
                    password: this.password,
                    email: this.email
                }
                this.$store.dispatch('signup', formData)
            }
        }
    }
</script>

<style>
.signup-container {
    width: 50%;
    margin: 0 auto;
    padding-top: 15px;
}
.signup-title {
    text-align: center;
    font-size: 24px;
}
.form-group {
    margin-bottom: 15px;
}
.input-control {
    display: inline-block;
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    resize: vertical;
    border-radius: 0px
}
.label-control {
    display: inline-block;
    margin-bottom: 5px;
}
.submit-btn {
    display: block;
    background-color: #4CAF50;
    color: #ffffff;
    cursor: pointer;
    text-align: center;
    border-radius: 4px;
    border: none;
    padding: 8px 10px 8px 10px;
    line-height: 1.2;
    outline: none;
    font-size: 13px;
}
.submit-btn:hover {
    background-color: #45a049;
}
.signUpInA {
    display: block;
    color: #13aff0;
    margin-top: 15px;
}
</style>
