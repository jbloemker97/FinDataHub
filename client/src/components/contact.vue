<template>
    <div>
        <!--====== CONTACT ONE PART START ======-->
        <section id="contact" class="contact-area gray-bg pt-50 p-100">
            <div class="container">
                <div class="row">
                    <div class="col-lg-8">
                        <div class="section-title mt-45">
                            <h3 class="title">Get in touch</h3>
                        </div>
                        <div class="contact-form form-style-four mt-15">
                            <form id="contact-form" action="assets/contact.php" method="post">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-input mt-15">
                                            <label>Full Name</label>
                                            <div class="input-items default">
                                                <i class="lni-user"></i>
                                                <input type="text" name="name" placeholder="John Doe">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-input mt-15">
                                            <label>Email Address</label>
                                            <div class="input-items default">
                                                <i class="lni-envelope"></i>
                                                <input type="text" name="email" placeholder="admin@uideck.com">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-input mt-15">
                                            <label>Subject</label>
                                            <div class="input-items default">
                                                <i class="lni-bubble"></i>
                                                <input type="text" name="subject" placeholder="Type here">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-input mt-15">
                                            <label>Your Message</label>
                                            <div class="input-items default">
                                                <i class="lni-pencil-alt"></i>
                                                <textarea name="message" placeholder="Type your message here"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <p class="form-message"></p>
                                    <div class="col-md-12">
                                        <div class="single-form pt-25">
                                            <div class="input-form rounded-buttons">
                                                <button class="main-btn rounded-three" type="submit">SEND MESSAGE</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-8">
                        <div class="section-title mt-45 pb-20">
                            <h3 class="title">Contact Information</h3>
                        </div>
                        <div class="contact-info">
                            <ul class="info">
                                <li>
                                    <div class="single-info">
                                        <div class="info-icon">
                                            <i class="lni-envelope"></i>
                                        </div>
                                        <div class="info-content">
                                            <p class="text">admin@uideck.com</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <ul class="social mt-30">
                                <li><a href="#"><i class="lni-facebook-filled"></i></a></li>
                                <li><a href="#"><i class="lni-twitter-original"></i></a></li>
                                <li><a href="#"><i class="lni-instagram-original"></i></a></li>
                                <li><a href="#"><i class="lni-linkedin-original"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'contact'
}
</script>

<style scope>

</style>