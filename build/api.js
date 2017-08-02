const authConfig = require('../client/auth/auth0-variables');
const pool = require('./db');
const request = require('request');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const fb = require('firebase');
const crypto = require('crypto-js');
const firebase = fb.initializeApp(authConfig.DEV_AUTH_CONFIG.firebaseAuth);
firebase.auth().signInWithEmailAndPassword(authConfig.DEV_AUTH_CONFIG.firebaseAuth.email, authConfig.DEV_AUTH_CONFIG.firebaseAuth.password).catch(function (error) {
  console.log(error);
})

router.get('/bitbucket/authenticate', function (req, res) {
  res.redirect(`https://bitbucket.org/site/oauth2/authorize?client_id=${authConfig.DEV_AUTH_CONFIG.clientId}&response_type=code&redirect_uri=${authConfig.DEV_AUTH_CONFIG.callbackUrl}`)
});

router.get('/bitbucket/callback', function (req, res) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const options = {
    url: 'https://bitbucket.org/site/oauth2/access_token',
    method: 'POST',
    headers: headers,
    form: {
      'client_id': authConfig.DEV_AUTH_CONFIG.clientId,
      'client_secret': authConfig.DEV_AUTH_CONFIG.clientSecret,
      'grant_type': 'authorization_code',
      'code': req.query.code,
      'redirect_uri': authConfig.DEV_AUTH_CONFIG.callbackUrl
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const token = jwt.sign(body, authConfig.DEV_AUTH_CONFIG.clientSecret);
      res.redirect(`/callback?access_token=${token}`)
    }
  })
}
);

router.get('/bitbucket/refresh', function (req, res) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const options = {
    url: 'https://bitbucket.org/site/oauth2/access_token',
    method: 'POST',
    headers: headers,
    form: {
      'client_id': authConfig.DEV_AUTH_CONFIG.clientId,
      'client_secret': authConfig.DEV_AUTH_CONFIG.clientSecret,
      'grant_type': 'refresh_token',
      'refresh_token': req.query.refresh_token
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.json(JSON.parse(body))
    }
  })
});

router.post('/updateUser', function (req, res) {
  var bitbucketId = `bitbucket${req.body.bitbucket_id}`;
  var userData = { BitbucketId: req.body.bitbucket_id };
  firebase.database().ref('users/' + bitbucketId).transaction((currentData) => {
    if (currentData === null) {
      return userData;
    }
  }, (error, committed) => {
  });
  firebase.database().ref('/users/' + bitbucketId).once('value').then(function (snapshot) {
    res.json(snapshot.val());
  });
});

router.get('/settings', function (req, res) {
  var bitbucketId = `bitbucket{${req.query['bitbucketId']}}`;
  firebase.database().ref('/users/' + bitbucketId).once('value').then(function (snapshot) {
    var user = snapshot.val();
    if (user.JiraAuth) {
      var bytes = crypto.AES.decrypt(user.JiraAuth, authConfig.DEV_AUTH_CONFIG.encryptionKey);
      user.JiraAuth = bytes.toString(crypto.enc.Utf8);
    }
    res.json(user);
  });
});

router.post('/updateSettings', function (req, res) {
  if (req.body.jiraAuth && req.body.jiraInstanceName) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${req.body.jiraAuth}`
    };

    const options = {
      url: `https://${req.body.jiraInstanceName}.atlassian.net/rest/tempo-timesheets/3/worklogs?dateFrom=3000-01-01&dateTo=3000-01-01`,
      method: 'GET',
      headers: headers
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var hash = crypto.AES.encrypt(req.body.jiraAuth, authConfig.DEV_AUTH_CONFIG.encryptionKey);
        var bitbucketId = `bitbucket${req.body.bitbucketId}`;
        var updatedUserData = {
          BitbucketTeamName: req.body.teamName,
          JiraAuth: hash.toString(),
          JiraInstanceName: req.body.jiraInstanceName,
          LastUpdated: new Date()
        };
        firebase.database().ref('users/' + bitbucketId).transaction((currentData) => {
          return Object.assign({}, currentData, updatedUserData);
        }, (error, committed) => {
        });
        res.status(200);
        res.send('Succesfully updated your settings.');
      }
      else if (response.statusCode === 401) {
        res.status(401);
        res.send('Unauthorized. Check to make sure you\'ve entered your credentials correctly');
      }
      else if (response.statusCode === 502) {
        res.status(502);
        res.send('Instance not found. Check to make sure you\'ve entered your Jira instance correctly');
      }
      else {
        res.status(500);
        res.send('An error occured. Please try submitting your settings again');
      }
    })
  }
  var bitbucketId = `bitbucket${req.body.bitbucketId}`;
  var updatedUserData = {
    BitbucketTeamName: req.body.teamName,
    JiraAuth: '',
    JiraInstanceName: req.body.jiraInstanceName,
    LastUpdated: new Date()
  };
  firebase.database().ref('users/' + bitbucketId).transaction((currentData) => {
    return Object.assign({}, currentData, updatedUserData);
  }, (error, committed) => {
  });
  res.status(200);
  res.send('Succesfully updated your settings.');
});

module.exports = {
  router
};
