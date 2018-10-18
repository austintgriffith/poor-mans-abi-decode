# 🤠✂️ Poor Man's DecodeABI()

Normally you have to cut up a byte array using a bunch of lines of assembly.

Here is a way to easily split up a byte array by 'calling' address(this) in Solidity!


[![screencast.png](https://user-images.githubusercontent.com/2653167/47154252-06c4e480-d29f-11e8-8ebb-ff9cb2a7835a.jpg)](https://youtu.be/FvFD_2OlfZQ)



Does DecodeABI() exist in Solidity yet? I don't think so, but here's a trick to do it easily...

# example

Let's say we have this function in solidity:
```solidity
function hello(bytes32 message,uint256 number,address addy) public returns (bool){
  emit Hello(message,number,addy);
  return true;
}
event Hello(bytes32 message,uint256 number,address addy);
```
Sure, we can call this directly and pass in the given arguments.

BUT, what if we want to pack the arguments into a byte array for standardization with flexibility?

A friend of mine, [Steve Ellis](https://github.com/se3000), taught me this cool trick we called the "poor man's decode abi":

```solidity
function abstracted(bytes data) public returns (bool success){
  uint256 value = 0;
  address to = address(this);
  uint256 gas = msg.gas;
  assembly {
    success := call(gas, to, value, add(data, 0x20), mload(data), 0, 0)
  }
}
```

For reference, here is how you do the encoding of the byte array in javascript:
```javascript
contracts.Example.hello(
  this.state.web3.utils.toHex(this.state.broadcastText),
  this.state.broadcastNumber,
  this.state.address
).encodeABI()
```
(if you aren't using [clevis and dapparatus](https://medium.com/@austin_48503/%EF%B8%8Fclevis-blockchain-orchestration-682d2396aeef), you would do 'contractname.methods.hello...')
