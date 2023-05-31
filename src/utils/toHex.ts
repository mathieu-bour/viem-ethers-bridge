import { hexlify, isBytes } from '@ethersproject/bytes';
import { isHex, type Hex } from 'viem';

export default function toHex(value: unknown): Hex {
  let dataStr;
  
  if(typeof value === 'string' ) {
    dataStr = value;
  } else if (isBytes(value)) {
    dataStr = hexlify(value);
  } else {
    throw new Error('dataHex: cannot convert to hex');
  }

  if (!isHex(dataStr)) {
    throw new Error('dataHex: cannot convert to hex');
  }
  
  return dataStr;
}
