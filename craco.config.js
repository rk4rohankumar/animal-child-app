const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.publicPath = 'http://localhost:3001/';

      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: 'AnimalApp',
          filename: 'remoteEntry.js',
          exposes: {
            './AnimalApp': './src/App',
          },
          shared: {
            react: { eager: true },
            'react-dom': { eager: true },
            'tailwindcss': { eager: true }
          },
        })
      );
      return webpackConfig;
    },
  },
};
