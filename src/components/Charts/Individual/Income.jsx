import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import FetchCharts from "../../../Api/Chart"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import Spinner from '../../Spinner/Spinner';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement, 
    Title,
    Tooltip,
    Legend
  );

export default function MonthlyIncomeChart() {
  const [monthlyData, setMonthlyData] = useState({})
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    const FetchMonthlyIncome = async ()=>{
      try{
        setIsLoading(true)
        const response = await FetchCharts.monthlyIncome();
        console.log(response.data);
        response.data.forEach((data) => setMonthlyData((prev)=>({...prev, [data[0]]:data[1]})));
        setIsLoading(false)
      }catch(error){
        setIsLoading(false)
        console.log("Response error upon FetchCharts.monthlyIncome :", error);
      }
    }
    FetchMonthlyIncome();
  }, []);
  const options = {
    responsive: true,
    maintainAspectRatio: true,
  };
  const label = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = {
    labels: label,
    datasets: [
      {
      label: "Monthly Income",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: label.map((data)=> monthlyData[data]),
      },
      ],
  };

  if(isLoading){
      return (
        <div className='w-100'>
          <Spinner />
        </div>
    )};

  return (
    <div className='w-100'>
      <Bar data={data} options={options} />
    </div>
  )
}
