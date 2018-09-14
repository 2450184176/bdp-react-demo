const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
    '@': path.resolve(__dirname,'src')
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
  "proxy": {
    // "/pisapi": {
    //   "target": "http://inc-pis.sit.sf-express.com/",
    //   "changeOrigin": true,
    //   "pathRewrite": { "^/pisapi": "" }
    // }
  }
};
