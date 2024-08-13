import React, { useState } from 'react';
import axios from 'axios';
import { HOST_WITH_PORT } from "../consts";
import './CreateRequestForm.css';
import { requestTypeMap } from "../en";

const CreateRequestForm = () => {
  const [type, setType] = useState('purchase');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [employeeName, setEmployeeName] = useState('');
  const [responseMessage, setResponseMessage] = useState(null);  // State to handle response message

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRequest = {
      type,
      name,
      description,
      amount: parseFloat(amount),
      currency,
      employee_name: employeeName,
    };

    try {
      const response = await axios.post(`${HOST_WITH_PORT}/api/requests`, newRequest);
      setResponseMessage({ type: 'success', text: 'Request Created Successfully!' });
      console.log('Request Created:', response.data);
      // Clear form fields after successful submission
      setType('');
      setName('');
      setDescription('');
      setAmount('');
      setCurrency('USD');
      setEmployeeName('');
    } catch (error) {
      setResponseMessage({ type: 'error', text: 'Error Creating Request' });
      console.error('Error creating request', error);
    }
  };

  return (
    <div className="form-container">
      <h1>Create Request Form</h1>
      <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
          <label>Type:</label>
          <select value={type} onChange={handleInputChange(setType)}>
            <option value="purchase">{requestTypeMap.purchase}</option>
            <option value="reimbursement">{requestTypeMap.reimbursement}</option>
          </select>
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={handleInputChange(setName)} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input type="text" value={description} onChange={handleInputChange(setDescription)} required />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input type="number" value={amount} onChange={handleInputChange(setAmount)} required />
        </div>
        <div className="form-group">
          <label>Currency:</label>
          <select value={currency} onChange={handleInputChange(setCurrency)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ILS">ILS</option>
          </select>
        </div>
        <div className="form-group">
          <label>Employee Name:</label>
          <input type="text" value={employeeName} onChange={handleInputChange(setEmployeeName)} required />
        </div>
        <button type="submit" className="submit-button">Create Request</button>
      </form>
      {responseMessage && (
        <div className={`response-message ${responseMessage.type}`}>
          {responseMessage.text}
        </div>
      )}
    </div>
  );
};

export default CreateRequestForm;
