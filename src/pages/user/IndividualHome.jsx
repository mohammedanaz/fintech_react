import React, { useEffect } from 'react'
import Header from '../../components/Header/Header'
import IncomeApi from "../../Api/Income"
import TableNavs from "../../components/TableNavs/TableNavs"

export default function IndividualHome() {

  return (
    <div className='container'>
        <Header />
        <h1 className='my-2 text-center'>Individual Home Page.</h1>
        <TableNavs />
    </div>
  )
}