const proxyConfig = {
  '/api': {
    target: 'https://vn-fe-test-api.iwalabs.info',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  }
}

module.exports = proxyConfig;
