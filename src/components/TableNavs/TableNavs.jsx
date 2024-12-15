import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import IncomeTable from '../Tables/IncomeTable';

function TableNavs() {
  const [key, setKey] = useState('income');

  return (
    <div className="container mt-4">
      <Tabs
        id="data-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="income" title="Income">
          <IncomeTable />
        </Tab>
        <Tab eventKey="expense" title="Expense">
          <h2>Expense Table</h2>
          {/* Render Expense Table here */}
        </Tab>
        <Tab eventKey="budget" title="Budget">
          <h2>Budget Table</h2>
          {/* Render Budget Table here */}
        </Tab>
      </Tabs>
    </div>
  );
}

export default TableNavs;
