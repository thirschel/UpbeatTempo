<template>
  <section class="set-team-name container">
    <div class="team-prompt slide-in-blurred-top" :class="{'slide-out-blurred-top':complete}">
      <h2>Do you have a team name?</h2>
      <custom-input :value="teamName" :label="CONSTANTS.TEAM_PROMPT_LABEL"
                    @valueChanged="teamNameChanged"></custom-input>
      <div class="buttons">
        <button class="ub-btn" @click="noTeamName">No</button>
        <button class="ub-btn ub-btn-primary" :disabled="!teamName.length" @click="confirmTeamName">Confirm</button>
      </div>
    </div>
  </section>
</template>

<script>
  import CustomInput from "components/Input";
  import router from './../router';

  export default {
    name:'SetTeamName',
    components: {
      CustomInput
    },
    data(){
      const CONSTANTS = {
        TEAM_PROMPT_LABEL: 'Team Name',
      }
      var bitbucketId = localStorage.getItem('bitbucket_id');
      return {
        CONSTANTS,
        bitbucketId,
        teamName: '',
        complete:false,
      }
    },
    methods:{
        teamNameChanged(value){
          this.teamName = value;
        },
        noTeamName(){
            this.complete = true;
            this.$http.post('/updateTeamName',{teamName:null, bitbucket_id:this.bitbucketId});
            setTimeout(()=>{
              router.replace('/')
            },700);
        },
        confirmTeamName(){
            if(this.teamName.length) {
              this.complete = true;
              this.$http.post('/updateTeamName',{teamName:this.teamName, bitbucket_id:this.bitbucketId});
              localStorage.setItem('team_name',this.teamName);
              setTimeout(() => {
                router.replace('/')
              }, 700)
            }
        }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../node_modules/bootstrap/dist/css/bootstrap.css';

  .set-team-name{
    .team-prompt{
      box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
      padding: 4em;
      margin: 0 auto;
      margin-top: 4em;
      width: 50%;
      background: #fff;
    }
  }

  .slide-in-blurred-top {
    -webkit-animation: slide-in-blurred-top 0.5s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
    animation: slide-in-blurred-top 0.5s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
  }

  .slide-out-blurred-top {
    -webkit-animation: slide-out-blurred-top 0.45s cubic-bezier(0.755, 0.050, 0.855, 0.060) both;
    animation: slide-out-blurred-top 0.45s cubic-bezier(0.755, 0.050, 0.855, 0.060) both;
  }

  @-webkit-keyframes slide-in-blurred-top {
    0% {
      -webkit-transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
      transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
      -webkit-transform-origin: 50% 0%;
      transform-origin: 50% 0%;
      -webkit-filter: blur(40px);
      filter: blur(40px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0) scaleY(1) scaleX(1);
      transform: translateY(0) scaleY(1) scaleX(1);
      -webkit-transform-origin: 50% 50%;
      transform-origin: 50% 50%;
      -webkit-filter: blur(0);
      filter: blur(0);
      opacity: 1;
    }
  }
  @keyframes slide-in-blurred-top {
    0% {
      -webkit-transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
      transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
      -webkit-transform-origin: 50% 0%;
      transform-origin: 50% 0%;
      -webkit-filter: blur(40px);
      filter: blur(40px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0) scaleY(1) scaleX(1);
      transform: translateY(0) scaleY(1) scaleX(1);
      -webkit-transform-origin: 50% 50%;
      transform-origin: 50% 50%;
      -webkit-filter: blur(0);
      filter: blur(0);
      opacity: 1;
    }
  }

  @-webkit-keyframes slide-out-blurred-top {
    0% {
      transform: translateY(0) scaleY(1) scaleX(1);
      transform-origin: 50% 0%;
      filter: blur(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-1000px) scaleY(2) scaleX(0.2);
      transform-origin: 50% 0%;
      filter: blur(40px);
      opacity: 0;
    }
  }
  @keyframes slide-out-blurred-top {
    0% {
      transform: translateY(0) scaleY(1) scaleX(1);
      transform-origin: 50% 0%;
      filter: blur(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(-1000px) scaleY(2) scaleX(0.2);
      transform-origin: 50% 0%;
      filter: blur(40px);
      opacity: 0;
    }
  }


</style>
