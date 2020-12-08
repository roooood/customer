var http = require('http')
  , express = require('express')
  , bodyParser = require("body-parser")
  , Connection = require('./connection')
  , port = process.env.PORT || 3333
  , app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var secret = 'demo';

app.post('/auth', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var params = req.body;
  if (secret != params.secret) {
    res.send({
      result: 'error'
    })
  }
  Connection.query('SELECT * FROM `users`  where `token`=? LIMIT 1', [params.token])
    .then(results => {
      if (results[0] != null) {
        res.send({
          result: 'ok',
          data: {
            id: results[0].id,
            username: results[0].username,
            balance: results[0].balance
          }
        });

      };
    });
});
app.post('/balance', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var params = req.body;
  if (secret != params.secret) {
    res.send({
      result: 'error'
    })
  }
  Connection.query('SELECT * FROM `users`  where `id`=? LIMIT 1', [params.id])
    .then(results => {
      if (results[0] != null) {
        res.send({
          result: 'ok',
          data: {
            balance: results[0].balance
          }
        });

      };
    });
});
app.post('/deposit', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var { secret, id, amount, tid, msg } = req.body;
  if (secret != secret) {
    return res.send({
      result: 'error'
    })
  }
  setBalance(res, id, -amount);
});
app.post('/rollback', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var { secret, id, amount, tid, msg } = req.body;
  if (secret != secret) {
    return res.send({
      result: 'error'
    })
  }
  setBalance(res, id, amount);
});
app.post('/withdraw', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var { secret, id, amount, tid, msg } = req.body;
  if (secret != secret) {
    return res.send({
      result: 'error'
    })
  }
  setBalance(res, id, amount);
});

function setBalance(res, id, amount) {
  Connection.query('UPDATE `users` SET `balance` =  `balance` + ? where `id`=? LIMIT 1', [amount, id])
    .then(results => {
      Connection.query('SELECT * FROM `users`  where `id`=? LIMIT 1', [id])
        .then(results => {
          if (results[0] != null) {
            res.send({
              result: 'ok',
              data: {
                balance: results[0].balance
              }
            });

          } else {
            res.send({
              result: 'error'
            })
          }
        });
    });
}
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})