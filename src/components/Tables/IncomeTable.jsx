import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import IncomeApi from "../../Api/Income";
import { Edit, Delete, Add } from '@mui/icons-material';
import useToast from "../../hooks/UseToast";
import { IconButton, 
    Dialog, 
    DialogActions,
    DialogContent,
    DialogTitle, 
    TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Spinner from '../Spinner/Spinner';

export default function IncomeTable() {
    const [incomeData, setIncomeData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const showToast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [newIncome, setNewIncome] = useState({
        date_received: '',
        amount: '',
        source: '',
        category_name: '',
        notes: '',
    });
    const [editedIncome, setEditedIncome] = useState({});

    useEffect(() => {
        const fetchIncomeData = async () => {
            try {
                setIsLoading(true)
                const response = await IncomeApi.incomeList();
                console.log('fetch income data - ', response);
                setIncomeData(response);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                console.error("Error fetching income data:", error);
            }
        };

        fetchIncomeData();
    }, []);

    // Columns definition
    const columns = [
        { field: 'date_received', headerName: 'Date', width: 150 },
        { field: 'amount', headerName: 'Amount', width: 100 },
        { field: 'source', headerName: 'Source', width: 100 },
        { field: 'category_name', headerName: 'Category', width: 150 },
        { field: 'notes', headerName: 'Notes', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 120,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => handleOpenModalEdit(params)}
                    color="primary"
                />,
                <GridActionsCellItem
                    icon={<Delete />}
                    label="Delete"
                    onClick={() => handleDelete(params)}
                    color="error"
                />,
            ],
        },
    ];

    const [pageSize, setPageSize] = useState(5); 
    const [page, setPage] = useState(0);

    const handleEdit = async () => {
        const confirmed = window.confirm('Are you sure you want to edit this income?');
        if (!confirmed) {
            return;
        }
        try {
            console.log('edited income data to be sent - ', editedIncome);
            
            const response = await IncomeApi.incomeEdit(editedIncome);
            console.log('Income edit successfully:', response);
            setIncomeData(prevData => [
                ...prevData.filter(income => income.id !== response.id),
                response,
            ]);
            handleCloseModalEdit()
            showToast("Successfully edited the income", "success");
        } catch (error) {
            console.error("Error deleting income:", error);
        }
    };

    const handleDelete = async (params) => {
        const rowId = params.row.id; 
        const confirmed = window.confirm('Are you sure you want to delete this income?');
        if (!confirmed) {
            return;
        }
        try {
            const response = await IncomeApi.incomeDelete(rowId);
            console.log('Income deleted successfully:', rowId);
            setIncomeData(prevData => prevData.filter(income => income.id !== rowId));
            showToast("Successfully deleted the income", "success");
        } catch (error) {
            console.error("Error deleting income:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewIncome(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditedIncome(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddIncome = async () => {
        try {
            const response = await IncomeApi.incomeCreate(newIncome); 
            console.log('New income added successfully:', response);
            setIncomeData(prevData => [...prevData, response]);
            setOpenModal(false);
            showToast("Successfully added the income", "success");
        } catch (error) {
            console.error("Error adding new income:", error);
        }
    };

    // Open the modal when Add icon is clicked
    const handleAddNew = () => {
        setOpenModal(true);
    };
    const handleOpenModalEdit = (params) => {
        setEditedIncome(params.row)
        setOpenModalEdit(true)
        console.log('Edit action triggered for row:', params.row);
    }

    // Close the modal
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleCloseModalEdit = () => {
        setEditedIncome({})
        setOpenModalEdit(false);
    };

    if(isLoading){
          return (
            <div className="container mt-4">
              <Spinner />
            </div>
        )};

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Income Table</h2>
            
            {/* Add Button */}
            <div className="d-flex justify-content-start mb-2">
                <IconButton 
                    color="primary" 
                    aria-label="add income" 
                    onClick={handleAddNew}
                >
                    <Add />
                </IconButton>
            </div>

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={incomeData}
                    columns={columns}
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    page={page}
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newSize) => setPageSize(newSize)} 
                    disableSelectionOnClick
                />
            </div>

            {/* Modal for Adding New Income */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Add New Income</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Date Received"
                        name="date_received"
                        type="date"
                        value={newIncome.date_received}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Amount"
                        name="amount"
                        value={newIncome.amount}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Source"
                        name="source"
                        value={newIncome.source}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="category-name-label">Category</InputLabel>
                        <Select
                            labelId="category-name-label"
                            label="Category"
                            name="category_name"
                            value={newIncome.category_name}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="Salary">Salary</MenuItem>
                            <MenuItem value="Business">Business</MenuItem>
                            <MenuItem value="Investment">Investment</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Notes"
                        name="notes"
                        value={newIncome.notes}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddIncome} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Modal for Editing an Income */}
            <Dialog open={openModalEdit} onClose={handleCloseModalEdit}>
                <DialogTitle>Edit Income</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Date Received"
                        name="date_received"
                        type="date"
                        value={editedIncome.date_received}
                        onChange={handleEditInputChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Amount"
                        name="amount"
                        value={editedIncome.amount}
                        onChange={handleEditInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Source"
                        name="source"
                        value={editedIncome.source}
                        onChange={handleEditInputChange}
                        fullWidth
                        margin="normal"
                    />
                    
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="category-name-label">Category</InputLabel>
                        <Select
                            labelId="category-name-label"
                            label="Category"
                            name="category_name"
                            value={editedIncome.category_name}
                            onChange={handleEditInputChange}
                        >
                            <MenuItem value="Salary">Salary</MenuItem>
                            <MenuItem value="Business">Business</MenuItem>
                            <MenuItem value="Investment">Investment</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Notes"
                        name="notes"
                        value={editedIncome.notes}
                        onChange={handleEditInputChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModalEdit} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEdit} color="primary">
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
