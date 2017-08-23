<template>
  <section class="confirm-repositories">
    <div class="container">
      <section class="query-text">
        <h2>I want to search </h2>
        <h2 class="query-input"  @click="goToRepositories">
          {{repoCount > 1 ? ' these' : ' this' }} {{repoCount}} {{repoCount > 1 ? 'repositories ' : 'repository '}}
        </h2>
        <h2>for my commits that occurred between </h2>
        <datepicker orientation="landscape" :doubled="true" @dateChanged="dateRangeChanged"></datepicker>
        <h2> and that match </h2>
        <div class="query-input">
          <custom-input value="DEV-\d{1,4}" @valueChanged="regexChanged"></custom-input>
        </div>
        <h2> in the commit message.</h2>
      </section>

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
    </div>
    <div class="confirm-filters-wrapper">
      <button class="ub-btn ub-btn-primary confirm-filters-btn" @click="filterCommits">
        Search Repositories
      </button>
    </div>
  </section>
</template>

<script>
  import Datepicker from 'components/Datepicker';
  import Loading from 'components/Loading';
  import CustomInput from 'components/Input';
  import moment from 'moment';
  import router from './../router';

  export default {
    name: 'ConfirmRepositories',
    components: {
      Datepicker,
      Loading,
      CustomInput
    },
    data() {
      const CONSTANTS = {
        TEAM_PROMPT_LABEL: 'Team Name',
      };
      var repos = JSON.parse(localStorage.getItem('repositories'));
      return {
        CONSTANTS,
        regex: 'DEV-\\d{1,4}',
        startDate: '',
        endDate: '',
        loading: false,
        tickets: new Map(),
        commits: [],
        repoCount: repos.length
      }
    },
    methods: {
      regexChanged(value) {
        var regex = value ? value.replace(/\\/g, "\\\\") : '';
        this.regex = new RegExp(value)
      },
      goToRepositories(){
        router.replace('/home');
      },
      dateRangeChanged(dates) {
        this.startDate = dates.start;
        this.endDate = dates.end;
      },
      filterCommits() {
        this.loading = true;
        const access_token = localStorage.getItem('access_token');
        const bitbucket_id = localStorage.getItem('bitbucket_id');
        const repos = JSON.parse(localStorage.getItem('repositories'));
        const repoCommits = {};
        const getCommits = (repo, url) => {
          this.$http.get(`${url}&pagelen=100`, {headers: {'Authorization': `Bearer ${access_token}`}}).then((commits) => {
            repoCommits[repo.name] = repoCommits[repo.name].concat(commits.body.values);
            if (!moment(commits.body.values[commits.body.values.length - 1].date).isBefore(this.startDate, 'day') && commits.body.next) {
              getCommits(repo, commits.body.next);
            }
            else {
              repoCommits[repo.name].forEach((commit) => {
                if (moment(commit.date).isAfter(this.startDate, 'day') &&
                  moment(commit.date).isBefore(this.endDate, 'day') &&
                  commit.author.user.uuid === bitbucket_id) {
                  var match = commit.message.match(this.regex);
                  if (commit.message.match(this.regex)) {
                    commit.ticket = match[0];
                    commit.dateString = moment(commit.date).format('YYYY-MM-DD');
                    if (this.tickets.has(match[0])) {
                      var value = this.tickets.get(match[0]);
                      this.tickets.set(value.concat([commit]));
                    }
                    else {
                      this.tickets.set(match[0], [commit]);
                    }
                    this.commits.push(commit);
                  }
                }
              })
            }
          })
          this.commits.sort((a, b) => new Date(a.dateString) - new Date(b.dateString));
        }
        repos.forEach((repo, i) => {
          repoCommits[repo.name] = [];
          getCommits(repo, `${repo.links.commits.href}?page=1`);
          if (i === repos.length - 1) {
            this.loading = false;
          }
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../assets/variables.scss';
  .query-text {
    text-align: center;
    * {
      display: inline-block;
    }
    .query-input{
      color: $brand-accent;
      cursor: pointer;
    }
  }

  .confirm-filters-wrapper {
    position: fixed;
    bottom: 0px;
    width: 100%;
    transition: 0.25s ease-in-out;
    &.active {
      bottom: 0;
    }
    .confirm-filters-btn {
      width: 100%;
    }
  }

  .ticket {
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
