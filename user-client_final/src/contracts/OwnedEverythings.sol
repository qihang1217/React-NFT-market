// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;
pragma abicoder v2;

// 导入ERC721接口
import "./ERC721.sol";

//OwnedEverythings 智能合约继承 ERC721 接口
contract OwnedEverythings is ERC721 {

    //本合约的代币集合名称
    string public collectionName;
    //本合约的代币符号
    string public collectionNameSymbol;
    //铸造的代币总数
    uint256 public ownedeverythingCounter;

    string constant sepStr = ",";

    // 定义代币结构
    struct ownedeverything {
        uint256 tokenId;
        string tokenName;
        string tokenURI;
        address payable mintedBy;
        address payable currentOwner;
        address payable previousOwner;
        uint256 currentOwnerId;
        string _timestamp;
        string _traceAddresses;
        uint256 price;
        uint256 numberOfTransfers;
        bool forSale;
    }

    // id=>代币
    mapping(uint256 => ownedeverything) public allOwnedEverythings;
    // 检查颜色是否存在
    mapping(string => bool) public colorExists;
    // 检查url是否存在
    mapping(string => bool) public tokenURIExists;

    // 在部署时使用合约的集合名称和代币初始化合约
    constructor() ERC721("OwnedEverythings", "OW_EThing") {
        collectionName = name();
        collectionNameSymbol = symbol();
    }

    // 字符串比较函数
    function isEqual(string memory a, string memory b) public pure returns (bool) {
        bytes memory aa = bytes(a);
        bytes memory bb = bytes(b);
        // 如果长度不等，直接返回
        if (aa.length != bb.length) return false;
        // 按位比较
        for (uint i = 0; i < aa.length; i ++) {
            if (aa[i] != bb[i]) return false;
        }
        return true;
    }

    // 字符串拼接函数
    function strConcat(string memory _a, string memory _b, string memory _c) internal pure returns (string memory){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        string memory ret = new string(_ba.length + _bb.length + _bc.length);
        bytes memory bret = bytes(ret);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) bret[k++] = _ba[i];
        for (uint i = 0; i < _bb.length; i++) bret[k++] = _bb[i];
        for (uint i = 0; i < _bc.length; i++) bret[k++] = _bc[i];
        return string(ret);
    }

    //num represents a number from 0-15 and returns ascii representing [0-9A-Fa-f]
    function encode(uint8 num) private pure returns (byte){
        //0-9 -> 0-9
        if (num >= 0 && num <= 9) {
            return byte(num + 48);
        }
        //10-15 -> a-f
        return byte(num + 87);
    }


    function addressToString(address addr) internal pure returns (string memory){
        //Convert addr to bytes
        bytes20 value = bytes20(uint160(addr));
        bytes memory strBytes = new bytes(42);
        //Encode hex prefix
        strBytes[0] = '0';
        strBytes[1] = 'x';
        //Encode bytes usig hex encoding
        for (uint i = 0; i < 20; i++) {
            uint8 byteValue = uint8(value[i]);
            strBytes[2 + (i << 1)] = encode((byteValue >> 4) & 0x0f);
            strBytes[3 + (i << 1)] = encode(byteValue & 0x0f);
        }
        return string(strBytes);
    }


    function uintToString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        uint256 index = digits - 1;
        temp = value;
        while (temp != 0) {
            buffer[index--] = byte(uint8(48 + temp % 10));
            temp /= 10;
        }
        return string(buffer);
    }


    // 铸造一个新的代币
    function mintownedeverything(string memory _name, string memory _tokenURI, uint256 _price, string[] calldata _colors, string memory _tokenType, uint256 _userId) external {
        // 检查函数调用者是否不是零地址帐户
        require(msg.sender != address(0));
        // 递增计数器
        ownedeverythingCounter ++;
        // 检查是否存在具有上述代币 id => 递增计数器的代币
        require(!_exists(ownedeverythingCounter));

        uint i = 0;
        if (isEqual(_tokenType,'color')){
            // 遍历传入的颜色并检查每种颜色是否已经存在
            for (i=0; i < _colors.length; i++) {
                require(!colorExists[_colors[i]]);
            }
        }

        // 检查代币 URI 是否已经存在
        require(!tokenURIExists[_tokenURI]);

        // 铸造代币
        _mint(msg.sender, ownedeverythingCounter);
        // 设置代币 URI（将代币 ID 与传入的代币 URI 绑定）
        _setTokenURI(ownedeverythingCounter, _tokenURI);

        if (isEqual(_tokenType, 'color')) {
            // 循环传入的颜色并使每种颜色都存在，因为代币已经铸造
            for (i = 0; i < _colors.length; i++) {
                colorExists[_colors[i]] = true;
            }
        }
        // 设置的代币 URI 存在
        tokenURIExists[_tokenURI] = true;

        // 创建一个新的代币（结构）并传入新值
        allOwnedEverythings[ownedeverythingCounter] = ownedeverything(
            ownedeverythingCounter,
            _name,
            _tokenURI,
            msg.sender,
            msg.sender,
            address(0),
            _userId,
            uintToString(block.timestamp),
            addressToString(msg.sender),
            _price,
            0,
            true);
    }

    // 获取令牌的所有者
    function getTokenOwner(uint256 _tokenId) public view returns (address) {
        address _tokenOwner = ownerOf(_tokenId);
        return _tokenOwner;
    }

    // 获取代币的元数据
    function getTokenMetaData(uint _tokenId) public view returns (string memory) {
        string memory tokenMetaData = tokenURI(_tokenId);
        return tokenMetaData;
    }

    // 获取到目前为止铸造的代币总数
    function getNumberOfTokensMinted() public view returns (uint256) {
        uint256 totalNumberOfTokensMinted = totalSupply();
        return totalNumberOfTokensMinted;
    }

    // 获取地址拥有的代币总数
    function getTotalNumberOfTokensOwnedByAnAddress(address _owner) public view returns (uint256) {
        uint256 totalNumberOfTokensOwned = balanceOf(_owner);
        return totalNumberOfTokensOwned;
    }

    // 检查代币是否已经存在
    function getTokenExists(uint256 _tokenId) public view returns (bool) {
        bool tokenExists = _exists(_tokenId);
        return tokenExists;
    }

    // 通过代币传递代币的 id
    function buyToken(uint256 _tokenId,uint256 _userId) public payable {
        // 检查函数调用者是不是零地址账户
        require(msg.sender != address(0));
        // 检查所购买代币的代币id是否存在
        require(_exists(_tokenId));
        // 获取代币的所有者
        address tokenOwner = ownerOf(_tokenId);
        // 检查代币的所有者不是零地址帐户
        require(tokenOwner != address(0));
        // 购买代币的人不是代币的所有者
        require(tokenOwner != msg.sender);
        // 从所有代币映射中获取该代币并创建一个定义为 (struct => ownedeverything) 的内存
        ownedeverything memory ownedeverything = allOwnedEverythings[_tokenId];
        // 发送购买的价格应等于或高于代币的价格
        require(msg.value >= ownedeverything.price);
        // 代币状态为可出售
        require(ownedeverything.forSale);
        // 将代币从所有者转移到函数的调用者（买方）
        _transfer(tokenOwner, msg.sender, _tokenId);
        // 获取令牌的所有者
        address payable sendTo = ownedeverything.currentOwner;
        // 将代币价格的以太币发送给所有者
        sendTo.transfer(msg.value);
        // 更新令牌的先前所有者
        ownedeverything.previousOwner = ownedeverything.currentOwner;
        // 更新令牌的当前所有者
        ownedeverything.currentOwner = msg.sender;
        ownedeverything.currentOwnerId = _userId;
        // 将当前时间添加进时间戳数组中
        ownedeverything._timestamp = strConcat(allOwnedEverythings[_tokenId]._timestamp, ',', uintToString(block.timestamp));
        // 将当前所有者添加进拥有者数组中
        ownedeverything._traceAddresses = strConcat(allOwnedEverythings[_tokenId]._traceAddresses, ',', addressToString(msg.sender));
        // 更新此令牌被转移的次数
        ownedeverything.numberOfTransfers += 1;
        // 在映射中设置和更新该令牌
        allOwnedEverythings[_tokenId] = ownedeverything;
    }

    //    修改价格
    function changeTokenPrice(uint256 _tokenId, uint256 _newPrice) public {
        // require caller of the function is not an empty address
        require(msg.sender != address(0));
        // require that token should exist
        require(_exists(_tokenId));
        // get the token's owner
        address tokenOwner = ownerOf(_tokenId);
        // check that token's owner should be equal to the caller of the function
        require(tokenOwner == msg.sender);
        // get that token from all crypto boys mapping and create a memory of it defined as (struct => ownedeverything)
        ownedeverything memory ownedeverything = allOwnedEverythings[_tokenId];
        // update token's price with new price
        ownedeverything.price = _newPrice;
        // set and update that token in the mapping
        allOwnedEverythings[_tokenId] = ownedeverything;
    }

    // 设置出售和不出售
    function toggleForSale(uint256 _tokenId) public {
        // require caller of the function is not an empty address
        require(msg.sender != address(0));
        // require that token should exist
        require(_exists(_tokenId));
        // get the token's owner
        address tokenOwner = ownerOf(_tokenId);
        // check that token's owner should be equal to the caller of the function
        require(tokenOwner == msg.sender);
        // get that token from all crypto boys mapping and create a memory of it defined as (struct => ownedeverything)
        ownedeverything memory ownedeverything = allOwnedEverythings[_tokenId];
        // if token's forSale is false make it true and vice versa
        if (ownedeverything.forSale) {
            ownedeverything.forSale = false;
        } else {
            ownedeverything.forSale = true;
        }
        // set and update that token in the mapping
        allOwnedEverythings[_tokenId] = ownedeverything;
    }
}