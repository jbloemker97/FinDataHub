<template>
    <div class="div">
        <product />
    </div>
</template>

<script>
import product from '../components/product';


export default {
    name: 'Home',
    components: {
        product,
    }
}
</script>

<style scoped>
    .div {
        overflow-x: hidden;
    }
</style>