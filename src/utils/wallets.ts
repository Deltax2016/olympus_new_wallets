import { Address, BigDecimal, BigInt, log, Bytes } from '@graphprotocol/graph-ts'
import { Balance, Wallet } from '../../generated/schema'
import {SOHM_ERC20_CONTRACT, OHM_ERC20_CONTRACT} from './Constants'
import {
  wOHM
} from "../../generated/wOHM/wOHM"

export function createBalance(address: Bytes, timestamp: BigInt, id: Bytes): Balance {

  let entity = Balance.load(id.toHex())

  if (!entity) {
    entity = new Balance(id.toHex())
  }

  let ohmContract = wOHM.bind(Address.fromString(OHM_ERC20_CONTRACT))
  let sohmContract = wOHM.bind(Address.fromString(SOHM_ERC20_CONTRACT))

  entity.wallet = address.toHex()
  entity.ohmBalance = ohmContract.balanceOf(Address.fromString(address.toHex()))
  entity.sohmBalance = sohmContract.balanceOf(Address.fromString(address.toHex()))
  entity.timestamp = timestamp
  entity.address = address.toHex()
  entity.save()

  return entity as Balance

}


export function createWallet(address: Bytes, timestamp: BigInt, id: Bytes): void {

  let entity = Wallet.load(address.toHex())

  if (!entity) {
    entity = new Wallet(address.toHex())
    entity.birth = timestamp
  }

  let ohmContract = wOHM.bind(Address.fromString(OHM_ERC20_CONTRACT))
  let sohmContract = wOHM.bind(Address.fromString(SOHM_ERC20_CONTRACT))

  entity.ohmBalance = ohmContract.balanceOf(Address.fromString(address.toHex()))
  entity.sohmBalance = sohmContract.balanceOf(Address.fromString(address.toHex()))
  entity.address = address.toHex()
  entity.save()

  let balance = createBalance(address, timestamp, id)

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
