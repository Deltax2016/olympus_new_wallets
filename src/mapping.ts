import { Address, BigDecimal, BigInt, log, Bytes } from '@graphprotocol/graph-ts'
import {
  wOHM,
  Approval,
  Transfer
} from "../generated/wOHM/wOHM"
//import { ExampleEntity } from "../generated/schema"
import { Transfer as TransferOHM } from '../generated/schema'
import { createWallet } from './utils/wallets'

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
  log.debug('Event timestamp {} ', [event.transaction.hash.toString()])
  let bTo = createWallet(event.params.from, event.block.timestamp)
  let bFrom = createWallet(event.params.to, event.block.timestamp)

  if (!entity) {
    entity = new TransferOHM(event.transaction.hash.toHex())
  }

  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.value
  entity.save()

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
