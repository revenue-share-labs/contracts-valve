import { expect } from "chai";
import { ethers } from "hardhat";
export { deployRSCValve };

async function deployRSCValve(
  controller: any,
  distributors: any,
  isImmutableRecipients: any,
  isAutoNativeCurrencyDistribution: any,
  minAutoDistributeAmount: any,
  initialRecipients: any,
  percentages: any,
  creationId: any
) {
  const RSCValveFactory = await ethers.getContractFactory("RSCValveFactory");
  const rscValveFactory = await RSCValveFactory.deploy();
  await rscValveFactory.deployed();

  const tx = await rscValveFactory.createRSCValve({
    controller,
    distributors,
    isImmutableRecipients,
    isAutoNativeCurrencyDistribution,
    minAutoDistributeAmount,
    initialRecipients,
    percentages,
    creationId,
  });
  const receipt = await tx.wait();
  const revenueShareContractAddress = receipt.events?.[3].args?.[0];
  const RevenueShareContract = await ethers.getContractFactory("RSCValve");
  const RSCValve = await RevenueShareContract.attach(
    revenueShareContractAddress
  );
  return RSCValve;
}

describe("RSCValve", function () {
  let RSCValveFactory: any;
  let RSCValve: any;
  let TestToken: any;
  let testToken: any;

  let owner: any;
  let addr1: any;
  let addr2: any;
  let addr3: any;
  let addr4: any;
  let addr5: any;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    RSCValve = await deployRSCValve(
      owner.address,
      [owner.address],
      false,
      true,
      ethers.utils.parseEther("1"),
      [addr1.address],
      [10000000],
      ethers.constants.HashZero
    );

    TestToken = await ethers.getContractFactory("TestToken");
    testToken = await TestToken.deploy();
    await testToken.deployed();
    await testToken.setMinter(owner.address);
  });

  it("Should set base attrs correctly", async () => {
    expect(await RSCValve.owner()).to.be.equal(owner.address);
    expect(await RSCValve.distributors(owner.address)).to.be.true;

    expect(await RSCValve.isAutoNativeCurrencyDistribution()).to.be.true;
    await RSCValve.setAutoNativeCurrencyDistribution(false);
    expect(await RSCValve.isAutoNativeCurrencyDistribution()).to.be.false;
    await expect(
      RSCValve.connect(addr1).setAutoNativeCurrencyDistribution(false)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    expect(await RSCValve.isImmutableRecipients()).to.be.false;
    await expect(
      RSCValve.connect(addr1).setImmutableRecipients()
    ).to.be.revertedWith("Ownable: caller is not the owner");
    await RSCValve.setImmutableRecipients();
    expect(await RSCValve.isImmutableRecipients()).to.be.true;
    await expect(
      RSCValve.setImmutableRecipients()
    ).to.be.revertedWithCustomError(RSCValve, "ImmutableRecipientsError");

    expect(await RSCValve.minAutoDistributionAmount()).to.be.equal(
      ethers.utils.parseEther("1")
    );
    await RSCValve.setMinAutoDistributionAmount(ethers.utils.parseEther("2"));
    expect(await RSCValve.minAutoDistributionAmount()).to.be.equal(
      ethers.utils.parseEther("2")
    );

    await expect(
      RSCValve.connect(addr1).setMinAutoDistributionAmount(
        ethers.utils.parseEther("2")
      )
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should set recipients correctly", async () => {
    await expect(
      RSCValve.connect(addr3).setRecipients(
        [addr1.address, addr3.address, addr4.address],
        [2000000, 5000000, 3000000]
      )
    ).to.be.revertedWithCustomError(RSCValve, "OnlyControllerError");

    await RSCValve.setRecipients(
      [addr1.address, addr3.address, addr4.address],
      [2000000, 5000000, 3000000]
    );

    expect(await RSCValve.recipients(0)).to.be.equal(addr1.address);
    expect(await RSCValve.recipients(1)).to.be.equal(addr3.address);
    expect(await RSCValve.recipients(2)).to.be.equal(addr4.address);
    expect(await RSCValve.recipientsPercentage(addr1.address)).to.be.equal(
      2000000
    );
    expect(await RSCValve.recipientsPercentage(addr3.address)).to.be.equal(
      5000000
    );
    expect(await RSCValve.recipientsPercentage(addr4.address)).to.be.equal(
      3000000
    );
    expect(await RSCValve.numberOfRecipients()).to.be.equal(3);

    await expect(
      RSCValve.setRecipients(
        [addr1.address, addr3.address, addr4.address],
        [2000000, 5000000, 2000000]
      )
    ).to.be.revertedWithCustomError(RSCValve, "InvalidPercentageError");

    expect(await RSCValve.recipients(0)).to.be.equal(addr1.address);
    expect(await RSCValve.recipients(1)).to.be.equal(addr3.address);
    expect(await RSCValve.recipients(2)).to.be.equal(addr4.address);
    expect(await RSCValve.recipientsPercentage(addr1.address)).to.be.equal(
      2000000
    );
    expect(await RSCValve.recipientsPercentage(addr3.address)).to.be.equal(
      5000000
    );
    expect(await RSCValve.recipientsPercentage(addr4.address)).to.be.equal(
      3000000
    );
    expect(await RSCValve.numberOfRecipients()).to.be.equal(3);

    await RSCValve.setRecipients(
      [addr5.address, addr4.address, addr3.address, addr1.address],
      [2000000, 2000000, 3000000, 3000000]
    );

    expect(await RSCValve.recipients(0)).to.be.equal(addr5.address);
    expect(await RSCValve.recipients(1)).to.be.equal(addr4.address);
    expect(await RSCValve.recipients(2)).to.be.equal(addr3.address);
    expect(await RSCValve.recipients(3)).to.be.equal(addr1.address);
    expect(await RSCValve.recipientsPercentage(addr5.address)).to.be.equal(
      2000000
    );
    expect(await RSCValve.recipientsPercentage(addr4.address)).to.be.equal(
      2000000
    );
    expect(await RSCValve.recipientsPercentage(addr3.address)).to.be.equal(
      3000000
    );
    expect(await RSCValve.recipientsPercentage(addr1.address)).to.be.equal(
      3000000
    );
    expect(await RSCValve.numberOfRecipients()).to.be.equal(4);

    await RSCValve.setController(ethers.constants.AddressZero);

    await expect(
      RSCValve.setRecipients(
        [addr1.address, addr3.address, addr4.address],
        [2000000, 5000000, 3000000]
      )
    ).to.be.revertedWithCustomError(RSCValve, "OnlyControllerError");
  });

  it("Should set recipients correctly and set immutable recipients", async () => {
    await expect(
      RSCValve.connect(addr3).setRecipientsExt(
        [addr1.address, addr3.address, addr4.address],
        [2000000, 5000000, 3000000]
      )
    ).to.be.revertedWithCustomError(RSCValve, "OnlyControllerError");

    await RSCValve.setRecipients(
      [addr1.address, addr3.address, addr4.address],
      [2000000, 5000000, 3000000]
    );

    await expect(
      RSCValve.setRecipientsExt(
        [addr1.address, addr3.address, addr4.address],
        [2000000, 5000000, 2000000]
      )
    ).to.be.revertedWithCustomError(RSCValve, "InvalidPercentageError");

    expect(await RSCValve.recipients(0)).to.be.equal(addr1.address);
    expect(await RSCValve.recipients(1)).to.be.equal(addr3.address);
    expect(await RSCValve.recipients(2)).to.be.equal(addr4.address);
    expect(await RSCValve.recipientsPercentage(addr1.address)).to.be.equal(
      2000000
    );
    expect(await RSCValve.recipientsPercentage(addr3.address)).to.be.equal(
      5000000
    );
    expect(await RSCValve.recipientsPercentage(addr4.address)).to.be.equal(
      3000000
    );
    expect(await RSCValve.numberOfRecipients()).to.be.equal(3);

    await RSCValve.setRecipientsExt(
      [addr5.address, addr4.address, addr3.address, addr1.address],
      [2000000, 2000000, 3000000, 3000000]
    );

    expect(await RSCValve.recipients(0)).to.be.equal(addr5.address);
    expect(await RSCValve.recipients(1)).to.be.equal(addr4.address);
    expect(await RSCValve.recipients(2)).to.be.equal(addr3.address);
    expect(await RSCValve.recipients(3)).to.be.equal(addr1.address);
    expect(await RSCValve.recipientsPercentage(addr5.address)).to.be.equal(
      2000000
    );
    expect(await RSCValve.recipientsPercentage(addr4.address)).to.be.equal(
      2000000
    );
    expect(await RSCValve.recipientsPercentage(addr3.address)).to.be.equal(
      3000000
    );
    expect(await RSCValve.recipientsPercentage(addr1.address)).to.be.equal(
      3000000
    );
    expect(await RSCValve.numberOfRecipients()).to.be.equal(4);

    await expect(
      RSCValve.setRecipientsExt(
        [addr1.address, addr3.address, addr4.address],
        [2000000, 5000000, 3000000]
      )
    ).to.be.revertedWithCustomError(RSCValve, "ImmutableRecipientsError");

    await expect(
      RSCValve.setRecipients(
        [addr1.address, addr3.address, addr4.address],
        [2000000, 5000000, 3000000]
      )
    ).to.be.revertedWithCustomError(RSCValve, "ImmutableRecipientsError");
  });

  it("Should redistribute eth correctly", async () => {
    await RSCValve.setRecipients(
      [addr1.address, addr2.address],
      [8000000, 2000000]
    );

    expect(await RSCValve.numberOfRecipients()).to.be.equal(2);

    const addr1BalanceBefore = (
      await ethers.provider.getBalance(addr1.address)
    ).toBigInt();
    const addr2BalanceBefore = (
      await ethers.provider.getBalance(addr2.address)
    ).toBigInt();

    const transactionHash = await owner.sendTransaction({
      to: RSCValve.address,
      value: ethers.utils.parseEther("50"),
    });

    const addr1BalanceAfter = (
      await ethers.provider.getBalance(addr1.address)
    ).toBigInt();
    const addr2BalanceAfter = (
      await ethers.provider.getBalance(addr2.address)
    ).toBigInt();

    expect(addr1BalanceAfter).to.be.equal(
      addr1BalanceBefore + ethers.utils.parseEther("40").toBigInt()
    );
    expect(addr2BalanceAfter).to.be.equal(
      addr2BalanceBefore + ethers.utils.parseEther("10").toBigInt()
    );

    const transactionHash2 = await owner.sendTransaction({
      to: RSCValve.address,
      value: ethers.utils.parseEther("0.5"),
    });

    expect(
      (await ethers.provider.getBalance(RSCValve.address)).toBigInt()
    ).to.be.equal(ethers.utils.parseEther("0.5"));

    await RSCValve.redistributeNativeCurrency();

    expect(
      (await ethers.provider.getBalance(RSCValve.address)).toBigInt()
    ).to.be.equal(ethers.utils.parseEther("0"));

    expect(
      (await ethers.provider.getBalance(addr1.address)).toBigInt()
    ).to.be.equal(
      addr1BalanceAfter + ethers.utils.parseEther("0.4").toBigInt()
    );
    expect(
      (await ethers.provider.getBalance(addr2.address)).toBigInt()
    ).to.be.equal(
      addr2BalanceAfter + ethers.utils.parseEther("0.1").toBigInt()
    );
  });

  it("Should redistribute ERC20 token", async () => {
    await testToken.mint(RSCValve.address, ethers.utils.parseEther("100"));

    await RSCValve.setRecipients(
      [addr1.address, addr2.address],
      [2000000, 8000000]
    );

    await RSCValve.redistributeToken(testToken.address);
    expect(await testToken.balanceOf(RSCValve.address)).to.be.equal(0);
    expect(await testToken.balanceOf(addr1.address)).to.be.equal(
      ethers.utils.parseEther("20")
    );
    expect(await testToken.balanceOf(addr2.address)).to.be.equal(
      ethers.utils.parseEther("80")
    );

    await testToken.mint(RSCValve.address, ethers.utils.parseEther("100"));

    await expect(
      RSCValve.connect(addr3).redistributeToken(testToken.address)
    ).to.be.revertedWithCustomError(RSCValve, "OnlyDistributorError");

    await expect(
      RSCValve.connect(addr3).setDistributor(addr3.address, true)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await RSCValve.setDistributor(addr3.address, true);
    await RSCValve.connect(addr3).redistributeToken(testToken.address);

    expect(await testToken.balanceOf(RSCValve.address)).to.be.equal(0);
    expect(await testToken.balanceOf(addr1.address)).to.be.equal(
      ethers.utils.parseEther("40")
    );
    expect(await testToken.balanceOf(addr2.address)).to.be.equal(
      ethers.utils.parseEther("160")
    );

    await expect(RSCValve.renounceOwnership()).to.be.revertedWithCustomError(
      RSCValve,
      "RenounceOwnershipForbidden"
    );
  });

  it("Should initialize only once", async () => {
    await expect(
      RSCValve.initialize(
        addr2.address,
        ethers.constants.AddressZero,
        [owner.address],
        false,
        true,
        ethers.utils.parseEther("1"),
        BigInt(0),
        addr1.address,
        [addr1.address],
        [10000000]
      )
    ).to.be.revertedWith("Initializable: contract is already initialized");
  });

  it("Should transfer ownership correctly", async () => {
    await RSCValve.transferOwnership(addr1.address);
    expect(await RSCValve.owner()).to.be.equal(addr1.address);
    await expect(
      RSCValve.connect(addr2).transferOwnership(addr2.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should create manual distribution split", async () => {
    const RSCValveManualDistribution = await deployRSCValve(
      owner.address,
      [owner.address],
      true,
      false,
      ethers.utils.parseEther("1"),
      [addr1.address, addr2.address],
      [5000000, 5000000],
      ethers.constants.HashZero
    );

    const addr1BalanceBefore = (
      await ethers.provider.getBalance(addr1.address)
    ).toBigInt();

    const transactionHash = await owner.sendTransaction({
      to: RSCValveManualDistribution.address,
      value: ethers.utils.parseEther("50"),
    });

    const contractBalance = (
      await ethers.provider.getBalance(RSCValveManualDistribution.address)
    ).toBigInt();
    expect(contractBalance).to.be.equal(ethers.utils.parseEther("50"));

    await expect(
      RSCValveManualDistribution.connect(addr3).redistributeNativeCurrency()
    ).to.be.revertedWithCustomError(RSCValve, "OnlyDistributorError");

    await RSCValveManualDistribution.redistributeNativeCurrency();

    const contractBalance2 = (
      await ethers.provider.getBalance(RSCValveManualDistribution.address)
    ).toBigInt();
    expect(contractBalance2).to.be.equal(0);

    const addr1BalanceAfter = (
      await ethers.provider.getBalance(addr1.address)
    ).toBigInt();
    expect(addr1BalanceAfter).to.be.equal(
      addr1BalanceBefore + ethers.utils.parseEther("25").toBigInt()
    );
  });

  it("Should work with fees Correctly", async () => {
    const RSCValveFeeFactory = await ethers.getContractFactory(
      "RSCValveFactory"
    );
    const rscValveFeeFactory = await RSCValveFeeFactory.deploy();
    await rscValveFeeFactory.deployed();

    await expect(
      rscValveFeeFactory.connect(addr1).setPlatformFee(BigInt(1))
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await expect(
      rscValveFeeFactory.setPlatformFee(BigInt(10000001))
    ).to.be.revertedWithCustomError(rscValveFeeFactory, "InvalidFeePercentage");

    await expect(
      rscValveFeeFactory.connect(addr1).setPlatformWallet(addr4.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await rscValveFeeFactory.setPlatformWallet(addr5.address);
    await rscValveFeeFactory.setPlatformFee(BigInt(5000000));

    expect(await rscValveFeeFactory.platformWallet()).to.be.equal(
      addr5.address
    );
    expect(await rscValveFeeFactory.platformFee()).to.be.equal(BigInt(5000000));

    const txFee = await rscValveFeeFactory.createRSCValve({
      controller: owner.address,
      distributors: [owner.address],
      isImmutableRecipients: true,
      isAutoNativeCurrencyDistribution: true,
      minAutoDistributeAmount: ethers.utils.parseEther("1"),
      initialRecipients: [addr1.address],
      percentages: [BigInt(10000000)],
      creationId: ethers.constants.HashZero,
    });
    const receipt = await txFee.wait();
    const revenueShareContractAddress = receipt.events?.[3].args?.[0];
    const RevenueShareContract = await ethers.getContractFactory("RSCValve");
    const rscFeeValve = await RevenueShareContract.attach(
      revenueShareContractAddress
    );

    const platformWalletBalanceBefore = (
      await ethers.provider.getBalance(addr5.address)
    ).toBigInt();
    const addr1BalanceBefore = (
      await ethers.provider.getBalance(addr1.address)
    ).toBigInt();

    const transactionHash = await owner.sendTransaction({
      to: rscFeeValve.address,
      value: ethers.utils.parseEther("50"),
    });

    const platformWalletBalanceAfter = (
      await ethers.provider.getBalance(addr5.address)
    ).toBigInt();
    const addr1BalanceAfter = (
      await ethers.provider.getBalance(addr1.address)
    ).toBigInt();

    expect(platformWalletBalanceAfter).to.be.equal(
      platformWalletBalanceBefore + ethers.utils.parseEther("25").toBigInt()
    );
    expect(addr1BalanceAfter).to.be.equal(
      addr1BalanceBefore + ethers.utils.parseEther("25").toBigInt()
    );

    await testToken.mint(rscFeeValve.address, ethers.utils.parseEther("100"));
    await rscFeeValve.redistributeToken(testToken.address);

    expect(await testToken.balanceOf(addr5.address)).to.be.equal(
      ethers.utils.parseEther("50")
    );
    expect(await testToken.balanceOf(addr1.address)).to.be.equal(
      ethers.utils.parseEther("50")
    );
  });

  it("Should work with creation ID correctly", async () => {
    const RSCValveCreationIdFactory = await ethers.getContractFactory(
      "RSCValveFactory"
    );
    const rscValveCreationIdFactory = await RSCValveCreationIdFactory.deploy();
    await rscValveCreationIdFactory.deployed();

    await rscValveCreationIdFactory.createRSCValve({
      controller: owner.address,
      distributors: [owner.address],
      isImmutableRecipients: true,
      isAutoNativeCurrencyDistribution: true,
      minAutoDistributeAmount: ethers.utils.parseEther("1"),
      initialRecipients: [addr1.address],
      percentages: [BigInt(10000000)],
      creationId: ethers.utils.formatBytes32String("test-creation-id-1"),
    });

    await expect(
      rscValveCreationIdFactory.createRSCValve({
        controller: owner.address,
        distributors: [owner.address],
        isImmutableRecipients: true,
        isAutoNativeCurrencyDistribution: true,
        minAutoDistributeAmount: ethers.utils.parseEther("1"),
        initialRecipients: [addr1.address],
        percentages: [BigInt(10000000)],
        creationId: ethers.utils.formatBytes32String("test-creation-id-1"),
      })
    ).to.be.revertedWith("ERC1167: create2 failed");

    await rscValveCreationIdFactory.createRSCValve({
      controller: owner.address,
      distributors: [owner.address],
      isImmutableRecipients: true,
      isAutoNativeCurrencyDistribution: true,
      minAutoDistributeAmount: ethers.utils.parseEther("1"),
      initialRecipients: [addr1.address, addr2.address],
      percentages: [BigInt(5000000), BigInt(5000000)],
      creationId: ethers.utils.formatBytes32String("test-creation-id-1"),
    });

    await rscValveCreationIdFactory.createRSCValve({
      controller: owner.address,
      distributors: [owner.address],
      isImmutableRecipients: true,
      isAutoNativeCurrencyDistribution: true,
      minAutoDistributeAmount: ethers.utils.parseEther("1"),
      initialRecipients: [addr1.address],
      percentages: [BigInt(10000000)],
      creationId: ethers.utils.formatBytes32String("test-creation-id-2"),
    });
  });

  it("Should recursively erc20 split", async () => {
    const rscValveThird = await deployRSCValve(
      owner.address,
      [owner.address],
      true,
      false,
      ethers.utils.parseEther("1"),
      [addr1.address, addr2.address],
      [5000000, 5000000],
      ethers.constants.HashZero
    );

    const rscValveSecond = await deployRSCValve(
      owner.address,
      [owner.address],
      true,
      false,
      ethers.utils.parseEther("1"),
      [addr1.address, rscValveThird.address],
      [5000000, 5000000],
      ethers.constants.HashZero
    );

    const rscValveMain = await deployRSCValve(
      owner.address,
      [owner.address],
      true,
      false,
      ethers.utils.parseEther("1"),
      [rscValveSecond.address],
      [10000000],
      ethers.constants.HashZero
    );

    await testToken.mint(
      rscValveMain.address,
      ethers.utils.parseEther("1000000")
    );
    await testToken.mint(
      rscValveSecond.address,
      ethers.utils.parseEther("1000000")
    );
    await testToken.mint(
      rscValveThird.address,
      ethers.utils.parseEther("1000000")
    );

    await rscValveSecond.setDistributor(rscValveMain.address, true);
    await rscValveThird.setDistributor(rscValveSecond.address, true);
    await rscValveMain.redistributeToken(testToken.address);

    expect(await testToken.balanceOf(rscValveMain.address)).to.be.equal(0);
    expect(await testToken.balanceOf(rscValveSecond.address)).to.be.equal(0);
    expect(await testToken.balanceOf(rscValveThird.address)).to.be.equal(0);
  });

  it("Should recursively ETH split", async () => {
    const rscValveThird = await deployRSCValve(
      owner.address,
      [owner.address],
      true,
      false,
      ethers.utils.parseEther("1"),
      [addr1.address, addr2.address],
      [5000000, 5000000],
      ethers.constants.HashZero
    );

    const rscValveSecond = await deployRSCValve(
      owner.address,
      [owner.address],
      true,
      false,
      ethers.utils.parseEther("1"),
      [addr1.address, rscValveThird.address],
      [5000000, 5000000],
      ethers.constants.HashZero
    );

    const rscValveMain = await deployRSCValve(
      owner.address,
      [owner.address],
      true,
      false,
      ethers.utils.parseEther("1"),
      [rscValveSecond.address],
      [10000000],
      ethers.constants.HashZero
    );

    await owner.sendTransaction({
      to: rscValveMain.address,
      value: ethers.utils.parseEther("50"),
    });

    await owner.sendTransaction({
      to: rscValveSecond.address,
      value: ethers.utils.parseEther("50"),
    });

    await owner.sendTransaction({
      to: rscValveThird.address,
      value: ethers.utils.parseEther("50"),
    });

    await rscValveSecond.setDistributor(rscValveMain.address, true);
    await rscValveThird.setDistributor(rscValveSecond.address, true);
    await rscValveMain.redistributeNativeCurrency();

    expect(await ethers.provider.getBalance(rscValveMain.address)).to.be.equal(
      0
    );
    expect(
      await ethers.provider.getBalance(rscValveSecond.address)
    ).to.be.equal(0);
    expect(await ethers.provider.getBalance(rscValveThird.address)).to.be.equal(
      0
    );
  });

  it("Should distribute small amounts correctly", async () => {
    await RSCValve.setRecipients(
      [addr1.address, addr2.address],
      [2000000, 8000000]
    );

    await testToken.mint(RSCValve.address, BigInt(15000000));

    await RSCValve.redistributeToken(testToken.address);
    expect(await testToken.balanceOf(addr1.address)).to.be.equal(
      BigInt(3000000)
    );
    expect(await testToken.balanceOf(addr2.address)).to.be.equal(
      BigInt(12000000)
    );
    expect(await testToken.balanceOf(RSCValve.address)).to.be.equal(BigInt(0));

    await testToken.mint(RSCValve.address, BigInt(15000000));

    await RSCValve.redistributeToken(testToken.address);
    expect(await testToken.balanceOf(addr1.address)).to.be.equal(
      BigInt(6000000)
    );
    expect(await testToken.balanceOf(addr2.address)).to.be.equal(
      BigInt(24000000)
    );
    expect(await testToken.balanceOf(RSCValve.address)).to.be.equal(BigInt(0));
  });

  it("Should distribute small ether amounts correctly", async () => {
    const rscValveXYZ = await deployRSCValve(
      owner.address,
      [owner.address],
      true,
      true,
      BigInt(10000000),
      [addr1.address, addr2.address],
      [5000000, 5000000],
      ethers.constants.HashZero
    );

    const addr1BalanceBefore1 = (
      await ethers.provider.getBalance(addr1.address)
    ).toBigInt();
    const addr2BalanceBefore1 = (
      await ethers.provider.getBalance(addr2.address)
    ).toBigInt();

    await owner.sendTransaction({
      to: rscValveXYZ.address,
      value: ethers.utils.parseEther("0.000000000015"),
    });

    expect(
      (await ethers.provider.getBalance(addr1.address)).toBigInt()
    ).to.be.equal(
      addr1BalanceBefore1 +
        ethers.utils.parseEther("0.0000000000075").toBigInt()
    );
    expect(
      (await ethers.provider.getBalance(addr2.address)).toBigInt()
    ).to.be.equal(
      addr2BalanceBefore1 +
        ethers.utils.parseEther("0.0000000000075").toBigInt()
    );
    expect(
      (await ethers.provider.getBalance(rscValveXYZ.address)).toBigInt()
    ).to.be.equal(BigInt(0));

    const addr1BalanceBefore2 = (
      await ethers.provider.getBalance(addr1.address)
    ).toBigInt();
    const addr2BalanceBefore2 = (
      await ethers.provider.getBalance(addr2.address)
    ).toBigInt();

    await owner.sendTransaction({
      to: rscValveXYZ.address,
      value: ethers.utils.parseEther("0.000000000015"),
    });

    expect(
      (await ethers.provider.getBalance(rscValveXYZ.address)).toBigInt()
    ).to.be.equal(BigInt(0));
    expect(
      (await ethers.provider.getBalance(addr1.address)).toBigInt()
    ).to.be.equal(
      addr1BalanceBefore2 +
        ethers.utils.parseEther("0.0000000000075").toBigInt()
    );

    expect(
      (await ethers.provider.getBalance(addr2.address)).toBigInt()
    ).to.be.equal(
      addr2BalanceBefore2 +
        ethers.utils.parseEther("0.0000000000075").toBigInt()
    );
  });
});
