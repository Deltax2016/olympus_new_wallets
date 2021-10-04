import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts'
import {
  wOHM,
  Approval,
  Transfer
} from "../generated/wOHM/wOHM"
//import { ExampleEntity } from "../generated/schema"
import { Transfer as TransferOHM } from '../generated/schema'
import { Balance } from '../generated/schema'
import {SOHM_ERC20_CONTRACT, OHM_ERC20_CONTRACT} from './utils/Constants'

/*
export function handleApproval(event: Approval): void {

  let entity = ExampleEntity.load(event.transaction.from.toHex())

  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())
    entity.count = BigInt.fromI32(0)
  }

  entity.count = entity.count + BigInt.fromI32(1)
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.save()

}*/

export function handleTransfer(event: Transfer): void {
  let entity = TransferOHM.load(event.transaction.hash.toHex())
  let balances_from = createWallet(event.params.from)
  let balances_to = createWallet(event.params.to)

  if (!entity) {
    entity = new TransferOHM(event.transaction.hash.toHex())
  }

  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.value
  entity.save()


}

function createWallet(address: Address): Balance {

  let entity = Balance.load(address.toHex())

  if (!entity) {
    entity = new Balance(address.toHex())
  }

  let ohmContract = wOHM.bind(Address.fromString(OHM_ERC20_CONTRACT))

  entity.ohmBalance = toDecimal(ohmContract.balanceOf(Address.fromString(entity.id.toString())),9)
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
