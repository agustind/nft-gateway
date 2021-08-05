# NFT Gateway POC

This webapp is meant to demonstrate how possession of an NFT can be used to grant access to a part of a website.

The web3.js library is used to get the user's ethereum address, and they are asked to sign a message to verify their ownership.

A request with the signed message is sent to the API which checks the balance of the wallet before issuing an access token to the client.

## Building Locally

### Setting up

If you do no have node.js installed, get it on [their site](https://nodejs.org/).

You will need an RPC URL for the backend to access the ethereum network. You can get free access at [Infura](https://infura.io/). Your link will look like this:

`https://mainnet.infura.io/v3/YOUR_API_KEY_HERE`

You will need to use this to replace the dummy link in `backend/index.js`.

### Starting the backend

Navigate to `backend/` and install dependencies:

```shell
npm install
```

Then run the start script:

```shell
npm start
```

### Starting the frontend

*Do this in a new terminal while the backend is running.*

Navigate to `frontend/` and install dependencies:

```shell
npm install
```

Then run the start script:

```shell
npm start
```

### Accessing the app

Navigate to `localhost:3000` in the browser.
