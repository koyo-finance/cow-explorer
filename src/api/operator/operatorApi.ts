import { COW_SDK } from 'const'
import { Network } from 'types'
import { buildSearchString } from 'utils/url'

import { ChainId } from '@koyofinance/core-sdk'
import { fetchQuery } from 'api/baseApi'
import {
  GetAccountOrdersParams,
  GetOrderParams,
  GetOrdersParams,
  GetTradesParams,
  GetTxOrdersParams,
  RawOrder,
  RawTrade,
} from './types'

function getOperatorUrl(): Partial<Record<Network, string>> {
  return {
    [ChainId.BOBA]: process.env.OPERATOR_URL_PROD_BOBA,
  }
}

const COW_SDK_ENV = COW_SDK

const API_BASE_URL = getOperatorUrl()

const DEFAULT_HEADERS: Headers = new Headers({
  'Content-Type': 'application/json',
  'X-AppId': CONFIG.appId.toString(),
})

/**
 * Unique identifier for the order, calculated by keccak256(orderDigest, ownerAddress, validTo),
   where orderDigest = keccak256(orderStruct). bytes32.
 */

function _getApiBaseUrl(networkId: Network): string {
  const baseUrl = API_BASE_URL[networkId]

  if (!baseUrl) {
    throw new Error('Unsupported Network. The operator API is not deployed in the Network ' + networkId)
  } else {
    return baseUrl + '/v1'
  }
}

function _get(networkId: Network, url: string): Promise<Response> {
  const baseUrl = _getApiBaseUrl(networkId)
  return fetch(baseUrl + url, {
    headers: DEFAULT_HEADERS,
  })
}

/**
 * Gets a single order by id
 */
export async function getOrder(params: GetOrderParams): Promise<RawOrder | null> {
  const { networkId, orderId } = params
  const cowInstance = COW_SDK[networkId]

  if (!cowInstance) return null

  const order = await cowInstance.orderbookService.getOrder(orderId)
  return order
}

/**
 * Gets a list of orders
 *
 * Optional filters:
 *  - owner: address
 *  - sellToken: address
 *  - buyToken: address
 *  - minValidTo: number
 */
export async function getOrders(params: GetOrdersParams): Promise<RawOrder[]> {
  const { networkId, ...searchParams } = params
  const { owner, sellToken, buyToken, minValidTo } = searchParams
  const defaultValues = {
    includeFullyExecuted: 'true',
    includeInvalidated: 'true',
    includeInsufficientBalance: 'true',
    includePresignaturePending: 'true',
    includeUnsupportedTokens: 'true',
  }

  console.log(
    `[getOrders] Fetching orders on network ${networkId} with filters: owner=${owner} sellToken=${sellToken} buyToken=${buyToken}`,
  )

  const searchString = buildSearchString({ ...searchParams, ...defaultValues, minValidTo: String(minValidTo) })

  const queryString = '/orders/' + searchString

  return _fetchQuery(networkId, queryString)
}

/**
 * Gets a list of orders of one user paginated
 *
 * Optional filters:
 *  - owner: address
 *  - offset: int
 *  - limit: int
 */
export async function getAccountOrders(params: GetAccountOrdersParams): Promise<RawOrder[]> {
  const { networkId, owner, offset, limit } = params
  const cowInstance = COW_SDK_ENV[networkId]

  if (!cowInstance) return []

  return cowInstance.orderbookService.getOrders({ owner, offset, limit })
}

/**
 * Gets a order list within Tx
 */
export async function getTxOrders(params: GetTxOrdersParams): Promise<RawOrder[]> {
  const { networkId, txHash } = params

  console.log(`[getTxOrders] Fetching tx orders on network ${networkId}`)

  const cowInstance = COW_SDK[networkId]

  if (!cowInstance) return []

  const orders = await cowInstance.orderbookService.getTxOrders(txHash)

  return orders
}

/**
 * Gets a list of trades
 *
 * Optional filters:
 *  - owner: address
 *  - orderId: string
 *
 * Both filters cannot be used at the same time
 */
export async function getTrades(params: GetTradesParams): Promise<RawTrade[]> {
  const { networkId, owner = '', orderId = '' } = params
  const cowInstance = COW_SDK[networkId]

  if (!cowInstance) return []

  console.log(`[getTrades] Fetching trades on network ${networkId} with filters`, { owner, orderId })

  // @ts-expect-error idk
  const trades = await cowInstance.orderbookService.getTrades({ owner, orderId })

  return trades
}

function _fetchQuery<T>(networkId: Network, queryString: string): Promise<T>
function _fetchQuery<T>(networkId: Network, queryString: string, nullOn404: true): Promise<T | null>
function _fetchQuery<T>(networkId: Network, queryString: string, nullOn404?: boolean): Promise<T | null> {
  const get = (): Promise<Response> => _get(networkId, queryString)
  if (nullOn404) {
    return fetchQuery({ get }, queryString, nullOn404)
  }

  return fetchQuery({ get }, queryString)
}
