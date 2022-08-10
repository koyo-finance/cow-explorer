import { safeTokenName, TokenDetailsConfigLegacy } from '@gnosis.pm/dex-js'
import { ChainId } from '@koyofinance/core-sdk'
import { DEFAULT_PRECISION } from 'const'
import { TokenDetails } from 'types'

export function getTokensByNetwork(networkId: number, tokenList: TokenDetailsConfigLegacy[]): TokenDetails[] {
  // Return token details
  const tokenDetails: TokenDetails[] = tokenList.reduce((acc: TokenDetails[], token) => {
    const address = token.addressByNetwork[networkId]
    if (address) {
      // There's an address for the current network
      const { id, name, symbol, decimals = DEFAULT_PRECISION } = token
      const addressMainnet = token.addressByNetwork[ChainId.BOBA]

      acc.push({
        id,
        label: safeTokenName({ address, name, symbol }),
        name,
        symbol,
        decimals,
        address,
        addressMainnet,
      })
      return acc
    }

    return acc
  }, [])

  return tokenDetails
}
