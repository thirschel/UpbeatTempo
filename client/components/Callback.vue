<template>
  <div class="callback">
    <div class="loading-wrapper">
      <loading></loading>
    </div>
  </div>
</template>

<script>
  import Loading from 'components/Loading';
  export default {
    name: 'callback',
    components:{
        Loading
    },
    props: ['auth'],
    data () {
      this.auth.handleAuthentication();
      return {}
    }
  }
</script>

<style lang="scss" scoped>
  .callback{
    margin-top:10em;
    .loading-wrapper{
      margin-left:50%;
    }
  }
</style>
