"use client";

import { useEffect, useState } from "react";
import { getContract } from "~~/helpers/getContract";
import CreateElection from "~~/components/CreateElection";
import VoteElection from "~~/components/VoteElection";
import ElectionResults from "~~/components/ElectionResults";

export default function Home() {
  const [elections, setElections] = useState<any[]>([]);

  const fetchElections = async () => {
    const contract = await getContract();
    if (!contract) return;

    try {
      const [names, endTimes, choices] = await contract.listElections();
      setElections(
        names.map((name: string, index: number) => ({
          id: index,
          name,
          endTime: new Date(endTimes[index].toNumber() * 1000).toLocaleString(),
          choices: choices[index],
        })),
      );
    } catch (error) {
      console.error("Error fetching elections:", error);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-4xl space-y-10">
        <CreateElection onCreate={fetchElections} />
        <VoteElection elections={elections} onVoteSuccess={fetchElections} />
        <ElectionResults elections={elections} />
      </div>
    </div>
  );
}
