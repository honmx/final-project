import { expect } from "chai";
import { ethers } from "hardhat";
import { ElectionSystem } from "../typechain-types";

describe("ElectionSystem", function () {
  let electionSystem: ElectionSystem;

  before(async () => {
    const ElectionSystemFactory = await ethers.getContractFactory("ElectionSystem");
    electionSystem = (await ElectionSystemFactory.deploy()) as ElectionSystem;
    await electionSystem.waitForDeployment();
  });

  it("Should allow creating an election", async function () {
    const options = ["Candidate A", "Candidate B"];
    await electionSystem.initializeElection("Test Election", options, 3600);
    const election = await electionSystem.electionsList(0);

    expect(election.title).to.equal("Test Election");
    expect(await electionSystem.listChoices(0)).to.deep.equal(options);
  });

  it("Should allow creating multiple elections", async function () {
    const elections = [
      { title: "Current Year", choices: ["2023", "2024", "2025"] },
      { title: "Favourite Food", choices: ["Meat", "Fruits", "Vegetables"] },
      { title: "Best Movie Genre", choices: ["Action", "Comedy", "Drama", "Horror"] },
      { title: "Favourite Drink", choices: ["Coffee", "Tea", "Juice"] },
      { title: "Preferred Pet", choices: ["Dog", "Cat", "Bird", "Fish"] },
    ];

    for (const [index, election] of elections.entries()) {
      await electionSystem.initializeElection(election.title, election.choices, 3600);
      const createdElection = await electionSystem.electionsList(index + 1);

      expect(createdElection.title).to.equal(election.title);
      expect(await electionSystem.listChoices(index + 1)).to.deep.equal(election.choices);
    }
  });

  it("Should allow voting for an option", async function () {
    await electionSystem.castVote(0, 1);
    const results = await electionSystem.viewResults(0);

    expect(results[1]).to.equal(1);
  });


  it("Should allow viewing election results", async function () {
    await electionSystem.castVote(3, 1);
    const results = await electionSystem.viewResults(3);

    expect(results[1]).to.equal(1);
    expect(results[0]).to.equal(0);
  });

  it("Should prevent double voting", async function () {
    await expect(electionSystem.castVote(0, 1)).to.be.revertedWith("Vote already cast");
  });

  it("Should prevent voting after the election ends", async function () {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    await ethers.provider.send("evm_setNextBlockTimestamp", [currentTimestamp + 3601]);
    await ethers.provider.send("evm_mine", []);

    await expect(electionSystem.castVote(0, 0)).to.be.revertedWith("Voting period has ended");
  });
});
