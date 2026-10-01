const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { dependencies } = require('./package.json');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 'auto' lets chunks resolve relative to wherever remoteEntry.js is
      // embedded; dev keeps CRA's '/' so the standalone dev server works.
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.output.publicPath = 'auto';
      }

      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: 'AnimalApp',
          filename: 'remoteEntry.js',
          exposes: {
            './AnimalApp': './src/App',
          },
          shared: {
            react: { singleton: true, requiredVersion: dependencies.react },
            'react-dom': { singleton: true, requiredVersion: dependencies['react-dom'] },
            'framer-motion': { singleton: true, requiredVersion: dependencies['framer-motion'] },
            axios: { singleton: true, requiredVersion: dependencies.axios },
          },
        })
      );
      return webpackConfig;
    },
  },
};
