# RYMEDI-AVAX

Web3 is a powerful library that provides an interface to interact with Ethereum-based blockchain networks. However, using it directly can be complex and time-consuming. To simplify the process, a wrapper library can be used. This repository provides a Web3 wrapper library that simplifies the process of interacting with Ethereum-based blockchain networks.

## Installation 

To install the library, simply run the following command:

```
npm install blockchain-client
```

## Usage

To use the library, you can import it into your project like this:

```javascript
const BlockchainClient = require('blockchain-client');
```
Then, you can create a new instance of the BlockchainClient class and pass in the URL of the Ethereum-based blockchain network you want to interact with, array of private keys or key, ABI json for smart contract and contract address: 

```javascript
const blockchainClient = new BlockchainClient('URL', [PRIVATE KEYS], [ABI], 'Contract address');
```

```javascript
constructor(providerUrl: string, privateKeys: string[], ABI: AbiItem|AbiItem[], ContractAddress: string)
```

Creates a new instance of the BlockchainClient class.

- providerUrl - The URL of the Ethereum-based blockchain network you want to interact with.

- privateKeys - The private keys to establish account details.

- ABI - ABI of smart contract gives a contract the ability to communicate and interact with external applications and other smart contracts.

- ContractAddress - Address of the smart contract.

## Functions

The BlockchainClient library provides the following functions:
### Contract functions
***readRecord(key: string): Promise: string***

- Reads a record from the blockchain by invoking the smart contract function that reads a record.

- @param key: The key of the record to read.

- @returns The value of the record as a string.
```javascript
blockchainClient.Contract.readRecord(key)
```
___
***pushRecord(
    key: string,
    value: string,
  ): Promise: string***
  
- Pushes data to the blockchain by invoking the smart contract function that writes a record.

- The transaction is signed with the provided private key.
    
- @param key: The key of the record to write.

- @param value: The value of the record to write.

- @returns The transaction hash of the submitted transaction.

```javascript
blockchainClient.Contract.pushRecord(key, value)
```
___


***pushBulkRecords(keys: string[], values: string[]): Promise: string***
- Pushes data in bulk to the blockchain by invoking the smart contract function that writes a record.
- The transaction is signed with the provided private key.
- @param keys The array of keys of the record to write.
- @param values The array of values of the record to write.
- @returns The transaction hash of the submitted transaction.

```javascript
blockchainClient.Contract.pushBulkRecords([keys], [values])
```
---

***removeRecord(key: string): Promise: string***

- Removes a record from the blockchain by invoking the smart contract function that removes the record.
- @param key The key of the record to remove.
- @returns The transaction hash of the submitted transaction.
```javascript
blockchainClient.Contract.removeRecord(key)
```
___
***getRecordCount():Promise: string***
- Returns a count of records from the blockchain by invoking the smart contract function.
- @param key The address of the new Contract.
- @returns The value of the record as a object of string.
```javascript
blockchainClient.Contract.getRecordCount()
```
___
### EventFetcher Function

***fetchEvents(
    eventName?: string,
    options?: EventFilter
  ): Promise: EventLog[]*** 
- Fetches event logs from the smart contract instance.
- @param eventName - The name of the event to fetch logs for. If not provided, all events will be fetched.
- @param options - An optional filter object containing fromBlock, toBlock.
- @returns An array of event logs matching the specified criteria.
- @throws An error if the specified event name is not found on the contract instance.
```javascript
blockchainClient.Contract.EventFetcher.fetchEvents(eventName,options)
```
___
### Ledger functions

***fetchTransactionDetails(transactionId: string): Promise: TransactionDetails***

- Get transaction details/status from blockchain for any provided transaction ID
   
- @param transactionId - The transaction ID

- @returns TransactionDetails - the transaction object
```javascript
blockchainClient.Ledger.fetchTransactionDetails(transactionId)
```
---
***fetchTransactionReceipt(transactionId: string): Promise: TransactionReceipt***

- Get transaction receipt from blockchain providing the ID for it in the input.
   
- @param transactionId - The transaction ID

