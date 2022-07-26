// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

// import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract Fundraiser is Ownable {
    using SafeMath for uint256;

    struct Donations {
        uint256 value;
        uint256 factor;
        uint256 date;
    }
    mapping(address => Donations[]) private _donations;
    string public name;
    string public url;
    string public image;
    string public desc;
    address payable public beneficiary;

    uint256 public totalDonations;
    uint256 public donationsCount;

    constructor(
        string memory _name,
        string memory _url,
        string memory _image,
        string memory _desc,
        address payable _beneficiary,
        address _custodian
    ) public {
        name = _name;
        url = _url;
        image = _image;
        desc = _desc;
        beneficiary = _beneficiary;
        _transferOwnership(_custodian);
    }

    function setBeneficiary(address payable _beneficiary) public onlyOwner {
        beneficiary = _beneficiary;
    }

    function getDonationCount() public view returns (uint256) {
        return _donations[msg.sender].length;
    }

    function donate() public payable {
        Donations memory donation = Donations({
            value: msg.value,
            factor: 0,
            date: block.timestamp
        });
        _donations[msg.sender].push(donation);
        totalDonations = totalDonations.add(msg.value);
        donationsCount++;
    }

    function myDonations()
        public
        view
        returns (uint256[] memory values, uint256[] memory dates)
    {
        uint256 count = getDonationCount();
        values = new uint256[](count);
        dates = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            Donations storage donation = _donations[msg.sender][i];
            values[i] = donation.value;
            dates[i] = donation.date;
        }
        return (values, dates);
    }
}
