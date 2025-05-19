/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: 'your.app.id',
  productName: 'RAGProject',
  copyright: 'Copyright © year Your Name',
  directories: {
    output: 'release',
    buildResources: 'resources',
  },
  files: ['dist/**/*', 'main/**/*', 'preload.js', 'package.json', 'resources/**/*'],
  asar: true,
  publish: [
    {
      provider: 'generic',
      url: 'https://your-update-server.com/updates/${os}/${arch}/${version}', // 你的更新伺服器 URL
    },
  ],
  mac: {
    artifactName: '${productName}_${version}.${ext}',
    target: ['dmg'],
    icon: 'resources/icon.png',
  },
  win: {
    artifactName: '${productName}_${version}.${ext}',
    target: ['nsis'],
    icon: 'resources/icon.ico',
  },
  linux: {
    artifactName: '${productName}_${version}.${ext}',
    target: ['deb', 'rpm', 'AppImage'],
    icon: 'resources/icon.png',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
}
