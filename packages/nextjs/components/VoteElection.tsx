import { useState } from "react";
import { getContract } from "~~/helpers/getContract";

const VoteElection = ({ elections, onVoteSuccess }: { elections: any[]; onVoteSuccess: () => void }) => {
  const [selectedElectionId, setSelectedElectionId] = useState<number | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number>(0);

  const handleVote = async () => {
    if (selectedElectionId === null) {
      alert("Please select an election to vote on!");
      return;
    }

    const contract = await getContract();

    if (!contract) return;

    try {
      const tx = await contract.castVote(selectedElectionId, selectedChoice);
      await tx.wait();
      alert("Vote successfully submitted!");
      onVoteSuccess();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl mb-10">Vote Now</h2>
      <div className="space-y-6">
        <select
          onChange={(e) => setSelectedElectionId(Number(e.target.value))}
          className="w-full p-2 border rounded"
        >
          <option value="" disabled selected>
            Select an election
          </option>
          {elections.map((election) => (
            <option key={election.id} value={election.id}>
              {election.name}
            </option>
          ))}
        </select>

        {selectedElectionId !== null && (
          <div>
            <p className="text-lg font-semibold text-gray-800 mb-4">Available Options</p>
            <select
              onChange={(e) => setSelectedChoice(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="" disabled selected>
                Select an option
              </option>
              {elections[selectedElectionId]?.choices.map((choice: string, index: number) => (
                <option key={index} value={index}>
                  {choice}
                </option>
              ))}
            </select>

            <p className="text-sm text-gray-600 mt-2">
              Voting ends: {elections[selectedElectionId]?.endTime}
            </p>
          </div>
        )}

        <button
          onClick={handleVote}
          className="w-full bg-teal-600"
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
};

export default VoteElection;