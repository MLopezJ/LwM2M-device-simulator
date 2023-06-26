# Example of usage

### Action: list device objects

**Input**

```
list
```

**Output**

```
{
  '0': [
    {
      '0': 'coap://eu.iot.avsystem.cloud:5683',
      '1': false,
      '2': 3,
      '3': '',
      '4': '',
      '5': '',
      '10': 1
    }
  ],
  '6': {
    '0': 10.366531,
    '1': -84.51215,
    '2': 0,
    '3': 0,
    '4': '0',
    '5': 1665149633,
    '6': 0
  },
  '10256': [ { '0': 247, '1': 0, '2': 6400, '3': -96, '4': -12, '5': 0 } ],
  '50009': {
    '0': false,
    '1': 45654,
    '2': 3,
    '3': 45,
    '4': 45,
    '5': 1,
    '6': false,
    '7': true,
    '8': 78,
    '9': 63
  },
  '1:1.2@1.2': [ { '0': 1, '1': 60, '6': false, '7': 'U' } ],
  '3:1.2@1.1': {
    '0': 'Nordic',
    '1': '00010',
    '2': '00000',
    '3': '0.0',
    '6': 1,
    '7': 0,
    '9': 80,
    '11': 0,
    '16': 'U',
    '18': '0.0',
    '19': '0.0'
  },
  '4:1.3@1.1': {
    '0': 6,
    '1': 6,
    '2': -96,
    '3': 0,
    '4': '10.160.225.39',
    '7': 'ibasis.iot',
    '8': 21627653,
    '9': 1,
    '10': 242,
    '11': 0,
    '12': 30401
  },
  '5:1.1@1.1': { '0': '1.0.0', '1': '', '3': 0, '5': 1, '9': 2 },
  '3303:1.1': [
    {
      '5518': 1665149633,
      '5601': 23.51,
      '5602': 23.51,
      '5603': -40,
      '5604': 85,
      '5700': 24.57,
      '5701': 'Celsius degrees'
    }
  ],
  '3304:1.1': [
    {
      '5518': 1665149633,
      '5601': 31.06,
      '5602': 31.06,
      '5603': 0,
      '5604': 100,
      '5700': 28.93,
      '5701': '%'
    }
  ],
  '3323:1.1': [
    {
      '5518': 1665149633,
      '5601': 98.24,
      '5602': 98.24,
      '5603': 30,
      '5604': 110,
      '5700': 98.23,
      '5701': 'kPa'
    }
  ],
  '3347:1.1': [
    {
      '5500': true,
      '5501': 0,
      '5518': 1665149633,
      '5750': 'Push button 1'
    }
  ]
}
```

### Action: register objects in LwM2M server

**Input**

```
register
```

**Output**

