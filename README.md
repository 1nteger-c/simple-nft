# Simple-nft

## run frontend
1. go to front-end directory
2. npm install
    * you should make .env file based on .env.template file
3. npm run dev
4. paste the generated link to your browser

## run backend-web2
1. go to backend-web2 directory
2. npm install
3. node server.js

## run backend-web3
1. go to backend-web3 directory
2. npm install
    * you should make .env file based on .env.template file
3. npx hardhat compile
4. npx hardhat run scripts/deploy.js --network sepolia