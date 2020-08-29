<template>
    <div>
        <section class="signin-area signin-area-three">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-6">
                        <div class="signin-three">
                            <div class="signin-form form-style-two light-rounded-buttons">
                                <div class="signin-text text-center">
                                    <p class="text">Enter Credential to Sign In</p>
                                </div>
                                
                                <form action="#">
                                    <div class="form-input mt-30">
                                        <div class="input-items default">
                                            <input type="text" placeholder="Email">
                                            <i class="lni-envelope"></i>
                                        </div>
                                    </div> <!-- form input -->
                                    
                                    <div class="form-input mt-30">
                                        <div class="input-items default">
                                            <input type="password" placeholder="Password">
                                            <i class="lni-key"></i>
                                        </div>
                                    </div> <!-- form input -->
                                    <div class="form-input mt-40 text-center">
                                        <button class="main-btn light-rounded-two" type="submit">sign in</button>
                                    </div> <!-- form input -->
                                </form>
                            </div>
                        </div> <!-- signin three -->
                    </div>
                </div> <!-- row -->
            </div> <!-- container -->
        </section>
    </div>
</template>

<script>
export default {
    name: 'login'
}
</script>

<style scoped>

</style>