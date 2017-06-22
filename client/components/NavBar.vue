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
  import { AUTH_CONFIG } from '../auth/auth0-variables'
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
        window.location.href = `http://localhost:4000/bitbucket/authenticate`
      },
      logout(){
          this.auth.logout()
      }
    }
  }
</script>

<style>
  .nav-bar-wrapper {
    background-color: #f8f8f8;
    border-color: #e7e7e7;
    padding:10px 0;
  }

  .nav-bar {
    display: flex;
    color: #777;
  }
  .nav-left, .nav-right{
    width:50%;
  }
  .nav-right{
    text-align:right;
  }

</style>
