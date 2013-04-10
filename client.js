var request = require('superagent'),
    crypto = require('crypto');

var baseAPIPath = 'https://data.mtgox.com/api/2/';

var MtGoxRESTClient = module.exports = function MtGoxRESTClient(key, secret) {
  this.apiKey = key;
  this.apiSecret = secret;
};

MtGoxRESTClient.prototype = {
  getTickerData: function(cb) {
    apiRequest.call(this, 'get', 'BTCUSD/money/ticker').end( function(err, res) {
      if(err)
        cb(err);
      else
        cb(err, res.body.data);
    });
  }
};

function apiRequest(method, path, data) {
  var req,
      hashData = path + "\0" + data,
      secret = (new Buffer(this.apiSecret, 'base64')).toString('ascii');
      restSign = crypto.createHmac('sha512', secret).update(hashData).digest('base64');

  if(method == 'post') {
    req = request.post(baseAPIPath + path);
  } else {
    req = request.get(baseAPIPath + path);
  }
  req.set('Rest-Key', this.apiKey)
     .set('Rest-Sign', restSign)
     .set('Accept-encoding', 'GZIP');

  return req;
}
