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

export default function IncomeTable() {
    const [incomeData, setIncomeData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const showToast = useToast();
    const [newIncome, setNewIncome] = useState({
        date_received: '',
        amount: '',
        source: '',
        category_name: '',
        notes: '',
    });

    useEffect(() => {
        const fetchIncomeData = async () => {
            try {
                const response = await IncomeApi.incomeList();
                console.log('fetch income data - ', response);
                setIncomeData(response);
            } catch (error) {
                console.error("Error fetching income data:", error);
            }
        };

        fetchIncomeData();
    }, []);

    // Columns definition
    const columns = [
        { field: 'date_received', headerName: 'Date', width: 150 },
        { field: 'amount', headerName: 'Amount', width: 150 },
        { field: 'source', headerName: 'Source', width: 150 },
        { field: 'category_name', headerName: 'Category', width: 150 },
        { field: 'notes', headerName: 'Notes', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 150,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => handleEdit(params)}
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

    const handleEdit = (params) => {
        console.log('Edit action triggered for row:', params.row);
        // Implement logic for editing here.
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

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewIncome(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleAddIncome = async () => {
        try {
            // Call the API to create the new income record
            const response = await IncomeApi.incomeCreate(newIncome); 
            console.log('New income added successfully:', response);
            // Update the state with the new income data
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

    // Close the modal
    const handleCloseModal = () => {
        setOpenModal(false);
    };

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
                    
                    {/* Category Select */}
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
        </div>
    );
}
