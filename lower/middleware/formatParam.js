'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gate = require('../plugin/json-gate/json-gate');
var createSchema = gate.createSchema;
var lodash = require('lodash');
var clone = lodash.clone;
var camelCase = lodash.camelCase;

module.exports = function (apiSchema) {
  return function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
      var method, query, body, p, schema, pathSchema, params;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              method = ctx.method.toLowerCase();
              query = clone(ctx.query);
              body = ctx.request.body;
              p = ctx.request.path;

              p = camelCase(p.slice(5));

              if (!(!apiSchema[method] || !apiSchema[method][p])) {
                _context.next = 7;
                break;
              }

              return _context.abrupt('return', ctx.respond.error('接口' + p + '不存在schema'));

            case 7:
              schema = apiSchema[method][p];
              pathSchema = createSchema(schema);

              (0, _keys2.default)(query).forEach(function (key) {
                if (schema && schema.properties && schema.properties[key] && schema.properties[key].type === 'string') return;
                try {
                  query[key] = JSON.parse(query[key]);
                } catch (e) {}
              });

              params = (0, _assign2.default)({}, query, clone(body));
              _context.prev = 11;

              pathSchema.validate(params);
              _context.next = 18;
              break;

            case 15:
              _context.prev = 15;
              _context.t0 = _context['catch'](11);
              return _context.abrupt('return', ctx.respond.error(_context.t0.message, { e: _context.t0 }));

            case 18:

              ctx.finalParams = params;
              return _context.abrupt('return', next());

            case 20:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[11, 15]]);
    }));

    function formatParam(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return formatParam;
  }();
};