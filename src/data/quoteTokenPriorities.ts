import { BOBA_WETH_ADDRESS, ChainId } from '@koyofinance/core-sdk'

interface QuoteTokenPriorityObject {
  priority: number
  addresses: {
    [network: number]: string[]
  }
}

type QuoteTokenPriorityList = QuoteTokenPriorityObject[]

const quoteTokenPriorityList: QuoteTokenPriorityList = [
  {
    // USD coins
    priority: 1,
    addresses: {
      [ChainId.BOBA]: [
        '0x7562F525106F5d54E891e005867Bf489B5988CD9', // FRAX
        '0xf74195Bb8a5cf652411867c5C2C5b8C2a402be35', // DAI
        '0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc', // USDC
        '0x5DE1677344D3Cb0D7D465c10b72A8f60699C062d', // USDT
      ],
    },
  },
  {
    // WETH
    priority: 2,
    addresses: {
      [ChainId.BOBA]: [BOBA_WETH_ADDRESS],
    },
  },
]

export default quoteTokenPriorityList
