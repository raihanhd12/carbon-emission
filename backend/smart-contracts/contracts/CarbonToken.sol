// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarbonToken is ERC20 {
    address public admin;

    struct CarbonSubmission {
        uint256 id;
        uint256 amount;
        uint256 pricePerTon; // Harga per ton ketika seller submit
        bool verified;
        uint256 verifiedAmount;
        uint256 verifiedPrice; // Harga yang ditentukan admin setelah verifikasi
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

    // Struct for storing user details
    struct UserDetails {
        string name;
        string company; // Optional: only for sellers
    }

    // Mapping to store roles and user details
    mapping(address => Role) public userRoles;
    mapping(address => UserDetails) public userDetails;

    // Events
    event CarbonSubmitted(
        address indexed seller,
        uint256 id,
        uint256 amount,
        uint256 pricePerTon,
        uint256 timestamp
    );
    event CarbonVerified(
        address indexed verifier,
        address indexed seller,
        uint256 id,
        uint256 verifiedAmount,
        uint256 verifiedPrice,
        uint256 timestamp
    );

    // Event for user selecting role
    event UserRoleSelected(
        address indexed user,
        Role role,
        string name,
        string company
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

    constructor() ERC20("VerifiedCarbonToken", "VCT") {
        admin = msg.sender;
        submissionIdCounter = 1;
    }

    // Function to assign role to a user with name (and company if seller)
    function userSelectRole(
        Role role,
        string memory name,
        string memory company
    ) external {
        require(
            userRoles[msg.sender] == Role.Unassigned,
            "Role already assigned"
        );
        require(
            role == Role.Seller || role == Role.Buyer,
            "Invalid role selection"
        );
        require(bytes(name).length > 0, "Name must not be empty");

        // Assign role and user details
        userRoles[msg.sender] = role;
        userDetails[msg.sender] = UserDetails({
            name: name,
            company: (role == Role.Seller) ? company : ""
        });

        if (role == Role.Seller) {
            sellers.push(msg.sender);
        }

        // Emit event when user selects role
        emit UserRoleSelected(msg.sender, role, name, company);
    }

    // Function for sellers to submit carbon with price
    function submitCarbon(
        uint256 amount,
        uint256 pricePerTon
    ) external onlySeller {
        require(amount > 0, "Amount must be greater than zero");
        require(pricePerTon > 0, "Price per ton must be greater than zero");
        require(
            !hasUnverifiedSubmission[msg.sender],
            "You have an unverified submission. Please wait for verification."
        );

        uint256 currentTimestamp = block.timestamp;

        carbonSubmissions[msg.sender].push(
            CarbonSubmission({
                id: submissionIdCounter,
                amount: amount,
                pricePerTon: pricePerTon,
                verified: false,
                verifiedAmount: 0,
                verifiedPrice: 0,
                timestamp: currentTimestamp
            })
        );

        hasUnverifiedSubmission[msg.sender] = true;
        submissionIdCounter++;

        emit CarbonSubmitted(
            msg.sender,
            submissionIdCounter,
            amount,
            pricePerTon,
            currentTimestamp
        );
    }

    // Function to verify carbon submission by admin and set verified price
    function verifyCarbon(
        address seller,
        uint256 submissionId,
        uint256 verifiedAmount,
        uint256 verifiedPricePerTon
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

        // Update the submission with verified amount and price
        submission.verified = true;
        submission.verifiedAmount = verifiedAmount;
        submission.verifiedPrice = verifiedPricePerTon;

        hasUnverifiedSubmission[seller] = false;

        // Mint ERC-20 tokens based on the verified amount
        _mint(seller, verifiedAmount);

        emit CarbonVerified(
            msg.sender,
            seller,
            submissionId,
            verifiedAmount,
            verifiedPricePerTon,
            block.timestamp
        );
    }

    // Function to get all unverified submissions with seller addresses
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

    // Function to get all verified submissions for buyers
    function getAllSubmissions()
        external
        view
        returns (CarbonSubmission[] memory)
    {
        uint256 totalVerified = 0;

        // Count the total number of verified submissions
        for (uint256 i = 0; i < sellers.length; i++) {
            address seller = sellers[i];
            CarbonSubmission[] storage submissions = carbonSubmissions[seller];
            for (uint256 j = 0; j < submissions.length; j++) {
                if (submissions[j].verified) {
                    totalVerified++;
                }
            }
        }

        // Create an array to store all verified submissions
        CarbonSubmission[] memory verifiedSubmissions = new CarbonSubmission[](
            totalVerified
        );
        uint256 index = 0;

        // Populate the array with verified submissions
        for (uint256 i = 0; i < sellers.length; i++) {
            address seller = sellers[i];
            CarbonSubmission[] storage submissions = carbonSubmissions[seller];
            for (uint256 j = 0; j < submissions.length; j++) {
                if (submissions[j].verified) {
                    CarbonSubmission storage submission = submissions[j];
                    verifiedSubmissions[index] = submission;
                    index++;
                }
            }
        }

        return verifiedSubmissions;
    }

    // Function to get submissions for a specific seller
    function getSubmissionsForSeller(
        address seller
    ) external view returns (CarbonSubmission[] memory) {
        require(userRoles[seller] == Role.Seller, "Address is not a seller");
        return carbonSubmissions[seller];
    }
}
