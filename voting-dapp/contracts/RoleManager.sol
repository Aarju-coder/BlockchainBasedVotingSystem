// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract RoleManager is AccessControl {
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");
    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");
    bytes32 public constant OBSERVER_ROLE = keccak256("OBSERVER_ROLE");

    function grantCreatorRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(CREATOR_ROLE, account);
    }

    function grantVoterRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(VOTER_ROLE, account);
    }

    function grantObserverRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(OBSERVER_ROLE, account);
    }

    function hasCreatorRole(address account) public view returns (bool) {
        return hasRole(CREATOR_ROLE, account);
    }

    function hasVoterRole(address account) public view returns (bool) {
        return hasRole(VOTER_ROLE, account);
    }

    function hasObserverRole(address account) public view returns (bool) {
        return hasRole(OBSERVER_ROLE, account);
    }
}
