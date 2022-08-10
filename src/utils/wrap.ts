import { BOBA_WETH_ADDRESS, ChainId } from '@koyofinance/core-sdk'

export interface NativeTokenInfo {
  nativeToken: string
  wrappedToken: string
}

export function getIsWrappable(networkId: number, address: string): boolean {
  switch (networkId) {
    case ChainId.BOBA:
      return address === BOBA_WETH_ADDRESS
    default:
      return false
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getNativeTokenName(_networkId?: number): NativeTokenInfo {
  return {
    nativeToken: 'ETH',
    wrappedToken: 'WETH',
  }
}
