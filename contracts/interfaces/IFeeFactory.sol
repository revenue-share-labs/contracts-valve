// SPDX-License-Identifier: BSL 1.1

pragma solidity ^0.8.19;

interface IFeeFactory {
    function platformWallet() external returns (address payable);
}
