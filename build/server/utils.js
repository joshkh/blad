// Generated by CoffeeScript 1.6.3
(function() {
  var EE, async, asyncWalk, connect, cs, eco, events, fs, mongodb, path, uglify, wrench, write,
    __slice = [].slice;

  fs = require('fs');

  path = require('path');

  cs = require('coffee-script');

  eco = require('eco');

  uglify = require('uglify-js');

  wrench = require('wrench');

  events = require('events');

  mongodb = require('mongodb');

  async = require('async');

  EE = new events.EventEmitter();

  exports.log = function(cb) {
    return EE.on('log', function(msg) {
      return cb(msg);
    });
  };

  exports.compile = {
    'admin': function() {
      var cb, whateva, _i;
      whateva = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
      EE.emit('log', 'Compiling Chaplin.js admin client app code');
      return async.waterfall([
        function(_cb) {
          var err;
          try {
            wrench.mkdirSyncRecursive("" + __dirname + "/../public/admin", 0x1ff);
            return _cb(null);
          } catch (_error) {
            err = _error;
            return _cb(err);
          }
        }, async.apply(wrench.copyDirRecursive, "" + __dirname + "/../../src/admin/assets", "" + __dirname + "/../public/admin", {
          'forceDelete': true
        }), function(_cb) {
          var apply, root, target;
          root = "" + __dirname + "/../../src/admin/chaplin";
          target = path.resolve("" + __dirname + "/../../build/public/admin/js");
          apply = function(file, __cb) {
            var name;
            if (file.match(/\.eco/)) {
              name = file.split('/').pop();
              return fs.readFile(path.resolve(root + '/' + file), 'utf8', function(err, data) {
                var js;
                if (err) {
                  return __cb(err);
                }
                js = eco.precompile(data);
                js = (uglify.minify("JST['" + name + "'] = " + js, {
                  'fromString': true
                })).code;
                return write((target + '/' + file).replace('.eco', '.js'), js, __cb);
              });
            } else if (file.match(/\.coffee/)) {
              return fs.readFile(path.resolve(root + '/' + file), 'utf8', function(err, data) {
                var js;
                if (err) {
                  return __cb(err);
                }
                js = cs.compile(data, {
                  'bare': 'on'
                });
                return write((target + '/' + file).replace('.coffee', '.js'), js, __cb);
              });
            } else {
              return __cb(null);
            }
          };
          return asyncWalk(root, apply, _cb);
        }
      ], cb);
    },
    'forms': function(_arg) {
      var site_src;
      site_src = _arg.site_src;
      return function() {
        var apply, cb, root, tml, whateva, _i;
        whateva = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
        EE.emit('log', 'Compiling custom document type forms');
        root = path.join(site_src, '/src/types');
        tml = [];
        tml.push((uglify.minify("JST['form_BasicDocument.eco'] = " + (eco.precompile("")), {
          'fromString': true
        })).code);
        apply = function(file, _cb) {
          if (file.match(/form\.eco/)) {
            return fs.readFile(path.resolve(root + '/' + file), 'utf8', function(err, data) {
              var js, name, p;
              p = file.split('/');
              name = p[p.length - 2];
              js = eco.precompile(data);
              tml.push((uglify.minify("JST['form_" + name + ".eco'] = " + js, {
                'fromString': true
              })).code);
              return _cb(null);
            });
          } else {
            return _cb(null);
          }
        };
        return asyncWalk(root, apply, function(err) {
          if (err) {
            return cb(err);
          }
          return write("" + __dirname + "/../public/admin/js/templates/document_forms.js", tml.join("\n"), cb);
        });
      };
    }
  };

  exports.copy = {
    'public': function(_arg) {
      var site_src;
      site_src = _arg.site_src;
      return function() {
        var cb, whateva, _i;
        whateva = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
        EE.emit('log', "Copying site's public files");
        return wrench.copyDirRecursive(path.join(site_src, '/src/public'), "" + __dirname + "/../public/site", {
          'forceDelete': true
        }, function(err) {
          return cb(err);
        });
      };
    },
    'additions': function(_arg) {
      var site_src;
      site_src = _arg.site_src;
      return function() {
        var cb, source, target, whateva, _i;
        whateva = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
        source = path.join(site_src, '/src/types/additions.coffee');
        target = path.resolve("" + __dirname + "/../../build/server/additions.js");
        return fs.stat(source, function(err, stats) {
          if (err) {
            return cb(null);
          }
          if (stats.isDirectory()) {
            return cb(null);
          }
          EE.emit('log', 'Including additions file');
          return fs.readFile(source, 'utf-8', function(err, data) {
            var js;
            if (err) {
              return cb(null);
            }
            try {
              js = cs.compile(data, {
                'bare': 'on'
              });
            } catch (_error) {}
            if (!js) {
              return cb(null);
            }
            return fs.writeFile(target, js, function(err) {
              return cb(null);
            });
          });
        });
      };
    }
  };

  exports.include = {
    'presenters': function(_arg) {
      var site_src;
      site_src = _arg.site_src;
      return function() {
        var apply, cb, paths, root, whateva, _i;
        whateva = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
        EE.emit('log', 'Returning a list of presenter paths');
        root = path.join(site_src, '/src/types');
        paths = [];
        apply = function(file, _cb) {
          if (file.match(/presenter\.coffee/)) {
            paths.push(root + '/' + file);
          }
          return _cb(null);
        };
        return asyncWalk(root, apply, function(err) {
          if (err) {
            return cb(err);
          }
          return cb(null, paths);
        });
      };
    }
  };

  exports.db = {
    'export': function(cfg, dir, done) {
      return async.waterfall([
        function(cb) {
          EE.emit('log', 'Create directory for dump');
          return fs.mkdir("" + dir + "/dump", function(err) {
            if (err && err.code !== 'EEXIST') {
              return cb(err);
            } else {
              return cb(null);
            }
          });
        }, function(cb) {
          return connect(cfg.mongodb, 'documents', cb);
        }, function(collection, cb) {
          EE.emit('log', 'Dump the database');
          return collection.find({}, {
            'sort': 'url'
          }).toArray(function(err, docs) {
            if (err) {
              return cb(err);
            } else {
              return cb(null, docs);
            }
          });
        }, function(docs, cb) {
          EE.emit('log', 'Write file');
          return write("" + dir + "/dump/data.json", JSON.stringify(docs, null, 4), cb);
        }
      ], function(err) {
        var e;
        if (err) {
          try {
            err = JSON.parse(err);
            console.log(err.error.message || err.message || err);
          } catch (_error) {
            e = _error;
            console.log(err);
          }
          return process.exit();
        } else {
          if (done && typeof done === 'function') {
            return done();
          } else {
            return process.exit();
          }
        }
      });
    },
    'import': function(cfg, dir, done) {
      return async.waterfall([
        function(cb) {
          return connect(cfg.mongodb, 'documents', cb);
        }, function(collection, cb) {
          EE.emit('log', 'Read dump file');
          return cb(null, collection, JSON.parse(fs.readFileSync("" + dir + "/dump/data.json", 'utf-8')));
        }, function(collection, docs, cb) {
          EE.emit('log', 'Clear database');
          return collection.remove({}, function(err) {
            if (err) {
              return cb(err);
            } else {
              return cb(null, collection, docs);
            }
          });
        }, function(collection, docs, cb) {
          var doc;
          EE.emit('log', 'Cleanup `_id`');
          return cb(null, collection, (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = docs.length; _i < _len; _i++) {
              doc = docs[_i];
              _results.push((delete doc._id, doc));
            }
            return _results;
          })());
        }, function(collection, docs, cb) {
          EE.emit('log', 'Insert into database');
          return collection.insert(docs, {
            'safe': true
          }, function(err, docs) {
            if (err) {
              return cb(err);
            } else {
              return cb(null);
            }
          });
        }
      ], function(err) {
        var e;
        if (err) {
          try {
            err = JSON.parse(err);
            console.log(err.error.message || err.message || err);
          } catch (_error) {
            e = _error;
            console.log(err);
          }
          return process.exit();
        } else {
          if (done && typeof done === 'function') {
            return done();
          } else {
            return process.exit();
          }
        }
      });
    }
  };

  asyncWalk = function(path, apply, cb) {
    var canExit, exit, jobs;
    jobs = 0;
    canExit = false;
    exit = function() {
      if (jobs === 0 && canExit) {
        return cb(null);
      }
    };
    return wrench.readdirRecursive(path, function(err, files) {
      var file, fns, _fn, _i, _len;
      if (err) {
        return cb(err);
      }
      if (!files) {
        canExit = true;
        return exit();
      } else {
        jobs++;
        fns = [];
        _fn = function(file) {
          return fns.push(function(_cb) {
            return apply(file, _cb);
          });
        };
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          _fn(file);
        }
        return async.parallel(fns, function(err) {
          if (err) {
            return cb(err);
          } else {
            jobs--;
            return exit();
          }
        });
      }
    });
  };

  write = function(path, text, cb) {
    var dir;
    dir = path.split('/').reverse().slice(1).reverse().join('/');
    wrench.mkdirSyncRecursive(dir, 0x1ff);
    return fs.open(path, 'w', 0x1b6, function(err, id) {
      if (err) {
        return cb(err);
      } else {
        return fs.write(id, text, null, 'utf8', cb);
      }
    });
  };

  connect = function(uri, collection, cb) {
    EE.emit('log', 'Connect to MongoDB');
    return mongodb.Db.connect(uri, function(err, connection) {
      if (err) {
        return cb(err);
      } else {
        return connection.collection(collection, function(err, coll) {
          if (err) {
            return cb(err);
          } else {
            return cb(null, coll);
          }
        });
      }
    });
  };

}).call(this);
