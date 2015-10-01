// Generated by CoffeeScript 1.6.3
(function() {
  module.exports = function(_arg) {
    var app, log;
    log = _arg.log, app = _arg.app;
    return {
      '/sitemap.xml': {
        get: function() {
          var _this = this;
          log.info('Get sitemap.xml');
          return app.db(function(collection) {
            return collection.find({
              'public': true
            }).toArray(function(err, docs) {
              var doc, xml, _i, _len;
              if (err) {
                throw err;
              }
              xml = ['<?xml version="1.0" encoding="utf-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
              for (_i = 0, _len = docs.length; _i < _len; _i++) {
                doc = docs[_i];
                xml.push("<url><loc>http://" + _this.req.headers.host + doc.url + "</loc><lastmod>" + doc.modified + "</lastmod></url>");
              }
              xml.push('</urlset>');
              _this.res.writeHead(200, {
                "content-type": "application/xml"
              });
              _this.res.write(xml.join("\n"));
              return _this.res.end();
            });
          });
        }
      }
    };
  };

}).call(this);
