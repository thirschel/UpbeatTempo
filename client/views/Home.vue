<template>
  <div class="page container">
    <div v-if='authenticated' class="team-prompt">
      Do you have a team name?
      <input type='text' class="team-input"/>
      <section class="repo-selection">
        <span @click="changeRepos(CONSTANTS.PERSONAL)">Personal Repositories</span>
        <span @click="changeRepos(CONSTANTS.TEAM)">Team Repositories</span>
      </section>
      <section class="repositories">
        <div class="repo" v-for="repo in displayRepos">
          <img class="repo-avatar" :src="repo.links.avatar.href"/>
          <div class="repo-names">
            <h2 class="name">{{repo.name}}</h2>
            <p class="project-name" >{{repo.project.name}}</p>
          </div>
        </div>
        <pagination v-if="total > pageSize" :total="total" :page-size="pageSize" :callback="pageChanged"></pagination>
        <div class="no-data" v-if="!displayRepos.length">
          <p>No repos found. </p>
          <img src="../assets/dead.png"/>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import Pagination from 'components/Pagination';

  export default {
  components: {
    Pagination
  },
  data(){
      const CONSTANTS = {
        PERSONAL:'PERSONAL_REPOS',
          TEAM:'TEAM_REPOS'
      }
      return{
        personalRepos:{values:[]},
        teamRepos:{values:[]},
        displayRepos:[],
        CONSTANTS,
        selectedRepoType:CONSTANTS.TEAM,
        total: 0,
        pageSize: 0,
      }
  },
  methods:{
      refreshToken(){
        this.$http.get(`/bitbucket/refresh?refresh_token=${localStorage.getItem('refresh_token')}`, {headers:{'Authorization': `Bearer ${access_token}`}}).then((access_token)=>{
          localStorage.setItem('access_token', access_token.body.access_token)
        })
      },
      changeRepos(repoType){
          this.selectedRepoType = repoType;
          this.total = repoType === this.CONSTANTS.TEAM ? this.teamRepos.size : this.personalRepos.size;
          this.pageSize = repoType === this.CONSTANTS.TEAM ? this.teamRepos.pagelen : this.personalRepos.pagelen;
          this.displayRepos = repoType === this.CONSTANTS.TEAM ?
            this.teamRepos.values.slice(0,this.pageSize) :
            this.personalRepos.values.slice(0,this.pageSize);

      },
    pageChanged(page){
      if(this.selectedRepoType === this.CONSTANTS.TEAM && this.teamRepos[((page - 1) * this.pageSize + this.pageSize)-1] ||
         this.selectedRepoType === this.CONSTANTS.PERSONAL && this.personalRepos[((page - 1) * this.pageSize + this.pageSize)-1]) {
          this.changeDisplayRepos(page);
          return;
      }
      const identifier = this.selectedRepoType === this.CONSTANTS.TEAM ? 'Arrowstream' : localStorage.getItem('bitbucket_user_name');
      const access_token = localStorage.getItem('access_token');
      const url = `https://api.bitbucket.org/2.0/repositories/${identifier}?page=${page}`;

      this.$http.get(url, {headers:{'Authorization': `Bearer ${access_token}`}}).then((repos)=>{
          if(this.selectedRepoType === this.CONSTANTS.TEAM){
            this.teamRepos.values = this.teamRepos.values.concat(repos.body.values);
          }
          else{
            this.personalRepos.values = this.personalRepos.values.concat(repos.body.values);
          }
          this.changeDisplayRepos(page);
      })
    },
    changeDisplayRepos(page){
        this.displayRepos =  this.selectedRepoType === this.CONSTANTS.TEAM ?
            this.teamRepos.values.slice((page - 1) * this.pageSize,(page - 1) * this.pageSize + this.pageSize) :
            this.personalRepos.values.slice((page - 1) * this.pageSize,(page - 1) * this.pageSize + this.pageSize);
    }

  },
  mounted(){
    const access_token = localStorage.getItem('access_token');
    const bitbucket_user_name = localStorage.getItem('bitbucket_user_name');
    if(access_token && !bitbucket_user_name) {
      this.$http.get('https://api.bitbucket.org/2.0/user', {headers:{'Authorization': `Bearer ${access_token}`}}).then((userInfo)=>{
        this.$http.post('/updateUser',{bitbucket_id:userInfo.body.uuid}).then(()=>{});
        localStorage.setItem('bitbucket_user_name', userInfo.body.username)
      })
    }
    else if(access_token && bitbucket_user_name){
      this.$http.get(`https://api.bitbucket.org/2.0/repositories/${bitbucket_user_name}`, {headers:{'Authorization': `Bearer ${access_token}`}}).then((repos)=>{
        this.personalRepos = repos.body;
      })
      this.$http.get('https://api.bitbucket.org/2.0/repositories/ArrowStream', {headers:{'Authorization': `Bearer ${access_token}`}}).then((repos)=>{
        this.teamRepos = repos.body;
      },()=>{})
    }
  },
  props:['authenticated']
}
</script>
@import '../../node_modules/bootstrap/dist/css/bootstrap.css';
<style lang="scss" scoped>
  .repo{
    display: flex;
    align-items:center;
    .repo-avatar{
      height: 40px;
      width: 40px;
      border-radius: 50%;
      margin-right:1em;
    }
    .repo-names{
      .name{
        margin:0;
      }
      .project-name{
        margin:0;
      }
    }
  }
  .no-data{
    text-align:center;
    img{
      width:200px;
      height:200px;
    }
  }
</style>
