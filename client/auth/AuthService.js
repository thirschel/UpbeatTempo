import auth0 from 'auth0-js'
import EventEmitter from 'EventEmitter'
import router from './../router'

export default class AuthService {

  authenticated = this.isAuthenticated();
  authNotifier = new EventEmitter();

  constructor () {
    this.login = this.login.bind(this);
    this.setSession = this.setSession.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login () {
    this.auth0.authorize()
  }

  handleAuthentication () {
    var params = this.getParams(window.location.search);
      if (params['access_token']) {
        this.setSession(params);
        router.replace('home')
      } else {
        router.replace('home');
        alert(`Error: Did not receive access token.`)
      }
  }

  setSession (params) {
    var token = this.parseJwt(params.access_token);
    let expiresAt = JSON.stringify(
      token.expires_in * 1000 + new Date().getTime()
    )
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
    // Check whether the current time is past the
    // access token's expiry time
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
}
