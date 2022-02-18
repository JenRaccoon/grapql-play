import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { getPatientQuery } from '../queries/queries';

const ShowDetails = (data) => {
  const { patient } = data;
  if (patient) {
    return (
      <div>
        <h2>{patient.name}</h2>
        <p>{patient.gender}</p>
        <h3>Now Live In</h3>
        <p> Org: {patient.orgId.name}</p>
        <p> Bed: {patient.orgId.bedNum}</p>
        {/* {patient.orgId.patients.map((item) => {
          return <li> {item.name}</li>;
        })} */}
      </div>
    );
  } else {
    return (
      <div>
        <p>Select Patient</p>
      </div>
    );
  }
};

const PatientDetails = (props) => {
  console.log(props);
  const { loading, error, data } = useQuery(
    getPatientQuery,
    { variables: { id: props.patientId } },
    {
      //https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy
      fetchPolicy: 'cache-and-network',
    }
  );
  console.log(data);
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  return (
    <div>
      <div id="patient-details">{ShowDetails(data)}</div>
    </div>
  );
};

export default PatientDetails;
