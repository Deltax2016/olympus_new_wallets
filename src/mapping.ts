import { Address, BigDecimal, BigInt, log, Bytes } from '@graphprotocol/graph-ts'
import {
  wOHM,
  Approval,
  Transfer,
  MintCall,
  SetVaultCall,
  BurnCall,
} from "../generated/wOHM/wOHM"
//import { ExampleEntity } from "../generated/schema"
import { Transfer as TransferOHM } from '../generated/schema'
import { createWallet, createTotals } from './utils/wallets'
import { Mint, Minter, totalSupply, Burn } from '../generated/schema'
import {SOHM_ERC20_CONTRACT, OHM_ERC20_CONTRACT} from './utils/Constants'



export function handleMint(call: MintCall): void {
  let entity = Mint.load(call.transaction.hash.toHex())

  if (!entity) {
    entity = new Mint(call.transaction.hash.toHex())
  }

  
  entity.address = call.inputs.account_
  entity.value = toDecimal(call.inputs.amount_, 9)
  entity.timestamp = call.block.timestamp
  entity.save()

  let total = createTotals(call.block.timestamp)
  let a = total.ohmBalance
  let b = call.inputs.amount_
  total.ohmBalance = a.plus(b)
  total.save()

  createWallet(call.inputs.account_, call.block.timestamp, call.transaction.hash)

}

export function handleBurn(call: BurnCall): void {
  let entity = Burn.load(call.transaction.hash.toHex())

  if (!entity) {
    entity = new Burn(call.transaction.hash.toHex())
  }

  entity.value = call.inputs.amount
  entity.save()

  let total = createTotals(call.block.timestamp)
  let a = total.ohmBalance
  let b = call.inputs.amount
  total.ohmBalance = a.minus(BigInt.fromString(b.toString()))
  total.save()

}

export function handleSetVault(call: SetVaultCall ): void {
  let entity = Minter.load(call.transaction.hash.toHex())

  if (!entity) {
    entity = new Minter(call.transaction.hash.toHex())
  }
  entity.timestamp = call.block.timestamp
  entity.address = call.inputs.vault_
  entity.save()
}


export function handleTransfer(event: Transfer): void {

  let entity = TransferOHM.load(event.transaction.hash.toHex())
  createWallet(event.params.to, event.block.timestamp, event.transaction.hash)
  createWallet(event.params.from, event.block.timestamp, event.transaction.hash)

  if (!entity) {
    entity = new TransferOHM(event.transaction.hash.toHex())
  }

  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = toDecimal(event.params.value, 9)
  entity.timestamp = event.block.timestamp
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
