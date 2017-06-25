import Rx from 'rxjs/Rx';
import EventEmitter from 'EventEmitter'
import router from './../router'

export default class AuthService {

  authenticated = this.isAuthenticated();
  authNotifier = new EventEmitter();

  constructor () {
    this.setSession = this.setSession.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  handleAuthentication () {
    var params = this.getParams(window.location.search);
      if (params['access_token']) {
        var token = this.parseJwt(params.access_token);
        this.getAuthorizedJSON('https://api.bitbucket.org/2.0/user' , token.access_token).subscribe(userInfo=>{
          this.postJSON('/updateUser', {bitbucket_id: userInfo.uuid}).subscribe(user=>{
            this.setSession(token, userInfo, user);
            if(user.has_confirmed_team_name){
              router.replace('/')
            }
            else{
              router.replace('/setTeamName')
            }
          })
        });
      } else {
        router.replace('/');
        alert(`Error: Did not receive access token.`)
      }
  }

  setSession (token, userInfo, user) {
    let expiresAt = JSON.stringify(
      token.expires_in * 1000 + new Date().getTime()
    )
    localStorage.setItem('bitbucket_id', userInfo.uuid);
    localStorage.setItem('team_name', user.team_name);
    localStorage.setItem('bitbucket_user_name', userInfo.username);
    localStorage.setItem('access_token', token.access_token);
    localStorage.setItem('refresh_token', token.refresh_token);
    localStorage.setItem('expires_at', expiresAt);
    this.authNotifier.emit('authChange', { authenticated: true })
  }

  logout () {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('bitbucket_user_name');
    localStorage.removeItem('expires_at');
    this.userProfile = null;
    this.authNotifier.emit('authChange', false);
    // navigate to the home route
    router.replace('home');
  }

  isAuthenticated () {
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt
  }

  parseJwt(token){
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  getParams(query) {
    if (!query) {
      return { };
    }

    return (/^[?#]/.test(query) ? query.slice(1) : query)
      .split('&')
      .reduce((params, param) => {
        let [ key, value ] = param.split('=');
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
      }, { });
  };

  postJSON(url, data) {
    return Rx.Observable.create(observer => {
      let canceled = false;
      if (!canceled) {
        $.ajax({
          type: 'POST',
          url,
          data,
          success: (res => {
            observer.next(res);
            observer.complete();
          }),
          error: (err => observer.error(err)),
        });
      }
      return () => canceled = true;
    });
  }

  getAuthorizedJSON(url, accessToken) {
    return Rx.Observable.create(observer => {
      let canceled = false;
      if (!canceled) {
        $.ajax({
          type: 'GET',
          beforeSend: function(request) {
            request.setRequestHeader("Authorization", `Bearer ${accessToken}`);
          },
          url,
          success: (res => {
            observer.next(res);
            observer.complete();
          }),
          error: (err => observer.error(err)),
        });
      }
      return () => canceled = true;
    });
  }
}
