const path = require('path');
process.env.PORT = '4001';

const { override, addDecoratorsLegacy, addWebpackAlias } = require('customize-cra');

module.exports = override(
  addDecoratorsLegacy(), //配置装饰器
  addWebpackAlias({
    src: path.resolve(__dirname, 'src'),
  }),
);
