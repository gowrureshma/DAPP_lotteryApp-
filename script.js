async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];
      document.getElementById("wallet-address").innerText = "Connected: " + walletAddress;
      console.log("Connected wallet:", walletAddress);
    } catch (error) {
      console.error("User rejected the connection:", error);
    }
  } else {
    alert("MetaMask not found. Please install it.");
  }
}
