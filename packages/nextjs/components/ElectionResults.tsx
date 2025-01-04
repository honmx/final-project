import { ethers } from "ethers";
import { useState } from "react";
import { getContract } from "~~/helpers/getContract";

const ElectionResults = ({ elections }: { elections: any[] }) => {
  const [results, setResults] = useState<number[]>([]);
  const [electionId, setElectionId] = useState<string>();

  const handleFetchResults = async () => {
    if (!electionId) {
      alert("Select an election first");
      return;
    }

    const contract = await getContract();
    if (!contract) return;

    try {
      const data = await contract.viewResults(electionId);
      setResults(data.map((res: ethers.BigNumber) => res.toNumber()));
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl mb-10">Results</h2>
      <div className="space-y-4">
        <div>
          <select onChange={e => setElectionId(e.target.value)} className="w-full p-2 border rounded">
            <option value="" disabled selected>
              Select an election
            </option>
            {elections.map(election => (
              <option key={election.id} value={election.id}>
                {election.name}
              </option>
            ))}
          </select>
          <ul className="list-disc list-inside">
            {results.map((result, index) => (
              <li key={index}>
                Option {index}: {result} votes
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleFetchResults}
          className="w-full bg-orange-500 py-2 rounded hover:bg-purple-600"
        >
          Fetch Results
        </button>
      </div>
    </div>
  );
};

export default ElectionResults;