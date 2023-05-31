import { BigNumber, type BigNumberish } from '@ethersproject/bignumber';

export default function toBigInt(value: BigNumberish): bigint {
  if (BigNumber.isBigNumber(value)) {
    return value.toBigInt();
  } else if (typeof value === 'bigint') {
    return value;
  }

  return BigNumber.from(value).toBigInt();
}
