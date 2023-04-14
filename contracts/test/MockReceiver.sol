// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "../RSCValve.sol";

error CantAcceptEtherDirectly();

contract MockReceiver {
    RSCValve public valve;

    receive() external payable {
        revert CantAcceptEtherDirectly();
    }

    constructor(address payable _valve) {
        valve = RSCValve(_valve);
    }

    function testRedistributeNativeCurrency() external {
        valve.redistributeNativeCurrency();
    }
}
