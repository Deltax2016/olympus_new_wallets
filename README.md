<!-- markdownlint-disable no-inline-html first-line-h1 -->

<div align="center">
  <a href="https://app.olympusdao.finance/#/dashboard" target="_blank">
    <img width="150" src="./img/android-chrome-192x192.png">
  </a>
  <h1>Olympus OHM wallets</h1>
</div>


## API url

https://api.thegraph.com/subgraphs/name/deltax2016/olympus-wallets

## Main Entities

### Wallets

Info about wallet balances:
- id - entity ID
- address - wallet address
- ohmBalance - ohm balance (now)
- dailyBalance - array of daily balances of this wallet
- birth - wallet activation timestamp

```graphql
type Wallet @entity {
  id: ID!
  address: Bytes
  ohmBalance: BigInt
  dailyBalance: [DailyBalance!]! @derivedFrom(field: "wallet")
  birth: BigInt
}
```

### Mints / Burns

Info about mints / burns:
- id - entity id
- address - address of the recipient
- value - how many tokens mined / burned
- timestamp - timestamp of Mint event

```graphql
type Mint @entity {

  id: ID!
  address: Bytes
  value: BigDecimal
  timestamp: BigInt

}

type Burn @entity {

  id: ID!
  value: BigInt

}
```

### Transfers

Info about mints / burns:
- id - entity id
- from - address of the recipient
- to - address of the sender
- amount - how many tokens transfered
- timestamp - timestamp of Transfer event

```graphql
type Transfer @entity {

  id: ID!
  from: Bytes
  to: Bytes
  amount: BigDecimal
  timestamp: BigInt

}
```

### totalSupply

Info about amount of supply and number of OHM holders:
- id - entity id
- totalWallets - number of holders
- ohmBalance - total ohm balance
- day - day of last mint / burn envent
- timestamp - timestamp last mint / burn event

```graphql
type totalSupply @entity {

  id: ID!
  totalWallets: BigInt!
  ohmBalance: BigInt!
  day: BigInt
  timestamp: BigInt

}

```

### Minter

Info about OHM minter role changes:
- id - entity id
- address - address of new miner 
- timestamp - timestamp of setVault call

```graphql
type Minter @entity {

  id: ID!
  address: Bytes
  timestamp: BigInt

}
```

## Query Example (python)

```python
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport

# Select your transport with a defined url endpoint
transport = AIOHTTPTransport(url="https://api.thegraph.com/subgraphs/name/deltax2016/olympus-wallets")

# Create a GraphQL client using the defined transport
client = Client(transport=transport, fetch_schema_from_transport=True)

# Provide a GraphQL query
query = gql(
    """
    query getWallets {
      wallets(first: 5) {
	    id
	    address
	    sohmBalance
	    dailyBalance {
	      id
	    }
	  }
    }
"""
)

# Execute the query on the transport
result = client.execute(query)
print(result)
```


