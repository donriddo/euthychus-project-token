// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.7.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EPT is ERC20 {
    constructor(uint256 initialSupply)
        public
        ERC20("Euthychus Project Token", "EPT")
    {
        _mint(msg.sender, initialSupply * (uint256(10)**decimals()));
    }

    function buyEPT(uint256 amount) external {
        _mint(msg.sender, amount * (uint256(10)**decimals()));
    }
}
