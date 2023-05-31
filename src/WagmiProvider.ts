import { BaseProvider } from '@ethersproject/providers';
import { type Client } from 'viem';

export default class WagmiProvider extends BaseProvider {
  constructor(private readonly client: Client) {
    super({
      chainId: client.chain!.id,
      name: client.chain!.name,
    });
  }

  override perform(method: string, params: any): Promise<any> {
    return this.client.request({ method: method as any, params });
  }
}
