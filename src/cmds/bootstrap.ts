import { assetTrackerFirmwareV2 } from "../assetTrackerV2.js"
import type { assetTracker } from "../assetTrackerV2.js";
import type { Agent } from 'coap'
import coap from 'coap'

const defaultType = "udp4"
const createAgent = () => new coap.Agent({type:defaultType})
export const bootstrap = (): [assetTracker, Agent] => [structuredClone(assetTrackerFirmwareV2),createAgent()]
