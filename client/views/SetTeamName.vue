<template>
  <section class="set-team-name container">
    <div class="buttons">
      <div class="loader-button" :class="{'loading':sending}" @click="send">
        <button class="ub-btn ub-btn-primary">
          <span>Save</span>
        </button>
        <svg class="svg-loading">
          <circle cx="22" cy="22" r="20" style="stroke: #70c1b3; stroke-width:4; fill:transparent"/>
        </svg>
      </div>
    </div>
    <div class="jira-prompt prompt" :class="{'slide-out-blurred-top':complete}">
      <div class="prompt-header">
        <h2 class="prompt-title">Atlassian Settings</h2>
        <p class="prompt-explanation" @click="toggleExplanation">Why is this needed?</p>
      </div>
      <div class="prompt-body">
        <div class="prompt-inputs">
          <div class="username-wrapper">
            <custom-input :value="userName" :label="CONSTANTS.USERNAME_LABEL"
                          @valueChanged="userNameChanged"></custom-input>
          </div>
          <div class="password-wrapper">
            <custom-input :value="password" :label="CONSTANTS.PASSWORD_LABEL" type="password"
                          @valueChanged="passwordChanged"></custom-input>
          </div>
          <div class="instance-wrapper">
            <custom-input :value="instanceName" :label="CONSTANTS.INSTANCE_LABEL"
                          @valueChanged="instanceNameChanged"></custom-input>
          </div>
        </div>
        <div class="explanation" :class="{'show':showExplanation}">
          Jira's API is tied to their tenant/subdomain based instances. Jira has support for OAuth 1.0 however, it requires the admin the instance to create an Application Link
        with a private key and share the private key to the consumer application. However, the API can also be accessed using Basic Auth in which credentials are sent encoded over TLS with request.
        If you choose to store your credentials on UpbeatTempo, a base64 encoded string of the username and password is salted and hashed using 1000 rounds. Otherwise you may choose to enter your credentials everytime and they are never stored.
        The sourcecode is openly available to look at on github
        </div>
      </div>
    </div>
    <div class="team-prompt prompt" :class="{'slide-out-blurred-top':complete}">
      <div class="prompt-header">
        <h2 class="prompt-title">Bitbucket Settings</h2>
      </div>
      <div class="prompt-body">
        <div class="prompt-inputs">
          <div class="teamname-wrapper">
            <custom-input :value="teamName" :label="CONSTANTS.TEAM_PROMPT_LABEL"
                          @valueChanged="teamNameChanged"></custom-input>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import CustomInput from "components/Input";
  import router from './../router';

  export default {
    name: 'SetTeamName',
    components: {
      CustomInput
    },
    data(){
      const CONSTANTS = {
        TEAM_PROMPT_LABEL: 'Team Name',
        USERNAME_LABEL: 'Atlassian Username',
        PASSWORD_LABEL: 'Atlassian Password',
        INSTANCE_LABEL: 'Atlassian Instance Name',
      }
      var bitbucketId = localStorage.getItem('bitbucket_id');
      return {
        CONSTANTS,
        bitbucketId,
        userName: '',
        password: '',
        instanceName: '',
        teamName: '',
        complete: false,
        showExplanation: false,
        sending: false
      }
    },
    methods: {
      userNameChanged(value){
        this.userName = value;
      },
      passwordChanged(value){
        this.password = value;
      },
      instanceNameChanged(value){
        this.instanceName = value;
      },
      teamNameChanged(value){
        this.teamName = value;
      },
      send(){
        this.sending = !this.sending;
        var auth = btoa(`${this.userName}:${this.password}`);
        this.$http.post('/updateSettings', {bitbucketId: this.bitbucketId, jiraAuth: auth, jiraInstanceName:this.instanceName, teamName:this.teamName})
          .then((success)=>{
            console.log(success);
          },(err)=>{
            console.log(err);
          });
      },
      toggleExplanation(){
        this.showExplanation = !this.showExplanation;
      }
    },
    mounted(){
      const bitbucket_user_name = localStorage.getItem('bitbucket_id');
      this.loading = true;
      if (bitbucket_user_name) {
        this.$http.get(`/settings?bitbucketId=${bitbucket_user_name.replace(/{|}/g,'')}`,).then((settings) => {
          console.log(settings.body)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../node_modules/bootstrap/dist/css/bootstrap.css';

  .set-team-name {
    margin-top: 1em;
    .buttons {
      text-align: right;
      .loader-button {
        position: relative;
        .ub-btn {
         transition:.25s ease-in-out, opacity .25s ease-in-out .3s;
          span {
            transition: .25s ease-in-out;
          }
        }
        .svg-loading {
          overflow: hidden;
          position: absolute;
          width: 44px;
          height: 44px;
          right: 0;
          top:0;
          circle {
            stroke: #70c1b3;
            stroke-width: 4;
            fill: transparent;
            stroke-dashoffset: -12px;
            stroke-dasharray: 131;
          }
        }
        &.loading {
          width:44px;
          height:44px;
          animation:rotate .5s linear infinite;
          animation-delay:.5s;
          .ub-btn {
            opacity:0;
            width: 44px;
            border-radius: 50%;
            min-width: 40px;
            height: 44px;
            span {
              opacity: 0;
            }
          }
        }
      }
    }
    .prompt {
      background: #FFF;
      margin: 1em 0;
      padding: 32px 32px 16px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
      .prompt-header {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #CCC;
        padding-bottom: 1em;
        .prompt-title {
          margin: 0;
          width: 50%;
          color: #666;
        }
      }
    }

    .jira-prompt {
      .prompt-header {
        .prompt-explanation {
          margin: 0;
          cursor: pointer;
          width: 50%;
          color: #448EE1;
          font-weight: bold;
          text-align: right;
        }
      }
      .prompt-body {
        display: flex;
        align-items: center;
        .prompt-inputs {
          width: 50%;
        }
        .explanation {
          width: 50%;
          opacity: 0;
          transition: .25s ease-in-out;
          &.show {
            opacity: 1;
          }
        }
      }
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

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
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
