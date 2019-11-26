<template>
    <div class="sights-container">
        <spinner v-if='isLoading'></spinner>
        <div v-else>
            <div v-if="this.sights != null" class='sights-list'>
                <div @click='selectSight(index)' class='sight' v-if='sights != null' v-for='(sight, index) in sights'>
                    <img class='sight-photos' :src="'https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=' + sight.result.photos[0].photo_reference + '&key=' + apiKey">
                    <div class="">
                        <p class='sights-name'>{{ sight.result.name }}</p>
                        <p class='sights-name' v-if="sight.result.rating != null"><i v-for='n in Math.round(sight.result.rating)' class="rating-stars fas fa-star"></i> {{ sight.result.user_ratings_total }} reviews</p>
                        <p class='sights-name'>{{ sight.result.vicinity }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Spinner from './Spinner'

    export default {
        data(){
            return {
                apiKey: process.env.VUE_APP_GOOGLE_API,
                sights: null,
                username: this.$route.params.username,
                source: this.$route.params.source,
                isLoading: false
            }
        },
        methods: {
            selectSight(index) {
                const placeId = this.sights[index].result.place_id;
                this.$router.push('/' + this.username + '/Sight/' + placeId)
            },
            getSights() {
                this.isLoading = true;
                axios.get('/get/' + this.source + '/' + this.username)
                .then(response => {
                    this.sights = response.data.sights
                    console.log(response)
                    this.isLoading = false;
                }).catch((error) => console.log(error));

                this.setContainerHeight();
            },
            setContainerHeight() {
                var navHeight = $(".nav").outerHeight();
                var viewport = $(window).height();
                var profileNavHeight = $('.profile-ul').outerHeight();
                $(".sights-container").first().css({
                    "min-height": viewport - navHeight - profileNavHeight - 20
                });
            }
        },
        watch:{
            $route (to, from){
                this.source = this.$route.params.source
                this.getSights()
            }
        },
        mounted() {
            this.getSights()
        },
        components: {
            Spinner
        }
    }
</script>

<style>
.sights-container {
    background-color: #ffffff;
    margin: 10px 10px 0 10px;
}
.sights-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1;
}
.sight {
    flex-basis: 49.5%;
    height: auto;
    flex-shrink: 0;
    display: flex;
    padding: 10px;
    min-height: 170px;
}
.sights-name {
    padding: 0px 15px 0px 15px;
    font-size: 18px;
}
.sight-photos {
    width: 100%;
    max-width: 300px;
    max-height: 150px;
    object-fit: cover;
}
.rating-stars {
    color: #febf00;
}
</style>
