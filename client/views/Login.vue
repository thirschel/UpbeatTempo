<template>
  <div>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Auth0 - Vue</a>

          <router-link :to="'/'"
                       class="btn btn-primary btn-margin">
            Home
          </router-link>

          <button
            class="btn btn-primary btn-margin"
            v-if="authenticated"
            @click="logout()">
            Log Out
          </button>

        </div>
      </div>
    </nav>

    <div class="container">
    </div>
  </div>
</template>

<style>
  @import '../../node_modules/bootstrap/dist/css/bootstrap.css';

  .btn-margin {
    margin-top: 7px
  }
</style>
