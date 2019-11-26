<template>
    <div class='flex'>
        <div v-if="markers.length > 0" class="column">
            <div class='cities-list'>
                <p @click='selectCity(index)' v-for='(marker, index) in markers'>{{ marker.city }}, {{ marker.country }}</p>
            </div>
        </div>

        <div class="column">
            <GmapMap ref="mapRef"
                @click='createMarker'
                :center="center"
                :zoom="zoom"
                :map-type-id="map"
                style="width: 100%; height: 100%"
                :options="mapOptions"
            >
            <GmapMarker
                :key="index"
                v-for="(marker, index) in markers"
                :position="marker"
                :clickable="true"
                :draggable="false"
                @click="deleteMarker(index)"
            />
            </GmapMap>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        data: function() {
            return {
                apiKey: process.env.VUE_APP_GOOGLE_API,
                markers: [],
                center: {lat: 42.150527, lng: 24.746477},
                zoom: 7,
                map: 'roadmap',
                username: this.$route.params.username,
                loggedUsername: this.$store.state.auth.username,
                loggedUserId: this.$store.state.auth.userId,
                mapOptions: {
                    clickableIcons: false,
                    disableDoubleClickZoom: true
                }
            }
        },
        methods: {
            createMarker(event){
                if (this.loggedUsername == this.username) {
                    var latLng = event.latLng
                    var lat = latLng.lat()
                    var lng = latLng.lng()
                    var api = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + this.apiKey

                    axios.get(api)
                    .then((response) => {
                        const data = response.data.results
                        const placeId = data[0].place_id
                        let city
                        let checkCountry = data.find(it => ['country'].every(type => it.types.includes(type)))
                        let checkCity = data.find(it => ['locality', 'political'].every(type => it.types.includes(type)))

                        if (typeof data.find(it => ['locality', 'political'].every(type => it.types.includes(type))) != 'undefined') {
                            city = checkCity.address_components[0].long_name
                        }

                        let country = checkCountry.address_components[0].long_name

                        if (!this.markers.filter(e => e.city === city).length > 0 && city !== undefined && country !== undefined) {
                            return axios.post('/createMarker?token=' + this.$store.state.auth.token, {
                                userId: this.loggedUserId,
                                marker: latLng,
                                country: country,
                                city: city,
                                placeId: placeId
                            })
                            .then((response) => {
                                if (!this.markers.filter(e => e.city === response.data.marker.city).length > 0) {
                                    this.markers.unshift(response.data.marker)
                                }
                            }).catch((error) => console.log(error))
                        }
                    })
                }
            },
            deleteMarker(index){
                if (this.loggedUsername == this.username) {
                    const markerId = this.markers[index].id
                    this.markers.splice(index, 1);

                    axios.post('/deleteMarker?token=' + this.$store.state.auth.token, {
                        userId: this.loggedUserId,
                        markerId: markerId
                    })
                    .then((response) => {
                        this.markers.forEach((e)=>{
                            if(e.id == markerId)
                            this.markers.splice(this.markers.indexOf(e),1)
                        })
                    }).catch((error) => console.log(error))
                }
            },
            selectCity(index){
                const city = this.markers[index].city;
                const lat = this.markers[index].lat;
                const lng = this.markers[index].lng;

                this.$router.push('/' + this.username + '/' + city + '/' + lat + '/' + lng)
            },
            redirect(index) {
                const lat = this.markers[index].lat;
                const lng = this.markers[index].lng;

                this.center = {lat: lat, lng: lng}
            },
            setFlexHeight() {
                var navHeight = $(".nav").outerHeight();
                var viewport = $(window).height();
                $(".flex").first().css({
                    "height": viewport - navHeight - 60
                });
            }
        },
        mounted(){
            this.$refs.mapRef.$mapPromise.then((map) => {
                map.addListener('center_changed', function() {
                    let mapLat = map.getCenter().lat()
                    let mapLng = map.getCenter().lng()
                    localStorage.setItem('mapLat', mapLat);
                    localStorage.setItem('mapLng', mapLng);
                });
            })

            this.$refs.mapRef.$mapPromise.then((map) => {
                map.addListener('zoom_changed', function() {
                    let mapZoom = map.getZoom();
                    localStorage.setItem('mapZoom', mapZoom)
                });
            })

            if (localStorage.getItem('mapLat') !== null && localStorage.getItem('mapLng') !== null) {
                let mapLat = parseFloat(localStorage.getItem('mapLat'))
                let mapLng = parseFloat(localStorage.getItem('mapLng'))
                let center = {lat: mapLat, lng: mapLng}
                this.center = center;
            }

            if (localStorage.getItem('mapZoom') !== null) {
                let mapZoom = parseInt(localStorage.getItem('mapZoom'))
                this.zoom = mapZoom
            }

            axios.get('/getMarkers/' + this.username)
            .then(response => {
                this.markers = response.data.markers
            }).catch((error) => console.log(error));

            this.setFlexHeight();

            $(window).on("resize", this.setFlexHeight);
        }
    }
</script>

<style>
    .flex {
        display: flex;
        padding: 10px;
    }
    .column {
        flex-basis: 250px;
        flex-grow: 0;
        flex-shrink: 0;
    }
    .column:last-child {
        flex: 8;
    }
    .gm-style:first-of-type > div:nth-child(1) {
        cursor: default !important;
    }
    .cities-list {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        overflow-y: scroll;
        max-height: 100%;
    }
    .cities-list::-webkit-scrollbar {
        display: none;
    }
    .cities-list p {
        background-color: #ffffff;
        padding: 10px;
        margin: 0 10px 10px 0;
        cursor: pointer;
        font-size: 18px;
    }
</style>
