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
        uint256 pricePerTon;
        uint256 timestamp;
    }

    struct VerifiedSubmission {
        address seller;
        uint256 id;
        uint256 verifiedAmount;
        uint256 verifiedPrice;
        uint256 timestamp;
    }

    // Struct to store unique token details for certificates
    struct TokenCertificate {
        address buyer;
        uint256 amount;
        uint256 pricePerTon;
        string uniqueTokenCode;
        uint256 timestamp;
    }

    // Mapping to track certificates by submission ID and buyer
    mapping(uint256 => mapping(address => TokenCertificate[]))
        public tokenCertificates;
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
                        pricePerTon: submission.pricePerTon,
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
        returns (VerifiedSubmission[] memory)
    {
        uint256 totalVerified = 0;

        // Count the total number of verified submissions
        for (uint256 i = 0; i < sellers.length; i++) {
            address seller = sellers[i];
            CarbonSubmission[] storage submissions = carbonSubmissions[seller];
            for (uint256 j = 0; j < submissions.length; j++) {
                if (
                    submissions[j].verified && submissions[j].verifiedAmount > 0
                ) {
                    totalVerified++;
                }
            }
        }

        // Create an array to store all verified submissions with seller info
        VerifiedSubmission[]
            memory verifiedSubmissions = new VerifiedSubmission[](
                totalVerified
            );
        uint256 index = 0;

        // Populate the array with verified submissions including seller addresses
        for (uint256 i = 0; i < sellers.length; i++) {
            address seller = sellers[i];
            CarbonSubmission[] storage submissions = carbonSubmissions[seller];
            for (uint256 j = 0; j < submissions.length; j++) {
                if (
                    submissions[j].verified && submissions[j].verifiedAmount > 0
                ) {
                    CarbonSubmission storage submission = submissions[j];
                    verifiedSubmissions[index] = VerifiedSubmission({
                        seller: seller,
                        id: submission.id,
                        verifiedAmount: submission.verifiedAmount,
                        verifiedPrice: submission.verifiedPrice,
                        timestamp: submission.timestamp
                    });
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

    // Function to retrieve detailed submission data for a seller, including verification details
    function getSubmissionDetails(
        address seller,
        uint256 submissionId
    )
        external
        view
        returns (
            uint256 amount,
            uint256 pricePerTon,
            uint256 date,
            uint256 verifiedPricePerTon,
            bool isVerified
        )
    {
        require(userRoles[seller] == Role.Seller, "Address is not a seller");

        CarbonSubmission[] storage submissions = carbonSubmissions[seller];
        bool found = false;
        CarbonSubmission memory submission;

        // Find the specific submission by ID
        for (uint256 i = 0; i < submissions.length; i++) {
            if (submissions[i].id == submissionId) {
                submission = submissions[i];
                found = true;
                break;
            }
        }

        require(found, "Submission not found");

        // Return the submission details
        return (
            submission.amount,
            submission.pricePerTon,
            submission.timestamp,
            submission.verifiedPrice,
            submission.verified
        );
    }
    function buyTokens(
        address seller,
        uint256 submissionId,
        uint256 amountToBuy
    ) external payable {
        require(
            userRoles[msg.sender] == Role.Buyer,
            "Only buyers can purchase tokens"
        );
        require(userRoles[seller] == Role.Seller, "Invalid seller address");

        CarbonSubmission[] storage submissions = carbonSubmissions[seller];
        uint256 index;
        bool found = false;

        // Find the index of the specific verified submission by ID
        for (uint256 i = 0; i < submissions.length; i++) {
            if (submissions[i].id == submissionId && submissions[i].verified) {
                index = i;
                found = true;
                break;
            }
        }

        require(found, "Verified submission not found");

        // Now safely access the submission
        CarbonSubmission storage submission = submissions[index];
        require(
            amountToBuy > 0 && amountToBuy <= submission.verifiedAmount,
            "Invalid purchase amount"
        );

        uint256 totalPrice = submission.verifiedPrice * amountToBuy; // Calculate the total price
        require(msg.value >= totalPrice, "Insufficient ETH sent");

        // Transfer tokens to buyer
        _transfer(seller, msg.sender, amountToBuy);

        // Update the verified amount to reflect the tokens sold
        submission.verifiedAmount -= amountToBuy;

        // Generate unique token codes for each purchased token
        for (uint256 i = 0; i < amountToBuy; i++) {
            string memory uniqueTokenCode = string(
                abi.encodePacked(
                    "TKN-CE",
                    uint2str(block.timestamp), // Date and time
                    "-",
                    uint2str(submissionId), // Submission ID
                    "-",
                    uint2str(i + 1), // Token number in this purchase
                    "-",
                    randomString(5) // Random string for uniqueness
                )
            );

            // Store the certificate information
            tokenCertificates[submissionId][msg.sender].push(
                TokenCertificate({
                    buyer: msg.sender,
                    amount: 1,
                    pricePerTon: submission.verifiedPrice,
                    uniqueTokenCode: uniqueTokenCode,
                    timestamp: block.timestamp
                })
            );
        }

        // Send ETH payment to the seller
        payable(seller).transfer(totalPrice);

        // Refund any excess ETH sent
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
    }

    // Helper function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    // Helper function to generate a random string of given length (insecure for production)
    function randomString(
        uint256 length
    ) internal view returns (string memory) {
        bytes memory charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        bytes memory randomStr = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            randomStr[i] = charset[
                uint256(
                    keccak256(
                        abi.encodePacked(block.timestamp, block.difficulty, i)
                    )
                ) % charset.length
            ];
        }
        return string(randomStr);
    }

    function getAllSellers() external view returns (address[] memory) {
        return sellers;
    }
}
