import { DepositApiDependencies } from 'api/deposit/DepositApi'
import { Erc20Api } from 'api/erc20/Erc20Api'
import { ExchangeApi } from './ExchangeApi'
import { ExchangeApiProxy } from './ExchangeApiProxy'

export function createExchangeApi(_erc20Api: Erc20Api, injectedDependencies: DepositApiDependencies): ExchangeApi {
  const exchangeApi = new ExchangeApiProxy({
    ...injectedDependencies,
    contractsDeploymentBlocks: CONFIG.exchangeContractConfig.config,
  })
  window['exchangeApi'] = exchangeApi
  return exchangeApi
}
