# LwM2M Device Simulator

This is a device simulator who pretends to connect to Coiote using CoAP. This device is going to send and update LwM2M objects. 

## CoAP interaction test

in `src/simulation` there is an example which pretend to simulate the interaction between the `src/connection.ts` (client) and `Coiote` (server). This is because is not possible to know how is the request received by Coiote, so a server was created in order to double check the information is sent as expected. 

```
// runs server
npx ts-node ./src/simulation/server.ts

// runs client
npx ts-node ./src/simulation/client.ts
```