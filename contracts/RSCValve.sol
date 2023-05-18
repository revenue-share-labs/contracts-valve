// SPDX-License-Identifier: BSL 1.1

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interfaces/IFeeFactory.sol";
import "./interfaces/IRecursiveRSC.sol";

/// Throw when if sender is not distributor
error OnlyDistributorError();

/// Throw when sender is not controller
error OnlyControllerError();

/// Throw when transaction fails
error TransferFailedError();

/// Throw when submitted recipient with address(0)
error NullAddressError();

/// Throw if recipient is already in contract
error RecipientAlreadyAddedError();

/// Throw when percentage is not 100%
error InvalidPercentageError(uint256);

/// Throw when change is triggered for immutable recipients
error ImmutableRecipientsError();

/// Throw when renounce ownership is called
error RenounceOwnershipForbidden();

/// Throw when amount to distribute is less than BASIS_POINT
error TooLowValueToRedistribute();

/// @title RSCValve contract.
/// @notice The main function of RSCValve is to redistribute tokens
/// (whether they are ERC-20 or native cryptocurrency), to the participants
/// based on the percentages assigned to them.
contract RSCValve is OwnableUpgradeable {
    using SafeERC20 for IERC20;

    /// Measurement unit 10000000 = 100%.
    uint256 public constant BASIS_POINT = 10000000;

    /// Max amount of recipients for auto-distribution.
    uint256 public constant AUTO_DISTRIBUTION_MAX_RECIPIENTS = 35;

    /// distributorAddress => isDistributor
    mapping(address => bool) public distributors;

    /// Controller address
    address public controller;

    /// If true, `recipients` array cant be updated.
    bool public isImmutableRecipients;

    /// If true, received native currency will be auto distributed.
    bool public isAutoNativeCurrencyDistribution;

    /// Minimum amount of native currency to trigger auto distribution.
    uint256 public minAutoDistributionAmount;

    /// Platform fee percentage.
    uint256 public platformFee;

    /// Factory address.
    IFeeFactory public factory;

    /// Array of the recipients.
    address payable[] public recipients;

    /// recipientAddress => recipientPercentage
    mapping(address => uint256) public recipientsPercentage;

    /// Contains recipient address and their percentage in rev share.
    struct RecipientData {
        address payable addrs;
        uint256 percentage;
    }

    /// Emitted when recipients and their percentages are set.
    event SetRecipients(RecipientData[] recipients);

    /// Emitted when token distribution is triggered.
    event DistributeToken(IERC20 token, uint256 amount);

    /// Emitted when distributor status is set.
    event Distributor(address distributor, bool isDistributor);

    /// Emitted when new controller address is set.
    event Controller(address newController);

    /// Emitted when new `minAutoDistributionAmount` is set.
    event MinAutoDistributionAmount(uint256 newAmount);

    /// Emitted when `isAutoNativeCurrencyDistribution` is set.
    event AutoNativeCurrencyDistribution(bool newValue);

    /// Emitted when recipients set immutable.
    event ImmutableRecipients(bool isImmutableRecipients);

    /**
     * @dev Checks whether sender is distributor.
     */
    modifier onlyDistributor() {
        if (distributors[msg.sender] == false) {
            revert OnlyDistributorError();
        }
        _;
    }

    /**
     * @dev Checks whether sender is controller.
     */
    modifier onlyController() {
        if (msg.sender != controller) {
            revert OnlyControllerError();
        }
        _;
    }

    receive() external payable {
        // Check whether automatic native currency distribution is enabled
        // and that contractBalance is more than automatic distribution threshold
        // and that amount of recipients is less than AUTO_DISTRIBUTION_MAX_RECIPIENTS
        uint256 contractBalance = address(this).balance;
        if (
            isAutoNativeCurrencyDistribution &&
            contractBalance >= minAutoDistributionAmount &&
            recipients.length <= AUTO_DISTRIBUTION_MAX_RECIPIENTS
        ) {
            _redistributeNativeCurrency(contractBalance);
        }
    }

    /**
     * @dev Constructor function, can be called only once.
     * @param _owner Owner of the contract.
     * @param _controller Address which control setting / removing recipients.
     * @param _distributors List of addresses which can distribute ERC20 tokens or native currency.
     * @param _isImmutableRecipients Flag indicating whether recipients could be changed.
     * @param _isAutoNativeCurrencyDistribution Flag indicating whether native currency will be automatically distributed or manually.
     * @param _minAutoDistributionAmount Minimum native currency amount to trigger auto native currency distribution.
     * @param _platformFee Percentage defining fee for distribution services.
     * @param _recipients Array of `RecipientData` structs with recipient address and percentage.
     */
    function initialize(
        address _owner,
        address _controller,
        address[] memory _distributors,
        bool _isImmutableRecipients,
        bool _isAutoNativeCurrencyDistribution,
        uint256 _minAutoDistributionAmount,
        uint256 _platformFee,
        RecipientData[] calldata _recipients
    ) external initializer {
        uint256 distributorsLength = _distributors.length;
        for (uint256 i = 0; i < distributorsLength; ) {
            address distributor = _distributors[i];
            if (distributor == address(0)) {
                revert NullAddressError();
            }
            emit Distributor(distributor, true);
            distributors[distributor] = true;
            unchecked {
                i++;
            }
        }

        emit Controller(_controller);
        controller = _controller;

        emit AutoNativeCurrencyDistribution(_isAutoNativeCurrencyDistribution);
        isAutoNativeCurrencyDistribution = _isAutoNativeCurrencyDistribution;

        emit MinAutoDistributionAmount(_minAutoDistributionAmount);
        minAutoDistributionAmount = _minAutoDistributionAmount;

        factory = IFeeFactory(msg.sender);
        platformFee = _platformFee;

        _setRecipients(_recipients);
        emit ImmutableRecipients(_isImmutableRecipients);
        isImmutableRecipients = _isImmutableRecipients;

        _transferOwnership(_owner);
    }

    /**
     * @notice External function to redistribute native currency.
     */
    function redistributeNativeCurrency() external onlyDistributor {
        _redistributeNativeCurrency(address(this).balance);
    }

    /**
     * @notice External function for setting recipients.
     * @param _recipients Array of `RecipientData` structs with recipient address and percentage.
     */
    function setRecipients(RecipientData[] calldata _recipients) external onlyController {
        _setRecipients(_recipients);
    }

    /**
     * @notice External function for setting immutable recipients.
     * @param _recipients Array of `RecipientData` structs with recipient address and percentage.
     */
    function setRecipientsExt(
        RecipientData[] calldata _recipients
    ) external onlyController {
        _setRecipients(_recipients);
        _setImmutableRecipients();
    }

    /**
     * @notice External function to redistribute ERC20 token based on percentages assign to the recipients.
     * @param _token Address of the ERC20 token to be distribute.
     */
    function redistributeToken(IERC20 _token) external onlyDistributor {
        if (address(_token) == address(0)) {
            revert NullAddressError();
        }

        uint256 contractBalance = _token.balanceOf(address(this));
        uint256 fee = (contractBalance * platformFee) / BASIS_POINT;
        if (fee > 0) {
            address payable platformWallet = factory.platformWallet();
            if (platformWallet != address(0)) {
                contractBalance -= fee;
                _token.safeTransfer(platformWallet, fee);
            }
        }

        emit DistributeToken(_token, contractBalance);

        uint256 recipientsLength = recipients.length;
        for (uint256 i = 0; i < recipientsLength; ) {
            address payable recipient = recipients[i];
            uint256 percentage = recipientsPercentage[recipient];
            uint256 amountToReceive = (contractBalance * percentage) / BASIS_POINT;
            _token.safeTransfer(recipient, amountToReceive);
            _recursiveERC20Distribution(recipient, _token);
            unchecked {
                i++;
            }
        }
    }

    /**
     * @notice External function to set distributor address.
     * @param _distributor Address of new distributor.
     * @param _isDistributor Bool indicating whether address is / isn't distributor.
     */
    function setDistributor(
        address _distributor,
        bool _isDistributor
    ) external onlyOwner {
        if (_distributor == address(0)) {
            revert NullAddressError();
        }
        bool isDistributor = distributors[_distributor];
        if (isDistributor != _isDistributor) {
            emit Distributor(_distributor, _isDistributor);
            distributors[_distributor] = _isDistributor;
        }
    }

    /**
     * @notice External function to set controller address.
     * @param _controller Address of new controller.
     */
    function setController(address _controller) external onlyOwner {
        if (_controller == address(0)) {
            revert NullAddressError();
        }
        if (controller != _controller) {
            emit Controller(_controller);
            controller = _controller;
        }
    }

    /**
     * @notice External function for setting immutable recipients to true.
     */
    function setImmutableRecipients() external onlyOwner {
        if (isImmutableRecipients) {
            revert ImmutableRecipientsError();
        }

        _setImmutableRecipients();
    }

    /**
     * @notice External function for setting auto native currency distribution.
     * @param _isAutoNativeCurrencyDistribution Bool switching whether auto native currency distribution is enabled.
     */
    function setAutoNativeCurrencyDistribution(
        bool _isAutoNativeCurrencyDistribution
    ) external onlyOwner {
        if (isAutoNativeCurrencyDistribution != _isAutoNativeCurrencyDistribution) {
            emit AutoNativeCurrencyDistribution(_isAutoNativeCurrencyDistribution);
            isAutoNativeCurrencyDistribution = _isAutoNativeCurrencyDistribution;
        }
    }

    /**
     * @notice External function for setting minimun auto distribution amount.
     * @param _minAutoDistributionAmount New minimum distribution amount.
     */
    function setMinAutoDistributionAmount(
        uint256 _minAutoDistributionAmount
    ) external onlyOwner {
        if (_minAutoDistributionAmount < BASIS_POINT) {
            revert TooLowValueToRedistribute();
        }
        if (minAutoDistributionAmount != _minAutoDistributionAmount) {
            emit MinAutoDistributionAmount(_minAutoDistributionAmount);
            minAutoDistributionAmount = _minAutoDistributionAmount;
        }
    }

    /**
     * @notice External function to return number of recipients.
     */
    function numberOfRecipients() external view returns (uint256) {
        return recipients.length;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership is forbidden for RSC contract.
     */
    function renounceOwnership() public view override onlyOwner {
        revert RenounceOwnershipForbidden();
    }

    /**
     * @notice Internal function for adding recipient to revenue share.
     * @param _recipient Recipient address.
     * @param _percentage Recipient percentage.
     */
    function _addRecipient(address payable _recipient, uint256 _percentage) internal {
        if (_recipient == address(0)) {
            revert NullAddressError();
        }
        if (recipientsPercentage[_recipient] != 0) {
            revert RecipientAlreadyAddedError();
        }
        recipients.push(_recipient);
        recipientsPercentage[_recipient] = _percentage;
    }

    /**
     * @notice Internal function for removing all recipients.
     */
    function _removeAll() internal {
        uint256 recipientsLength = recipients.length;

        if (recipientsLength == 0) {
            return;
        }

        for (uint256 i = 0; i < recipientsLength; ) {
            address recipient = recipients[i];
            recipientsPercentage[recipient] = 0;
            unchecked {
                i++;
            }
        }
        delete recipients;
    }

    /**
     * @notice Internal function for setting recipients.
     * @param _recipients Array of `RecipientData` structs with recipient address and percentage.
     */
    function _setRecipients(RecipientData[] calldata _recipients) internal {
        if (isImmutableRecipients) {
            revert ImmutableRecipientsError();
        }

        _removeAll();

        uint256 percentageSum;
        uint256 newRecipientsLength = _recipients.length;
        for (uint256 i = 0; i < newRecipientsLength; ) {
            uint256 percentage = _recipients[i].percentage;
            _addRecipient(_recipients[i].addrs, percentage);
            percentageSum += percentage;
            unchecked {
                i++;
            }
        }

        if (percentageSum != BASIS_POINT) {
            revert InvalidPercentageError(percentageSum);
        }

        emit SetRecipients(_recipients);
    }

    /**
     * @notice Internal function for setting immutable recipients to true.
     * @dev Can only be called from controller or contract owner via
     * `setImmutableRecipients()` or `setRecipientsExt()`
     */
    function _setImmutableRecipients() internal {
        if (!isImmutableRecipients) {
            emit ImmutableRecipients(true);
            isImmutableRecipients = true;
        }
    }

    /**
     * @notice Internal function to redistribute native currency.
     * @param _valueToDistribute Native currency amount to be distributed.
     */
    function _redistributeNativeCurrency(uint256 _valueToDistribute) internal {
        uint256 fee = (_valueToDistribute * platformFee) / BASIS_POINT;

        if (_valueToDistribute + fee < BASIS_POINT) {
            revert TooLowValueToRedistribute();
        }

        if (fee > 0) {
            address payable platformWallet = factory.platformWallet();
            if (platformWallet != address(0)) {
                _valueToDistribute -= fee;
                (bool success, ) = platformWallet.call{ value: fee }("");
                if (!success) {
                    revert TransferFailedError();
                }
            }
        }

        uint256 recipientsLength = recipients.length;
        for (uint256 i = 0; i < recipientsLength; ) {
            address payable recipient = recipients[i];
            uint256 percentage = recipientsPercentage[recipient];
            uint256 amountToReceive = (_valueToDistribute * percentage) / BASIS_POINT;
            (bool success, ) = payable(recipient).call{ value: amountToReceive }("");
            if (!success) {
                revert TransferFailedError();
            }
            _recursiveNativeCurrencyDistribution(recipient);
            unchecked {
                i++;
            }
        }
    }

    /**
     * @notice Internal function to check whether recipient should be recursively distributed.
     * @param _recipient Address of recipient to recursively distribute.
     * @param _token Token to be distributed.
     */
    function _recursiveERC20Distribution(address _recipient, IERC20 _token) internal {
        // Wallets have size 0 and contracts > 0. This way we can distinguish them.
        uint256 recipientSize;
        assembly {
            recipientSize := extcodesize(_recipient)
        }
        if (recipientSize > 0) {
            IRecursiveRSC recursiveRecipient = IRecursiveRSC(_recipient);
            // Validate this contract is distributor in child recipient
            try recursiveRecipient.distributors(address(this)) returns (
                bool isBranchDistributor
            ) {
                if (isBranchDistributor) {
                    recursiveRecipient.redistributeToken(_token);
                }
            } catch {
                return;
            } // unable to recursively distribute
        }
    }

    /**
     * @notice Internal function to check whether recipient should be recursively distributed.
     * @param _recipient Address of recipient to recursively distribute.
     */
    function _recursiveNativeCurrencyDistribution(address _recipient) internal {
        // Wallets have size 0 and contracts > 0. This way we can distinguish them.
        uint256 recipientSize;
        assembly {
            recipientSize := extcodesize(_recipient)
        }
        if (recipientSize > 0) {
            IRecursiveRSC recursiveRecipient = IRecursiveRSC(_recipient);
            // Check whether child recipient have autoNativeCurrencyDistribution set to true,
            // if yes tokens will be recursively distributed automatically
            try recursiveRecipient.isAutoNativeCurrencyDistribution() returns (
                bool childAutoNativeCurrencyDistribution
            ) {
                if (childAutoNativeCurrencyDistribution == true) {
                    return;
                }
            } catch {
                return;
            }

            // Validate this contract is distributor in child recipient
            try recursiveRecipient.distributors(address(this)) returns (
                bool isBranchDistributor
            ) {
                if (isBranchDistributor) {
                    recursiveRecipient.redistributeNativeCurrency();
                }
            } catch {
                return;
            } // unable to recursively distribute
        }
    }
}
