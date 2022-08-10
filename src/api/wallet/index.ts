import Web3 from 'web3'
import WalletApiImpl, { WalletApi } from './WalletApi'

export function createWalletApi(web3: Web3): WalletApi {
  const walletApi = new WalletApiImpl(web3)
  window['walletApi'] = walletApi // register for convenience
  return walletApi
}
