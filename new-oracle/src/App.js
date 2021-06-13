import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'
import axios from "axios";
import Web3 from 'web3';
import React, { useState } from 'react';
import { STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS } from './quotecontract'

function App() {
  const [symbol, setSymbol] = useState(false);
  const [stockPrice, setStockPrice] = useState("");
  const [stockVolume, setStockVolume] = useState("");
  const handleChange = (event) =>{
    event.preventDefault();
    setSymbol(event.target.value)
  }
  const handleSubmit =  async (event) =>{
    event.preventDefault();
    const web3 = new Web3(Web3.givenProvider);
    const OracleContract = new web3.eth.Contract(STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS);
    const accounts = await window.ethereum.enable();
    const account = accounts[0]

    const url = `http://localhost:3000/?SYMBOL=${symbol}`
    const symbolBytesValue = web3.utils.fromAscii(symbol)


      // set condition
    axios.get(url)
    .then(async function (response) {
      // handle success

      const price = parseInt(response.data["Global Quote"]["05. price"])
      const volume = parseInt(response.data["Global Quote"]["06. volume"])

      // set price
      await OracleContract.methods.setStock(symbolBytesValue, price, volume).call();

      // get price
      const getPrice = await OracleContract.methods.getStockPrice(symbolBytesValue).call();
      setStockPrice(getPrice);

      // get volume
      const getVolume = await OracleContract.methods.getStockVolume(symbolBytesValue).call();
      setStockVolume(getVolume);

    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    
  }
  return (
    <>
       <Jumbotron>
          <h1>Buyer View</h1>
          <form >
          <p>
            <input placeholder="Enter SYMBOL" onChange={handleChange} required/>
          </p>
          <p>
            <Button variant="primary" onClick={handleSubmit}>Send funds</Button>
          </p>
          </form>

          <h1>STOCK PRICE: {stockPrice}</h1>
          <h1>STOCK VOLUME: {stockVolume}</h1>
        </Jumbotron>
      </>
    
  );
}

export default App;
