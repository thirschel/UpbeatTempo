const authConfig = require('../client/auth/auth0-variables');
const pool = require('./db');
const request = require('request');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

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
  const insertUserSql = `INSERT INTO users (bitbucket_id) 
  SELECT($1::varchar)
  WHERE NOT EXISTS ( SELECT bitbucket_id from users where bitbucket_id = $1::varchar);
  `;
  const getUserSql = `SELECT * FROM users WHERE bitbucket_id = $1::varchar;`;
  pool.query(insertUserSql, [req.body.bitbucket_id], function (err) {
    if (err) {
      return console.error('error running query', err)
    }
    pool.query(getUserSql, [req.body.bitbucket_id], function (err, resp) {
      if (err) {
        return console.error('error running query', err)
      }
      res.json(resp.rows[0])
    })
  })
});

router.post('/updateTeamName', function (req, res) {
  const sql = `
  UPDATE users SET team_name = $1::varchar, has_confirmed_team_name = true
  WHERE  bitbucket_id = $2::varchar;
  `;
  pool.query(sql, [req.body.teamName, req.body.bitbucket_id], function (err) {
    if (err) {
      return console.error('error running query', err)
    }
  })
});

module.exports = {
  router
};
