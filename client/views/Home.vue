<template>
  <div class="page container">
    <div v-if='authenticated'>

      <section class="repo-selection">
        <div class="selection ub-btn" :class="{'ub-btn-primary':CONSTANTS.PERSONAL === selectedRepoType}"
             @click="changeRepos(CONSTANTS.PERSONAL)">Personal Repositories

        </div>
        <span class='selection ub-btn' :class="{'ub-btn-primary':CONSTANTS.TEAM === selectedRepoType}"
              @click="changeRepos(CONSTANTS.TEAM)">Team Repositories</span>
      </section>

      <div class="repo-controls" v-if="filteredRepos.length">
        <div class="search-repo-input">
          <custom-input :value="searchRepoName" :label="CONSTANTS.SEARCH_REPO_LABEL"
                        @valueChanged="searchTextChanged"></custom-input>
        </div>
        <div class="confirm-repos-wrapper">
          <button class="ub-btn ub-btn-primary" :disabled="!checkedRepos.length" @click="confirmRepositories">Confirm Repositories</button>
        </div>
      </div>

      <section class="repositories" :class="{ loading: loading }">
        <div class="repo" v-for="repo in filteredRepos" @click="onCheckRepository(repo)" :class="{'checked':isChecked(repo)}">
          <div class="repo-wrapper">
          <img class="repo-avatar" :src="repo.links.avatar.href"/>
          <div class="repo-names">
            <h2 class="name">{{repo.name}}</h2>
            <p class="project-name">{{repo.project.name}}</p>
          </div>
          </div>
        </div>

        <pagination v-if="total > pageSize" :total="total" :page-size="pageSize" :callback="pageChanged"></pagination>

        <transition name="fade">
          <div class="no-data" v-show="!displayRepos.length">
            <p>No repos found. </p>
            <img src="../assets/dead.png"/>
          </div>
        </transition>

        <transition name="fade">
          <div class="loading-wrapper">
            <loading v-show="loading"></loading>
          </div>
        </transition>
      </section>
    </div>
  </div>
</template>

<script>
  import Pagination from 'components/Pagination';
  import Loading from 'components/Loading';
  import Checkbox from 'components/Checkbox';
  import CustomInput from "components/Input";
  import router from './../router';

  export default {
    components: {
      Pagination,
      Loading,
      Checkbox,
      CustomInput
    },
    data(){
      const CONSTANTS = {
        PERSONAL: 'PERSONAL_REPOS',
        TEAM: 'TEAM_REPOS',
        SEARCH_REPO_LABEL: 'Search Repository Name...'
      }
      return {
        personalRepos: {values: []},
        teamRepos: {values: []},
        displayRepos: [],
        checkedRepos: [],
        CONSTANTS,
        selectedRepoType: CONSTANTS.TEAM,
        total: 0,
        page: 1,
        pageSize: 10,
        loading: false,
        searchRepoName: '',
      }
    },
    computed: {
      filteredRepos(){
        if (this.selectedRepoType === this.CONSTANTS.TEAM) {
          return this.searchRepoName === '' ?
            this.teamRepos.values.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize) :
            this.teamRepos.values.filter(tr => tr.name.toLowerCase().includes(this.searchRepoName.toLowerCase()));
        }
        else {
          return this.searchRepoName === '' ?
            this.personalRepos.values.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize) :
            this.personalRepos.values.filter(tr => tr.name.toLowerCase().includes(this.searchRepoName.toLowerCase()));

        }
      }
    },
    methods: {
      refreshToken(){
        this.$http.get(`/bitbucket/refresh?refresh_token=${localStorage.getItem('refresh_token')}`, {headers: {'Authorization': `Bearer ${access_token}`}}).then((access_token) => {
          localStorage.setItem('access_token', access_token.body.access_token)
        })
      },
      changeRepos(repoType){
        this.searchRepoName = '';
        this.selectedRepoType = repoType;
        this.total = repoType === this.CONSTANTS.TEAM ? this.teamRepos.values.length : this.personalRepos.values.length;
        this.displayRepos = repoType === this.CONSTANTS.TEAM ?
          this.teamRepos.values.slice(0, this.pageSize) :
          this.personalRepos.values.slice(0, this.pageSize);

      },
      pageChanged(page){
        this.page = page;
        if (this.selectedRepoType === this.CONSTANTS.TEAM && this.teamRepos.values[((page - 1) * this.pageSize + this.pageSize) - 1] ||
          this.selectedRepoType === this.CONSTANTS.PERSONAL && this.personalRepos.values[((page - 1) * this.pageSize + this.pageSize) - 1]) {
          this.changeDisplayRepos(page);
          return;
        }
        this.loading = true;
        const identifier = this.selectedRepoType === this.CONSTANTS.TEAM ? 'Arrowstream' : localStorage.getItem('bitbucket_user_name');
        const access_token = localStorage.getItem('access_token');
        const url = `https://api.bitbucket.org/2.0/repositories/${identifier}?page=${page}`;

        this.$http.get(url, {headers: {'Authorization': `Bearer ${access_token}`}}).then((repos) => {
          if (this.selectedRepoType === this.CONSTANTS.TEAM) {
            this.teamRepos.values = this.teamRepos.values.concat(repos.body.values);
          }
          else {
            this.personalRepos.values = this.personalRepos.values.concat(repos.body.values);
          }
          this.changeDisplayRepos(page);
          this.loading = false;
        })
      },
      changeDisplayRepos(page){
        this.filteredRepos = this.selectedRepoType === this.CONSTANTS.TEAM ?
          this.teamRepos.values.slice((page - 1) * this.pageSize, (page - 1) * this.pageSize + this.pageSize) :
          this.personalRepos.values.slice((page - 1) * this.pageSize, (page - 1) * this.pageSize + this.pageSize);
      },
      isChecked(repo){
        return !!this.checkedRepos.find(cr => cr.uuid === repo.uuid);
      },
      onCheckRepository(repo){
        if (this.checkedRepos.find(cr => cr.uuid === repo.uuid)) {
          this.checkedRepos = this.checkedRepos.filter(cr => cr.uuid !== repo.uuid);
        }
        else {
          this.checkedRepos.push(repo);
        }
      },
      searchTextChanged(value){
        this.searchRepoName = value;
      },
      confirmRepositories(){
          localStorage.setItem('repositories',JSON.stringify(this.checkedRepos));
          router.replace('/ConfirmRepositories')
      }
    },
    mounted(){
      const access_token = localStorage.getItem('access_token');
      const bitbucket_user_name = localStorage.getItem('bitbucket_user_name');
      this.loading = true;
      if (access_token && bitbucket_user_name) {
        this.$http.get(`https://api.bitbucket.org/2.0/repositories/${bitbucket_user_name}?pagelen=100`, {headers: {'Authorization': `Bearer ${access_token}`}}).then((repos) => {
          this.personalRepos = repos.body;
        })
        this.$http.get('https://api.bitbucket.org/2.0/repositories/ArrowStream?pagelen=100', {headers: {'Authorization': `Bearer ${access_token}`}}).then((repos) => {
          this.teamRepos = repos.body;
          this.changeDisplayRepos(1);
          this.loading = false;
        }, () => {
        })
      }
    },
    props: ['authenticated']
  }
