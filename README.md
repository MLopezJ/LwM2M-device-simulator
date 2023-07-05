# LwM2M Device Simulator

[![Test and Release](https://github.com/MLopezJ/LwM2M-device-simulator/actions/workflows/test-and-release.yaml/badge.svg)](https://github.com/MLopezJ/LwM2M-device-simulator/actions/workflows/test-and-release.yaml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://api.mergify.com/v1/badges/NordicSemiconductor/LwM2M-device-simulator)](https://mergify.io)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

This is a LwM2M device simulator who emulate 4 actions from a
[Thingy:91](https://www.nordicsemi.com/Products/Development-hardware/Nordic-Thingy-91)
running with
[nRF Asset Tracker v2](https://github.com/nrfconnect/sdk-nrf/tree/main/applications/asset_tracker_v2) firmware; bootstrapping, connection, sequential updates and heartbeat.

| Action            | Description | LwM2M Interface      | LwM2M Operation   | Triggered By |
| -- 		    |  --         |  --                  |   --              | -- |
| Bootstrapping     | Used to provision essential information into the LwM2M Client to enable it to perform the "Register" operation. The Factory Bootstrap is the default mode used | Bootstrap            | Factory Bootstrap | LwM2M Client | 
| Connection        | Register the device with a LwM2M server and send the value of the object registered. This action mix 3 operation from 2 different interfaces|                      |                   |
| --                |             | Client Registration  | Register          | LwM2M Client |
| --                |             | Dev Mang & Serv Enab | Discover          | LwM2M Server | 
| --                |             | Dev Mang & Serv Enab | Read              | LwM2M Server |
| Sequential Updates| Update the value of an object, instance or resource without explicit request of the LwM2M Server | Information Reporting| Send              | LwM2M Client |
| Heartbeat         | Extend the lifetime of a registration | Client Registration  | Update            |  LwM2M Client |

The main propose of this project is to facilitate the testing process of
[LwM2M Asset Tracker](https://github.com/MLopezJ/LwM2M-Asset-Tracker).

## Specifications

This device uses LwM2M as a protocol and provides a command line interface for its interaction. This interface offer 7 different commands and here is one table with the operations from the LwM2M protocol implemented by each command.


|Command   | Action Emulated      | LwM2M Operation     | LwM2M Interface       | Content Format |  
| -- 	   |  --                  |  --                 |   --                  |  --            |
| clear    |                      |                     |                       |                |
| register | Connection           |                     |                       |                |
|--        |                      | Client registration |  Register             | Link Format    |                
|--        |                      | Discover            | Dev Mang & Serv Enab  | LwM2M JSON     |
|--        |                      | Read                | Dev Mang & Serv Enab  | LwM2M JSON     |
| list     |                      |                     |                       |                |
| set      |  Sequential Update   | Send                |Information Reporting  | SenML JSON     |
| quit     |                      |                     |                       |                |
| help     |                      |                     |                       |                |
| heartbeat| Heartbeat            | Update              |  Client Registration  | Link Format    |

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

## Enviroment variables

Create a `.env` file in the root of the proyect with the following keys

```
deviceName=
port=
host=
lifetime=
lwm2mV=
biding=
```

Where 

* `deviceName` should be the name of the device
* `port` should be the port of the LwM2M server. `5683`, for example.
* `host` should be the hostname. `eu.iot.avsystem.cloud`, for example.
* `lifetime` should be the lifetime desire for the connection between the client and the server. It should be in seconds, `3600` for example.
* `lwm2mV` should be the LwM2M version used by the client. `1.1`, for example.
* `biding` should be the type of binding that the client supports for communication with the server. `U` for example, which stands for UDP.


## Test

```
npm test
```


## Execution

```
npx tsx src/index.ts
```

## Usage

see [example](example.md) to see the usage of the CLI and the expected behavior
in each command.

Also you can type `help` in the CLI in order to get more info about commands.

## Limitations

#### Security Mode

The device simulator does not support `credentials` or `pre-shared keys`, and
the only security mode option implemented is the `No-Sec`, which uses the port
`5683` for the comunication with the server. The implemented security mode is
not recommended for production enviroments.

#### Content format

The data format used for transferring resource information is
[ LwM2M+json (Doc. Page 48)](http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf)

#### No implemented interface

The
[Information Reporting (Doc. Pag 38)](http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf)
interface is not implemented in the device simulator, for this reason is not
possible to performance "observe" action on the LwM2M objects.
