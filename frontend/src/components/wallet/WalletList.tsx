import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Wallet, dbResponse } from '@/utils/type';
import NewWalletForm from './NewWalletForm';
import { Popconfirm, message } from 'antd';
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
    return 'Rp. ' + hasil;
  };

  const handleDeleteWallet = (walletId: number) => {
    axiosInstance.delete(`/wallet/${walletId}`)
      .then((response: AxiosResponse<dbResponse<Wallet>>) => {
        console.log(response.data.msg);
        // Update wallets state after successful deletion
        setWallets((prevWallets: Wallet[]) => {
          return prevWallets.filter(wallet => wallet.id !== walletId);
        });
        message.success('Wallet deleted successfully', 5);
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
    <div className='sm:flex'>
      <div className='flex-initial sm:w-1/3 m-4 rounded flex flex-col gap-4 bg-white'>
        <NewWalletForm
          onWalletAdded={fetchWallets}
          onWalletEdited={() => {
            fetchWallets();
            setEditingWallet(null);
          }}
          editingWallet={editingWallet}
        />
      </div>
      <div className='flex-initial sm:w-2/3 m-4 bg-white'>
        <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default">
          <div className="m-5">
            <h2 className="font-bold text-xl mb-2 text-black">Budget List</h2>
            <TableContainer component={Paper} className='max-h-96 overflow-auto'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Wallet Name</TableCell>
                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Total Balance</TableCell>
                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? wallets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : wallets
                  ).map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell align='center'>{wallet.wallet_name}</TableCell>
                      <TableCell align='center'>{formatCurrency(wallet.total_balance)}</TableCell>
                      <TableCell align='center'>
                        <Button
                          variant="contained"
                          color='primary'
                          className={`bg-yellow-500 text-white rounded p-2 px-5 hover:bg-yellow-700 sm:mr-2 sm:mb-0 mb-2`}
                          onClick={() => setEditingWallet(wallet)}
                        >
                          Edit
                        </Button>
                        <Popconfirm
                          title="Are you sure you want to delete this wallet?"
                          onConfirm={() => handleDeleteWallet(wallet.id)}
                          okText="Yes"
                          okType="danger"
                          cancelText="No"
                        >
                          <Button
                            variant="contained"
                            color='error'
                            className='bg-red-500 text-white rounded p-2 hover:bg-red-700'
                          >
                            Delete
                          </Button>
                        </Popconfirm>
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
      </div>
    </div>
  );
};

export default WalletList;
