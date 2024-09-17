// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarbonToken is ERC20 {
    // Define the admin and seller roles
    address public admin;
    mapping(address => uint256) public carbonSubmissions;
    mapping(address => uint256) public verifiedCarbon;

    // Event declarations
    event CarbonSubmitted(address indexed seller, uint256 amount);
    event CarbonVerified(
        address indexed verifier,
        address indexed seller,
        uint256 verifiedAmount
    );
    event TokensMinted(address indexed seller, uint256 amount);

    // Modifier to check if the caller is admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() ERC20("CarbonToken", "CTKN") {
        admin = msg.sender;
    }

    // Function for seller to submit carbon amount
    function submitCarbon(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        carbonSubmissions[msg.sender] = amount;
        emit CarbonSubmitted(msg.sender, amount);
    }

    // Function for admin to verify carbon submission and mint tokens
    function verifyCarbon(
        address seller,
        uint256 verifiedAmount
    ) external onlyAdmin {
        require(
            carbonSubmissions[seller] > 0,
            "No carbon submission from this seller"
        );
        require(
            verifiedAmount <= carbonSubmissions[seller],
            "Verified amount exceeds submitted amount"
        );

        verifiedCarbon[seller] = verifiedAmount;
        carbonSubmissions[seller] = 0; // Reset the submission after verification

        _mint(seller, verifiedAmount); // Mint tokens representing the verified carbon amount

        emit CarbonVerified(msg.sender, seller, verifiedAmount);
        emit TokensMinted(seller, verifiedAmount);
    }

    // Function to get verified carbon amount for a seller
    function getVerifiedCarbon(address seller) external view returns (uint256) {
        return verifiedCarbon[seller];
    }
}
