import React, { useRef, useState, useEffect } from "react";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Web3 from "web3";
import contractjson from "./details/contract.json";
import 'react-notifications/lib/notifications.css';
import "./main.css";
import twitter from "./media/twitter.png";
import etherscan from "./media/etherscan.png";
import img from "./media/img.png";
import publicDomain from "./media/publicDomain.png"
import logo from "./media/Logo.png"

let contract = null;
let selectedAccount = null;
const ADDRESS = "0x2F2548cc5ce18789AAcC400e488ce33626824551";

const loadedData = JSON.stringify(contractjson);
const abi = JSON.parse(loadedData);

export default function Main() {
  const inputMint = useRef();
  const [mintCount, setMintCount] = useState(0);
  const [textInput1, setTextInput1] = useState(1);
  const [selected, setSelected] = useState(null);
  //const network;
  //const [network, setNetwork] = useState(true);
  const totalCount = 999;
  let publicCost = 1000000000000000;
  // let currentBet = -1;
  const [currentBet, setCurrentBet] = useState(-1);
  // const currentBet = useRef();


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     let provider = window.ethereum;
  //     if (typeof provider !== "undefined") {
  //       const web3 = new Web3(provider);
  //       contract = new web3.eth.Contract(abi, ADDRESS);
  //       contract.methods
  //         .totalSupply()
  //         .call()
  //         .then((cts) => {
  //           console.log(cts);
  //           setMintCount(cts);
  //         });
  //     }
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    async function checkNetwork() {
      let provider = window.ethereum;
      const web3 = new Web3(provider);
      //const chainId = await provider.request({ method: 'eth_chainId' });
      provider.on("chainChanged", function () {
        window.location.reload();
      });
      provider.on("accountsChanged", function (accounts) {
        if (accounts.length > 0) {
          selectedAccount = accounts[0];
          setSelected(selectedAccount.slice(0, 5) + "..." + selectedAccount.slice(-4));
          console.log("Selected Account change is" + selectedAccount);
        } else {
          window.location.reload();
          console.error("No account is found");
        }
      });
      let accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        selectedAccount = accounts[0];
        setSelected(selectedAccount.slice(0, 5) + "..." + selectedAccount.slice(-4));
      }
      // if (typeof provider !== "undefined") {
      //   const web3 = new Web3(provider);
      //   contract = new web3.eth.Contract(abi, ADDRESS);
      //   contract.methods
      //     .totalSupply()
      //     .call()
      //     .then((cts) => {
      //       console.log(cts);
      //       setMintCount(cts);
      //     });
      // }
    }
    checkNetwork();
  },[]);

  const changeValue = (newValue) => {
    let value = newValue !== 21 ? newValue : 20;
    setTextInput1(value);
  }

  // const setBetValue = (val) => {
  //   currentBet = val;
  //   console.log(currentBet);
  // }

  async function onBetHeads() {
    // currentBet = 0;
    setCurrentBet(0);
    console.log("New Val for head: " + currentBet);
  }

  async function onBetTails() {
    // currentBet = 1;
    setCurrentBet(1);
    console.log("New Val for tail: " + currentBet);
  }

  const setMintValue = (val, field) => {
    val = parseInt(val, 10);
    if (!val) {
      if (field) {
        val = ''
      } else {
        val = 1
      }
    }
    if (val < 0) {
      val = 1
    }
    if (!field) {      
      inputMint.current.style.transform = val > textInput1 ? 'translateY(-100%)' : 'translateY(100%)'
      inputMint.current.style.opacity = 0
       
      setTimeout(() => {
        inputMint.current.style.transitionDuration = '0s'
        inputMint.current.style.transform = val > textInput1 ? 'translateY(100%)' : 'translateY(-100%)'
        inputMint.current.style.opacity = 0
        changeValue(val);
        
        setTimeout(() => {
          inputMint.current.style.transitionDuration = '0.3s'
          inputMint.current.style.transform = 'translateY(0)'
          inputMint.current.style.opacity = 1
        }, 20)
      }, 250)
    } else {
      changeValue(val);
    }    
  }

  async function onConnectClick() {
    let provider = window.ethereum;
    if (typeof provider !== "undefined") {
      provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          selectedAccount = accounts[0];
          setSelected(selectedAccount.slice(0, 5) + "..." + selectedAccount.slice(-4));
          console.log("Selected Account is " + selectedAccount);
        })
        .catch((err) => {
          console.log(err);
        });

      provider.on("chainChanged", function () {
        window.location.reload();
      });

      provider.on("accountsChanged", function (accounts) {
        if (accounts.length > 0) {
          selectedAccount = accounts[0];
          console.log("Selected Account change is" + selectedAccount);
        } else {
          window.location.reload();
          console.error("No account is found");
        }
      });

      provider.on("message", function (message) {
        console.log(message);
      });

      provider.on("connect", function (info) {
        console.log("Connected to network " + info);
      });

      provider.on("disconnect", function (error) {
        console.log("Disconnected from network " + error);
        window.location.reload();
      });
      
    }
    else {
      NotificationManager.error('Plese connect  metamask', "", 3000);
    }
    
  }

  async function onPublicMintClick() {
    let provider = window.ethereum;
    const web3 = new Web3(provider);
    let accounts = await web3.eth.getAccounts();
    if (accounts[0] === undefined) {
      NotificationManager.error('Plese connect  metamask', "", 3000);
    } else {
      if (totalCount - mintCount < textInput1) {
        NotificationManager.error('Not Enough Remained', "", 3000);
      } else {
        contract = new web3.eth.Contract(abi, ADDRESS);
        let cost = publicCost * textInput1;
        console.log(cost);
        contract.methods
            .mintForPublic(textInput1)
            .send({from: accounts[0], value: cost});
        setTextInput1(1);
        NotificationManager.success('Will Receive NFT Soon', "", 3000);
      }
    }
  }

  async function onBetClick() {
    let provider = window.ethereum;
    const web3 = new Web3(provider);
    let accounts = await web3.eth.getAccounts();
    if (accounts[0] === undefined) {
      NotificationManager.error('Please connect  metamask', "",  3000);
    }
    else {
        contract = new web3.eth.Contract(abi, ADDRESS);
        let cost = publicCost;
        contract.methods
            .flip(currentBet)
            .send({ from: accounts[0], value: cost });
        NotificationManager.success('Betting in process', "", 3000);
      }
    }

  async function checkWin() {
    let provider = window.ethereum;
    const web3 = new Web3(provider);
    let accounts = await web3.eth.getAccounts();
    if (accounts[0] === undefined) {
      NotificationManager.error('Please connect  metamask', "",  3000);
    }
    else {
      contract = new web3.eth.Contract(abi, ADDRESS);
      contract.methods
          .updateCheck()
          .send({from:accounts[0]});
      let result = contract.methods.didWin();
      console.log(result[0]);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="socialLink">
          <a href="https://etherscan.io/address/0x2F2548cc5ce18789AAcC400e488ce33626824551" target="_blank" rel="noreferrer">
            <img alt="etherscan" className="socialIcon" src={etherscan} />
          </a>
        </div>
        <div className="logo">
          <img alt="logobanner" src={logo} style={{marginTop:"5vw",width:"15vw"}}></img>
        </div>
        <div className="connectWallet">
          {selected !== null ? <button className="fontStyle">Connected {selected}</button> : 
            <button className="fontStyle" onClick={onConnectClick}>Connect to Wallet</button>
          }
        </div>
      </div>
      <div className="content">
        <div className="boxModal">
          <div className="boxModalTitle">
            <p className="dickClaim">Make a bet</p>
            <p className="dickClaim3">Now on your neighborhood Ethereum</p>
            <p className="dickClaim3">0.001 ETH - each bet</p>
          </div>
          <div className="mintCount">
            <button className="plButton" onClick={onBetHeads}> HEADS </button>
            <div className="mintTotalCount">
              <div className="circle"></div>
              <div className="total">
                <span>{currentBet}</span>
              </div>
              <div className="circle"></div>
            </div>
            <button className="plButton" onClick={onBetTails}> TAILS.. </button>
            {/*<span */}
            {/*  className="plus"*/}
            {/*  onClick = {() => setBetValue(0)}*/}
            {/*>*/}
            {/*  HEADS*/}
            {/*</span>*/}
            {/*<span */}
            {/*  className="minus"*/}
            {/*  onClick = {() => setBetValue(1)}*/}
            {/*>*/}
            {/*  TAILS*/}
            {/*</span>*/}
          </div>
          <div className="mintButtons">
            <button className="plButton" onClick={onBetClick}>MAKE A BET</button>
          </div>
          {/*<div className="mintButtons">*/}
          {/*  <button className="plButton" onClick={checkWin}>CHECK RESULT</button>*/}
          {/*</div>*/}
        </div>
      </div>   
      <NotificationContainer/>
      <div className="footer">
        <img alt="publicDomain" src={publicDomain} style={{paddingRight:"10px", width:"5vw"}} />
        <span style={{paddingLeft:"5em", fontSize:"1vw"}}> Pixel Beanz falls under CCO Licensing allowing and waiving all the rights for the art. The collectors and community have all the rights to play, build, destroy, create, burn or whatever they wish to do.</span>
      </div>
    </div>
  );
}
