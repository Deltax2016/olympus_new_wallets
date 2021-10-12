import { Address, BigDecimal, BigInt, log, Bytes } from '@graphprotocol/graph-ts'
import {
  wOHM,
  Approval,
  Transfer,
  MintCall,
  SetVaultCall
} from "../generated/wOHM/wOHM"
//import { ExampleEntity } from "../generated/schema"
import { Transfer as TransferOHM } from '../generated/schema'
import { createWallet } from './utils/wallets'
import { Balance, Mint, Minter } from '../generated/schema'
import {SOHM_ERC20_CONTRACT, OHM_ERC20_CONTRACT} from './utils/Constants'



export function handleMint(call: MintCall): void {
  let entity = Mint.load(call.transaction.hash.toHex())

  if (!entity) {
    entity = new Mint(call.transaction.hash.toHex())
  }

  entity.address = call.inputs.account_
  entity.value = call.inputs.amount_
  entity.save()

  createWallet(call.inputs.account_, call.block.timestamp, call.transaction.hash)

}

export function handleSetVault(call: SetVaultCall ): void {
  let entity = Minter.load(call.transaction.hash.toHex())

  if (!entity) {
    entity = new Minter(call.transaction.hash.toHex())
  }

  entity.address = call.inputs.vault_
  entity.save()
}


export function handleTransfer(event: Transfer): void {
  let entity = TransferOHM.load(event.transaction.hash.toHex())
  log.debug('Event timestamp {} ', [event.transaction.hash.toString()])
  //createWallet(event.params.from, event.block.timestamp, event.transaction.hash)
  createWallet(event.params.to, event.block.timestamp, event.transaction.hash)

  if (!entity) {
    entity = new TransferOHM(event.transaction.hash.toHex())
  }

  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.value
  entity.save()

}
