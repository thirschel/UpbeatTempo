<template>
  <section class="confirm-repositories container">
    <section class="date-range-selection">
      <h2>When are you looking for commits?</h2>
      <datepicker orientation="landscape" :doubled="true"></datepicker>
    </section>
    <section class="ticket-selection">
      <h2>What do your ticket numbers looks like?</h2>
      <custom-input placeholder="DEV-\d{1,4}" label="Ticket Regex"></custom-input>
    </section>

    <transition name="fade">
      <div class="loading-wrapper">
        <loading v-show="loading"></loading>
      </div>
    </transition>

  </section>
</template>

<script>
  import Datepicker from 'components/Datepicker';
  import Loading from 'components/Loading';
  import CustomInput from 'components/Input';
  import moment from 'moment';

  export default {
    name:'ConfirmRepositories',
    components: {
      Datepicker,
      Loading,
      CustomInput
    },
    data(){
      const CONSTANTS = {
        TEAM_PROMPT_LABEL: 'Team Name',
      };
      return {
        CONSTANTS,
        loading:false,
      }
    },
    methods:{
    },
    mounted(){
      this.loading = true;
      const access_token = localStorage.getItem('access_token');
      const bitbucket_id = localStorage.getItem('bitbucket_id');
      const repos = JSON.parse(localStorage.getItem('repositories'));
      const repoCommits = {};
      const getCommits = (repo, url)=>{
        this.$http.get(`${url}&pagelen=100`, {headers: {'Authorization': `Bearer ${access_token}`}}).then((commits) => {
          repoCommits[repo.name] = repoCommits[repo.name].concat(commits.body.values);
          if(!moment(commits.body.values[commits.body.values.length - 1].date).isBefore('2017-05-01', 'day') && commits.body.next){
            getCommits(repo,commits.body.next);
          }
          else{
            repoCommits[repo.name].forEach(commit=>{
                if(moment(commit.date).isAfter('2017-05-01', 'day') &&
                   moment(commit.date).isBefore('2017-06-01', 'day') &&
                   commit.author.user.uuid === bitbucket_id){

                }
            })
          }
        })
      }
      repos.forEach((repo,i)=>{
        repoCommits[repo.name] = [];
        getCommits(repo, `${repo.links.commits.href}?page=1`);
          if(i === repos.length - 1){
              this.loading = false;
          }
      })
    }
  }
</script>

<style lang="scss" scoped>

</style>
