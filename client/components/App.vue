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

<style lang="scss">
@import '../../node_modules/bootstrap/dist/css/bootstrap.css';
@import '../assets/variables.scss';
  body{
    font-family: 'Arimo', sans-serif;
    .ub-btn{
      font-size: 20px;
      border-radius: 4px;
      padding: 6px 8px;
      color: $brand-accent;
      min-width:90px;
      background: #FFF;
      outline:none;
      border: 2px solid $brand-accent;
      transition:.3s ease-in-out;
      &:disabled{
        opacity: .5;
        cursor: not-allowed;
      }
    }
    .ub-btn-primary{
      color: #FFF;
      background: $brand-accent;
      &:active{
        background:$brand-accent-dark;
        border-color:$brand-accent-dark;
      }
    }
  }
</style>
