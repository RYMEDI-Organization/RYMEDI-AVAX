export const ABI = [
	{
		"inputs": [
			{
				"internalType": "bytes32[]",
				"name": "keys",
				"type": "bytes32[]"
			},
			{
				"internalType": "bytes32[]",
				"name": "values",
				"type": "bytes32[]"
			}
		],
		"name": "addBulkRecords",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "key",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "value",
				"type": "bytes32"
			}
		],
		"name": "addRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "key",
				"type": "bytes32"
			}
		],
		"name": "getRecord",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "initalized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "initialize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "proxiableUUID",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newCode",
				"type": "address"
			}
		],
		"name": "updateCode",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]