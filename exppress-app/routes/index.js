var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  const symbol = req.query.SYMBOL
  const KEY = "353S0H3LGU3D1KS1"
  const URL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${KEY}`

  axios.get(URL)
    .then(function (response) {
      res.send(response.data)
    })
    .catch(function (error) {
      res.send(error)
    })
});

module.exports = router;
