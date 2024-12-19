import instance from "../axios/Instances";

const FetchCharts = {
    monthlyIncome: async () => {
        const response = await instance.get("finance/income-chart-monthly/");
        return response.data; 
    },
    
  };
  
export default FetchCharts;