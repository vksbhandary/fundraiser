const FundraiserContract = artifacts.require("Fundraiser");

contract("Fundraiser", (accounts) => {
  let fundraiser;
  const name = "Devdass singh";
  const url = "devdas.com";
  const image = "https://placekitten.com/600/350";
  const desc = "Devdass description.";
  const owner = accounts[0];
  const beneficiary = accounts[1];
  const newBeneficary = accounts[2];

  describe("initializatoin", () => {
    beforeEach(async () => {
      fundraiser = await FundraiserContract.new(
        name,
        url,
        image,
        desc,
        beneficiary,
        owner
      );
    });

    it("Gets benificary name", async () => {
      const actual = await fundraiser.name();
      assert.equal(actual, name, "name should match");
    });
    it("Gets benificary url", async () => {
      const actual = await fundraiser.url();
      assert.equal(actual, url, "url should match");
    });
    it("Gets benificary image", async () => {
      const actual = await fundraiser.image();
      assert.equal(actual, image, "image should match");
    });
    it("Gets benificary desc", async () => {
      const actual = await fundraiser.desc();
      assert.equal(actual, desc, "desc should match");
    });
    it("Gets benificary beneficiary", async () => {
      const actual = await fundraiser.beneficiary();
      assert.equal(actual, beneficiary, "beneficiary should match");
    });
    it("Gets benificary owner", async () => {
      const actual = await fundraiser.owner();
      assert.equal(actual, owner, "owner should match");
    });
  });

  describe("setBenificiary tests", () => {
    it("updated beneficiary when called by onwer", async () => {
      await fundraiser.setBeneficiary(newBeneficary, { from: owner });
      const beneficiary = await fundraiser.beneficiary();
      assert.equal(newBeneficary, beneficiary, "new beneficiary should match");
    });

    it("beneficiary error when not called by onwer", async () => {
      try {
        await fundraiser.setBeneficiary(newBeneficary, { from: accounts[3] });
        assert.fail("widthraw was not restricted to owners");
      } catch (err) {
        const error = "Ownable: caller is not the owner";
        const actualErr = err.reason;
        assert.equal(error, actualErr, "should not be permitted");
      }
    });
  });

  describe("make donations", () => {
    const value = web3.utils.toWei("0.03");
    const donor = accounts[2];
    it("increases getDonationCount", async () => {
      const currentCount = await fundraiser.getDonationCount({ from: donor });
      await fundraiser.donate({ from: donor, value });
      const newCount = await fundraiser.getDonationCount({ from: donor });
      assert.equal(
        parseInt(currentCount, 10) + 1,
        parseInt(newCount, 10),
        "getDonationCount should increment by 1"
      );
    });
    // it("increases getDonationCount", async () => {
    //   const currentCount = await fundraiser.getDonationCount({ from: donor });
    //   await fundraiser.donate({ from: donor, value });
    //   const newCount = await fundraiser.getDonationCount({ from: donor });
    //   assert.equal(
    //     currentCount + 1,
    //     newCount,
    //     "getDonationCount should increment by 1"
    //   );
    // });
  });
});
