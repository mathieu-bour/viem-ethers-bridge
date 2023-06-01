import { BaseProvider, type Network } from '@ethersproject/providers';
import { type Client } from 'viem';

export default class WagmiProvider extends BaseProvider {
  constructor(private readonly client: Client) {
    super({
      chainId: client?.chain?.id ?? 1,
      name: client?.chain?.name ?? 'mainnet'
    });
  }

  override detectNetwork(): Promise<Network> {
    const chain = this.client?.chain;
    
    if (!chain) {
      throw new Error('WagmiProvider.detectNetwork: cannot detect network as client.chain is undefined')
    }
    
    return Promise.resolve({
      chainId: chain.id,
      name: chain.name,
    })
  }

  override perform(method: string, params: any): Promise<any> {
    return this.client.request({ method: method as any, params });
  }
}
