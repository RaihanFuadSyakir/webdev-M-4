import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Wallet, dbResponse } from '@/utils/type';
import NewWalletForm from './NewWalletForm';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Button,
  TablePagination
} from '@mui/material';

const WalletList = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Fetch list of wallets from the backend when the component mounts
    fetchWallets();
  }, []);

  const fetchWallets = () => {
    axiosInstance.get('/wallet/user/')
      .then((response: AxiosResponse<dbResponse<Wallet[]>>) => {
        setWallets(response.data.data);
      })
      .catch((err_response: AxiosError<dbResponse<Wallet[]>>) => {
        console.log(err_response.response?.data.msg);
      });
  };

  const formatCurrency = (rupiah: number) => {
    const reverse = rupiah.toString().split('').reverse().join('');
    const ribuan = reverse.match(/\d{1,3}/g);
    const hasil = ribuan?.join('.').split('').reverse().join('');
    return 'Rp ' + hasil;
  };

  const handleDeleteWallet = (walletId: number) => {
    axiosInstance.delete(`/wallet/${walletId}`)
      .then((response: AxiosResponse<dbResponse<Wallet>>) => {
        console.log(response.data.msg);
        // Update wallets state after successful deletion
        setWallets((prevWallets: Wallet[]) => {
          return prevWallets.filter(wallet => wallet.id !== walletId);
        });
      })
      .catch((err_response: AxiosError<dbResponse<Wallet>>) => {
        console.log(err_response.response?.data.msg);
      });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, wallets.length - page * rowsPerPage);

  return (
    <div className='flex'>
      <div className='flex-initial w-1/3 m-4 rounded p-4 flex flex-col gap-4 bg-white'>
        <NewWalletForm
          onWalletAdded={fetchWallets}
          onWalletEdited={() => {
            fetchWallets();
            setEditingWallet(null);
          }}
          editingWallet={editingWallet}
        />
      </div>
      <div className='flex-initial w-2/3 m-4 bg-white'>
        <TableContainer component={Paper} className='max-h-96 overflow-auto'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Wallet Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Total Balance</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? wallets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : wallets
              ).map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell>{wallet.wallet_name}</TableCell>
                  <TableCell>{formatCurrency(wallet.total_balance)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      className={`bg-yellow-500 text-white rounded p-2 hover:bg-yellow-700 hover:text-white mr-2`}
                      onClick={() => setEditingWallet(wallet)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      className={`bg-red-500 text-white rounded p-2 hover:bg-red-700 hover:text-white`}
                      onClick={() => handleDeleteWallet(wallet.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={3} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ textAlign: 'right', padding: '10px' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={wallets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default WalletList;
