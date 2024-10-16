// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CarbonToken {
    address public admin;

    struct CarbonSubmission {
        uint256 id;
        uint256 amount;
        bool verified;
        uint256 verifiedAmount;
        uint256 timestamp;
    }

    struct UnverifiedSubmission {
        address seller;
        uint256 id;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => CarbonSubmission[]) public carbonSubmissions;
    mapping(address => bool) public hasUnverifiedSubmission;

    address[] public sellers; // To track all sellers
    uint256 public submissionIdCounter;

    // Enum for roles
    enum Role {
        Unassigned,
        Seller,
        Buyer
    }

    // Mapping to store roles of users
    mapping(address => Role) public userRoles;

    event CarbonSubmitted(
        address indexed seller,
        uint256 id,
        uint256 amount,
        uint256 timestamp
    );
    event CarbonVerified(
        address indexed verifier,
        address indexed seller,
        uint256 id,
        uint256 verifiedAmount,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlySeller() {
        require(
            userRoles[msg.sender] == Role.Seller,
            "Only sellers can perform this action"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
        submissionIdCounter = 1;
    }

    // Function to assign role to a user
    function userSelectRole(Role role) external {
        require(
            userRoles[msg.sender] == Role.Unassigned,
            "Role already assigned"
        );
        require(
            role == Role.Seller || role == Role.Buyer,
            "Invalid role selection"
        );

        // Assign the role
        userRoles[msg.sender] = role;

        if (role == Role.Seller) {
            sellers.push(msg.sender);
        }
    }

    // Function for sellers to submit carbon
    function submitCarbon(uint256 amount) external onlySeller {
        require(amount > 0, "Amount must be greater than zero");
        require(
            !hasUnverifiedSubmission[msg.sender],
            "You have an unverified submission. Please wait for verification."
        );

        uint256 currentTimestamp = block.timestamp;

        carbonSubmissions[msg.sender].push(
            CarbonSubmission({
                id: submissionIdCounter,
                amount: amount,
                verified: false,
                verifiedAmount: 0,
                timestamp: currentTimestamp
            })
        );

        hasUnverifiedSubmission[msg.sender] = true;
        submissionIdCounter++;
    }

    // Function to verify carbon submission
    function verifyCarbon(
        address seller,
        uint256 submissionId,
        uint256 verifiedAmount
    ) external onlyAdmin {
        require(userRoles[seller] == Role.Seller, "Address is not a seller");

        CarbonSubmission[] storage submissions = carbonSubmissions[seller];
        uint256 index;
        bool found = false;

        // Find the index of the submission
        for (uint256 i = 0; i < submissions.length; i++) {
            if (submissions[i].id == submissionId) {
                index = i;
                found = true;
                break;
            }
        }

        require(found, "Submission not found");

        CarbonSubmission storage submission = submissions[index];

        require(!submission.verified, "Submission already verified");
        require(
            verifiedAmount <= submission.amount,
            "Verified amount exceeds submitted amount"
        );

        submission.verified = true;
        submission.verifiedAmount = verifiedAmount;

        hasUnverifiedSubmission[seller] = false;

        emit CarbonVerified(
            msg.sender,
            seller,
            submissionId,
            verifiedAmount,
            block.timestamp
        );
    }

    // Updated function to get all unverified submissions with seller addresses
    function getAllUnverifiedSubmissions()
        external
        view
        returns (UnverifiedSubmission[] memory)
    {
        uint256 totalUnverified = 0;

        // First, count the total number of unverified submissions
        for (uint256 i = 0; i < sellers.length; i++) {
            address seller = sellers[i];
            CarbonSubmission[] storage submissions = carbonSubmissions[seller];
            for (uint256 j = 0; j < submissions.length; j++) {
                if (!submissions[j].verified) {
                    totalUnverified++;
                }
            }
        }

        // Create an array to store unverified submissions with seller addresses
        UnverifiedSubmission[]
            memory unverifiedSubmissions = new UnverifiedSubmission[](
                totalUnverified
            );
        uint256 index = 0;

        // Populate the array with unverified submissions
        for (uint256 i = 0; i < sellers.length; i++) {
            address seller = sellers[i];
            CarbonSubmission[] storage submissions = carbonSubmissions[seller];
            for (uint256 j = 0; j < submissions.length; j++) {
                if (!submissions[j].verified) {
                    CarbonSubmission storage submission = submissions[j];
                    unverifiedSubmissions[index] = UnverifiedSubmission({
                        seller: seller,
                        id: submission.id,
                        amount: submission.amount,
                        timestamp: submission.timestamp
                    });
                    index++;
                }
            }
        }

        return unverifiedSubmissions;
    }

    // Function to get submissions for a specific seller
    function getSubmissionsForSeller(
        address seller
    ) external view returns (CarbonSubmission[] memory) {
        require(userRoles[seller] == Role.Seller, "Address is not a seller");
        return carbonSubmissions[seller];
    }

    // **New function to get the admin address**
    function getAdmin() external view returns (address) {
        return admin;
    }
}
