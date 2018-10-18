//
// usage: node contract Hello Example
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Hello', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}
