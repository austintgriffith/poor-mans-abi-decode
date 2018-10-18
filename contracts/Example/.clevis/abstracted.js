//
// usage: clevis contract abstracted Example ##accountindex## data
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running abstracted("+args[4]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.abstracted(args[4]).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
