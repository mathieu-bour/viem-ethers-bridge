# Viem => Ethers.js bridge

## Motivations

Without a doubt, I think that viem will shortly replace ethers.js as the reference web3 base library.
While the tooling with wagmi is very useful for dApp developers, some third-party services will still only accept ethers.js objects.

This package allow to convert a [viem `WalletClient`](https://viem.sh/docs/clients/wallet.html) to a [ethers.js v5 `Signer`](https://docs.ethers.org/v5/api/signer/).

## Example

```ts
import { createWalletClient, custom } from 'viem';
import { WagmiSigner } from 'viem-ethers-bridge';
import { mainnet } from 'viem/chains';

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

const signer = new WagmiSigner(client);
// signer instanceof Signer === true
```
