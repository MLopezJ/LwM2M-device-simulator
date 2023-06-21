# Example of usage

### Action: list device objects

**Input**

```
list
```

**Output**

```
...
```

### Action: register objects in LwM2M server

**Input**

```
register
```

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
