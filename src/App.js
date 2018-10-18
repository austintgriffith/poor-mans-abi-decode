import React, { Component } from 'react';
import './App.css';
import { Metamask, Gas, ContractLoader, Transactions, Events, Scaler, Blockie, Address, Button } from "dapparatus"
import Web3 from 'web3';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: false,
      account: false,
      gwei: 4,
      doingTransaction: false,
    }
  }
  handleInput(e){
    let update = {}
    update[e.target.name] = e.target.value
    this.setState(update)
  }
  render() {
    let {web3,account,contracts,tx,gwei,block,avgBlockTime,etherscan} = this.state
    let connectedDisplay = []
    let contractsDisplay = []
    if(web3){
      connectedDisplay.push(
       <Gas
         key="Gas"
         onUpdate={(state)=>{
           console.log("Gas price update:",state)
           this.setState(state,()=>{
             console.log("GWEI set:",this.state)
           })
         }}
       />
      )

      connectedDisplay.push(
        <ContractLoader
         key="ContractLoader"
         config={{DEBUG:true}}
         web3={web3}
         require={path => {return require(`${__dirname}/${path}`)}}
         onReady={(contracts,customLoader)=>{
           console.log("contracts loaded",contracts)
           this.setState({contracts:contracts},async ()=>{
             console.log("Contracts Are Ready:",this.state.contracts)
           })
         }}
        />
      )
      connectedDisplay.push(
        <Transactions
          key="Transactions"
          config={{DEBUG:false}}
          account={account}
          gwei={gwei}
          web3={web3}
          block={block}
          avgBlockTime={avgBlockTime}
          etherscan={etherscan}
          onReady={(state)=>{
            console.log("Transactions component is ready:",state)
            this.setState(state)
          }}
          onReceipt={(transaction,receipt)=>{
            // this is one way to get the deployed contract address, but instead I'll switch
            //  to a more straight forward callback system above
            console.log("Transaction Receipt",transaction,receipt)
          }}
        />
      )

      let messages = []
      for(let e in this.state.events){
        console.log("EVENT",this.state.events[e])
        let message = this.state.web3.utils.hexToUtf8(this.state.events[e].message)
        messages.push(
          <div key={e}>
            {message},{this.state.events[e].number},{this.state.events[e].addy}
          </div>
        )
      }

      if(contracts){
        contractsDisplay.push(
          <div key="UI" style={{padding:30}}>
            <div>
              <Address
                {...this.state}
                address={contracts.Example._address}
              />
            </div>
            <div>
              string: <input
                  style={{verticalAlign:"middle",width:400,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                  type="text" name="broadcastText" value={this.state.broadcastText} onChange={this.handleInput.bind(this)}
              />
            </div>
            <div>
              number: <input
                  style={{verticalAlign:"middle",width:400,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                  type="text" name="broadcastNumber" value={this.state.broadcastNumber} onChange={this.handleInput.bind(this)}
              />
            </div>
            <div>
              address: <input
                  style={{verticalAlign:"middle",width:400,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                  type="text" name="address" value={this.state.address} onChange={this.handleInput.bind(this)}
              />
            </div>
            <Button color={"green"} size="2" onClick={()=>{
                this.setState({doingTransaction:true})
                tx(contracts.Example.hello(this.state.web3.utils.toHex(this.state.broadcastText),this.state.broadcastNumber,this.state.address),(receipt)=>{
                  this.setState({doingTransaction:false})
                })
              }}>
              Send
            </Button>
            <Button color={"blue"} size="2" onClick={()=>{
                this.setState({crafted:contracts.Example.hello(this.state.web3.utils.toHex(this.state.broadcastText),this.state.broadcastNumber,this.state.address).encodeABI()})
              }}>
              Craft
            </Button>
            <div style={{padding:10,fontSize:14}}>
              <h2>Messages:</h2>
              {messages}
            </div>

            <div>
              crafted: <input
                  style={{verticalAlign:"middle",width:800,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                  type="text" name="crafted" value={this.state.crafted} onChange={this.handleInput.bind(this)}
              />
            </div>
            <Button color={"green"} size="2" onClick={()=>{
                this.setState({doingTransaction:true})
                tx(contracts.Example.abstracted(this.state.crafted),(receipt)=>{
                  this.setState({doingTransaction:false})
                })
              }}>
              Send Crafted
            </Button>
            <Events
              config={{hide:false}}
              contract={contracts.Example}
              eventName={"Hello"}
              block={block}
              onUpdate={(eventData,allEvents)=>{
                console.log("EVENT DATA:",eventData)
                this.setState({events:allEvents})
              }}
            />
          </div>
        )
      }

    }
    return (
      <div className="App">
        <Metamask
          config={{requiredNetwork:['Unknown','Rinkeby']}}
          onUpdate={(state)=>{
           console.log("metamask state update:",state)
           if(state.web3Provider) {
             state.web3 = new Web3(state.web3Provider)
             state.address=state.account
             this.setState(state)
           }
          }}
        />
        {connectedDisplay}
        {contractsDisplay}
      </div>
    );
  }
}

export default App;
