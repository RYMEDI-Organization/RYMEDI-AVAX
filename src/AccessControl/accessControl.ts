import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Accounts } from "../Account/Account";
import { Contract } from "web3-eth-contract";
import { ABI } from "../../abi";
export class AccessControl {
  private web3: Web3;
  private contract: Contract;
  private readonly PrivateKeys: string[];
  private accounts: Accounts;
  private addresses: string[];
  public senders: string[];
  private admins: string[];
  private owner: string[];
  constructor(
    web3: Web3,
    privateKeys: string[],
    Abi: AbiItem | AbiItem[],
    contractAddress: string
  ) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(Abi, contractAddress);
    this.PrivateKeys = privateKeys;
    this.accounts = new Accounts(this.web3, privateKeys);
    this.addresses = this.accounts.getAccounts();
    this.senders = [];
  }

  public async assignRole() {
    let roleIdentity: { [key: string]: string } = {};
    try {
      this.addresses.map(async (address) => {
        let sender = await this.contract.methods
          .isSender("0x6FAC93cbe0263cBAbf9b95ce415fCDC5829713c4")
          .call();
        let owner = await this.contract.methods
          .isOwner("0x6FAC93cbe0263cBAbf9b95ce415fCDC5829713c4")
          .call();
        let admin = await this.contract.methods
          .isAdmin("0x6FAC93cbe0263cBAbf9b95ce415fCDC5829713c4")
          .call();
        console.log(sender, owner, admin);
        if (sender) {
          this.senders.push(address);
          roleIdentity[address] = "sender";
          console.log(address, "sender", roleIdentity);
        } else if (owner) {
          roleIdentity[address] = "owner";
          this.owner.push(address);
        } else if (admin) {
          this.admins.push(address);
          roleIdentity[address] = "admin";
        }
      });
    } catch (error) {
      console.log(error);
    }
    console.log(roleIdentity);
  }

  public async assignAdmin(address: string): Promise<void> {
    if(this.admins.length > 0 || this.owner.length > 0) {
        await this.contract.methods.assignAdmin(address)
    }
  }

  public async assignSender(address: string): Promise<void> {
    if(this.owner.length > 0) {
        await this.contract.methods.assignSender(address)
    }
  }
}
const data = new AccessControl(
  "https://api.avax-test.network/ext/C/rpc",
  [
    "331c277ed4b077b5ca137b930aaa73143d85c7d0adad39adc4feaff0f3a14c7b",
    "35cea68b9ab2c1e8e49632dc681ee9f18c0ec45955382487ba32f2b0e2a34be2",
    "4a762a213d5020ae43b6902aeaefb8e74fd585dd4931d692d49a4c87f5426b7a",
    "3d726d69bbc0f4ade8bcd4fc72a557ddd7ede6ff783929f1e5557c15fda6146e",
    "c252374696ce572d51ba3bf950187be654c9c00db3528958a4ea7c6044ac5f82",
    "fd5d3f2fa1480fc49861e357ededbd05031b5e69621cd5c4b6c63056f90b8208",
    "ed43e0dd77cdd75ec11ca120f8fbc6168a7fef45d0714010a9d6d7bc299883f0",
    "1317b6498809121f86e83f7276524b3271fac9ad84c3c6a4abe1c9576ea606c6",
    "83b761bb23bc89f8513a09ddf52ae776161e5507859f47db136bf1e44a794ceb",
    "0645fae951939fc60c4920cea623660a59d2f54575a86c1420845c463631471c",
    "28962f5002e6d47bcb3d0bc2e6d49f30ef98fdca885b5e5842bc4eef4dc90a2d",
    "463da28c501e4feb04d3b1ec37c79952023cebbc302d04b2331c86753cb55a75",
  ],
  ABI as AbiItem[],
  "0xD0aD439cf1cc43e05004E021B24cE7B02252795f"
);

data.assignRole();
