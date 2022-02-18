import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { getPatientsQuery } from '../queries/queries';
import PatientDetails from './PatientDetail';

const PatientList = (props) => {
  const [selectedId, setSelectedId] = useState();
  const { loading, error, data } = useQuery(getPatientsQuery, {
    //https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy
    fetchPolicy: 'cache-and-network',
  });
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  return (
    <div>
      <ul id="patient-list">
        {data.patients.map((patient) => (
          <li
            key={patient.id}
            onClick={(e) => {
              setSelectedId(patient.id);
            }}
          >
            {patient.name}
          </li>
        ))}
      </ul>
      <PatientDetails patientId={selectedId} />
    </div>
  );
};

export default PatientList;
