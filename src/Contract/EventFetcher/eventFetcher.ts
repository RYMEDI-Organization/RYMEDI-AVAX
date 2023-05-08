/**
 * This class provides a convenient way to fetch events from a smart contract using the Web3 library.
 */
import { Contract } from "web3-eth-contract";
import { EventFilter, EventLog } from "./eventTypes";

class EventFetcher {
  /**
   * The smart contract instance used to fetch events from.
   */
  private events: Contract;

  /**
   * Constructs a new instance of the EventFetcher class.
   * @param providerUrl - The URL of the blockchain provider to connect to.
   * @param contractInstance - The smart contract instance to fetch events from.
   */
  constructor(contractInstance: Contract) {
    this.events = contractInstance;
  }

  /**
   * Fetches event logs from the smart contract instance.
   * @param eventName - The name of the event to fetch logs for. If not provided, all events will be fetched.
   * @param options - An optional filter object containing fromBlock, toBlock.
   * @returns An array of event logs matching the specified criteria.
   * @throws An error if the specified event name is not found on the contract instance.
   */
  async fetchEvents(
    eventName?: string,
    options?: EventFilter
  ): Promise<EventLog[]> {
    // Check if the event name is valid, if provided
    if (eventName && !(eventName in this.events.events)) {
      throw new Error(`Event "${eventName}" not found`);
    }
    // Set default values for fromBlock and toBlock if not provided
    const fromBlock = options?.fromBlock || 0;
    const toBlock = options?.toBlock || "latest";
    const eventLogs = await this.events.getPastEvents(
      eventName || "allEvents",
      { ...options, fromBlock, toBlock }
    );
    return eventLogs;
  }
}

export default EventFetcher;
