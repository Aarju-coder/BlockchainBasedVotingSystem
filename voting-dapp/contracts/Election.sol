// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Election {
    struct Candidate {
        string name;
        string imageHash; // IPFS image hash
        uint voteCount;
    }

    string public title;
    string public description;
    uint public endTime;
    address public creator;
    bool public isFinalized;
    uint public voterCount;

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;

    event CandidateAdded(uint index, string name);
    event VoteCasted(address voter, uint candidateIndex);
    event ElectionFinalized();

    modifier onlyCreator() {
        require(msg.sender == creator, "Not the election creator");
        _;
    }

    modifier electionOpen() {
        require(
            block.timestamp < endTime && !isFinalized,
            "Election is closed"
        );
        _;
    }

    constructor(
        address _creator,
        string memory _title,
        string memory _description,
        uint _durationMinutes
    ) {
        creator = _creator;
        title = _title;
        description = _description;
        endTime = block.timestamp + (_durationMinutes * 1 minutes);
        isFinalized = false;
        voterCount = 0;
    }

    function addCandidate(
        string memory _name,
        string memory _imageHash
    ) external onlyCreator {
        candidates.push(Candidate(_name, _imageHash, 0));
        emit CandidateAdded(candidates.length - 1, _name);
    }

    function vote(uint _candidateIndex) external electionOpen {
        require(!hasVoted[msg.sender], "Already voted");
        require(_candidateIndex < candidates.length, "Invalid candidate");

        candidates[_candidateIndex].voteCount += 1;
        hasVoted[msg.sender] = true;
        voterCount++;
        emit VoteCasted(msg.sender, _candidateIndex);
    }

    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    function finalizeElection() external onlyCreator {
        require(block.timestamp >= endTime, "Election still running");
        isFinalized = true;
        emit ElectionFinalized();
    }

    function getCandidateCount() public view returns (uint) {
        return candidates.length;
    }

    function getTotalVotes() public view returns (uint total) {
        for (uint i = 0; i < candidates.length; i++) {
            total += candidates[i].voteCount;
        }
    }

    function getVoterCount() public view returns (uint) {
        return voterCount;
    }
}