// SPDX-License-Identifier: BSL 1.1

pragma solidity ^0.8.19;

import "../RSCValve.sol";

error CantAcceptEtherDirectly();

contract MockReceiver {
    RSCValve public valve;

    receive() external payable {
        revert CantAcceptEtherDirectly();
    }

    constructor() {}
}
