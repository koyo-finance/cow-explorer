import { ChainId } from '@koyofinance/core-sdk'
import { IRPCMap, IWalletConnectProviderOptions } from '@walletconnect/types'
import { INFURA_ID, STORAGE_KEY_CUSTOM_WC_OPTIONS, WALLET_CONNECT_BRIDGE } from 'const'

export interface WCOptions {
  infuraId?: string
  bridge?: string
  rpc?: {
    boba?: string
  }
}

const defaultRPC = {
  [ChainId.BOBA]: 'https://mainnet.boba.network/',
}

export const setCustomWCOptions = (options: WCOptions): boolean => {
  const optionsStr = JSON.stringify(options)
  const oldStr = localStorage.getItem(STORAGE_KEY_CUSTOM_WC_OPTIONS)

  // no change,no need to reconnect
  if (optionsStr === oldStr) return false

  localStorage.setItem(STORAGE_KEY_CUSTOM_WC_OPTIONS, optionsStr)
  return true
}

export const getWCOptionsFromStorage = (): WCOptions => {
  const storedOptions = localStorage.getItem(STORAGE_KEY_CUSTOM_WC_OPTIONS)
  if (!storedOptions) return {}

  return JSON.parse(storedOptions)
}

const mapStoredRpc = (rpc?: WCOptions['rpc']): IRPCMap | undefined => {
  if (!rpc) return

  const { boba } = rpc

  const rpcMap = {}
  if (boba) rpcMap[ChainId.BOBA] = boba

  return rpcMap
}

export const generateWCOptions = (): IWalletConnectProviderOptions => {
  const { infuraId, bridge, rpc } = getWCOptionsFromStorage()
  return {
    infuraId: infuraId || INFURA_ID,
    bridge: bridge || WALLET_CONNECT_BRIDGE,
    rpc: {
      ...defaultRPC,
      ...mapStoredRpc(rpc),
    },
  }
}
