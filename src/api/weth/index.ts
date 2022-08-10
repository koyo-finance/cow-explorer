import { WethApi, WethApiDependencies, WethApiImpl } from './WethApi'

export function createWethApi(injectedDependencies: WethApiDependencies): WethApi {
  const wethApi = new WethApiImpl(injectedDependencies)
  window['wethApi'] = wethApi // register for convenience
  return wethApi
}
