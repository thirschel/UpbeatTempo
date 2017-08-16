<template>
  <div id="app">
    <nav-bar :auth="auth"></nav-bar>
    <div class="task-progress" v-if="['home', 'ConfirmRepositories'].indexOf($route.name) > -1">
      <div class="container task-container">
        <div class="task select-repos" :class="{'active':['home'].indexOf($route.name) > -1}" @click="goToRepositories">
          <div class="task-number">1</div>
          <span class="task-description">Repositories</span>
        </div>
        <div class="task commit-filters" :class="{'active':['ConfirmRepositories'].indexOf($route.name) > -1}" @click="goToFilters">
          <div class="task-number">2</div>
          <span class="task-description">Commit Filters</span>
        </div>
        <div class="task confirm-entry" :class="{'active':['Confirm'].indexOf($route.name) > -1}">
          <div class="task-number">3</div>
          <span class="task-description">Confirm Time Entry</span>
        </div>
      </div>
    </div>
    <router-view :auth="auth" :authenticated="authenticated"></router-view>
  </div>
</template>

<script>
  import NavBar from 'components/NavBar'
  import AuthService from 'auth/AuthService'
  import router from './../router';

  const auth = new AuthService()
  const {authNotifier, authenticated} = auth
  export default {
    name: 'app',
    components: {
      NavBar
    },
    data () {
      authNotifier.on('authChange', authState => {
        this.authenticated = authState.authenticated
      })
      return {
        auth,
        authenticated
      }
    },
    methods:{
      goToRepositories(){
        router.replace('/home')
      },
      goToFilters(){
        router.replace('/ConfirmRepositories')
      }
    }
  }
</script>

<style lang="scss">
  @import '../../node_modules/bootstrap/dist/css/bootstrap.css';
  @import '../assets/variables.scss';

  body {
    font-family: 'Arimo', sans-serif;
    background: #f5f6f7;
    .ub-btn {
      font-size: 20px;
      border-radius: 4px;
      padding: 6px 8px;
      color: $brand-accent;
      min-width: 90px;
      background: #FFF;
      outline: none;
      border: 2px solid $brand-accent;
      transition: .3s ease-in-out;
      &:disabled {
        opacity: .5;
        cursor: not-allowed;
      }
    }
    .ub-btn-primary {
      color: #FFF;
      background: $brand-accent;
      &:active {
        background: $brand-accent-dark;
        border-color: $brand-accent-dark;
      }
    }
    .task-progress{
      margin-top:1em;
      .task-container {
        display: flex;
        .task {
          width:33%;
          opacity:.5;
          cursor: pointer;
          transition:.3s ease-in-out;
          &.select-repos{
            text-align:left;
          }
          &.commit-filters{
            text-align:center;
          }
          &.confirm-entry{
            text-align:right;
          }
          .task-number {
            background: #f5f6f7;
            color: #333;
            border:1px solid #333;
            padding: 4px 8px;
            border-radius: 50%;
            display: inline-block;
            width:26px;
            height:26px;
            font-size:13px;
            margin-right:1em;
          }
          .task-description {
            font-weight: bold;
            color: #333;
          }
          &.active{
            opacity:1;
            .task-number{
              background: #247ba0;
              color: #FFF;
              border:1px solid #247ba0;
            }
          }
        }
      }
    }
  }
</style>
