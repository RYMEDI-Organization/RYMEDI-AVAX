# RYMEDI-AVAX

Web3 is a powerful library that provides an interface to interact with Ethereum-based blockchain networks. However, using it directly can be complex and time-consuming. To simplify the process, a wrapper library can be used. This repository provides a Web3 wrapper library that simplifies the process of interacting with Ethereum-based blockchain networks.

## Installation 

To install the library, simply run the following command:

```
npm install blockchain-client

```

## Usage

To use the library, you can import it into your project like this:

```
const BlockchainClient = require('blockchain-client');

```
Then, you can create a new instance of the BlockchainClient class and pass in the URL of the Ethereum-based blockchain network you want to interact with, array of private keys or key, ABI json for smart contract and contract address: 

```
const blockchainClient = new BlockchainClient('URL', [PRIVATE KEYS], [ABI], 'Contract address');

```

### API

The BlockchainClient library provides the following API:

constructor(providerUrl: string, privateKeys: string[], ABI: AbiItem|AbiItem[], ContractAddress: string)

Creates a new instance of the BlockchainClient class.

providerUrl - The URL of the Ethereum-based blockchain network you want to interact with.

privateKeys - The private keys to establish account details.

ABI - ABI of smart contract gives a contract the ability to communicate and interact with external applications and other smart contracts.

ContractAddress - Address of the smart contract.


```
blockchainClient.Contract.readRecord(key)
```
***readRecord(key: string): Promise<string>***

Reads a record from the blockchain by invoking the smart contract function that reads a record.

key: The key of the record to read.

returns The value of the record as a string.

```
blockchainClient.Contract.pushRecord(key, value)
```
***pushRecord(
    key: string,
    value: string,
  ): Promise<string>***
  
Pushes data to the blockchain by invoking the smart contract function that writes a record.

The transaction is signed with the provided private key.
    
key: The key of the record to write.

value: The value of the record to write.

returns The transaction hash of the submitted transaction.


```
blockchainClient.Ledger.fetchTransactionDetails(transactionId)
```

***fetchTransactionDetails(transactionId: string): Promise<TransactionDetails>***

Get transaction details/status from blockchain for any provided transaction ID
   
transactionId - The transaction ID

TransactionDetails - returns the transaction object


```
blockchainClient.Ledger.fetchTransactionReceipt(transactionId)
```

***fetchTransactionReceipt(transactionId: string): Promise<TransactionReceipt>***

Get transaction receipt from blockchain providing the ID for it in the input.
   
transactionId - The transaction ID

TransactionReceipt - returns the transaction receipt object

```
blockchainClient.Ledger.getLatestBlockNumber()
```

***getLatestBlockNumber(): Promise<number>***

Retrieves the latest block number from the blockchain network
  
returns a promise that resolves latest block number

```
blockchainClient.Ledger.getBlockDetails(blockIdentifier)
```
***getBlockDetails(blockIdentifier: string | number): Promise<any>***

Retrieves details of a block on the blockchain network based on its identifier (either block number or block hash)
    
blockIdentifier The identifier of the block to retrieve details for.

returns A promise that resolves to the block details object or throws an error if the block is not found


```
blockchainClient.Account.getAccounts()
```
***getAccounts() - string[]***

Gets the address of the account.

Returns a string of array which is represent account address.


```
blockchainClient.Account.getBalance(address)
```
getBalance(address: string): Promise<string>

Gets the balance of the specified Ethereum address.

address - The Ethereum address you want to get the balance of.

Returns a Promise that resolves to a string representing the balance in wei.
