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
  const insertUserSql = `INSERT INTO users (BitbucketID) 
  SELECT($1::varchar)
  WHERE NOT EXISTS ( SELECT BitbucketID from users where BitbucketID = $1::varchar);
  `;
  const getUserSql = `SELECT * FROM users WHERE BitbucketID = $1::varchar;`;
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

router.get('/settings', function (req, res) {
  const getUserSql = `SELECT * FROM users WHERE BitbucketID = $1::varchar;`;
  pool.query(getUserSql, [`{${req.query['bitbucketId']}}`], function (err, resp) {
    if (err) {
      return console.error('error running query', err)
    }
    else {
      res.json(resp.rows[0]);
    }
  })
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
  const sql = `
  UPDATE users SET TeamName = $2::varchar, JiraAuth = $3::varchar, JiraInstanceName = $4::varchar, LastUpdated = $5::timestamp
  WHERE  BitbucketID = $1::varchar;
  `;
  pool.query(sql, [req.body.bitbucketId, req.body.teamName, req.body.jiraAuth, req.body.jiraInstanceName, new Date()], function (err) {
    if (err) {
      return console.error('error running query', err)
    }
  })
});

module.exports = {
  router
};
