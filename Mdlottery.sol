// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; // Keep this pragma or update it in hardhat.config.js to match

contract Mdlottery {
    // manager is in charge of the contract
    address public manager;
    // new player in the contract using array[] to unlimit number
    address payable[] public players;
    address payable public winner; // Stores the last lottery winner

    // Events to log actions for off-chain monitoring
    event PlayerParticipated(address indexed playerAddress, uint256 amountPaid);
    event WinnerPicked(address indexed winnerAddress, uint256 prizeAmount, uint256 randomIndex);
    event LotteryReset();

    // Default Constructor
    constructor() {
        manager = msg.sender;
    }

    // Modifier to restrict access to only the manager
    modifier onlyManager() {
        require(msg.sender == manager, "Mdlottery: You are not the manager");
        _;
    }

    // Entering the player to the lottery
    function participate() public payable {
        // Each player is compelled to add a certain ETH to join
        require(msg.value > 1 ether, "Mdlottery: Please pay a value greater than 1 Ether");
        players.push(payable(msg.sender));
        emit PlayerParticipated(msg.sender, msg.value);
    }

    // Returns the current balance of the contract
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to get all players in the current lottery
    // This is the function the tests are looking for!
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    // Internal function to generate a pseudo-random number
    // WARNING: This randomness is highly insecure for production use!
    // Miners can manipulate block.timestamp and block.prevrandao.
    // For real dApps, use Chainlink VRF or similar secure oracle solutions.
    function random() internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, players.length, block.prevrandao)));
    }

    // Picks a random winner and sends the prize
    function pickWinner() public onlyManager {
        require(players.length >= 3, "Mdlottery: Requires at least 3 players to pick a winner");

        uint256 r = random();
        uint256 index = r % players.length;

        winner = players[index];
        uint256 prizeAmount = address(this).balance;

        (bool success, ) = winner.call{value: prizeAmount}("");
        require(success, "Mdlottery: Failed to send prize to winner");

        emit WinnerPicked(winner, prizeAmount, index);

        players = new address payable[](0);
        emit LotteryReset();
    }

    // Fallback function to allow receiving Ether directly, if needed.
    receive() external payable {
        // Optional: Add a check here if you want to only allow specific amounts
    }
}
