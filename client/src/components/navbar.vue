<template>
    <div class="navbar-area navbar-transparent">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <nav class="navbar navbar-expand-lg">
                        <router-link :to="{ name: 'Home' }">
                            <img src="@/assets/images/logo.svg" alt="Logo">
                        </router-link>
                        

                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarFive" aria-controls="navbarFive" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="toggler-icon"></span>
                            <span class="toggler-icon"></span>
                            <span class="toggler-icon"></span>
                        </button>

                        <div class="collapse navbar-collapse sub-menu-bar" id="navbarFive">
                            <ul class="navbar-nav ml-auto">
                                <li class="nav-item">
                                    <!-- <a class="page-scroll" href="#about">Home</a> -->
                                    <router-link :to="{ name: 'Home' }">Home</router-link>
                                </li>
                                <li class="nav-item">
                                    <!-- <a class="page-scroll" href="#features">Entries</a> -->
                                    <router-link :to="{ name: 'Entries' }">Entries</router-link>
                                </li>
                            </ul>
                        </div>
                    </nav> <!-- navbar -->
                </div>
            </div> <!-- row -->
        </div> <!-- container -->
    </div>

</template>

<script>
    export default {
        name: 'navbar'
    }
</script>

<style scroped>

</style>