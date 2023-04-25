# RSCValveFactory

## Contract Description


License: MIT


Used to deploy RSCValve contracts.

## Events info

### NewRSCValve event

```solidity
event NewRSCValve(
	address contractAddress,
	address controller,
	address[] distributors,
	bytes32 version,
	bool isImmutableRecipients,
	bool isAutoNativeCurrencyDistribution,
	uint256 minAutoDistributeAmount,
	bytes32 creationId
);
```


Emitted when a new RSCValve is deployed.

### OwnershipTransferred event

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
```

### PlatformFee event

```solidity
event PlatformFee(uint256 newFee);
```


Emitted when a platform fee is set.

### PlatformWallet event

```solidity
event PlatformWallet(address newPlatformWallet);
```


Emitted when a platform wallet is set.

## Errors info

### InvalidFeePercentage error

```solidity
error InvalidFeePercentage(uint256);
```


Throw when Fee Percentage is more than 100%.

## Functions info

### BASIS_POINT (0xada5f642)

```solidity
function BASIS_POINT() external view returns (uint256);
```


Measurement unit 10000000 = 100%.

### VERSION (0xffa1ad74)

```solidity
function VERSION() external view returns (bytes32);
```


RSCValveFactory contract version.

### contractImplementation (0x9e72370b)

```solidity
function contractImplementation() external view returns (address);
```


RSCValve implementation address.

### createRSCValve (0x02afbfe1)

```solidity
function createRSCValve(tuple _data) external returns (address);
```


Public function for creating clone proxy pointing to RSC Percentage.


Parameters:

| Name  | Type  | Description                                       |
| :---- | :---- | :------------------------------------------------ |
| _data | tuple | Initial data for creating new RSC Valve contract. |

### owner (0x8da5cb5b)

```solidity
function owner() external view returns (address);
```


Returns the address of the current owner.

### platformFee (0x26232a2e)

```solidity
function platformFee() external view returns (uint256);
```


Current platform fee.

### platformWallet (0xfa2af9da)

```solidity
function platformWallet() external view returns (address);
```


Fee receiver address.

### predictDeterministicAddress (0xa0c7b014)

```solidity
function predictDeterministicAddress(
	tuple _data,
	address _deployer
) external view returns (address);
```


External function for creating clone proxy pointing to RSC Percentage.


Parameters:

| Name      | Type    | Description                                               |
| :-------- | :------ | :-------------------------------------------------------- |
| _data     | tuple   | RSC Create data used for hashing and getting random salt. |
| _deployer | address | Wallet address that want to create new RSC contract.      |

### renounceOwnership (0x715018a6)

```solidity
function renounceOwnership() external;
```


Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.

### setPlatformFee (0x12e8e2c3)

```solidity
function setPlatformFee(uint256 _fee) external;
```


Only Owner function for setting platform fee.


Parameters:

| Name | Type    | Description                                         |
| :--- | :------ | :-------------------------------------------------- |
| _fee | uint256 | Percentage define platform fee 100% == BASIS_POINT. |

### setPlatformWallet (0x8831e9cf)

```solidity
function setPlatformWallet(address _platformWallet) external;
```


Owner function for setting platform fee.


Parameters:

| Name            | Type    | Description                                        |
| :-------------- | :------ | :------------------------------------------------- |
| _platformWallet | address | New native currency wallet which will receive fee. |

### transferOwnership (0xf2fde38b)

```solidity
function transferOwnership(address newOwner) external;
```


Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
