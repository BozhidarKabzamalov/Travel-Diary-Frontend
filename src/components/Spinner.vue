<template>
    <div class="spinner">
        <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>

</template>

<script>
    export default {
        data(){
            return {

            }
        }
    }
</script>

<style>
    .spinner {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .lds-ring {
        position: relative;
        width: 150px;
        height: 150px;
        margin-top: 200px;
    }
    .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 150px;
        height: 150px;
        border: 25px solid #333333;
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #57cfb0 transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
    }
    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
