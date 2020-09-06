<template>
    <div class="div">
        <momo />
    </div>
</template>

<script>
import momo from '../components/momo';


export default {
    name: 'Home',
    components: {
        momo,
    }
}
</script>

<style scoped>
    .div {
        overflow-x: hidden;
    }
</style>