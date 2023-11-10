import React from 'react'


const columns: GridColDef[] = [
    {
        field: 'category', 
        headerName: 'Category', 
        width: 120,
        valueFormatter: (params: GridValueFormatterParams<Category>) => params.value.category_name
      },
    {
      field: 'year',
      headerName: 'Year',
      width: 80,
    },
    {
      field: 'total_budget',
      headerName: 'Total Budget',
      width: 110,
      valueFormatter: (params) => `Rp. ${numeral(params.value).format('0,0')}`

    },
    { 
      field: 'description', 
      headerName: 'Description', 
      width: 140 
    },
    {
      field: 'category', 
      headerName: 'Category', 
      width: 120,
      valueFormatter: (params: GridValueFormatterParams<Category>) => params.value.category_name
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="outlined"
            color="primary"
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 hover:text-white"
            onClick={() => {
              const budgetId = params.row.id as number;
              const budget = budgets.find((b) => b.id === budgetId);
              setSelectedBudget(budget!);
              setIsUpdateModalOpen(true);
            }}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className="bg-red-500 text-white rounded p-2 hover:bg-red-700 hover:text-white ml-2"
            onClick={() => handleDelete(params.row.id as number)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

export default function ListExpensesByCategory() {
    return (
        <div>ListExpensesByCategory</div>
    )
}
