const https = require('https');

const parseJsonStream = (readable) => new Promise(
  (resolve) => {
    let json = "";
    readable.setEncoding("utf8");
    readable.on("data", data => json += data);
    readable.on("end", () => resolve(JSON.parse(json)));
  }
);

module.exports = ({ body, ...config }) => {
  if (body) {
    body = JSON.stringify(body)
    config.headers['Content-Length'] = Buffer.byteLength(body)
  }
  return new Promise((resolve) => {
    https.request(config,
      (responseStream) => parseJsonStream(responseStream).then(resolve)
    ).end(body)
  });
};
