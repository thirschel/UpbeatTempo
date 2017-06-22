<template>
  <div class="page">
    <p>test</p>
  </div>
</template>

<script>
var repositories
export default {
  components: {
  },
  data(){
      var access_token = localStorage.getItem('access_token');
      var bitbucket_user_name = localStorage.getItem('bitbucket_user_name');
      if(access_token && !bitbucket_user_name) {
        this.$http.get('https://api.bitbucket.org/2.0/user', {headers:{'Authorization': `Bearer ${access_token}`}}).then((userInfo)=>{
            localStorage.setItem('bitbucket_user_name', userInfo.body.username)
        })
      }
      else if(access_token && bitbucket_user_name){
        this.$http.get(`https://api.bitbucket.org/2.0/repositories/${bitbucket_user_name}`, {headers:{'Authorization': `Bearer ${access_token}`}}).then((repos)=>{
          console.log(repos.body)
        })
        this.$http.get('https://api.bitbucket.org/2.0/repositories/ArrowStream', {headers:{'Authorization': `Bearer ${access_token}`}}).then((repos)=>{
          console.log(repos.body)
        },()=>{})
      }
      return{

      }
  },
  methods:{
      refreshToken(){
        this.$http.get(`/bitbucket/refresh?refresh_token=${localStorage.getItem('refresh_token')}`, {headers:{'Authorization': `Bearer ${access_token}`}}).then((access_token)=>{
          localStorage.setItem('access_token', access_token.body.access_token)
        })
      }
  }
}
</script>
