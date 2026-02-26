import { Suspense } from 'react'
import PacketDetails from './PacketDetails'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PacketDetails />
    </Suspense>
  )
}