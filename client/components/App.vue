<template>
  <div id="app">
    <nav-bar :auth="auth"></nav-bar>
    <router-view :auth="auth" :authenticated="authenticated"></router-view>
  </div>
</template>

<script>
  import NavBar from 'components/NavBar'
  import AuthService from 'auth/AuthService';

  const auth = new AuthService();
  const { authNotifier, authenticated } = auth;
  export default {
    name: 'app',
    components: {
      NavBar
    },
    data () {
      authNotifier.on('authChange', authState => {
        this.authenticated = authState.authenticated
      });
      return {
        auth,
        authenticated
      }
    },
  }
</script>

<style>
@import '../../node_modules/bootstrap/dist/css/bootstrap.css';
</style>
