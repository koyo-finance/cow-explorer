import TokenListApiImpl, { TokenList } from './TokenListApi'
import TokenListApiMock from './TokenListApiMock'

import { SUPPORTED_CHAINS } from '@koyofinance/momiji-sdk'
import { tokenList } from '../../../test/data'

export function createTokenListApi(): TokenList {
  let tokenListApi: TokenList
  if (process.env.MOCK_TOKEN_LIST === 'true') {
    tokenListApi = new TokenListApiMock(tokenList)
  } else {
    tokenListApi = new TokenListApiImpl({
      networkIds: SUPPORTED_CHAINS as unknown as number[],
      initialTokenList: CONFIG.initialTokenList,
    })
  }

  window['tokenListApi'] = tokenListApi // register for convenience
  return tokenListApi
}
