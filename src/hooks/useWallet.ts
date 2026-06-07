import { useAppKit, useAppKitAccount } from '@reown/appkit/react'

export function useWallet() {
  const { open } = useAppKit()
  const { address, isConnected, status } = useAppKitAccount()

  return {
    address: address as string | undefined,
    isConnected,
    status,
    connect: () => open(),
    disconnect: () => open({ view: 'Account' }),
  }
}
