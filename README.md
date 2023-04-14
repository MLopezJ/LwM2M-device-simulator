# LwM2M Device Simulator

This is a LwM2M Client who pretends to emulate the behavior of a Thingy:91 with nRF Asset Tracker firmware and connect with a LwM2M Server. The main propose of this proyect is to facilitate the testing process of [LwM2M Asset Tracker](https://github.com/MLopezJ/LwM2M-Asset-Tracker)


## 1 - About LwM2M
> notes from https://www.avsystem.com/crashcourse/lwm2m/ . First documented here: https://github.com/MLopezJ/trace-anjay/issues/5

### 1.1 Actors 

- Bootstrap Server
- Client
- Server

### 1.2 Interfaces
> highways or bridges that goverment the communication between actos

- Bootstrap
- Client Registration
- Device Managment and Service Enable
- Information Reporting

> **Device Management and Service Enable** -- >  where actual device management occurs. 

> **Information Reporting** -- >  enables LwM2M server to receive periodic updates of LwM2M client resources


### 1.3 CoAP
LwM2M is a protocol on top of CoAP. I'm simplifying a lot here but CoAP is like HTTP for resource constrained devices. CoAP uses UDP.

### 1.4 LwM2M Benefits 
Allows to manage devices that have very little power over really low bandwidth networks.  


## 2 - Solution Steps
1. Uses Coiote as the LwM2M Server
2. Hard code LwM2M Security object and LwM2M Server object to perform Factory Bootstrap
3. Perform Client Registration
4. Perform Device Managment and Service Enable
5. Perform Information Reporting


## Install
```
npm install
```

## Execute Client Registration

```
npx ts-node ./src/connection.ts
```

## CoAP interaction test

in `src/simulation` there is an example which pretend to simulate the interaction between the `src/connection.ts` (client) and `Coiote` (server). This is because is not possible to know how is the request received by Coiote, so a server was created in order to double check the information is sent as expected. 

```
// runs server
npx ts-node ./src/simulation/server.ts

// runs client
npx ts-node ./src/simulation/client.ts
```
