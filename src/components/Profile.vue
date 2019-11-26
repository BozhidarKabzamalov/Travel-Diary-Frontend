<template>
    <div>
        <ul class='profile-ul'>
            <router-link :to="'/' + this.username + '/information'" tag='li'>Profile</router-link>
            <router-link :to="'/' + this.username" tag='li'>Map</router-link>
            <router-link :to="'/' + this.username + '/visitedPlaces'" tag='li'>Visited</router-link>
            <router-link :to="'/' + this.username + '/wishlistedPlaces'" tag='li'>Wishlist</router-link>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                username: this.$route.params.username,
            }
        }
    }
</script>

<style>
    .profile-ul {
        display: flex;
    }
    .profile-ul li {
        background-color: #ffffff;
        cursor: pointer;
        font-size: 18px;
        padding: 10px;
        margin: 10px 10px 0 0;
    }
    .profile-ul li:first-child {
        margin-left: 10px;
    }
</style>
