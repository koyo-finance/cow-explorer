const dotenv = require('dotenv')

// Setup env vars
dotenv.config()

const getWebpackConfig = require('./getWebpackConfig')
const loadConfig = require('./src/loadConfig')
const overrideEnvConfig = require('./src/overrideEnvConfig')

const isProduction = process.env.NODE_ENV === 'production'
const baseUrl = isProduction ? '' : '/'

// FIXME: The apps right now depend on config they don't, se below attempt to check what was required. One example of something that is required but we don't need is --> for some reason "createTheGraphApi" it's being executed
const CONFIG = loadConfig()

const config = overrideEnvConfig(CONFIG)
const EXPLORER_APP = {
  name: 'explorer',
  title: 'Momiji Explorer',
  filename: 'index.html',
  envVars: {
    EXPLORER_APP_DOMAIN_REGEX_DEV: '^protocol-explorer\\.dev|^localhost:\\d{2,5}|^pr\\d+--explorer\\.review',
    EXPLORER_APP_DOMAIN_REGEX_STAGING: '^protocol-explorer\\.staging',
    EXPLORER_APP_DOMAIN_REGEX_PROD: '^explorer\\.koyo\\.finance|^momiji\\.exchange',
    // EXPLORER_APP_DOMAIN_REGEX_BARN: '^barn\\.explorer\\.cow\\.fi|^barn\\.gnosis-protocol\\.io',

    OPERATOR_URL_PROD_BOBA: 'https://momiji.koyo.finance/boba/api',
    EXPLORER_APP_GRAPH_ENABLED: false,

    GOOGLE_ANALYTICS_ID: '',
    REACT_APP_SENTRY_DSN: '',
  },
}
const ALL_APPS = [EXPLORER_APP]

function getSelectedApps() {
  const appName = process.env.APP
  if (appName) {
    const app = ALL_APPS.find((app) => appName === app.name)
    if (!app) {
      throw new Error(`Unknown App ${app}`)
    }

    return [
      {
        ...app,
        filename: 'index.html', // If we return only one app, the html web is "index.html"
      },
    ]
  } else {
    return ALL_APPS.filter((app) => !app.disabled)
  }
}

// Get selected apps: all apps by default
const apps = getSelectedApps()

module.exports = getWebpackConfig({
  apps,
  config,
  baseUrl,
  envVars: {
    BASE_URL: baseUrl,
  },
  defineVars: {
    CONFIG: JSON.stringify(config),
    CONTRACT_VERSION: JSON.stringify(require('@gnosis.pm/gp-v2-contracts/package.json').version),
    DEX_JS_VERSION: JSON.stringify(require('@gnosis.pm/dex-js/package.json').version),
  },
})
