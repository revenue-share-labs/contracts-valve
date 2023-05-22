# RSCValve

## Contract Description


License: BSL 1.1


The main function of RSCValve is to redistribute tokens (whether they are ERC-20 or native cryptocurrency), to the participants based on the percentages assigned to them.

## Events info

### AutoNativeCurrencyDistribution event

```solidity
event AutoNativeCurrencyDistribution(bool newValue);
```


Emitted when `isAutoNativeCurrencyDistribution` is set.

### Controller event

```solidity
event Controller(address newController);
```


Emitted when new controller address is set.

### DistributeToken event

```solidity
event DistributeToken(address token, uint256 amount);
```


Emitted when token distribution is triggered.

### Distributor event

```solidity
event Distributor(address distributor, bool isDistributor);
```


Emitted when distributor status is set.

### ImmutableRecipients event

```solidity
event ImmutableRecipients(bool isImmutableRecipients);
```


Emitted when recipients set immutable.

### Initialized event

```solidity
event Initialized(uint8 version);
```


Triggered when the contract has been initialized or reinitialized.

### MinAutoDistributionAmount event

```solidity
event MinAutoDistributionAmount(uint256 newAmount);
```


Emitted when new `minAutoDistributionAmount` is set.

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

### SetRecipients event

```solidity
event SetRecipients(tuple[] recipients);
```


Emitted when recipients and their percentages are set.

## Errors info

### ImmutableRecipientsError error

```solidity
error ImmutableRecipientsError();
```


Throw when change is triggered for immutable recipients

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

### RecipientAlreadyAddedError error

```solidity
error RecipientAlreadyAddedError();
```


Throw if recipient is already in contract

### TooLowValueToRedistribute error

```solidity
error TooLowValueToRedistribute();
```


Throw when amount to distribute is less than BASIS_POINT

### TransferFailedError error

```solidity
error TransferFailedError();
```


Throw when transaction fails

## Functions info

### ADMIN_ROLE (0x75b238fc)

```solidity
function ADMIN_ROLE() external view returns (bytes32);
```


Role identifier for the distributor role

### AUTO_DISTRIBUTION_MAX_RECIPIENTS (0x325bc8e9)

```solidity
function AUTO_DISTRIBUTION_MAX_RECIPIENTS() external view returns (uint256);
```


Max amount of recipients for auto-distribution.

### BASIS_POINT (0xada5f642)

```solidity
function BASIS_POINT() external view returns (uint256);
```


Measurement unit 10000000 = 100%.

### CONTROLLER_ROLE (0x092c5b3b)

```solidity
function CONTROLLER_ROLE() external view returns (bytes32);
```


Role identifier for the controller role

### DEFAULT_ADMIN_ROLE (0xa217fddf)

```solidity
function DEFAULT_ADMIN_ROLE() external view returns (bytes32);
```

### DISTRIBUTOR_ROLE (0xf0bd87cc)

```solidity
function DISTRIBUTOR_ROLE() external view returns (bytes32);
```


Role identifier for the distributor role

### factory (0xc45a0155)

```solidity
function factory() external view returns (address);
```


Factory address.

### getRoleAdmin (0x248a9ca3)

```solidity
function getRoleAdmin(bytes32 role) external view returns (bytes32);
```


Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role's admin, use {_setRoleAdmin}.

### getRoleMember (0x9010d07c)

```solidity
function getRoleMember(bytes32 role, uint256 index) external view returns (address);
```


Returns one of the accounts that have `role`. `index` must be a value between 0 and {getRoleMemberCount}, non-inclusive. Role bearers are not sorted in any particular way, and their ordering may change at any point. WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure you perform all queries on the same block. See the following https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post] for more information.

### getRoleMemberCount (0xca15c873)

```solidity
function getRoleMemberCount(bytes32 role) external view returns (uint256);
```


Returns the number of accounts that have `role`. Can be used together with {getRoleMember} to enumerate all bearers of a role.

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

### initialize (0x9004963b)

```solidity
function initialize(
	address _owner,
	address _controller,
	address[] _distributors,
	bool _isImmutableRecipients,
	bool _isAutoNativeCurrencyDistribution,
	uint256 _minAutoDistributionAmount,
	uint256 _platformFee,
	tuple[] _recipients
) external;
```


Constructor function, can be called only once.


