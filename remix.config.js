/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'build',
  // devServerPort: 8002,
  ignoredRouteFiles: ['**/.*'],
  // future: {
  //   v2_errorBoundary: true,
  //   v2_meta: true,
  //   v2_normalizeFormMethod: true,
  //   v2_routeConvention: true,
  // },
};
