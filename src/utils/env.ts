type Envs = {
  isDev: boolean
  isStaging: boolean
  isProd: boolean
  isBarn: boolean
}

const getRegex = (regex: string | undefined): RegExp | undefined => (regex ? new RegExp(regex) : undefined)

function checkEnvironment(host: string): Envs {
  const domainDevRegex = getRegex(process.env.EXPLORER_APP_DOMAIN_REGEX_DEV)
  const domainStagingRegex = getRegex(process.env.EXPLORER_APP_DOMAIN_REGEX_STAGING)
  const domainProdRegex = getRegex(process.env.EXPLORER_APP_DOMAIN_REGEX_PROD)
  // const domainBarnRegex = getRegex(process.env.EXPLORER_APP_DOMAIN_REGEX_BARN)

  return {
    isDev: domainDevRegex?.test(host) || false,
    isStaging: domainStagingRegex?.test(host) || false,
    isProd: domainProdRegex?.test(host) || false,
    isBarn: false,
  }
}

const { isDev, isStaging, isProd, isBarn } = checkEnvironment(window.location.host)

export const environmentName = (function (): 'production' | 'barn' | 'staging' | 'development' | undefined {
  if (isProd) {
    return 'production'
  } else if (isBarn) {
    return 'barn'
  } else if (isStaging) {
    return 'staging'
  } else if (isDev) {
    return 'development'
  } else {
    return undefined
  }
})()

export const GRAPH_ENABLED =
  process.env.EXPLORER_APP_GRAPH_ENABLED === 'false'
    ? false
    : process.env.EXPLORER_APP_GRAPH_ENABLED !== undefined
    ? true
    : process.env.EXPLORER_APP_GRAPH_ENABLED

export { isDev, isStaging, isProd, isBarn }
