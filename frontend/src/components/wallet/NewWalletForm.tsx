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
    const [wallets, setWallets] = useState([]);
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
  
        axiosInstance.post('/wallet/new',data)
        .then((response : AxiosResponse<dbResponse<Wallet>>)=>{
            console.log(response.data.msg);
        })
        .catch((err_response : AxiosError<dbResponse<Wallet>>)=>{
            console.log(err_response.response?.data.msg);
        })
      } catch (error) {
        setError('Gagal menambahkan wallet.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="h-96 w-96 bg-amber-100 rounded m-4 p-2">
        <h2>Tambah Wallet</h2>
        <TextField
          label="Nama Wallet"
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
        <Button color="primary" onClick={addWallet}>
          Tambah Wallet
        </Button>
        
      </div>
    );
  };

  export default NewWalletForm;