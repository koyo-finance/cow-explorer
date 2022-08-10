import { CHAIN_KOYO_GP_V2_SETTLEMENT_ADDRESS } from '@koyofinance/momiji-sdk'
import { Network } from 'types'

export const getAddressForNetwork = (networkId: Network): string | null => {
  return CHAIN_KOYO_GP_V2_SETTLEMENT_ADDRESS[networkId] || null
}

export default CHAIN_KOYO_GP_V2_SETTLEMENT_ADDRESS
