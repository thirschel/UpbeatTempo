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
  body{
    font-family: 'Arimo', sans-serif;

    #bitbucket_loader_wrapper {
      animation: hover 2s ease-in-out infinite;
    }

    @keyframes hover {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-6px);
      }
      100% {
        transform: translateY(0px);
      }
    }

    #bitbucket_loader {
      display: block;
      height: 10rem;
      animation: spin-wobble 4s ease infinite;
    }

    @keyframes spin-wobble {
      0% {
        transform: translateX(10px) translateY(-5px) rotateX(8deg) rotateZ(10deg);
      }
      20% {
        transform: translateX(-10px) translateY(-5px) rotateX(8deg) rotateZ(-10deg);
      }
      10%,
      30%,
      90% {
        transform: translateX(0px) translateY(0px) rotateX(0deg) rotateZ(0deg);
      }
      100% {
        transform: translateX(10px) translateY(-5px) rotateX(8deg) rotateZ(10deg);
      }
    }

    .head,
    .mouth,
    .eye-inner {
      fill: #205081;
    }

    .eye-outter {
      fill: #FFFFFF;
    }

    .mouth {
      animation: mouth-drop 2s ease;
    }

    @keyframes mouth-drop {
      0%, 60% {
        transform: translateY(-60px);
      }
      70% {
        transform: translateY(0px);
      }
      80% {
        transform: translateY(-15px);
      }
      100% {
        transform: translateY(0px);
      }
    }

    .eye-translate g {
      animation: eye-rotate 4s ease infinite;
      transform-origin: center;
      transform: rotateY(70deg) translateZ(40px) translateX(80px) translateY(-8px) rotateX(-9.5deg);
    }

    @keyframes eye-rotate {
      0% {
        transform: rotateY(75deg) translateZ(40px) translateX(55px) translateY(-10px) rotateX(-9.5deg);
      }
      20% {
        transform: rotateY(-75deg) translateZ(40px) translateX(-55px) translateY(-10px) rotateX(-9.5deg);
      }
      10%,
      30%,
      90% {
        transform: rotateY(0deg) translateZ(40px) translateX(0px) translateY(0px) rotateX(0deg);
      }
      100% {
        transform: rotateY(75deg) translateZ(40px) translateX(55px) translateY(-10px) rotateX(-9.5deg);
      }
    }
  }
</style>
