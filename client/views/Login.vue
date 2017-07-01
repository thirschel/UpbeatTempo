<template>
  <section class="login">
    <section class="hero-about">
      <div class="container">
        <h1>Turn Time Keeping </br> Tasks Upbeat </h1>
      </div>
    </section>
    <section class="learn-more container">
      <section class="overview">
        <h1>Welcome to Upbeat Time Keeping</h1>
        <p>Automatically search your commit history for time keeping items and log time against them.</p>
        <div class="steps">
          <div class="step">
            Grant access through BitBucket. No additional logins required.
          </div>
          <div class="step">
            Select your personal and team repositories you want to search through.
          </div>
          <div class="step">
            Set the search criteria and see the potential time entries.
          </div>
          <div class="step">
            Look over and approve the time entries and submit them.
          </div>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
  export default {
    name:'Login',
  }
</script>

<style lang="scss" scoped>
  .login{
    .hero-about{
      background-image: url('../assets/background-polygons@2x.png'),linear-gradient(-90deg,#397AE9 15%,#4789E1 24%,#ADF2AB 140%);
      animation: background-gradient 30s ease infinite;
      background-position: center,top;
      background-repeat: no-repeat,no-repeat;
      background-size: cover,cover;
      height: 768px;
      h1{
        font-size: 3.125em;
        color: #fff;
        font-weight: 400;
        line-height: 1.2;
        margin:0;
      }
    }
    .learn-more{
      .overview{
        h1{
          font-size: 3.4375em;
          color: #505050;
          font-weight: 400;
          line-height: 1.2;
          margin: 0 0 10px;
          text-align: center;
        }
        p{
          font-size: 1.375em;
          color: #505050;
          line-height: 1.4;
          text-align: center;
        }
      }
    }
  }
  @keyframes background-gradient {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
  }
</style>
