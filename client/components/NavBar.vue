<template>
  <div class="nav-bar-wrapper">
    <div class="container nav-bar">
      <div class="nav-left">
        <div class="title">
          UpbeatTempo
        </div>
      </div>
      <div class="nav-right">
        <p v-if="!authenticated" @click="login()">
          Login
        </p>
        <p v-if="authenticated" @click="logout()">
          LogOut
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'nav-bar',
    props:['auth'],
    data () {
      this.auth.authNotifier.on('authChange', authState => {
        this.authenticated = authState.authenticated
      });
      return {
        authenticated:this.auth.authenticated,
      }
    },
    methods: {
      login(){
        window.location.href = `/bitbucket/authenticate`
      },
      logout(){
          this.auth.logout()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/variables.scss';
  .nav-bar-wrapper {
    background-color: $brand-primary;
    border-color: $brand-primary;
    padding:10px 0;
  }

  .nav-bar {
    display: flex;
    color: #FFF;
  }
  .nav-left, .nav-right{
    width:50%;
  }
  .nav-right{
    text-align:right;
  }

</style>
