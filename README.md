# LwM2M Device Simulator

This is a LwM2M device simulator who emulate a [Thingy:91](https://www.nordicsemi.com/Products/Development-hardware/Nordic-Thingy-91) running with [nRF Asset Tracker firmware](https://github.com/nrfconnect/sdk-nrf/tree/main/applications/asset_tracker_v2). 

The main propose of this project is to facilitate the testing process of [LwM2M Asset Tracker](https://github.com/MLopezJ/LwM2M-Asset-Tracker).

## Specifications 
This device uses LwM2M as a protocol and has implemented the “Client Registration” and “Device Management and Service Enablement” interfaces to communicate with the server.

The bootstrap of the device is executed by using the Factory Bootstrap mode with the already defined [LwM2M objects](https://github.com/MLopezJ/LwM2M-device-simulator/blob/saga/src/assetTrackerV2.ts)
 
A command line interface is provided for communication with the server

## CLI reference

```
command required-param [optional param]

Options:

	List

		List values

	Format: list /[object-id]/[instance-id]/[resource-id]
	Example: 
           list
           list /3
           list /3/0
           list /3/0/0
-------------------------------------------------

	Set

		Set resource value

	Format: set object-id/instance-id/resource-id  value
	Example: set /3/0/0 Nordic
-------------------------------------------------

	Register

		Execute LwM2M Client Registration interface

	Format: register
	Example: register
-------------------------------------------------

	Clear

		Clear console

	Format: clear
	Example: clear
-------------------------------------------------

	Quit

		Exit the client

	Format: quit
	Example: quit
-------------------------------------------------

	Help

		List all possible commands

	Format: help
	Example: help
-------------------------------------------------
```

## Installation
```
npm install
```

## Test

```
npm test
```

## Prerequisites

The default LwM2M server is Coiote from AV System. If you want to use the device simulator with the default configuration, you should:

* Have a [Coiote IoT DM account](https://eu.iot.avsystem.cloud/ui/device/inventory)
* Create a device in Coiote IoT DM with NoSec security mode
* Update [config](https://github.com/MLopezJ/LwM2M-device-simulator/blob/saga/config.json) file with name of created device in `deviceName` property.

If other server is desired to be used, just update the `host` property from [config](https://github.com/MLopezJ/LwM2M-device-simulator/blob/saga/config.json) with the required value. 


## Execution

```
npx tsx src/cli.ts 
```

## Limitations

#### Security Mode
The device simulator does not support `credentials` or `pre-shared keys`, and the only security mode option implemented is the `No-Sec`, which uses the port `5683` for the comunication with the server. The implemented security mode is not recommended for production enviroments. 

#### Content format
The data format used for transferring resource information is LwM2M+json ([Documentation - Page 48](http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf))

#### No implemented interface
The "Information Reporting” interface is not implemented in the device simulator, for this reason is not possible to performance "observe" action on the LwM2M objects.

