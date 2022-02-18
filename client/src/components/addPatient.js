import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  getOrganizationsQuery,
  addPatientMutation,
  getPatientsQuery,
} from '../queries/queries';

const displayOrg = (loading, data) => {
  if (loading) return <option>Loading Organizations...</option>;
  // if (error) return <option>`Error! ${error.message}`</option>;
  return data.organizations.map((org) => {
    return (
      <option key={org.id} value={org.id}>
        {org.name}
      </option>
    );
  });
};

const AddPatient = () => {
  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [orgId, setOrgId] = useState();

  const { loading, data } = useQuery(getOrganizationsQuery);

  const [addPatient, { error }] = useMutation(addPatientMutation, {
    //新增完自動改變patient list
    refetchQueries: [{ query: getPatientsQuery }],
  });

  const createPatient = () => {
    addPatient({
      variables: { name, gender, orgId },
    });
    if (error) {
      console.log(error);
    }
  };

  const Submit = (e) => {
    e.preventDefault();
    console.log(name, gender, orgId);
    createPatient();
  };

  return (
    <form id="add-patient" onSubmit={Submit}>
      <div className="field">
        <label>Name :</label>
        <input type="text" onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label>Gender :</label>
        <input type="text" onChange={(e) => setGender(e.target.value)} />
      </div>
      <div className="field">
        <label>Organization :</label>
        <select onChange={(e) => setOrgId(e.target.value)}>
          <option>Select organization</option>
          {displayOrg(loading, data)}
        </select>
      </div>
      <button> + </button>
    </form>
  );
};

export default AddPatient;
