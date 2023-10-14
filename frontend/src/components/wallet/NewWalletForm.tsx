"use client"
import { useState } from "react";
import axiosInstance from "@/utils/fetchData";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AxiosError, AxiosResponse } from "axios";
import { Wallet, dbResponse } from "@/utils/type";

const NewWalletForm = () => {
  const [walletName, setWalletName] = useState('');
  const [totalBalance, setTotalBalance] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'walletName') {
      setWalletName(value);
    } else if (name === 'totalBalance') {
      setTotalBalance(value);
    }
  };

  const addWallet = async () => {
    setLoading(true);
    try {
      if (!walletName || !totalBalance) {
        setError('Nama wallet dan total balance harus diisi.');
        setLoading(false);
        return;
      }

      const data = {
        wallet_name: walletName,
        total_balance: parseFloat(totalBalance),
      };

      axiosInstance.post('/wallet/new', data)
        .then((response: AxiosResponse<dbResponse<Wallet>>) => {
          console.log(response.data.msg);
        })
        .catch((err_response: AxiosError<dbResponse<Wallet>>) => {
          console.log(err_response.response?.data.msg);
        });
    } catch (error) {
      setError('Gagal menambahkan wallet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-96 w-96 bg-white rounded m-4 p-2 text-black">
      <h2 className="font-bold text-xl mb-2">Wallet</h2>
      <TextField
        label="Wallet Name"
        name="walletName"
        value={walletName}
        onChange={handleInput}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Total Balance (Rp)"
        name="totalBalance"
        type="number"
        value={totalBalance}
        onChange={handleInput}
        fullWidth
        margin="normal"
      />
      <Button
        className="bg-blue-500 text-white hover:bg-blue-700 hover:text-white"
        onClick={addWallet}
      >
        Add Wallet
      </Button>
    </div>
  );
};

export default NewWalletForm;
