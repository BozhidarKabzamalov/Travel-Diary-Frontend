<template>
    <div class="nav">
        <div class="wrapper">
            <ul class='nav-ul'>
                <router-link to="/" tag='li'>Home</router-link>
                <router-link v-if="!isAuthenticated" to="/signup" tag='li'>Sign Up</router-link>
                <router-link v-if="!isAuthenticated" to="/signin" tag='li'>Sign In</router-link>
                <router-link v-if="isAuthenticated" :to="'/' + this.$store.state.auth.username" tag='li'>Profile</router-link>
                <li v-if="isAuthenticated" v-on:click="logout">Log Out</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            logout(){
                this.$store.dispatch('logout')
            }
        },
        computed: {
            isAuthenticated () {
                return this.$store.getters.isAuthenticated
            }
        }
    }
</script>

<style>
    *, *:after, *:before {
        margin: 0;
        padding: 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-decoration: none;
        list-style-type: none;
    }
    html {
        font-size: 16px;
    }
    body {
        background-color: #f2f2f2;
        font-family: "Helvetica", sans-serif;
        height: 100%;
        width: 100%;
        line-height: 1.8rem;
        color: #333333;
    }
    .wrapper {
        width: 70%;
        margin: 0 auto;
    }
    .nav {
        background: linear-gradient(-45deg, #57cfb0, #2ab5d3);
    }
    .nav-ul {
        display: flex;
    }
    .nav li {
        padding: 11px 30px 11px 0;
        color: #ffffff;
        cursor: pointer;
        font-weight: 500;
    }
    .nav li:nth-last-child(2) {
        margin-left: auto;
    }
    .nav li:last-child {
        padding-right: 0px;
    }
</style>
