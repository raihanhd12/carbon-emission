// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarbonToken is ERC20 {
    address public admin;

    struct CarbonSubmission {
        uint256 id;
        uint256 amount;
        bool verified;
        uint256 verifiedAmount; // New field to track the verified amount
    }

    mapping(address => CarbonSubmission[]) public carbonSubmissions;
    mapping(address => uint256) public verifiedCarbon;

    uint256 public submissionIdCounter;

    event CarbonSubmitted(address indexed seller, uint256 id, uint256 amount);
    event CarbonVerified(
        address indexed verifier,
        address indexed seller,
        uint256 id,
        uint256 verifiedAmount
    );
    event TokensMinted(address indexed seller, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() ERC20("CarbonToken", "CTKN") {
        admin = msg.sender;
        submissionIdCounter = 1;
    }

    function submitCarbon(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");

        carbonSubmissions[msg.sender].push(
            CarbonSubmission({
                id: submissionIdCounter,
                amount: amount,
                verified: false,
                verifiedAmount: 0 // Initialize the verifiedAmount to 0
            })
        );

        emit CarbonSubmitted(msg.sender, submissionIdCounter, amount);

        submissionIdCounter++;
    }

    function verifyCarbon(
        address seller,
        uint256 submissionId,
        uint256 verifiedAmount
    ) external onlyAdmin {
        require(
            carbonSubmissions[seller].length > 0,
            "No carbon submissions from this seller"
        );

        CarbonSubmission storage submission = findSubmission(
            seller,
            submissionId
        );
        require(!submission.verified, "Submission already verified");
        require(
            verifiedAmount <= submission.amount,
            "Verified amount exceeds submitted amount"
        );

        submission.verified = true;
        submission.verifiedAmount = verifiedAmount; // Store the verified amount

        verifiedCarbon[seller] += verifiedAmount;

        _mint(seller, verifiedAmount);

        emit CarbonVerified(msg.sender, seller, submissionId, verifiedAmount);
        emit TokensMinted(seller, verifiedAmount);
    }

    function findSubmission(
        address seller,
        uint256 submissionId
    ) internal view returns (CarbonSubmission storage) {
        for (uint256 i = 0; i < carbonSubmissions[seller].length; i++) {
            if (carbonSubmissions[seller][i].id == submissionId) {
                return carbonSubmissions[seller][i];
            }
        }
        revert("Submission not found");
    }

    function getCarbonSubmissionById(
        address seller,
        uint256 submissionId
    )
        external
        view
        returns (uint256 amount, bool verified, uint256 verifiedAmount)
    {
        CarbonSubmission storage submission = findSubmission(
            seller,
            submissionId
        );
        return (
            submission.amount,
            submission.verified,
            submission.verifiedAmount
        );
    }

    function getAllSubmissions(
        address seller
    ) external view returns (CarbonSubmission[] memory) {
        return carbonSubmissions[seller];
    }

    function getVerifiedCarbon(address seller) external view returns (uint256) {
        return verifiedCarbon[seller];
    }

    function getAllVerifiedSubmissions(
        address seller
    ) external view returns (CarbonSubmission[] memory) {
        uint256 verifiedCount = 0;

        // Count the number of verified submissions first
        for (uint256 i = 0; i < carbonSubmissions[seller].length; i++) {
            if (carbonSubmissions[seller][i].verified) {
                verifiedCount++;
            }
        }

        // Create a new array for verified submissions
        CarbonSubmission[] memory verifiedSubmissions = new CarbonSubmission[](
            verifiedCount
        );
        uint256 index = 0;

        // Add verified submissions to the array
        for (uint256 i = 0; i < carbonSubmissions[seller].length; i++) {
            if (carbonSubmissions[seller][i].verified) {
                verifiedSubmissions[index] = carbonSubmissions[seller][i];
                index++;
            }
        }

        return verifiedSubmissions;
    }
}
