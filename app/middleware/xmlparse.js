module.exports = () => {
  return async function (ctx, next) {
    let bodyParser = require('body-parser');
    console.log(22222);
    ctx.app.use(bodyParser.urlencoded({
      extended: true
    }));
    console.log(33333);
    await next();
  }
}
