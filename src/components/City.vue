<template>
    <div class="city-flex" v-if="this.sights != null">
        <div class='radio'>
            <div>
                <p>Maximum Distance {{ Math.floor(this.range/1000) }} km</p>
                <input @change="range = $event.target.value" :value="range" class='range-input' type="range" min="1000" max="25000">
            </div>
            <div v-for='placeType in placeTypes'>
                <input type="radio" :id="placeType.value" :value="placeType.value" v-model="type">
                <label class='type-label' :for="placeType.value">{{ placeType.title }}</label>
            </div>
        </div>
        <div v-if='isLoading' class="spinner-container">
            <spinner></spinner>
        </div>
        <div v-else class='sights-list'>
            <div class='sight' @click='selectSight(index)' v-for='(sight, index) in sights' v-if='sight.photos'>
                <img class='sight-photos' :src="'https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=' + sight.photos[0].photo_reference + '&key=' + apiKey">
                <div class="">
                    <p class='sights-name'>{{ sight.name }}</p>
                    <p class='sights-name' v-if="sight.rating != null"><i v-for='n in Math.round(sight.rating)' class="rating-stars fas fa-star"></i> {{ sight.user_ratings_total }} reviews</p>
                    <p class='sights-name'>{{ sight.vicinity }}</p>
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
                city: this.$route.params.city,
                lat: this.$route.params.lat,
                lng: this.$route.params.lng,
                nextPageToken: null,
                type: 'museum',
                range: 5000,
                bottom: false,
                isLoading: false,
                placeTypes: [   {"title": "Libraries", "value": "library"},
                                {"title": "Parks", "value": "park"},
                                {"title": "Amusement Parks", "value": "amusement_park"},
                                {"title": "Aquariums", "value": "aquarium"},
                                {"title": "Art Galleries", "value": "art_gallery"},
                                {"title": "Bars", "value": "bar"},
                                {"title": "Bowling Alleys", "value": "bowling_alley"},
                                {"title": "Cafes", "value": "cafe"},
                                {"title": "Casinos", "value": "casino"},
                                {"title": "Gyms", "value": "gym"},
                                {"title": "Hindu Temples", "value": "hindu_temple"},
                                {"title": "Movie Theaters", "value": "movie_theater"},
                                {"title": "Museums", "value": "museum"},
                                {"title": "Night Clubs", "value": "night_club"},
                                {"title": "Restaurants", "value": "restaurant"},
                                {"title": "Spas", "value": "spa"},
                                {"title": "Stadiums", "value": "stadium"},
                                {"title": "Zoos", "value": "zoo"},
                            ]
            }
        },
        methods: {
            getSights(){
                this.isLoading = true
                axios.get('/getSights/' + this.lat + '/' + this.lng + '/' + this.type + '/' + this.range)
                .then(response => {
                    this.sights = response.data.result.results
                    this.nextPageToken = response.data.result.next_page_token
                    this.isLoading = false
                    console.log(response)
                }).catch((error) => console.log(error));
            },
            getNextSights(){
                this.isLoading = true
                axios.get('/getSights/' + this.lat + '/' + this.lng + '/' + this.type + '/' + this.range + '/' + this.nextPageToken)
                .then(response => {
                    this.sights = response.data.result.results
                    this.nextPageToken = response.data.result.next_page_token
                    this.isLoading = false
                }).catch((error) => console.log(error));
            },
            selectSight(index) {
                const placeId = this.sights[index].place_id;
                localStorage.setItem('type', this.type);
                localStorage.setItem('range', this.range);
                this.$router.push('/' + this.username + '/' + this.city + '/' + placeId)
            },
            appendSights(){
                axios.get('/getSights/' + this.lat + '/' + this.lng + '/' + this.type + '/' + this.range + '/' + this.nextPageToken)
                .then(response => {
                    for (var i = 0; i < response.data.result.results.length; i++) {
                        this.sights.push(response.data.result.results[i])
                    }
                    this.nextPageToken = response.data.result.next_page_token
                }).catch((error) => console.log(error));
            },
            bottomVisible() {
                const scrollY = window.scrollY
                const visible = document.documentElement.clientHeight
                const pageHeight = document.documentElement.scrollHeight
                const bottomOfPage = visible + scrollY >= pageHeight
                return bottomOfPage || pageHeight < visible
            }
        },
        mounted(){
            window.addEventListener('scroll', () => {
                this.bottom = this.bottomVisible()
            })

            if (localStorage.getItem('type') !== null) {
                let lastType = localStorage.getItem('type')
                this.type = lastType
            }

            if (localStorage.getItem('range') !== null) {
                let lastRange = localStorage.getItem('range')
                this.range = lastRange
            }

            this.getSights()
        },
        watch: {
            type: function () {
                localStorage.setItem('type', this.type)
                this.getSights()
            },
            range: function(){
                localStorage.setItem('range', this.range)
                this.getSights()
            },
            bottom(bottom) {
                if (bottom) {
                    this.appendSights()
                }
            }
        },
        components: {
            Spinner
        }
    }
</script>

<style>
    .city-flex {
        display: flex;
        padding: 10px;
        align-items: flex-start;
    }
    .radio {
        display: flex;
        flex-direction: column;
        flex-basis: 250px;
        flex-grow: 0;
        flex-shrink: 0;
        padding: 0px 10px 0px 0px;
    }
    .radio div {
        padding: 5px 0px 5px 0px;
    }
    .range-input {
        width: 100%;
        padding: 5px 0px 5px 0px;
    }
    .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
    }
    .sights-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        flex: 1;
        background-color: #ffffff;
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
    .type-label {
        margin-left: 10px;
    }
</style>
