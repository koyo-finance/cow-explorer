import { SUPPORTED_CHAINS } from '@koyofinance/momiji-sdk'
import TokenListApiImpl, { TokenList } from './TokenListApi'

export function createTokenListApi(): TokenList {
  const tokenListApi: TokenList = new TokenListApiImpl({
    networkIds: SUPPORTED_CHAINS as unknown as number[],
    initialTokenList: CONFIG.initialTokenList,
  })

  window['tokenListApi'] = tokenListApi // register for convenience
  return tokenListApi
}
