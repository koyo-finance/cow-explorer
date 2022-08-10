import { Erc20Api, Erc20ApiDependencies } from './Erc20Api'
import { Erc20ApiProxy } from './Erc20ApiProxy'

export function createErc20Api(injectedDependencies: Erc20ApiDependencies): Erc20Api {
  const erc20Api = new Erc20ApiProxy(injectedDependencies)
  window['erc20Api'] = erc20Api // register for convenience
  return erc20Api
}
