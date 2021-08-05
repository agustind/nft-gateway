import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Header from './components/header/header';
import Home from "./components/_pages/home/home";
import Web3 from 'web3';
import axios from "axios";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            web3: undefined,
            account: undefined,
            token: undefined,
            data: []
        };
        this.message = "Only sign this message for NFT Gateway POC."
    }

    connectWallet = async () => {
        // ethereum injection
        if (window.ethereum) {
            const web3a = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.setState({web3: web3a});
                web3a.eth.getAccounts().then(accs => {
                    this.setState({account: accs[0]});
                });
            } catch (error) {
                console.error(error);
            }
        }
        // legacy
        else if (window.web3) {
            const web3a = window.web3;
            this.setState({web3: web3a});
            web3a.eth.getAccounts().then(accs => {
                this.setState({account: accs[0]});
            });
        }
        // user has no wallet
        else alert("Please connect a web3 wallet! Visit metamask.io 🦊");
    };

    verifyNFT = () => {
        // have the user sign our message
        this.state.web3.eth.personal.sign(this.state.web3.utils.toHex(this.message), this.state.account)
            .then(signature => {
                // send signature and address to api
                axios.post('http://localhost:3005/api/verify',
                    {signature: signature, address: this.state.account})
                    .then(r => {
                        // store token
                        if (r.status === 200) this.setState({token: r.data.token}, () => {
                            // fetch data
                            this.fetchData();
                        });
                    }).catch(e => alert(e.response ? e.response.data : e.toString()));
            });
    }

    fetchData = () => {
        // can only fetch data with valid token
        if (this.state.token === undefined)
            return console.log("Cannot fetch data without valid token.");
        // fetch data
        axios.get('http://localhost:3005/api/data', {headers: {'Authorization': `Bearer ${this.state.token}`}})
            .then(r => this.setState({data: r.data}));
    }

    render() {
        return (
            <div className="d-flex flex-column bg-dark" style={fullscreen}>
                <Router>
                    <Header
                        web3={this.state.web3}
                        connectFn={this.connectWallet}
                    />
                    <Route exact path="/" render={() =>
                        <Home
                            web3={this.state.web3}
                            token={this.state.token}
                            verifyFn={this.verifyNFT}
                            data={this.state.data}
                        />
                    }/>
                </Router>
            </div>
        );
    }
}

const fullscreen = {
    width: '100vw',
    height: '100vh'
}

export default App;
