(function() {
  require('es6-promise').polyfill();

  var args    = require('process');
  var path    = require('fs-path');
  var sass    = require('node-sass');
  var postcss = require('postcss');
  var server  = require('browser-sync');
  /**
   * @namespace AT
   * @type {object}
   */
  var AT = {};

  AT.render = function(message) {
    return new Promise(function() {
      sass.render({
        file: 'public/scss/main.scss'
      }, function(error, result) {
        if(error) {
          console.log('You did something wrong (╯°□°）╯︵ ┻━┻ \n\n\x1b[31m', error, '\x1b[0m');
          return;
        }

        postcss([
          require('autoprefixer')
        ]).process(result.css).then(function(result) {
          path.writeFile('public/css/main.css', result.css);
          console.log(message);
        }).catch(function(error) {
          console.log('You did something wrong (╯°□°）╯︵ ┻━┻ \n\n\x1b[31m', error, '\x1b[0m');
        });
      });
    });
  };

  AT.watch = function() {
    this.render('\x1b[33mYour style was compiled in the speed of light. Now we\'re watching you placing important! in everywhere (◡︿⊙)\x1b[0m');

    server.watch('public/scss/**/*.scss').on('change', function(event, file) {
      this.render('\x1b[32m'+ file +' has been changed (◡‿◡)\x1b[0m').then(function() {
        server.stream();
      });
    }.bind(this));
  };

  AT.init = function() {
    if(args.argv.slice(2).indexOf('--prod') > -1) {
      this.render('\x1b[33mYour style was compiled in the speed of light (◡‿◡)\x1b[0m');

      return;
    }
    /**
     * Init BrowserSync.
     * @type {object}
     */
    server.init({
      server: './public'
    });

    this.watch();
  }.call(AT);
})();
