async function main() {
    const NFTour = await ethers.getContractFactory("NFTour")
  
    // Start deployment, returning a promise that resolves to a contract object
    const nftTour = await NFTour.deploy()
    console.log("Contract deployed to address:", nftTour.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  