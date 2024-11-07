import { getSDK } from '@openim/wasm-client-sdk'

export const IMSDK = getSDK({
  coreWasmPath: './openIM.wasm',
  sqlWasmPath: '/sql-wasm.wasm',
})