</script>

<style lang="scss" scoped>
  @import '../assets/variables.scss';

  .repo-selection {
    display: flex;
    margin: 1em 0;
    .selection {
      cursor: pointer;
      margin-right: 1em;
      font-size: 20px;
      border-radius: 4px;
      padding: 6px 8px;
      border: 2px solid #70c1b3;
      transition: .3s ease-in-out;
      &.selected {
        background: #70c1b3;
        color: #FFF;

      }
    }
  }

  .search-repo-input {
    .input {
      width: 100%;
    }
  }

  .confirm-repos-wrapper {
    text-align: right;
  }

  .repositories {
    position: relative;
    &::before {
      content: 'a';
      background: #FFF;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: none;
      opacity: 0;
      z-index: -1;
      animation: loading-overlay-out 2s ease-in-out;
    }
    &.loading {
      &::after {
        animation: loading-overlay-in 2s ease-in-out;
      }
    }
    .loading-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 2;
      transform: translate(-50%, -50%);
    }
    .repo {
      width: calc(33% - 2em);
      margin-right: 2em;
      margin-bottom: 2em;
      display: inline-block;
      align-items: center;
      border-radius: 4px;
      border: 1px solid #e6e9eb;
      cursor: pointer;
      padding:15px 10px;
      transition:.3s ease-in-out;
      &.checked{
        background: linear-gradient(45deg, #135FAC 1%, #1e88e5 64%, #40BAF5 97%);
        border-width: 0px;
        box-shadow: 0 5px 30px -5px rgba(37,45,51, .5);
        color: #FFF ;
      }
      .repo-wrapper {
        display: flex;
        align-items: center;
        .checkbox {
          margin-right: 1em;
        }
        .repo-avatar {
          height: 40px;
          width: 40px;
          border-radius: 50%;
          margin-right: 1em;
        }
        .repo-names {
          text-align: left;
          .name {
            margin: 0;
            color: $brand-accent;
          }
          .project-name {
            margin: 0;
          }
        }
      }
    }
    .no-data {
      text-align: center;
      margin: 4em 0;
      img {
        width: 200px;
        height: 200px;
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
  {
    opacity: 0
  }

  @keyframes loading-overlay-in {
    0% {
      display: block;
      z-index: 2;
      opacity: 0;
    }
    99% {
      opacity: .5;
    }
    100% {
      opacity: .5;
    }
  }

  @keyframes loading-overlay-out {
    0% {
      opacity: .5;
    }
    99% {
      opacity: 0;
    }
    100% {
      display: none;
      opacity: 0;
      z-index: -1;
    }
  }
</style>
