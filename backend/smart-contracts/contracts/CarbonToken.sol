// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarbonToken is ERC20 {
    address public immutable admin;
    uint256 private submissionCounter;

    // Format kode: 1 huruf, 4 angka, 2 huruf (contoh: B1234CD)
    uint256 private numberCounter = 1; // untuk angka bagian tengah
    uint8 private firstLetterCounter = 65; // ASCII untuk 'A'
    uint8 private lastLetterCounter1 = 65; // ASCII untuk 'A'
    uint8 private lastLetterCounter2 = 65; // ASCII untuk 'A'

    enum Role {
        Unassigned,
        Seller,
        Buyer
    }

    struct Submission {
        uint256 submissionId;
        uint256 amount;
        uint256 priceInEth; // Changed to store price in ether
        bool verified;
        uint256 verifiedAmount;
        uint256 verifiedPriceInEth; // Changed to store verified price in ether
        uint256 timestamp;
    }

    struct TokenCertificate {
        string registrationNumber;
        uint256 priceInEth; // Changed to store price in ether
        uint256 timestamp;
        address buyer;
        address seller;
        uint256 submissionId;
    }

    struct PurchaseCertificate {
        address buyer;
        address seller;
        uint256 submissionId;
        uint256 totalAmount;
        uint256 pricePerTokenInEth; // Changed to store price in ether
        uint256 totalPriceInEth; // Changed to store total price in ether
        uint256 timestamp;
        string[] registrationNumbers;
    }

    struct User {
        Role role;
        string name;
        string company;
    }

    // Main storage
    mapping(address => User) public users;
    mapping(address => mapping(uint256 => Submission)) public submissions;
    mapping(address => uint256[]) public userSubmissionIds;
    mapping(string => TokenCertificate) public tokenCertificates;
    mapping(address => PurchaseCertificate[]) public purchaseCertificates;
    mapping(string => bool) public usedRegistrationNumbers;
    mapping(address => bool) private hasUnverifiedSubmission;
    address[] public sellers;
    mapping(address => bool) private isSellerAdded;

    event SubmissionCreated(
        address indexed seller,
        uint256 indexed id,
        uint256 amount,
        uint256 priceInEth
    );
    event SubmissionVerified(
        address indexed seller,
        uint256 indexed id,
        uint256 amount,
        uint256 priceInEth
    );
    event TokensPurchased(
        address indexed buyer,
        address indexed seller,
        uint256 submissionId,
        uint256 amount,
        uint256 totalPriceInEth,
        string[] registrationNumbers
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyRole(Role role) {
        require(users[msg.sender].role == role, "Invalid role");
        _;
    }

    constructor() ERC20("VerifiedCarbonToken", "VCT") {
        admin = msg.sender;
    }

    function generateNextRegistrationNumber() private returns (string memory) {
        // Format: B1234CD
        string memory regNumber = string(
            abi.encodePacked(
                bytes1(firstLetterCounter),
                uint2str(numberCounter),
                bytes1(lastLetterCounter1),
                bytes1(lastLetterCounter2)
            )
        );

        // Increment counters
        lastLetterCounter2++;
        if (lastLetterCounter2 > 90) {
            // 'Z'
            lastLetterCounter2 = 65; // 'A'
            lastLetterCounter1++;
            if (lastLetterCounter1 > 90) {
                lastLetterCounter1 = 65;
                numberCounter++;
                if (numberCounter > 9999) {
                    numberCounter = 1;
                    firstLetterCounter++;
                    if (firstLetterCounter > 90) {
                        firstLetterCounter = 65;
                    }
                }
            }
        }

        return regNumber;
    }

    function register(
        Role role,
        string calldata name,
        string calldata company
    ) external {
        require(
            users[msg.sender].role == Role.Unassigned,
            "Already registered"
        );
        require(role == Role.Seller || role == Role.Buyer, "Invalid role");
        require(bytes(name).length > 0, "Empty name");

        users[msg.sender] = User(role, name, company);
    }

    function submitCarbon(
        uint256 amount,
        uint256 priceInEth // Price in ether
    ) external onlyRole(Role.Seller) {
        require(amount > 0 && priceInEth > 0, "Invalid input");
        require(
            !hasUnverifiedSubmission[msg.sender],
            "Pending unverified submission"
        );

        uint256 id = ++submissionCounter;
        submissions[msg.sender][id] = Submission({
            submissionId: id,
            amount: amount,
            priceInEth: priceInEth, // Store price in ether
            verified: false,
            verifiedAmount: 0,
            verifiedPriceInEth: 0,
            timestamp: block.timestamp
        });

        userSubmissionIds[msg.sender].push(id);
        hasUnverifiedSubmission[msg.sender] = true;

        if (!isSellerAdded[msg.sender]) {
            sellers.push(msg.sender);
            isSellerAdded[msg.sender] = true;
        }

        emit SubmissionCreated(msg.sender, id, amount, priceInEth);
    }

    function verifySubmission(
        address seller,
        uint256 id,
        uint256 verifiedAmount,
        uint256 verifiedPriceInEth // Verified price in ether
    ) external onlyAdmin {
        Submission storage sub = submissions[seller][id];
        require(!sub.verified, "Already verified");
        require(verifiedAmount <= sub.amount, "Amount too high");

        sub.verified = true;
        sub.verifiedAmount = verifiedAmount;
        sub.verifiedPriceInEth = verifiedPriceInEth;

        hasUnverifiedSubmission[seller] = false;
        _mint(seller, verifiedAmount);
        emit SubmissionVerified(seller, id, verifiedAmount, verifiedPriceInEth);
    }

    function buyTokens(
        address seller,
        uint256 submissionId,
        uint256 amount
    ) external payable onlyRole(Role.Buyer) {
        Submission storage sub = submissions[seller][submissionId];

        // Validasi submission
        require(sub.verified, "Submission not verified");
        require(sub.verifiedAmount >= amount, "Insufficient tokens available");
        require(sub.submissionId == submissionId, "Invalid submissionId");

        // Calculate total price in wei for comparison with msg.value
        uint256 totalPriceInWei = amount * sub.verifiedPriceInEth * 1 ether;
        require(msg.value == totalPriceInWei, "Incorrect payment amount");

        // Kurangi jumlah token dalam submission
        sub.verifiedAmount -= amount;

        // Transfer ETH ke seller
        (bool success, ) = payable(seller).call{value: totalPriceInWei}("");
        require(success, "ETH transfer failed");

        // Transfer token ke buyer
        _transfer(seller, msg.sender, amount);

        // Generate sertifikat token
        string[] memory regNumbers = new string[](amount);
        for (uint256 i = 0; i < amount; i++) {
            string memory regNumber = generateNextRegistrationNumber();
            regNumbers[i] = regNumber;

            // Simpan data sertifikat
            tokenCertificates[regNumber] = TokenCertificate({
                registrationNumber: regNumber,
                priceInEth: sub.verifiedPriceInEth,
                timestamp: block.timestamp,
                buyer: msg.sender,
                seller: seller,
                submissionId: submissionId
            });

            usedRegistrationNumbers[regNumber] = true;
        }

        // Simpan sertifikat pembelian
        purchaseCertificates[msg.sender].push(
            PurchaseCertificate({
                buyer: msg.sender,
                seller: seller,
                submissionId: submissionId,
                totalAmount: amount,
                pricePerTokenInEth: sub.verifiedPriceInEth,
                totalPriceInEth: sub.verifiedPriceInEth * amount,
                timestamp: block.timestamp,
                registrationNumbers: regNumbers
            })
        );

        emit TokensPurchased(
            msg.sender,
            seller,
            submissionId,
            amount,
            sub.verifiedPriceInEth * amount,
            regNumbers
        );
    }

    // View functions
    function getAllSubmissions()
        external
        view
        returns (address[] memory, Submission[] memory)
    {
        uint256 totalCount = 0;

        // Hitung total jumlah submission
        for (uint256 i = 0; i < sellers.length; i++) {
            totalCount += userSubmissionIds[sellers[i]].length;
        }

        // Inisialisasi array untuk hasil
        address[] memory sellerAddresses = new address[](totalCount);
        Submission[] memory allSubmissions = new Submission[](totalCount);

        uint256 index = 0;

        // Loop melalui semua sellers dan submission mereka
        for (uint256 i = 0; i < sellers.length; i++) {
            uint256[] memory ids = userSubmissionIds[sellers[i]];
            for (uint256 j = 0; j < ids.length; j++) {
                uint256 id = ids[j];
                Submission memory sub = submissions[sellers[i]][id];
                sub.submissionId = id;

                // Simpan submission dan seller address
                allSubmissions[index] = sub;
                sellerAddresses[index] = sellers[i];
                index++;
            }
        }

        return (sellerAddresses, allSubmissions);
    }

    function getTokenCertificate(
        string calldata regNumber
    ) external view returns (TokenCertificate memory) {
        require(
            usedRegistrationNumbers[regNumber],
            "Registration number not found"
        );
        return tokenCertificates[regNumber];
    }

    function getPurchaseCertificates(
        address buyer
    ) external view returns (PurchaseCertificate[] memory) {
        return purchaseCertificates[buyer];
    }

    function uint2str(uint256 value) internal pure returns (string memory) {
        bytes memory buffer = new bytes(4);
        uint256 temp = value;

        // Pad with zeros if necessary
        for (uint256 i = 3; i >= 0; i--) {
            buffer[i] = bytes1(uint8(48 + (temp % 10)));
            temp /= 10;
            if (i == 0) break;
        }

        return string(buffer);
    }
}
