<template>
  <section class="confirm-repositories container">
    <section class="date-range-selection">
      <h2>When are you looking for commits?</h2>
      <datepicker orientation="landscape" :doubled="true" @dateChanged="dateRangeChanged"></datepicker>
    </section>
    <section class="ticket-selection">
      <h2>What do your ticket numbers looks like?</h2>
      <custom-input placeholder="DEV-\d{1,4}" label="Ticket Regex" @valueChanged="regexChanged"></custom-input>
    </section>

    <button class="ub-btn ub-btn-primary" @click="filterCommits">Search Repositories</button>

    <transition name="fade">
      <div class="loading-wrapper">
        <loading v-show="loading"></loading>
      </div>
    </transition>

    <div class='ticket' v-for="commit in commits">
      <div class="ticket-header">
        <p>{{commit.ticket}}</p>
        <p>{{commit.dateString}}</p>
      </div>
      <div class="body">

      </div>
    </div>

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
        regex:'',
        startDate:'',
        endDate:'',
        loading:false,
        tickets:new Map(),
        commits:[],
      }
    },
    methods:{
      regexChanged(value){
          var regex = value ? value.replace(/\\/g, "\\\\") : '';
          this.regex = new RegExp(value)
      },
      dateRangeChanged(dates){
          this.startDate = dates.start;
          this.endDate = dates.end;
      },
      filterCommits(){
        this.loading = true;
        const access_token = localStorage.getItem('access_token');
        const bitbucket_id = localStorage.getItem('bitbucket_id');
        const repos = JSON.parse(localStorage.getItem('repositories'));
        const repoCommits = {};
        const getCommits = (repo, url)=>{
          this.$http.get(`${url}&pagelen=100`, {headers: {'Authorization': `Bearer ${access_token}`}}).then((commits) => {
            repoCommits[repo.name] = repoCommits[repo.name].concat(commits.body.values);
            if(!moment(commits.body.values[commits.body.values.length - 1].date).isBefore(this.startDate, 'day') && commits.body.next){
              getCommits(repo,commits.body.next);
            }
            else{
              repoCommits[repo.name].forEach((commit)=>{
                if(moment(commit.date).isAfter(this.startDate, 'day') &&
                  moment(commit.date).isBefore(this.endDate, 'day') &&
                  commit.author.user.uuid === bitbucket_id){
                    var match = commit.message.match(this.regex);
                    if(commit.message.match(this.regex)){
                      commit.ticket = match[0];
                      commit.dateString = moment(commit.date).format('YYYY-MM-DD');
                      if(this.tickets.has(match[0])){
                          var value = this.tickets.get(match[0]);
                          this.tickets.set(value.concat([commit]));
                      }
                      else{
                          this.tickets.set(match[0],[commit]);
                      }
                      this.commits.push(commit);
                    }
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
    },
  }
</script>

<style lang="scss" scoped>
  .ticket{
    background: #FFF;
    margin: 1em 0;
    padding: 32px 32px 16px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    .ticket-header {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #CCC;
      padding-bottom: 1em;
    }
  }
</style>
