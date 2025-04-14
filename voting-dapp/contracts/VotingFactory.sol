// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Election.sol";
import "./RoleManager.sol";

contract VotingFactory is RoleManager {
    address[] public elections;

    event ElectionCreated(
        address indexed electionAddress,
        address indexed creator,
        string title
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CREATOR_ROLE, msg.sender);
    }

    function createElection(
        string memory _title,
        string memory _description,
        uint _durationMinutes
    ) external onlyRole(CREATOR_ROLE) {
        Election newElection = new Election(
            msg.sender,
            _title,
            _description,
            _durationMinutes
        );
        elections.push(address(newElection));
        emit ElectionCreated(address(newElection), msg.sender, _title);
    }

    function getAllElections() external view returns (address[] memory) {
        return elections;
    }

    function getElectionCount() external view returns (uint) {
        return elections.length;
    }

    function getActiveElectionCount() public view returns (uint) {
        uint count = 0;
        for (uint i = 0; i < elections.length; i++) {
            Election e = Election(elections[i]);
            if (block.timestamp < e.endTime() && !e.isFinalized()) {
                count++;
            }
        }
        return count;
    }

    function getTotalVotesCast() public view returns (uint totalVotes) {
        totalVotes = 0;
        for (uint i = 0; i < elections.length; i++) {
            Election e = Election(elections[i]);
            totalVotes += e.getTotalVotes();
        }
    }

    function getUniqueVotersCount() public view returns (uint totalVoters) {
        totalVoters = 0;
        for (uint i = 0; i < elections.length; i++) {
            Election e = Election(elections[i]);
            totalVoters += e.getVoterCount();
        }
    }
}
