# RSCValveFactory

## Contract Description


License: BSL 1.1


Used to deploy RSCValve contracts.

## Events info

### NewRSCValve event

```solidity
event NewRSCValve(
	address contractAddress,
	address controller,
	address[] distributors,
	bytes32 indexed version,
	bool isImmutableRecipients,
	bool isAutoNativeCurrencyDistribution,
	uint256 minAutoDistributeAmount,
	bytes32 indexed creationId
);
```


Emitted when a new RSCValve is deployed.

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

### RoleAdminChanged event

```solidity
event RoleAdminChanged(
	bytes32 indexed role,
	bytes32 indexed previousAdminRole,
	bytes32 indexed newAdminRole
);
```


Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole` `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite {RoleAdminChanged} not being emitted signaling this. _Available since v3.1._

### RoleGranted event

```solidity
event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
```


Emitted when `account` is granted `role`. `sender` is the account that originated the contract call, an admin role bearer except when using {AccessControl-_setupRole}.

### RoleRevoked event

```solidity
event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
```


Emitted when `account` is revoked `role`. `sender` is the account that originated the contract call:   - if using `revokeRole`, it is the admin role bearer   - if using `renounceRole`, it is the role bearer (i.e. `account`)

## Errors info

### InvalidPercentageError error

```solidity
error InvalidPercentageError(uint256);
```


Throw when percentage is not 100%

### NullAddressError error

```solidity
error NullAddressError();
```


Throw when submitted recipient with address(0)

## Functions info

### BASIS_POINT (0xada5f642)

```solidity
function BASIS_POINT() external view returns (uint256);
```


Measurement unit 10000000 = 100%.

### DEFAULT_ADMIN_ROLE (0xa217fddf)

```solidity
function DEFAULT_ADMIN_ROLE() external view returns (bytes32);
```

### FEE_BOUND (0x29e4f362)

```solidity
function FEE_BOUND() external view returns (uint256);
```


Maximum fee value 5000000 = 50%.

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

### createRSCValve (0x46c4d7ff)

```solidity
function createRSCValve(tuple _data) external returns (address);
```


Public function for creating clone proxy pointing to RSC Percentage.


Parameters:

| Name  | Type  | Description                                       |
| :---- | :---- | :------------------------------------------------ |
| _data | tuple | Initial data for creating new RSC Valve contract. |

### getRoleAdmin (0x248a9ca3)

```solidity
function getRoleAdmin(bytes32 role) external view returns (bytes32);
```


Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role's admin, use {_setRoleAdmin}.

### grantRole (0x2f2ff15d)

```solidity
function grantRole(bytes32 role, address account) external;
```


Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleGranted} event.

### hasRole (0x91d14854)

```solidity
function hasRole(bytes32 role, address account) external view returns (bool);
```


Returns `true` if `account` has been granted `role`.

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

### predictDeterministicAddress (0xd78a6213)

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

### renounceRole (0x36568abe)

```solidity
function renounceRole(bytes32 role, address account) external;
```


Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function's purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`. May emit a {RoleRevoked} event.

### revokeRole (0xd547741f)

```solidity
function revokeRole(bytes32 role, address account) external;
```


Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleRevoked} event.

### setPlatformFee (0x12e8e2c3)

```solidity
function setPlatformFee(uint256 _fee) external;
```


Admin function for setting platform fee.


Parameters:

| Name | Type    | Description                                         |
| :--- | :------ | :-------------------------------------------------- |
| _fee | uint256 | Percentage define platform fee 100% == BASIS_POINT. |

### setPlatformWallet (0x8831e9cf)

```solidity
function setPlatformWallet(address _platformWallet) external;
```


Admin function for setting platform fee.


Parameters:

| Name            | Type    | Description                                        |
| :-------------- | :------ | :------------------------------------------------- |
| _platformWallet | address | New native currency wallet which will receive fee. |

### supportsInterface (0x01ffc9a7)

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool);
```


See {IERC165-supportsInterface}.
