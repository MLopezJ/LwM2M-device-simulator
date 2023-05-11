# LwM2M Device Simulator

This is a LwM2M device simulator who emulate a Thingy:91 running with nRF Asset Tracker firmware and connect to Coiote. 

The main propose of this project is to facilitate the testing process of [LwM2M Asset Tracker](https://github.com/MLopezJ/LwM2M-Asset-Tracker).

## Device Simulator Specifications 
This device uses LwM2M as a protocol and has implemented the “Client Registration” and “Information Reporting” interfaces to communicate with Coiote.  

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

## Execution

```
npx tsx src/cli.ts 
```
