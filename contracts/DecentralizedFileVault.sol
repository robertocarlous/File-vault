// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Decentralized File Vault Smart Contract
/// @notice Maps user wallet addresses to uploaded file CIDs stored via Lighthouse on IPFS/Filecoin
/// @dev Includes support for file sharing, metadata management, subscription payments, rewards, and revenue streams
contract DecentralizedFileVault {
    address public owner; // Contract owner address

    enum SubscriptionTier {
        BASIC, // 0.01 ETH/month, 10 files
        PROFESSIONAL, // 0.02 ETH/month, 50 files
        ENTERPRISE // 0.05 ETH/month, unlimited files
    }

    struct FileRecord {
        string cid; // IPFS CID of the uploaded file
        string fileType; // e.g., resume, publication, research, article
        uint256 uploadedAt; // Timestamp
        uint256 duration; // Duration in seconds
        string metadata; // File metadata (JSON string)
        bool isPublic; // Whether the file is publicly accessible
        address[] sharedWith; // List of addresses with access
        string encryptedKey; // Encryption key for private files
        string version; // Version identifier
        uint256 rewardPoints; // Points earned for storing this file
    }

    struct Subscription {
        uint256 startTime;
        uint256 endTime;
        uint256 storageLimit; // Maximum number of files allowed
        bool isActive;
        uint256 rewardPoints; // Total reward points earned
        uint256 discountPercentage; // Discount on next subscription
        SubscriptionTier tier; // Subscription tier
    }

    struct PremiumFeatures {
        bool hasPrioritySupport; // Priority customer support
        bool hasCustomDomain; // Custom domain for sharing
        bool hasAnalytics; // Advanced analytics
    }

    // --- Storage Change: Replace dynamic array with count and indexed mapping ---
    // mapping(address => FileRecord[]) private userFiles; // OLD - Gas intensive
    mapping(address => uint256) private userFileCount; // NEW - Tracks number of files per user
    mapping(address => mapping(uint256 => FileRecord)) private userFilesByIndex; // NEW - Stores files by user and index
    // --- End Storage Change ---

    // Mapping of file CID => owner address
    mapping(string => address) private fileOwners;

    // Mapping of file CID => access control list
    mapping(string => mapping(address => bool)) private fileAccess;

    // Mapping of user address => subscription details
    mapping(address => Subscription) private subscriptions;

    // Mapping of user address => premium features
    mapping(address => PremiumFeatures) private premiumFeatures;

    // Reward system constants
    uint256 public constant BASE_REWARD_POINTS = 100; // Points per file
    uint256 public constant POINTS_TO_DISCOUNT = 1000; // Points needed for discount
    uint256 public constant MAX_DISCOUNT = 50; // Maximum discount percentage
    uint256 public constant REWARD_MULTIPLIER = 2; // Multiplier for long-term storage

    // Subscription pricing
    mapping(SubscriptionTier => uint256) public tierPrices;
    uint256 public constant SUBSCRIPTION_DURATION = 30 days;
    mapping(SubscriptionTier => uint256) public tierStorageLimits;

    // Platform fees
    uint256 public constant TRANSFER_FEE = 0.002 ether;
    uint256 public constant PREMIUM_FEATURE_FEE = 0.005 ether;

    // Events
    event FileUploaded(
        address indexed user,
        string cid,
        string fileType,
        uint256 timestamp,
        uint256 duration,
        bool isPublic,
        uint256 rewardPoints
    );

    event RewardPointsEarned(
        address indexed user,
        uint256 points,
        uint256 totalPoints
    );

    event DiscountApplied(address indexed user, uint256 discountPercentage);

    event PremiumFeaturePurchased(
        address indexed user,
        string feature,
        uint256 price
    );

    event FileShared(
        string indexed cid,
        address indexed owner,
        address indexed recipient
    );

    event SubscriptionPurchased(
        address indexed user,
        uint256 startTime,
        uint256 endTime,
        uint256 storageLimit
    );

    constructor() {
        owner = msg.sender;

        // Initialize tier prices
        tierPrices[SubscriptionTier.BASIC] = 0.01 ether;
        tierPrices[SubscriptionTier.PROFESSIONAL] = 0.02 ether;
        tierPrices[SubscriptionTier.ENTERPRISE] = 0.05 ether;

        // Initialize storage limits
        tierStorageLimits[SubscriptionTier.BASIC] = 10;
        tierStorageLimits[SubscriptionTier.PROFESSIONAL] = 50;
        tierStorageLimits[SubscriptionTier.ENTERPRISE] = type(uint256).max;
    }

    /// @notice Purchase or renew a subscription with potential discount
    /// @param tier The subscription tier to purchase
    function purchaseSubscription(SubscriptionTier tier) external payable {
        Subscription storage sub = subscriptions[msg.sender];
        uint256 price = tierPrices[tier];

        // Apply discount if available
        if (sub.discountPercentage > 0) {
            price = price - ((price * sub.discountPercentage) / 100);
            sub.discountPercentage = 0; // Reset discount after use
        }

        require(msg.value >= price, "Insufficient payment");

        if (sub.isActive && block.timestamp < sub.endTime) {
            // Renew existing subscription
            sub.endTime += SUBSCRIPTION_DURATION;
        } else {
            // New subscription
            sub.startTime = block.timestamp;
            sub.endTime = block.timestamp + SUBSCRIPTION_DURATION;
            sub.isActive = true;
        }

        sub.tier = tier;
        sub.storageLimit = tierStorageLimits[tier];

        emit SubscriptionPurchased(
            msg.sender,
            sub.startTime,
            sub.endTime,
            sub.storageLimit
        );
    }

    /// @notice Purchase premium features
    /// @param feature The feature to purchase
    function purchasePremiumFeature(string calldata feature) external payable {
        require(msg.value >= PREMIUM_FEATURE_FEE, "Insufficient payment");
        PremiumFeatures storage features = premiumFeatures[msg.sender];

        if (keccak256(bytes(feature)) == keccak256(bytes("prioritySupport"))) {
            features.hasPrioritySupport = true;
        } else if (
            keccak256(bytes(feature)) == keccak256(bytes("customDomain"))
        ) {
            features.hasCustomDomain = true;
        } else if (keccak256(bytes(feature)) == keccak256(bytes("analytics"))) {
            features.hasAnalytics = true;
        } else {
            revert("Invalid feature");
        }

        emit PremiumFeaturePurchased(msg.sender, feature, PREMIUM_FEATURE_FEE);
    }

    /// @notice Share a file with another address
    /// @param _cid The CID of the file to share
    /// @param _recipient The address to share the file with
    function shareFile(string calldata _cid, address _recipient) external {
        require(fileOwners[_cid] == msg.sender, "Not the file owner");
        require(!fileAccess[_cid][_recipient], "Already shared with recipient");

        fileAccess[_cid][_recipient] = true;

        // --- Modify shareFile logic to use new storage structure ---
        uint256 count = userFileCount[msg.sender];
        bool found = false;
        for (uint i = 0; i < count; i++) {
            // Access file by index
            FileRecord storage file = userFilesByIndex[msg.sender][i];
            if (keccak256(bytes(file.cid)) == keccak256(bytes(_cid))) {
                // Append to sharedWith (Note: this push can still be gas-intensive)
                file.sharedWith.push(_recipient);
                found = true;
                break;
            }
        }
        require(found, "File record not found for owner"); // Should not happen if fileOwners mapping is correct
        // --- End modification ---

        emit FileShared(_cid, msg.sender, _recipient);
    }

    /// @notice Upload a file record to the vault
    /// @param _cid IPFS CID returned by Lighthouse
    /// @param _fileType Type of file (e.g., "resume", "publication")
    /// @param _duration Duration in seconds the file should be considered valid
    /// @param _isPublic Whether the file should be publicly accessible
    /// @param _encryptedKey Optional encryption key for private files
    function uploadFile(
        string calldata _cid,
        string calldata _fileType,
        uint256 _duration,
        bool _isPublic,
        string calldata _encryptedKey
    ) external {
        require(hasActiveSubscription(msg.sender), "No active subscription");
        require(bytes(_cid).length > 0, "CID required");
        require(bytes(_fileType).length > 0, "File type required");
        require(_duration > 0, "Duration must be greater than 0");
        require(fileOwners[_cid] == address(0), "CID already exists");

        Subscription storage sub = subscriptions[msg.sender];

        // --- Modify uploadFile logic to use new storage structure ---
        uint256 currentCount = userFileCount[msg.sender];
        require(currentCount < sub.storageLimit, "Storage limit reached");

        // Calculate reward points
        uint256 rewardPoints = calculateRewardPoints(_duration);
        sub.rewardPoints += rewardPoints;

        // Update discount if enough points
        if (sub.rewardPoints >= POINTS_TO_DISCOUNT) {
            uint256 discount = (sub.rewardPoints / POINTS_TO_DISCOUNT) * 10;
            sub.discountPercentage = discount > MAX_DISCOUNT
                ? MAX_DISCOUNT
                : discount;
            sub.rewardPoints = sub.rewardPoints % POINTS_TO_DISCOUNT; // Keep remaining points
            emit DiscountApplied(msg.sender, sub.discountPercentage);
        }

        FileRecord memory newFile = FileRecord({
            cid: _cid,
            fileType: _fileType,
            uploadedAt: block.timestamp,
            duration: _duration,
            metadata: "",
            isPublic: _isPublic,
            sharedWith: new address[](0),
            encryptedKey: _encryptedKey,
            version: "1.0",
            rewardPoints: rewardPoints
        });

        // Store the file at the next index
        userFilesByIndex[msg.sender][currentCount] = newFile;
        // Increment the user's file count
        userFileCount[msg.sender] = currentCount + 1;
        // --- End modification ---

        // Update owner and access mappings
        fileOwners[_cid] = msg.sender;
        fileAccess[_cid][msg.sender] = true;

        emit FileUploaded(
            msg.sender,
            _cid,
            _fileType,
            block.timestamp,
            _duration,
            _isPublic,
            rewardPoints
        );
        emit RewardPointsEarned(msg.sender, rewardPoints, sub.rewardPoints);
    }

    /// @notice Calculate reward points for a file based on duration
    /// @param _duration Duration in seconds
    /// @return points Calculated reward points
    function calculateRewardPoints(
        uint256 _duration
    ) internal pure returns (uint256 points) {
        // Base points + bonus for longer duration
        uint256 durationInDays = _duration / 1 days;
        return BASE_REWARD_POINTS + (durationInDays * REWARD_MULTIPLIER);
    }

    /// @notice Check if a user has an active subscription
    /// @param user Address to check
    /// @return isActive Boolean indicating if subscription is active
    function hasActiveSubscription(
        address user
    ) public view returns (bool isActive) {
        Subscription storage sub = subscriptions[user];
        return sub.isActive && block.timestamp < sub.endTime;
    }

    /// @notice Get subscription details for a user
    /// @param user Address to check
    /// @return startTime Subscription start time
    /// @return endTime Subscription end time
    /// @return storageLimit Maximum number of files allowed
    /// @return isActive Whether subscription is currently active
    function getSubscriptionDetails(
        address user
    )
        external
        view
        returns (
            uint256 startTime,
            uint256 endTime,
            uint256 storageLimit,
            bool isActive
        )
    {
        Subscription storage sub = subscriptions[user];
        return (
            sub.startTime,
            sub.endTime,
            sub.storageLimit,
            sub.isActive && block.timestamp < sub.endTime
        );
    }

    /// @notice Get user's reward points and discount information
    /// @param user Address to check
    /// @return points Current reward points
    /// @return discount Current discount percentage
    function getUserRewards(
        address user
    ) external view returns (uint256 points, uint256 discount) {
        Subscription storage sub = subscriptions[user];
        return (sub.rewardPoints, sub.discountPercentage);
    }

    /// @notice Withdraw collected fees
    /// @param amount Amount to withdraw
    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    // Add public getter functions for mappings
    function getFileOwner(
        string calldata _cid
    ) external view returns (address) {
        return fileOwners[_cid];
    }

    function getFileAccess(
        string calldata _cid,
        address user
    ) external view returns (bool) {
        return fileAccess[_cid][user];
    }

    function getUserPremiumFeatures(
        address user
    ) external view returns (PremiumFeatures memory) {
        return premiumFeatures[user];
    }

    // --- Add Getter functions for new storage structure ---
    /// @notice Get the total number of files uploaded by a user
    /// @param user The address of the user
    /// @return The number of files uploaded by the user
    function getUserFileCount(address user) external view returns (uint256) {
        return userFileCount[user];
    }

    /// @notice Get a specific file record for a user by index
    /// @param user The address of the user
    /// @param index The index of the file (0-based)
    /// @return The FileRecord struct at the specified index
    function getUserFile(
        address user,
        uint256 index
    ) external view returns (FileRecord memory) {
        require(index < userFileCount[user], "Index out of bounds");
        return userFilesByIndex[user][index];
    }

    // --- End Add Getter functions ---

    /// @notice Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /// @notice Transfer ownership of the contract
    /// @param newOwner The address of the new owner
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}
