import { useState } from "react";
import { getContract } from "~~/helpers/getContract";

const CreateElection = ({ onCreate }: { onCreate: () => void }) => {
  const [electionTitle, setElectionTitle] = useState<string>("");
  const [options, setOptions] = useState<string[]>([""]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };


  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleCreateElection = async () => {
    if (electionTitle === "") {
      alert("Please fill out election title field.");
      return;
    }

    if (options.some(option => option.trim() === "")) {
      alert("Please fill out all option fields.");
      return;
    }

    const contract = await getContract();
    if (!contract) return;

    try {
      const tx = await contract.initializeElection(electionTitle, options, 60 * 60);
      await tx.wait();
      alert("Election created successfully!");
      onCreate();
      setElectionTitle("");
      setOptions([]);
    } catch (error) {
      console.error("Error creating election:", error);
    }
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl mb-10">Create</h2>
      <div className="space-y-5">
        <input
          type="text"
          placeholder="Title"
          value={electionTitle}
          onChange={e => setElectionTitle(e.target.value)}
        />
        <div className="space-y-1">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={option}
                onChange={e => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleAddOption}
          className="bg-pink-600"
        >
          Add Option
        </button>
        <button
          onClick={handleCreateElection}
          className="bg-indigo-600"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateElection;