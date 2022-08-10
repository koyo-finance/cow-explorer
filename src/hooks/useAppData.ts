import { AppDataDoc } from '@cowprotocol/cow-sdk'
import { ChainId } from '@koyofinance/core-sdk'
import { useEffect, useState } from 'react'
import { useNetworkId } from 'state/network'

export const useAppData = (appDataHash: string): { isLoading: boolean; appDataDoc: AppDataDoc | void | undefined } => {
  const network = useNetworkId() || undefined
  const [isLoading, setLoading] = useState<boolean>(false)
  const [appDataDoc, setAppDataDoc] = useState<AppDataDoc | void>()
  useEffect(() => {
    async function getAppDataDoc(): Promise<void> {
      setLoading(true)
      try {
        const decodedAppData = await getDecodedAppData(appDataHash, network)
        setAppDataDoc(decodedAppData)
      } catch (e) {
        const msg = `Failed to fetch appData document`
        console.error(msg, e)
      } finally {
        setLoading(false)
        setAppDataDoc(undefined)
      }
    }
    getAppDataDoc()
  }, [appDataHash, network])

  return { isLoading, appDataDoc }
}

export const getDecodedAppData = (
  _appDataHash: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _networkId = ChainId.BOBA,
): Promise<void | AppDataDoc> | undefined => {
  throw new Error('yeet')
}

export const getCidHashFromAppData = (
  _appDataHash: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _networkId = ChainId.BOBA,
): Promise<string | void> | undefined => {
  throw new Error('yeet')
}
