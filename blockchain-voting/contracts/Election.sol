// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Election {
    struct Candidate {
        uint id;
        string name;
        string imageUrl; // IPFS image hash/link
        uint voteCount;
    }

    struct ElectionDetails {
        string topic;
        string description;
        address creator;
        mapping(address => bool) voters;
        Candidate[] candidates;
        bool isActive;
    }

    mapping(uint => ElectionDetails) public elections;
    uint public electionCount;

    event ElectionCreated(uint electionId, string topic);
    event VoteCast(uint electionId, uint candidateId, address voter);

    function createElection(string memory _topic, string memory _description, string[] memory candidateNames, string[] memory candidateImages) public {
        electionCount++;
        ElectionDetails storage newElection = elections[electionCount];
        newElection.topic = _topic;
        newElection.description = _description;
        newElection.creator = msg.sender;
        newElection.isActive = true;

        for (uint i = 0; i < candidateNames.length; i++) {
            newElection.candidates.push(Candidate({
                id: i,
                name: candidateNames[i],
                imageUrl: candidateImages[i],
                voteCount: 0
            }));
        }

        emit ElectionCreated(electionCount, _topic);
    }

    function vote(uint _electionId, uint _candidateId) public {
        ElectionDetails storage election = elections[_electionId];
        require(election.isActive, "Election inactive");
        require(!election.voters[msg.sender], "Already voted");

        election.candidates[_candidateId].voteCount++;
        election.voters[msg.sender] = true;

        emit VoteCast(_electionId, _candidateId, msg.sender);
    }

    function getCandidates(uint _electionId) public view returns (Candidate[] memory) {
        return elections[_electionId].candidates;
    }
}
