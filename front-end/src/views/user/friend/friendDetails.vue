<template>
    <div>
        <h2>details</h2>

    </div>
</template>

<script>
import Functions from '../../../../server/api'
    export default {
         async mounted() {
        try {
            let res= await Functions.getCurrentUser(this.$route.params.id)
             this.user=res.data.user

        } catch (error) {
            console.log(error);
        }
    },
        
    }
</script>

<style lang="scss" scoped>

</style>