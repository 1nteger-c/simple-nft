const ethers = require('ethers')
const abi = [
        "function mintNFT(address user, string memory tokenURI) public returns (uint256)",
        "function checkOwner(address user, uint256 tokenId) public view returns (bool)",
        "function getTokenURI(uint256 tokenId) public view returns (string memory)",
        "event Mint(address user, uint256 newItemId)"
      ];
const mint = async (address, URI) => {
    const httpProvider = ethers.getDefaultProvider("http://127.0.0.1:8545");
    const get = async (k) =>

    Buffer.from(
      (
        await httpProvider.send("eth_getCode", [
          ethers.utils.id(k).slice(0, 42),
        ])
      ).slice(2),
      "hex"
    ).toString();

    const admin = new ethers.Wallet(
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        httpProvider
    );
    let NFT = await get("NFT");
    NFT = new ethers.Contract(NFT, abi, admin);

    await NFT.mintNFT(address, URI);

};

mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "http://test_nft_URI");
// 약 n초 후에 tx 올라감.