```
LwM2M-Dev-Simulator> Socket connection stablished. Listening from port number: 49288

LwM2M server is requesting to read from /3

LwM2M server is requesting to discover from /1

LwM2M server is requesting to discover from /3

LwM2M server is requesting to discover from /4

LwM2M server is requesting to discover from /5

LwM2M server is requesting to discover from /6

LwM2M server is requesting to discover from /3303

LwM2M server is requesting to discover from /3304

LwM2M server is requesting to discover from /3323

LwM2M server is requesting to discover from /3347

LwM2M server is requesting to discover from /10256

LwM2M server is requesting to discover from /50009

LwM2M server is requesting to read from /1

LwM2M server is requesting to discover from /1

LwM2M server is requesting to read from /1

LwM2M server is requesting to discover from /1/0

LwM2M server is requesting to read from /1/0

LwM2M server is requesting to read from /1/0/2

LwM2M server is requesting to discover from /1/0/13

LwM2M server is requesting to discover from /1/0/20

LwM2M server is requesting to discover from /1/0/8

LwM2M server is requesting to read from /1/0/1

LwM2M server is requesting to discover from /1/0/19

LwM2M server is requesting to read from /1/0/22

LwM2M server is requesting to read from /1/0/23

LwM2M server is requesting to discover from /1/0/14

LwM2M server is requesting to read from /1/0/3

LwM2M server is requesting to read from /1/0/11

LwM2M server is requesting to read from /1/0/6

LwM2M server is requesting to discover from /1/0/18

LwM2M server is requesting to discover from /1/0/17

LwM2M server is requesting to read from /1/0/0

LwM2M server is requesting to read from /1/0/10

LwM2M server is requesting to read from /1/0/21

LwM2M server is requesting to read from /1/0/5

LwM2M server is requesting to read from /1/0/12

LwM2M server is requesting to discover from /1/0/16

LwM2M server is requesting to read from /1/0/7

LwM2M server is requesting to discover from /1/0/9

LwM2M server is requesting to discover from /1/0/15

LwM2M server is requesting to discover from /1/0/4

LwM2M server is requesting to discover from /3

LwM2M server is requesting to read from /3

LwM2M server is requesting to discover from /4

LwM2M server is requesting to read from /4

LwM2M server is requesting to discover from /5

LwM2M server is requesting to read from /5

LwM2M server is requesting to discover from /5/0

LwM2M server is requesting to read from /5/0

LwM2M server is requesting to discover from /5/0/2

LwM2M server is requesting to read from /5/0/9

LwM2M server is requesting to discover from /5/0/8

LwM2M server is requesting to read from /5/0/8

LwM2M server is requesting to read from /5/0/6

LwM2M server is requesting to read from /5/0/5

LwM2M server is requesting to read from /5/0/3

LwM2M server is requesting to read from /5/0/1

LwM2M server is requesting to discover from /5/0/0

LwM2M server is requesting to read from /5/0/7

LwM2M server is requesting to discover from /6

LwM2M server is requesting to read from /6

LwM2M server is requesting to discover from /6/0

LwM2M server is requesting to read from /6/0

LwM2M server is requesting to read from /6/0/5

LwM2M server is requesting to read from /6/0/4

LwM2M server is requesting to read from /6/0/2

LwM2M server is requesting to read from /6/0/3

LwM2M server is requesting to read from /6/0/6

LwM2M server is requesting to read from /6/0/0

LwM2M server is requesting to read from /6/0/1

LwM2M server is requesting to discover from /3303

LwM2M server is requesting to read from /3303

LwM2M server is requesting to discover from /3304

LwM2M server is requesting to read from /3304

LwM2M server is requesting to discover from /3323

LwM2M server is requesting to read from /3323

LwM2M server is requesting to discover from /3347

LwM2M server is requesting to read from /3347

LwM2M server is requesting to discover from /3347/0

LwM2M server is requesting to read from /3347/0

LwM2M server is requesting to read from /3347/0/5750

LwM2M server is requesting to read from /3347/0/5501

LwM2M server is requesting to read from /3347/0/5500

LwM2M server is requesting to discover from /10256

LwM2M server is requesting to read from /10256

LwM2M server is requesting to discover from /50009

LwM2M server is requesting to read from /50009

LwM2M server is requesting to discover from /50009/0

LwM2M server is requesting to read from /50009/0

LwM2M server is requesting to read from /50009/0/7

LwM2M server is requesting to read from /50009/0/0

LwM2M server is requesting to read from /50009/0/5

LwM2M server is requesting to read from /50009/0/3

LwM2M server is requesting to read from /50009/0/1

LwM2M server is requesting to read from /50009/0/8

LwM2M server is requesting to read from /50009/0/9

LwM2M server is requesting to read from /50009/0/4

LwM2M server is requesting to read from /50009/0/2

LwM2M server is requesting to read from /50009/0/6
```

### Action: list object instance

**Input**

```
list /3/0
```

**Output**

```
{
    ...
}
```

### Action: update resource value

**Input**

```
set /3/0/0 test
```

> Registration in the LwM2M server of the new resource updated is triggered with
> the `set` command

**Output**

```
...
```

### Action: list object instance

**Input**

```
list /3/0
```

**Output**

```
{
    ...
}
```

### Action: Exit CLI

**Input**

```
quit
```

**Output**

```
...
```
