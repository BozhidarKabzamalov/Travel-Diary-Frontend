<template>
    <div class="wrapper">
        <div class="sight-container" v-if="this.sight != null">
            <div class="sight-column">
                <div class="sight-information">
                    <div class="sight-information-container">
                        <p v-if="sight.name" class='sight-name'>{{ sight.name }} </p>
                        <p class='sight-rating' v-if="sight.rating != null">
                            <i v-for='n in Math.round(sight.rating)' class="rating-stars fas fa-star fa-fw"></i> {{ sight.user_ratings_total }} reviews
                        </p>
                        <div v-if='this.$store.state.auth.userId' class="buttons-container">
                            <button v-if='isVisited' class='button danger-button' @click='addTo("visitedPlaces")'>Remove from visited places</button>
                            <button v-else class='button success-button' @click='addTo("visitedPlaces")'>Add to visited places</button>
                            <button v-if='isWishlisted' class='button danger-button' @click='addTo("wishlistedPlaces")'>Remove from wishlist</button>
                            <button v-else class='button warning-button' @click='addTo("wishlistedPlaces")'>Add to wishlist</button>
                        </div>
                        <h2 class='opening_hours'>Information for {{ sight.name }}</h2>
                        <p v-if="sight.formatted_address">
                            <i class="fas fa-directions fa-fw"></i> {{ sight.formatted_address }}
                        </p>
                        <p v-if="sight.international_phone_number">
                            <i class="fas fa-mobile-alt fa-fw"></i> {{ sight.international_phone_number }}
                        </p>
                        <p v-if="sight.website">
                            <i class="fab fa-chrome fa-fw"></i> <a class='sight-website' :href='sight.website'> {{ sight.name }}</a>
                        </p>
                    </div>
                    <div v-if='sight.opening_hours' class="sight-timetable-container">
                        <h2 class='opening_hours'>Opening Hours</h2>
                        <div v-if='sight.opening_hours && sight.opening_hours.weekday_text'>
                            <div class="sight-timetable">
                                <div class="sight-days">
                                    <p v-for='day in this.sight.opening_hours.weekday_text'>{{ day.split(": ")[0] }}</p>
                                </div>
                                <div>
                                    <p v-for='day in this.sight.opening_hours.weekday_text'>:</p>
                                </div>
                                <div class="sight-hours">
                                    <p v-for='day in this.sight.opening_hours.weekday_text'>{{ day.split(": ")[1] }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='reviews-container'>
                    <h2 class='opening_hours'>Reviews for {{ sight.name }}</h2>
                    <div v-for='(review, index) in reviews' class="review-container">
                        <div class="review-image-container">
                            <a :href='review.author_url'>
                                <img class='reviewer-image' :src='review.profile_photo_url'>
                            </a>
                        </div>
                        <div class="review-info-container">
                            <a class='reviewer-name' :href='review.author_url'>{{ review.author_name }}</a>
                            <p><i v-for='n in review.rating' class="rating-stars fas fa-star"></i> {{ review.relative_time_description }}</p>
                            <p>{{ review.text.slice(0,240) }}<span class='read-more-dots' v-show='!review.isActive' v-if='review.text.length > 240'>...</span><span v-show='review.isActive' class='extra-text'>{{ review.text.slice(240) }}</span></p>
                            <p class='show-more-less' v-if='review.text.length > 240' v-show='!review.isActive' @click='$set(review, "isActive", true)'>Show more <i class="fas fa-chevron-down fa-fw"></i></p>
                            <p class='show-more-less' v-if='review.text.length > 240' v-show='review.isActive' @click='$set(review, "isActive", false)'>Show less <i class="fas fa-chevron-up fa-fw"></i></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sight-column">
                <div class="photos-container">
                    <div class="mySlides" v-for='(image, index) in sightImages'>
                        <img class='slideshow-photos' :src="'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=' + image.photo_reference + '&key=' + apiKey">
                    </div>

                    <div class="thumbnails-container">
                        <div class='thumbnail-container' v-for='(image, index) in sightImages'>
                            <img class="slideshow-photos demo cursor" @click="selectSlide(index)" :src="'https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=' + image.photo_reference + '&key=' + apiKey">
                        </div>
                    </div>
                </div>
                <div class="map-container">
                    <GmapMap ref="mapRef"
                        :center="center"
                        :zoom="zoom"
                        :map-type-id="map"
                        style="width: 400px; height: 400px"
                        :options="mapOptions"
                    >
                    <GmapMarker
                        :position="center"
                        :clickable="true"
                        :draggable="false"
                    />
                    </GmapMap>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        data(){
            return {
                apiKey: process.env.VUE_APP_GOOGLE_API,
                placeId: this.$route.params.placeid,
                userId: this.$store.state.auth.userId,
                sight: null,
                sightImages: [],
                reviews: null,
                slideIndex: 1,
                markers: [],
                center: {lat: 42.150527, lng: 24.746477},
                zoom: 16,
                map: 'roadmap',
                mapOptions: {
                    clickableIcons: false,
                    disableDoubleClickZoom: true
                },
                isVisited: false,
                isWishlisted: false
            }
        },
        methods: {
            addTo(source) {
                if (source == 'wishlistedPlaces') {
                    this.isWishlisted = !this.isWishlisted
                } else {
                    this.isVisited = !this.isVisited
                }
                axios.post('/create/' + source + '?token=' + this.$store.state.auth.token, {
                    placeId: this.placeId,
                    userId: this.userId
                })
                .then(response => {
                }).catch((error) => console.log(error));
            },
            showSlides(index) {
                let slides = document.getElementsByClassName("mySlides");
                let dots = document.getElementsByClassName("demo");

                if (index > slides.length) {
                    this.slideIndex = 1
                }
                if (index < 1) {
                    this.slideIndex = slides.length
                }
                for (let i = 0; i < slides.length; i++) {
                    slides[i].style.display = "none";
                }
                for (let i = 0; i < dots.length; i++) {
                    dots[i].className = dots[i].className.replace(" active", "");
                }

                slides[this.slideIndex-1].style.display = "block";
                dots[this.slideIndex-1].className += " active";
            },
            changeSlide(index) {
                this.showSlides(this.slideIndex += index);
            },
            selectSlide(index) {
                this.showSlides(this.slideIndex = index + 1);
            }
        },
        mounted() {
            if (this.userId === null) {
                axios.get('/getSight/' + this.placeId)
                .then(response => {
                    this.sight = response.data.result.result;
                    this.sightImages = response.data.result.result.photos.splice(0,8);
                    this.center.lat = response.data.result.result.geometry.location.lat
                    this.center.lng = response.data.result.result.geometry.location.lng
                    this.reviews = response.data.result.result.reviews
                    this.isVisited = response.data.isVisited
                    this.isWishlisted = response.data.isWishlisted
                    this.$nextTick(() => {
                        this.showSlides(this.slideIndex);
                    });
                }).catch((error) => console.log(error));
            } else {
                axios.get('/getSight/' + this.placeId + '/' + this.userId)
                .then(response => {
                    this.sight = response.data.result.result;
                    this.sightImages = response.data.result.result.photos.splice(0,8);
                    this.center.lat = response.data.result.result.geometry.location.lat
                    this.center.lng = response.data.result.result.geometry.location.lng
                    this.reviews = response.data.result.result.reviews
                    this.isVisited = response.data.isVisited
                    this.isWishlisted = response.data.isWishlisted
                    this.$nextTick(() => {
                        this.showSlides(this.slideIndex);
                    });
                }).catch((error) => console.log(error));
            }

        }
    }
