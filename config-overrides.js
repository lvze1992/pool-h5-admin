const path = require('path');
process.env.BUILD_PATH = 'docs';

const { override, fixBabelImports, addDecoratorsLegacy, addWebpackAlias } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }), //antd按需加载
  addDecoratorsLegacy(), //配置装饰器
  addWebpackAlias({
    src: path.resolve(__dirname, 'src'),
  }),
);
