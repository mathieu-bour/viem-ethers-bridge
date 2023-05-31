import { type TransactionRequest, type TransactionResponse } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { BigNumber } from '@ethersproject/bignumber';
import type { Bytes } from '@ethersproject/bytes';
import { type Deferrable } from '@ethersproject/properties';
import { type Hash, type WalletClient } from 'viem';
import WagmiProvider from './WagmiProvider.js';
import toBigInt from './utils/toBigInt.js';
import toHex from './utils/toHex.js';

export default class WagmiSigner extends Signer {
  override readonly provider: WagmiProvider;
  
  constructor(private client: WalletClient) {
    super();
    this.provider =  new WagmiProvider(client);
  }

  connect(): Signer {
    throw new Error('WagmiSigner: changing provider is not supported');
  }

  async getAddress(): Promise<`0x${string}`> {
    const addresses = await this.client.getAddresses();

    if (addresses.length === 0) {
      throw new Error('WagmiSigner.getAddress: WalletClient.getAddresses() returned an empty array');
    }

    return toHex(addresses[0]);
  }

  signTransaction(): Promise<string> {
    throw new Error('WagmiSigner.signTransaction is not supported, see WagmiSigner.sendTransaction instead');
  }

  override async sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse> {
    const tx = await this.populateTransaction(transaction);
    
    // From
    const from = toHex(tx.from ?? await this.getAddress());

    // Nonce
    let nonce: number;
    if (typeof tx.nonce !== 'undefined') {
      nonce = BigNumber.from(tx.nonce).toNumber();
    } else {
      nonce = await this.provider.getTransactionCount(from);
    }

    const common = {
      chain: this.client.chain,
      account: from,
      data: tx.data ? toHex(tx.data) : undefined,
      nonce,
      to: toHex(tx.to),
      value: tx.value ? toBigInt(tx.value) : undefined,
    };

    let txHash: Hash;
    if (tx.gasLimit && tx.gasPrice) {
      // Legacy transaction
      txHash = await this.client.sendTransaction({
        ...common,
        gas: toBigInt(tx.gasLimit),
        gasPrice: toBigInt(tx.gasPrice)
      })
    } else if (tx.maxFeePerGas && tx.maxPriorityFeePerGas) {
      // EIP-1559 transaction
      txHash = await this.client.sendTransaction({
        ...common,
        maxFeePerGas: toBigInt(tx.maxFeePerGas),
        maxPriorityFeePerGas: toBigInt(tx.maxPriorityFeePerGas)
      })
    } else {
      throw new Error('WagmiSigner.sendTransaction: invalid fee configuration');
    }

    return this.provider.getTransaction(txHash);
  }

  async signMessage(messageOrBytes: string | Bytes): Promise<string> {
    const message = toHex(messageOrBytes);

    return this.client.signMessage({
      account: await this.getAddress(),
      message,
    });
  }
}
