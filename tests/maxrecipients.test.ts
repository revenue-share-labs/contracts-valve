import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
  RSCValve,
  RSCValveFactory,
  RSCValveFactory__factory,
  RSCValve__factory,
  TestToken,
  TestToken__factory,
} from "../typechain-types";
import { randomSigners, snapshot } from "./utils";

describe("RSCValve Max recipients test", () => {
  let rscValveFactory: RSCValveFactory,
    rscValve: RSCValve,
    testToken: TestToken,
    owner: SignerWithAddress,
    addrs: SignerWithAddress[],
    snapId: string;

  before(async () => {
    [owner, ...addrs] = await ethers.getSigners();
    rscValveFactory = await new RSCValveFactory__factory(owner).deploy();
    const tx = await rscValveFactory.createRSCValve({
      controller: owner.address,
      distributors: [owner.address],
      isImmutableRecipients: false,
      isAutoNativeCurrencyDistribution: true,
      minAutoDistributeAmount: ethers.utils.parseEther("1"),
      initialRecipients: [owner.address],
      percentages: [10000000],
      creationId: ethers.constants.HashZero,
    });
    const receipt = await tx.wait();
    const revenueShareContractAddress = receipt.events?.[3].args?.[0];
    rscValve = await RSCValve__factory.connect(
      revenueShareContractAddress,
      owner
    );
    testToken = await new TestToken__factory(owner).deploy();
    await testToken.setMinter(owner.address);
  });

  beforeEach(async () => {
    snapId = await snapshot.take();
  });

  afterEach(async () => {
    await snapshot.restore(snapId);
  });

  describe("Different recipients values", () => {
    it("Gas test with 16 recipients", async () => {
      const recipients = randomSigners(16).map((signer) => signer.address);
      const percentages: number[] = new Array(16).fill(625000);

      await expect(rscValve.setRecipients(recipients, percentages)).to.emit(
        rscValve,
        "SetRecipients"
      );
      expect(await rscValve.numberOfRecipients()).to.be.equal(16);

      const alice = recipients[0];
      const bob = recipients[14];
      const aliceBalanceBefore = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceBefore = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      const tx = await owner.sendTransaction({
        to: rscValve.address,
        value: ethers.utils.parseEther("50"),
      });
      const receipt = tx.wait();
      const totalGasUsed = (await receipt).gasUsed.toNumber();
      console.log("16 recipient gas used: ", totalGasUsed);

      const aliceBalanceAfter = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceAfter = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      expect(aliceBalanceAfter).to.be.equal(
        aliceBalanceBefore + ethers.utils.parseEther("3.125").toBigInt()
      );
      expect(bobBalanceAfter).to.be.equal(
        bobBalanceBefore + ethers.utils.parseEther("3.125").toBigInt()
      );
    });

    it("Gas test with 25 recipients", async () => {
      const recipients = randomSigners(25).map((signer) => signer.address);
      const percentages: number[] = new Array(25).fill(400000);

      await expect(rscValve.setRecipients(recipients, percentages)).to.emit(
        rscValve,
        "SetRecipients"
      );
      expect(await rscValve.numberOfRecipients()).to.be.equal(25);

      const alice = recipients[3];
      const bob = recipients[22];
      const aliceBalanceBefore = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceBefore = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      const tx = await owner.sendTransaction({
        to: rscValve.address,
        value: ethers.utils.parseEther("50"),
      });
      const receipt = tx.wait();
      const totalGasUsed = (await receipt).gasUsed.toNumber();
      console.log("25 recipient gas used: ", totalGasUsed);

      const aliceBalanceAfter = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceAfter = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      expect(aliceBalanceAfter).to.be.equal(
        aliceBalanceBefore + ethers.utils.parseEther("2").toBigInt()
      );
      expect(bobBalanceAfter).to.be.equal(
        bobBalanceBefore + ethers.utils.parseEther("2").toBigInt()
      );
    });

    it("Gas test with 40 recipients", async () => {
      const recipients = randomSigners(40).map((signer) => signer.address);
      const percentages: number[] = new Array(40).fill(250000);

      await expect(rscValve.setRecipients(recipients, percentages)).to.emit(
        rscValve,
        "SetRecipients"
      );
      expect(await rscValve.numberOfRecipients()).to.be.equal(40);

      const alice = recipients[15];
      const bob = recipients[36];
      const aliceBalanceBefore = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceBefore = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      const tx = await owner.sendTransaction({
        to: rscValve.address,
        value: ethers.utils.parseEther("50"),
      });
      const receipt = tx.wait();
      const totalGasUsed = (await receipt).gasUsed.toNumber();
      console.log("40 recipient gas used: ", totalGasUsed);

      const aliceBalanceAfter = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceAfter = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      expect(aliceBalanceAfter).to.be.equal(
        aliceBalanceBefore + ethers.utils.parseEther("1.25").toBigInt()
      );
      expect(bobBalanceAfter).to.be.equal(
        bobBalanceBefore + ethers.utils.parseEther("1.25").toBigInt()
      );
    });

    it("Gas test with 50 recipients", async () => {
      const recipients = randomSigners(50).map((signer) => signer.address);
      const percentages: number[] = new Array(50).fill(200000);

      await expect(rscValve.setRecipients(recipients, percentages)).to.emit(
        rscValve,
        "SetRecipients"
      );
      expect(await rscValve.numberOfRecipients()).to.be.equal(50);

      const alice = recipients[7];
      const bob = recipients[43];
      const aliceBalanceBefore = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceBefore = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      const tx = await owner.sendTransaction({
        to: rscValve.address,
        value: ethers.utils.parseEther("50"),
      });
      const receipt = tx.wait();
      const totalGasUsed = (await receipt).gasUsed.toNumber();
      console.log("50 recipient gas used: ", totalGasUsed);

      const aliceBalanceAfter = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceAfter = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      expect(aliceBalanceAfter).to.be.equal(
        aliceBalanceBefore + ethers.utils.parseEther("1").toBigInt()
      );
      expect(bobBalanceAfter).to.be.equal(
        bobBalanceBefore + ethers.utils.parseEther("1").toBigInt()
      );
    });

    it("Gas test with 80 recipients", async () => {
      const recipients = randomSigners(80).map((signer) => signer.address);
      const percentages: number[] = new Array(80).fill(125000);

      await expect(rscValve.setRecipients(recipients, percentages)).to.emit(
        rscValve,
        "SetRecipients"
      );
      expect(await rscValve.numberOfRecipients()).to.be.equal(80);

      const alice = recipients[9];
      const bob = recipients[71];
      const aliceBalanceBefore = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceBefore = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      const tx = await owner.sendTransaction({
        to: rscValve.address,
        value: ethers.utils.parseEther("50"),
      });
      const receipt = tx.wait();
      const totalGasUsed = (await receipt).gasUsed.toNumber();
      console.log("80 recipient gas used: ", totalGasUsed);

      const aliceBalanceAfter = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceAfter = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      expect(aliceBalanceAfter).to.be.equal(
        aliceBalanceBefore + ethers.utils.parseEther("0.625").toBigInt()
      );
      expect(bobBalanceAfter).to.be.equal(
        bobBalanceBefore + ethers.utils.parseEther("0.625").toBigInt()
      );
    });
  });
});