- @returns TransactionReceipt - the transaction receipt object


```javascript
blockchainClient.Ledger.fetchTransactionReceipt(transactionId)
```
---
***getLatestBlockNumber(): Promise: Number***

- Retrieves the latest block number from the blockchain network
  
- @returns a promise that resolves latest block number

```javascript
blockchainClient.Ledger.getLatestBlockNumber()
```
---
***getBlockDetails(blockIdentifier: string | number): Promise: BlockDetails***

- Retrieves details of a block on the blockchain network based on its identifier (either block number or block hash)
    
- @param blockIdentifier The identifier of the block to retrieve details for.

- @returns A promise that resolves to the block details object or throws an error if the block is not found

```javascript
blockchainClient.Ledger.getBlockDetails(blockIdentifier)
```
---
**getBlockByTransactionHash(transactionHash: string): Promise: number***

- Gets block number of transaction from blockchain providing the ID for it in the input.
   
- @param transactionHash - The transaction hash/id

- @returns the block number of the transaction.

```javascript
blockchainClient.Ledger.getBlockByTransactionHash(transactionHash)
```
---
### AccessControl functions
***assignAdmin(
    address: string,
    ownerPrivateKey: string
  ): Promise: string***
  
- Assign the given address as the admin
- Can only be signed by owners.
- @param {string} address - The address which needs to be admin
- @param {string} ownerPrivateKey - The private key of owner to sign the transaction
- @returns {string} - The transaction hash
```javascript
blockchainClient.AccessControl.assignAdmin(address, ownerPrivateKey)
```
___
***removeSender(
    address: string,
    adminPrivateKey: string
  ): Promise: string*** 
Revoke the address from sender role.
- Can only be signed by admins.
- @param {string} address - The address which needs to be removed
- @param {string} adminPrivateKey - The private key of admin to sign the transaction
- @returns {string} - The transaction hash

```javascript
blockchainClient.AccessControl.removeSender(address, adminPrivateKey)
```
___
***removeAdmin(
    address: string,
    ownerPrivateKey: string
  ): Promise: string***
- Revoke the address from admin role.
- Can only be signed by owners.
- @param {string} address - The address which needs to be removed as admin
- @param {string} ownerPrivateKey - The private key of owner to sign the transaction
- @returns {string} - The transaction hash
```javascript
blockchainClient.AccessControl.removeAdmin(address, ownerPrivateKey)
```
___
***assignSender(
    address: string,
    adminPrivateKey: string
  ): Promise: string***
- Set the address to sender role.
- Can only be signed by admins.
- @param {string} address - The address which needs to be sender
- @param {string} adminPrivateKey - The private key of owner to sign the transaction
- @returns {string} - The transaction hash
```javascript
assignSender(address: string, adminPrivateKey: string)
```
***updateContractAddress(
    contractAddress: string,
    ownerPrivateKey: string
  ): Promise: string***
- update the address of new smart contract.
- can only be done by owner.
- @param contractAddress The address of new contract.
- @param {string} ownerPrivateKey - The private key of owner to sign the transaction
- @returns The transaction hash of the submitted transaction.
```javascript
updateContractAddress(contractAddress ,ownerPrivateKey)
```
___
***transferOwnership(
    address: string,
    ownerPrivateKey: string
  ): Promise: string***
- Function is used to transfer ownership
- Can only be signed by owners.
- @param {string} address - The address which needs to be owner
- @param {string} ownerPrivateKey - The private key of owner to sign the transaction
- @returns {string} - The transaction hash
```javascript
blockchainClient.AccessControl.transferOwnership(address, ownerPrivateKey)
```
___

### Account functions
***getAccounts() - string[]***

- Gets the address of the account.

- @returns a string of array which is represent account address.


```javascript
blockchainClient.Account.getAccounts()
```
---
***getBalance(address: string): Promise: string***

- Gets the balance of the specified Ethereum address.

- @param address - The Ethereum address you want to get the balance of.

- @returns a Promise that resolves to a string representing the balance in wei.

```javascript
blockchainClient.Account.getBalance(address)
```
---
