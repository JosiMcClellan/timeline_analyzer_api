module.exports = (readable) => new Promise(
  (resolve) => {
    let json = "";
    readable.setEncoding("utf8");
    readable.on("data", data => json += data);
    readable.on("end", () => resolve(JSON.parse(json)));
  }
)
