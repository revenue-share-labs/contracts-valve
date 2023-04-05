import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { RSCValveFactory, RSCValveFactory__factory } from "../typechain-types";
import { snapshot } from "./utils";

describe("RSCValveFactory", () => {
  let rscValveFactory: RSCValveFactory,
    owner: SignerWithAddress,
    alice: SignerWithAddress,
    snapId: string;

  before(async () => {
    [owner, alice] = await ethers.getSigners();
    rscValveFactory = await new RSCValveFactory__factory(owner).deploy();
  });

  beforeEach(async () => {
    snapId = await snapshot.take();
  });

  afterEach(async () => {
    await snapshot.restore(snapId);
  });

  describe("Deployment", () => {
    it("Should set the correct owner of the contract", async () => {
      expect(await rscValveFactory.owner()).to.be.equal(owner.address);
    });

    it("Should deploy RSC Valve Implementation", async () => {
      expect(await rscValveFactory.contractImplementation()).not.to.be.empty;
    });
  });

  describe("Ownership", () => {
    it("Only owner can renounce ownership", async () => {
      await expect(
        rscValveFactory.connect(alice).renounceOwnership()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Only owner can transfer ownership", async () => {
      await expect(
        rscValveFactory.connect(alice).transferOwnership(alice.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
