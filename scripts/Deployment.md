## This article describes general Factory SC deployment process independently on its type and version.

### Step 1

Clone this repository main branch.

### Step 2

Setup necessary `.env` variables as described in `.env.example`

### Step 3

Choose the factory and network where it should be deployed and call one of following script. Implementation contracts are deployed alongside with factory.

Deployed factory address is displayed in the terminal after deployment script finish.

`npx hardhat run --network <network_name> scripts/deployRSCValveFactory.ts`

### Step 4

Once the factory contract is deployed. Deployer address is set as factory contract owner. Now we need to verify the factory contract and implementation contracts.

`npx hardhat verify --network <network_name> <factory_contract_address>`

### Step 5

After factory contract is verified, we have to verify each implementation contract. Each Implementation contract address can be found in the etherscan, on factory contract address.

This needs to be done, so that every contract created through factory is verified automatically.

`npx hardhat verify --network <network_name> <implementation_contract_address>`
