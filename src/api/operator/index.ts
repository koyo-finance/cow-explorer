import * as realApi from './operatorApi'
export * from './types'

// Re-exporting the result, mocked or not.
// Unfortunately, did not find a way to export
// a mix of mock/real implementations
// without manually naming the exports
export const {
  // functions that have a mock
  getOrder,
  getOrders,
  getAccountOrders,
  getTxOrders,
  getTrades,
  // functions that only have a mock
} = { ...realApi }
