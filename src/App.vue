<template>
    <div id="app">
        <app-header></app-header>
        <router-view></router-view>
    </div>
</template>

<script>
    import Header from './components/Layouts/Header.vue';

    export default {
        components: {
            appHeader: Header
        },
        created () {
            this.$store.dispatch('autoSignin');
        }
    }
</script>

<style lang="scss">

</style>