</script>

<style>
.sight-container {
    display: flex;
    margin-top: 10px;
}
.sight-column {
    flex: 1;
}
.sight-column:first-of-type {
    padding: 0 25px 0 0;
}
.sight-column:last-of-type {
    flex: 0;
}
.sight-name {
    font-size: 32px;
    font-weight: bold;
}
.sight-rating {
    margin-bottom: 15px;
}
.sight-information-container {
    margin: 0 0 30px 0;
}
.sight-timetable-container {
    margin: 0 0 30px 0;
}
.mySlides {
    display: none;
    width: 400px;
    height: 400px;
}
.photos-container {
    display: flex;
    flex-direction: column;
}
.thumbnails-container {
    display: flex;
    flex-wrap: wrap;
    width: 400px;
}
.thumbnail-container {
    width: 100px;
    height: 100px;
}
.slideshow-photos {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.cursor {
    cursor: pointer;
}
.demo {
    opacity: 0.6;
}
.active, .demo:hover {
    opacity: 1;
}
.review {
    margin: 20px 0 20px 0;
}
.review-container {
    display: flex;
    margin-bottom: 15px;
    font-size: 14px;
}
.review-container:last-child {
    margin-bottom: 0px;
}
.review-image-container {
    flex: 0;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0px 10px 0px 0px;
}
.reviewer-image {
    border-radius: 50px;
    height: 40px;
    width: 40px;
}
.reviewer-name {
    font-weight: bold;
    color: #0e0e0e;
}
.review-info-container {
    flex: 1;
}
.sight-website {
    color: #13aff0;
}
.sight-website:hover {
    border-bottom: 1px solid #13aff0;
}
.review-info-container p {
    word-break: normal;
}
.comment-actions-container {
    flex: 1;
    text-align: right;
}
.rating-stars {
    color: #febf00;
}
.sight-timetable {
    display: flex;
}
.sight-timetable div {
    flex: 0 auto;
}
.sight-days {
    padding-right: 10px;
}
.sight-hours {
    padding-left: 10px;
}
.opening_hours {
    font-size: 21px;
    margin-bottom: 10px;
    padding: 0 0 10px 0;
    border-bottom: 1px solid #333333;
}
.show-more-less {
    font-weight: bold;
    cursor: pointer;
}
.buttons-container {
    margin-bottom: 30px;
}
.button:first-child {
    margin-right: 10px;
}
.button {
    display: inline-block;
    color: #ffffff;
    cursor: pointer;
    text-align: center;
    border: none;
    border-radius: 4px;
    padding: 8px 10px 8px 10px;
    outline: none;
    font-size: 14px;
    min-width: 250px;
}
.success-button {
    background-color: #4caf50;
}
.danger-button {
    background-color: #ed5e68;
}
.warning-button {
    background-color: #13aff0;
}
</style>
