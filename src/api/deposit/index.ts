import { Erc20Api } from 'api/erc20/Erc20Api'

import { DepositApi, DepositApiDependencies } from './DepositApi'
import { DepositApiProxy } from './DepositApiProxy'

export function createDepositApi(_erc20Api: Erc20Api, injectedDependencies: DepositApiDependencies): DepositApi {
  const depositApi = new DepositApiProxy(injectedDependencies)
  window['depositApi'] = depositApi // register for convenience
  return depositApi
}
