import { Address, BigDecimal, BigInt, log, Bytes } from '@graphprotocol/graph-ts'
import { Balance } from '../../generated/schema'
import {SOHM_ERC20_CONTRACT, OHM_ERC20_CONTRACT} from './Constants'
import {
  wOHM
} from "../../generated/wOHM/wOHM"

export function createWallet(address: Bytes, timestamp: BigInt): Balance {

  log.debug('Address {} timestamp {} id {}', [address.toString(), timestamp.toString()])

  let entity = Balance.load(address.toHex())

  if (!entity) {
    entity = new Balance(address.toHex())
  }

  let ohmContract = wOHM.bind(Address.fromString(OHM_ERC20_CONTRACT))
  let sohmContract = wOHM.bind(Address.fromString(SOHM_ERC20_CONTRACT))

  entity.ohmBalance = toDecimal(ohmContract.balanceOf(Address.fromString(entity.id.toString())),9)
  entity.sohmBalance = toDecimal(sohmContract.balanceOf(Address.fromString(entity.id.toString())),9)
  entity.timestamp = timestamp
  entity.address = address
  entity.save()

  return entity as Balance

}

function toDecimal(
  value: BigInt,
  decimals: number = DEFAULT_DECIMALS,
): BigDecimal {
  let precision = BigInt.fromI32(10)
    .pow(<u8>decimals)
    .toBigDecimal();

  return value.divDecimal(precision);
}
