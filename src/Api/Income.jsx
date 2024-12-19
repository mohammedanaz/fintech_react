import instance from "../axios/Instances";

const Income = {
    incomeList: async () => {
        const response = await instance.get("finance/income-list/");
        return response.data; 
    },
    incomeCreate: async (data) => {
        const response = await instance.post("finance/income-create/", data);
        return response.data; 
    },
    incomeDelete: async (rowId) => {
        const response = await instance.delete(`finance/income-delete/${rowId}`);
        return response.data; 
    },
    incomeEdit: async (data) => {
        const response = await instance.patch('finance/income-edit/', data);
        return response.data; 
    },
    
  };
  
export default Income;