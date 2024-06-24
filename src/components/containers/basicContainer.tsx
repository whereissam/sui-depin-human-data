import BasicDataField from "../fields/basicDataField";
import BasicInputField from "../fields/basicInputField";
import ActionButton from "../buttons/actionButton";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAccounts, useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { AppContext } from "@/context/AppContext";
// import { TransactionBlock } from "@mysten/sui"
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

const BasicContainer = () => {
  const { walletAddress, suiName } = useContext(AppContext);
  const { data: suiBalance } = useSuiClientQuery("getBalance", {
    owner: walletAddress ?? "",
  });
  const [selectedToken, setSelectedToken] = useState<string>("SUI");
  const client = useSuiClient();
  const [account] = useAccounts();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const userBalance = useMemo(() => {
    if (suiBalance?.totalBalance) {
      return Math.floor(Number(suiBalance?.totalBalance) / 10 ** 9);
    } else {
      return 0;
    }
  }, [suiBalance]);

  useEffect(() => {
    async function runGetNode(){
      // use getFullnodeUrl to define Devnet RPC location
      const rpcUrl = getFullnodeUrl('devnet');
      
      // create a client connected to devnet
      const client = new SuiClient({ url: rpcUrl });
      
      // get coins owned by an address
      // replace <OWNER_ADDRESS> with actual address in the form of 0x123...
      // const getOwnCoin = await client.getCoins({
      //   owner: walletAddress,
      // });

      const getObject = await client.getObject({ id : '0xc13f797bf739164e5ecaada9438c82ba0d9dd8f8b3140b188e3cdeb1b6cebbfc'})
      console.log(getObject)

      

      // console.log('getCoin',getOwnCoin)
    }

    runGetNode()
  }, [walletAddress])

  return (
    <div className="w-[80%] flex flex-col items-center justify-center gap-4">
      <BasicDataField
        label="Your Wallet Balance"
        value={userBalance ?? "0.0000"}
        spaceWithUnit
        unit="SUI"
        minFractionDigits={0}
      />
      <BasicInputField
        label="Input"
        inputValue="0.0000"
        setInputValue={(value) => console.log(value)}
        tokenInfo={["SUI", "BUCK", "USDC", "USDT"]}
        canSelectToken={true}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        maxValue={0.0}
      />
      <ActionButton
        label="Get Buck"
        isConnected={true}
        isLoading={false}
        onClick={() => console.log("Go to Bucket!")}
        buttonClass="w-40"
      />
    </div>
  );
};

export default BasicContainer;
