import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
  RSCValve,
  RSCValveFactory,
  RSCValveFactory__factory,
  RSCValve__factory,
} from "../typechain-types";
import { randomSigners, snapshot } from "./utils";

describe("RSCValve Max recipients test", () => {
  let rscValveFactory: RSCValveFactory,
    rscValve: RSCValve,
    owner: SignerWithAddress,
    snapId: string;

  before(async () => {
    [owner] = await ethers.getSigners();
    rscValveFactory = await new RSCValveFactory__factory(owner).deploy();
    const tx = await rscValveFactory.createRSCValve({
      controller: owner.address,
      distributors: [owner.address],
      isImmutableRecipients: false,
      isAutoNativeCurrencyDistribution: false,
      minAutoDistributeAmount: ethers.utils.parseEther("1"),
      recipients: [{ addrs: owner.address, percentage: 10000000 }],
      creationId: ethers.constants.HashZero,
    });
    const receipt = await tx.wait();
    const revenueShareContractAddress = receipt.events?.[8].args?.[0];
    rscValve = await RSCValve__factory.connect(
      revenueShareContractAddress,
      owner
    );
  });

  beforeEach(async () => {
    snapId = await snapshot.take();
  });

  afterEach(async () => {
    await snapshot.restore(snapId);
  });

  describe("Different recipients values", () => {
    it("Gas test with 16 recipients", async () => {
      const addrs = randomSigners(16).map((signer) => signer.address);
      const percentages: number[] = new Array(16).fill(625000);
      const recipients = addrs.map((addrs, i) => {
        return { addrs, percentage: percentages[i] };
      });

      await expect(rscValve.setRecipients(recipients)).to.emit(
        rscValve,
        "SetRecipients"
      );
      expect(await rscValve.numberOfRecipients()).to.be.equal(16);

      const alice = recipients[0].addrs;
      const bob = recipients[14].addrs;
      const aliceBalanceBefore = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceBefore = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      await owner.sendTransaction({
        to: rscValve.address,
        value: ethers.utils.parseEther("50"),
      });
      const tx = await rscValve.redistributeNativeCurrency();
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
      const addrs = randomSigners(25).map((signer) => signer.address);
      const percentages: number[] = new Array(25).fill(400000);
      const recipients = addrs.map((addrs, i) => {
        return { addrs, percentage: percentages[i] };
      });

      await expect(rscValve.setRecipients(recipients)).to.emit(
        rscValve,
        "SetRecipients"
      );
      expect(await rscValve.numberOfRecipients()).to.be.equal(25);

      const alice = recipients[3].addrs;
      const bob = recipients[22].addrs;
      const aliceBalanceBefore = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceBefore = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      await owner.sendTransaction({
        to: rscValve.address,
        value: ethers.utils.parseEther("50"),
      });
      const tx = await rscValve.redistributeNativeCurrency();
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
      const addrs = randomSigners(40).map((signer) => signer.address);
      const percentages: number[] = new Array(40).fill(250000);
      const recipients = addrs.map((addrs, i) => {
        return { addrs, percentage: percentages[i] };
      });

      await expect(rscValve.setRecipients(recipients)).to.emit(
        rscValve,
        "SetRecipients"
      );
      expect(await rscValve.numberOfRecipients()).to.be.equal(40);

      const alice = recipients[15].addrs;
      const bob = recipients[36].addrs;
      const aliceBalanceBefore = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceBefore = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      await owner.sendTransaction({
        to: rscValve.address,
        value: ethers.utils.parseEther("50"),
      });
      const tx = await rscValve.redistributeNativeCurrency();
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
      const addrs = randomSigners(50).map((signer) => signer.address);
      const percentages: number[] = new Array(50).fill(200000);
      const recipients = addrs.map((addrs, i) => {
        return { addrs, percentage: percentages[i] };
      });

      await expect(rscValve.setRecipients(recipients)).to.emit(
        rscValve,
        "SetRecipients"
      );
      expect(await rscValve.numberOfRecipients()).to.be.equal(50);

      const alice = recipients[7].addrs;
      const bob = recipients[43].addrs;
      const aliceBalanceBefore = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceBefore = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      await owner.sendTransaction({
        to: rscValve.address,
        value: ethers.utils.parseEther("50"),
      });
      const tx = await rscValve.redistributeNativeCurrency();
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
      const addrs = randomSigners(80).map((signer) => signer.address);
      const percentages: number[] = new Array(80).fill(125000);
      const recipients = addrs.map((addrs, i) => {
        return { addrs, percentage: percentages[i] };
      });

      await expect(rscValve.setRecipients(recipients)).to.emit(
        rscValve,
        "SetRecipients"
      );
      expect(await rscValve.numberOfRecipients()).to.be.equal(80);

      const alice = recipients[9].addrs;
      const bob = recipients[71].addrs;
      const aliceBalanceBefore = (
        await ethers.provider.getBalance(alice)
      ).toBigInt();
      const bobBalanceBefore = (
        await ethers.provider.getBalance(bob)
      ).toBigInt();

      await owner.sendTransaction({
        to: rscValve.address,
        value: ethers.utils.parseEther("50"),
      });
      const tx = await rscValve.redistributeNativeCurrency();
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
