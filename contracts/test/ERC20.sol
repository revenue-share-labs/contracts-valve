// SPDX-License-Identifier: BSL 1.1

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    constructor() ERC20("TokenX", "TX") {}

    /**
     * @notice Mint of Tokens
     * @param _to Receiver of tokens
     * @param _amount Amount of tokens to mint
     */
    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
