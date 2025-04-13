const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentralizedFileVault", function () {
    let vault;
    let owner;
    let user1;
    let user2;
    let user3;

    const BASIC_PRICE = ethers.parseEther("0.01");
    const PROFESSIONAL_PRICE = ethers.parseEther("0.02");
    const ENTERPRISE_PRICE = ethers.parseEther("0.05");
    const PREMIUM_FEATURE_FEE = ethers.parseEther("0.005");

    beforeEach(async function () {
        [owner, user1, user2, user3] = await ethers.getSigners();

        const Vault = await ethers.getContractFactory("DecentralizedFileVault");
        vault = await Vault.deploy();
        await vault.waitForDeployment();
    });

    describe("Subscription Management", function () {
        it("Should allow users to purchase basic subscription", async function () {
            await vault.connect(user1).purchaseSubscription(0, { value: BASIC_PRICE });

            const [startTime, endTime, storageLimit, isActive] = await vault.getSubscriptionDetails(user1.address);

            expect(isActive).to.be.true;
            expect(storageLimit).to.equal(10);
            expect(endTime - startTime).to.equal(30 * 24 * 60 * 60); // 30 days
        });

        it("Should allow users to purchase professional subscription", async function () {
            await vault.connect(user1).purchaseSubscription(1, { value: PROFESSIONAL_PRICE });

            const [, , storageLimit] = await vault.getSubscriptionDetails(user1.address);
            expect(storageLimit).to.equal(50);
        });

        it("Should allow users to purchase enterprise subscription", async function () {
            await vault.connect(user1).purchaseSubscription(2, { value: ENTERPRISE_PRICE });

            const [, , storageLimit] = await vault.getSubscriptionDetails(user1.address);
            expect(storageLimit).to.equal(ethers.MaxUint256);
        });

        it("Should not allow subscription with insufficient payment", async function () {
            await expect(
                vault.connect(user1).purchaseSubscription(0, { value: ethers.parseEther("0.005") })
            ).to.be.revertedWith("Insufficient payment");
        });
    });

    describe("File Management", function () {
        beforeEach(async function () {
            await vault.connect(user1).purchaseSubscription(0, { value: BASIC_PRICE });
        });

        it("Should allow users to upload files", async function () {
            const cid = "QmExampleCID123";
            const fileType = "resume";
            const duration = 30 * 24 * 60 * 60; // 30 days
            const isPublic = true;
            const encryptedKey = "encryptedKey123";

            await vault.connect(user1).uploadFile(
                cid,
                fileType,
                duration,
                isPublic,
                encryptedKey
            );

            // Verify file ownership
            const fileOwner = await vault.getFileOwner(cid);
            expect(fileOwner).to.equal(user1.address);
        });

        it("Should not allow file upload without subscription", async function () {
            const cid = "QmExampleCID123";
            const fileType = "resume";
            const duration = 30 * 24 * 60 * 60;
            const isPublic = true;
            const encryptedKey = "encryptedKey123";

            await expect(
                vault.connect(user2).uploadFile(
                    cid,
                    fileType,
                    duration,
                    isPublic,
                    encryptedKey
                )
            ).to.be.revertedWith("No active subscription");
        });

        it("Should not allow duplicate CID uploads", async function () {
            const cid = "QmExampleCID123";
            const fileType = "resume";
            const duration = 30 * 24 * 60 * 60;
            const isPublic = true;
            const encryptedKey = "encryptedKey123";

            await vault.connect(user1).uploadFile(
                cid,
                fileType,
                duration,
                isPublic,
                encryptedKey
            );

            await expect(
                vault.connect(user1).uploadFile(
                    cid,
                    fileType,
                    duration,
                    isPublic,
                    encryptedKey
                )
            ).to.be.revertedWith("CID already exists");
        });
    });

    describe("File Sharing", function () {
        beforeEach(async function () {
            await vault.connect(user1).purchaseSubscription(0, { value: BASIC_PRICE });

            // Upload a file
            const cid = "QmExampleCID123";
            const fileType = "resume";
            const duration = 30 * 24 * 60 * 60;
            const isPublic = false;
            const encryptedKey = "encryptedKey123";

            await vault.connect(user1).uploadFile(
                cid,
                fileType,
                duration,
                isPublic,
                encryptedKey
            );
        });

        it("Should allow file owner to share file with another user", async function () {
            const cid = "QmExampleCID123";

            await vault.connect(user1).shareFile(cid, user2.address);

            // Verify access was granted
            const hasAccess = await vault.getFileAccess(cid, user2.address);
            expect(hasAccess).to.be.true;
        });

        it("Should not allow non-owners to share files", async function () {
            const cid = "QmExampleCID123";

            await expect(
                vault.connect(user2).shareFile(cid, user3.address)
            ).to.be.revertedWith("Not the file owner");
        });

        it("Should not allow sharing with same user twice", async function () {
            const cid = "QmExampleCID123";

            await vault.connect(user1).shareFile(cid, user2.address);

            await expect(
                vault.connect(user1).shareFile(cid, user2.address)
            ).to.be.revertedWith("Already shared with recipient");
        });
    });

    describe("Premium Features", function () {
        it("Should allow users to purchase premium features", async function () {
            await vault.connect(user1).purchasePremiumFeature("prioritySupport", { value: PREMIUM_FEATURE_FEE });

            const features = await vault.getUserPremiumFeatures(user1.address);
            expect(features.hasPrioritySupport).to.be.true;
        });

        it("Should not allow purchase of invalid premium features", async function () {
            await expect(
                vault.connect(user1).purchasePremiumFeature("invalidFeature", { value: PREMIUM_FEATURE_FEE })
            ).to.be.revertedWith("Invalid feature");
        });

        it("Should not allow purchase with insufficient payment", async function () {
            await expect(
                vault.connect(user1).purchasePremiumFeature("prioritySupport", { value: ethers.parseEther("0.001") })
            ).to.be.revertedWith("Insufficient payment");
        });
    });

    describe("Reward System", function () {
        beforeEach(async function () {
            await vault.connect(user1).purchaseSubscription(1, { value: PROFESSIONAL_PRICE }); // Use Professional tier for more storage
        });

        it("Should award points for file upload", async function () {
            const cid = "QmExampleCID123";
            const fileType = "resume";
            const duration = 30 * 24 * 60 * 60;
            const isPublic = true;
            const encryptedKey = "encryptedKey123";

            await vault.connect(user1).uploadFile(
                cid,
                fileType,
                duration,
                isPublic,
                encryptedKey
            );

            const [points] = await vault.getUserRewards(user1.address);
            expect(points).to.be.gt(0);
        });

        it("Should apply discount when enough points are earned", async function () {
            // Upload multiple files to accumulate points
            for (let i = 0; i < 10; i++) { // Reduced from 15 to 10 to stay within storage limits
                const cid = `QmExampleCID${i}`;
                const fileType = "resume";
                const duration = 30 * 24 * 60 * 60;
                const isPublic = true;
                const encryptedKey = "encryptedKey123";

                await vault.connect(user1).uploadFile(
                    cid,
                    fileType,
                    duration,
                    isPublic,
                    encryptedKey
                );
            }

            const [, discount] = await vault.getUserRewards(user1.address);
            expect(discount).to.be.gt(0);
        });
    });

    describe("Owner Functions", function () {
        it("Should allow owner to withdraw collected fees", async function () {
            // First collect some fees
            await vault.connect(user1).purchaseSubscription(0, { value: BASIC_PRICE });
            await vault.connect(user2).purchaseSubscription(1, { value: PROFESSIONAL_PRICE });

            const balanceBefore = await ethers.provider.getBalance(owner.address);
            const contractBalance = await ethers.provider.getBalance(vault.target);

            await vault.connect(owner).withdraw(contractBalance);

            const balanceAfter = await ethers.provider.getBalance(owner.address);
            expect(balanceAfter).to.be.gt(balanceBefore);
        });

        it("Should not allow non-owners to withdraw", async function () {
            await expect(
                vault.connect(user1).withdraw(ethers.parseEther("0.01"))
            ).to.be.revertedWith("Only owner can call this function");
        });
    });
}); 