Parameters:

| Name                              | Type      | Description                                                                            |
| :-------------------------------- | :-------- | :------------------------------------------------------------------------------------- |
| _owner                            | address   | Owner of the contract.                                                                 |
| _controller                       | address   | Address which control setting / removing recipients.                                   |
| _distributors                     | address[] | List of addresses which can distribute ERC20 tokens or native currency.                |
| _isImmutableRecipients            | bool      | Flag indicating whether recipients could be changed.                                   |
| _isAutoNativeCurrencyDistribution | bool      | Flag indicating whether native currency will be automatically distributed or manually. |
| _minAutoDistributionAmount        | uint256   | Minimum native currency amount to trigger auto native currency distribution.           |
| _platformFee                      | uint256   | Percentage defining fee for distribution services.                                     |
| _recipients                       | tuple[]   | Array of `RecipientData` structs with recipient address and percentage.                |

### isAutoNativeCurrencyDistribution (0x0808e1c6)

```solidity
function isAutoNativeCurrencyDistribution() external view returns (bool);
```


If true, received native currency will be auto distributed.

### isImmutableRecipients (0xeaf4598a)

```solidity
function isImmutableRecipients() external view returns (bool);
```


If true, `recipients` array cant be updated.

### minAutoDistributionAmount (0x478f425a)

```solidity
function minAutoDistributionAmount() external view returns (uint256);
```


Minimum amount of native currency to trigger auto distribution.

### numberOfRecipients (0xee0e01c7)

```solidity
function numberOfRecipients() external view returns (uint256);
```


External function to return number of recipients.

### platformFee (0x26232a2e)

```solidity
function platformFee() external view returns (uint256);
```


Platform fee percentage.

### recipients (0xd1bc76a1)

```solidity
function recipients(uint256) external view returns (address);
```


Array of the recipients.

### recipientsPercentage (0x1558ab2f)

```solidity
function recipientsPercentage(address) external view returns (uint256);
```


recipientAddress => recipientPercentage

### redistributeNativeCurrency (0x3d12394a)

```solidity
function redistributeNativeCurrency() external;
```


External function to redistribute native currency.

### redistributeToken (0xf4d3bdec)

```solidity
function redistributeToken(address _token) external;
```


External function to redistribute ERC20 token based on percentages assign to the recipients.


Parameters:

| Name   | Type    | Description                                  |
| :----- | :------ | :------------------------------------------- |
| _token | address | Address of the ERC20 token to be distribute. |

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

### setAutoNativeCurrencyDistribution (0x3d39e377)

```solidity
function setAutoNativeCurrencyDistribution(bool _isAutoNativeCurrencyDistribution) external;
```


External function for setting auto native currency distribution.


Parameters:

| Name                              | Type | Description                                                          |
| :-------------------------------- | :--- | :------------------------------------------------------------------- |
| _isAutoNativeCurrencyDistribution | bool | Bool switching whether auto native currency distribution is enabled. |

### setImmutableRecipients (0x50a2f6c8)

```solidity
function setImmutableRecipients() external;
```


External function for setting immutable recipients to true.

### setMinAutoDistributionAmount (0xf432c79f)

```solidity
function setMinAutoDistributionAmount(uint256 _minAutoDistributionAmount) external;
```


External function for setting minimun auto distribution amount.


Parameters:

| Name                       | Type    | Description                      |
| :------------------------- | :------ | :------------------------------- |
| _minAutoDistributionAmount | uint256 | New minimum distribution amount. |

### setRecipients (0x84890ba3)

```solidity
function setRecipients(tuple[] _recipients) external;
```


External function for setting recipients.


Parameters:

| Name        | Type    | Description                                                             |
| :---------- | :------ | :---------------------------------------------------------------------- |
| _recipients | tuple[] | Array of `RecipientData` structs with recipient address and percentage. |

### setRecipientsExt (0x97bf53b9)

```solidity
function setRecipientsExt(tuple[] _recipients) external;
```


External function for setting immutable recipients.


Parameters:

| Name        | Type    | Description                                                             |
| :---------- | :------ | :---------------------------------------------------------------------- |
| _recipients | tuple[] | Array of `RecipientData` structs with recipient address and percentage. |

### supportsInterface (0x01ffc9a7)

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool);
```


See {IERC165-supportsInterface}.
