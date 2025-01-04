// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ElectionSystem {
    struct VoterRecord {
        address voterAddress;
        uint256 selectedOption;
    }

    struct ElectionDetails {
        string title;
        string[] choices;
        uint256 closingTime;
        mapping(address => bool) hasCastVote;
        mapping(uint256 => uint256) voteCounts;
    }

    ElectionDetails[] public electionsList;

    function initializeElection(
        string memory _title,
        string[] memory _choices,
        uint256 _votingDuration
    ) public {
        ElectionDetails storage newElection = electionsList.push();
        newElection.title = _title;
        newElection.choices = _choices;
        newElection.closingTime = block.timestamp + _votingDuration;
    }

    function listElections()
        public
        view
        returns (
            string[] memory titles,
            uint256[] memory closingTimes,
            string[][] memory choicesList
        )
    {
        uint256 totalElections = electionsList.length;
        titles = new string[](totalElections);
        closingTimes = new uint256[](totalElections);
        choicesList = new string[][](totalElections);

        for (uint256 i = 0; i < totalElections; i++) {
            titles[i] = electionsList[i].title;
            closingTimes[i] = electionsList[i].closingTime;
            choicesList[i] = electionsList[i].choices;
        }
    }

    function castVote(uint256 _electionIndex, uint256 _optionIndex) public {
        ElectionDetails storage election = electionsList[_electionIndex];

        require(block.timestamp < election.closingTime, "Voting period has ended");
        require(!election.hasCastVote[msg.sender], "Vote already cast");

        election.hasCastVote[msg.sender] = true;
        election.voteCounts[_optionIndex]++;
    }

    function viewResults(uint256 _electionIndex)
        public
        view
        returns (uint256[] memory)
    {
        ElectionDetails storage election = electionsList[_electionIndex];
        uint256[] memory results = new uint256[](election.choices.length);

        for (uint256 i = 0; i < election.choices.length; i++) {
            results[i] = election.voteCounts[i];
        }
        return results;
    }

    function listChoices(uint256 _electionIndex)
        public
        view
        returns (string[] memory)
    {
        ElectionDetails storage election = electionsList[_electionIndex];
        return election.choices;
    }
}
