module.exports = function (shipit) {
    require('shipit-deploy')(shipit)
    const config = require('./shipit/config')
    shipit.initConfig({
      default: {
        deleteOnRollback: false,
        // ignores: ['.git', 'node_modules'],
        repositoryUrl: 'git@github.com:jisack/react-starter-example.git',
        workspace: 'shipit/workspace',
        rsyncFrom: 'shipit/workspace/build',
        keepReleases: 2
      },
      server: {
        servers: 'root@your-server',
        key: config.dev.key || '~/.ssh/your-keys',
        deployTo: '/your/location',
        branch: 'dev',
        build: 'build'
      }
    })
  
    shipit.on('fetched', () => shipit.start('setup'))
  
    shipit.blTask('setup', () => {
      const cmdConfig = { cwd: shipit.config.workspace }
      const build = shipit.config.build
  
      return shipit.local('npm install --production', cmdConfig)
        .then(() => {
          shipit.log('Npm dependencies installed. Start building React')
          return shipit.local(`npm run ${build} || 'build'`, cmdConfig)
        })
    })
  }