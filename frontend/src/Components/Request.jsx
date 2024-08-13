import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { HOST_WITH_PORT } from "../consts";
import "./Requests.css";

const Request = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [isRequestLoading, setIsRequestLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const approveRequest = async () => {
    try {
      await axios.patch(`${HOST_WITH_PORT}/api/requests/${id}/approve`);
    } catch (error) {
      setErrorMessage({ type: "error", text: "Error Approving Request" });
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const decineRequest = async () => {
    try {
      await axios.patch(`${HOST_WITH_PORT}/api/requests/${id}/decline`);
    } catch (error) {
      setErrorMessage({ type: "error", text: "Error Declining Request" });
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          `${HOST_WITH_PORT}/api/requests/${id}`
        );
        setRequest(response.data);
        setIsRequestLoading(false);
      } catch (error) {
        setErrorMessage({ type: "error", text: "Error Fetching Request" });
        setTimeout(() => setErrorMessage(null), 3000);
        setIsRequestLoading(false);
        console.error("Error fetching request", error);
      }
    };

    fetchRequest();
  }, [id]);

  if (isRequestLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="single-request-container">
      <h1>Request Details</h1>
      <form className="single-request-form">
        <div>
          <label>ID:</label>
          <input type="text" value={request?.id} readOnly />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" value={request?.name} readOnly />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={request?.description} readOnly />
        </div>
        <div>
          <label>Amount:</label>
          <input type="number" value={request?.amount} readOnly />
        </div>
        <div>
          <label>Currency:</label>
          <input type="text" value={request?.currency} readOnly />
        </div>
        <div>
          <label>Employee Name:</label>
          <input type="text" value={request?.employee_name} readOnly />
        </div>
        <div>
          <label>Status:</label>
          <input type="text" value={request?.status} readOnly />
        </div>
      </form>
      {request && (
        <div className="button-group">
          <button className="approve-button" onClick={approveRequest}>
            Approve
          </button>
          <button className="decline-button" onClick={decineRequest}>
            Decline
          </button>
        </div>
      )}
      {errorMessage && (
        <div className={`snackbar ${errorMessage.type}`}>
          {errorMessage.text}
        </div>
      )}
    </div>
  );
};

export default Request;
