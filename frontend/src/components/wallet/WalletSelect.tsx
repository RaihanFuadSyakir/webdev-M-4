// components/WalletSelect.js
"use client"
import { BACKEND_URL } from '@/constants';
import { useEffect, useState } from 'react';
import { Wallet, dbResponse } from '@/utils/type';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface Props {
  setSelectedWallet: React.Dispatch<React.SetStateAction<number>>;
}

const WalletSelect: React.FC<Props> = ({ setSelectedWallet }) => {
  const router = useRouter();
  const [wallets, setWallets] = useState<{ id: number; label: string }[]>([]);

  useEffect(() => {
    // Make a GET request to your backend API endpoint to fetch wallets.
    console.log("fetching wallets");
    axios.get(`${BACKEND_URL}/api/wallet/user`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }).then((response: AxiosResponse) => {
      const res: dbResponse<Wallet[]> = response.data;
      const walletList: Wallet[] = res.data;
      walletList.forEach((wallet) => {
        setWallets((prev) => {
          return [...prev, { id: wallet.id, label: wallet.wallet_name }];
        });
      });
    }).catch((e) => {
      console.log(e);
    });
  }, []);

  return (
    <div>
      <Autocomplete
        onChange={(event, value) => {
          if (value !== undefined) {
            setSelectedWallet(value!.id);
          }
        }}
        disablePortal
        id="combo-box-wallet"
        options={wallets}
        sx={{ maxWidth: 300 }}
        renderInput={(params) => <TextField {...params} label="Wallet" name="wallet" />}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          );
        }}
      />
    </div>
  );
};

export default WalletSelect;
