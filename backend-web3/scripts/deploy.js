(async () => {
    const NFTContract = await ethers.getContractFactory("NFT_CS492")
    
    const NFT = await NFTContract.deploy()
    await NFT.deployed()

    console.log(`NFT : ${NFT.address}`);

})();

