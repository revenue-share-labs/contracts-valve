// SPDX-License-Identifier: BSL 1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IRecursiveRSC {
    function distributors(address _distributor) external returns (bool);

    function redistributeToken(IERC20 _token) external;

    function redistributeNativeCurrency() external;

    function isAutoNativeCurrencyDistribution() external returns (bool);
}
