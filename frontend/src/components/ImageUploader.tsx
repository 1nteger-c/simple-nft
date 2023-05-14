import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { ethers } from 'ethers';

type ImageUploaderProps = {
  signer: ethers.Signer | null;
  wallet: string | null;
};


function ImageUploader({ signer, wallet }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageDBUrl, setImageDBUrl] = useState<String | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fileInputRef.current?.files) {
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        console.error('Failed to upload image:', response);
        return undefined;
      }

      const result = await response.json();
      setImageDBUrl("http://127.0.0.1:8080/img/" + result.imageUrl)
      return result.imageUrl;
    }
  };
  const handleMintClick = async () => {
    if (imageDBUrl) {
      console.log("Image URL:", imageDBUrl);
      const address = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const abi = [
        "function mintNFT(address user, string memory tokenURI) public returns (uint256)",
        "function getTokenIds() public view returns (uint256)",
        "event Mint(address user, uint256 tokenId)"
      ];
      if (!signer) {
        throw new Error("Signer is null.");
      }
      const contract = new ethers.Contract(address, abi, signer);
  
      try {
        const tx = await contract.mintNFT(wallet, imageDBUrl);
        console.log(`Transaction hash: ${tx.hash}`);
      
        const receipt = await provider.waitForTransaction(tx.hash);
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
        setTimeout(async () => {
          const events = await contract.queryFilter(contract.filters.Mint(), receipt.blockNumber, receipt.blockNumber);
          if (events.length > 0) {
            const event = events[0];
            if (event.args && event.args.tokenId) {
              console.log(`New NFT minted with tokenId ${event.args.tokenId.toString()}`);
              alert(`The transaction succeeded - tokenId : ${event.args.tokenId.toString()}`);
            } else {
              console.log("Event found but tokenId not present");
            }
          } else {
            console.log("Failed to find Mint event in receipt");
          }
        
        }, 5000); // wait 5 seconds before checking for event
      } catch (error) {
        console.error("Error minting NFT:", error);
      }    
    
    } else {
      alert("Upload image first")
      console.log("Upload img first");
    }
  };
    
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width: "500px",
          height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          border: "2px solid black",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Uploaded image"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <span style={{ color: "gray" }}>No image uploaded</span>
        )}
      </div>
        <div style={{ display: "flex", marginTop: "16px" }}>
          <form onSubmit={onSubmit}>
            <input type="file" ref={fileInputRef} onChange={handleFileInputChange} />
            <button type="submit">Upload</button>
          </form>
          <button style={{ marginLeft: "8px" }} onClick={handleMintClick}>
            Mint!
          </button>
        </div>
      
    </div>
  );
}

export default ImageUploader;
