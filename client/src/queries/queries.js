import { gql } from '@apollo/client';

export const getOrganizationsQuery = gql`
  {
    organizations {
      id
      name
    }
  }
`;

export const getPatientsQuery = gql`
  {
    patients {
      id
      name
    }
  }
`;

export const addPatientMutation = gql`
  mutation ($name: String!, $gender: String!, $orgId: String) {
    addPatient(name: $name, gender: $gender, orgId: $orgId) {
      name
      id
    }
  }
`;

export const getPatientQuery = gql`
  query ($id: ID) {
    patient(id: $id) {
      id
      name
      gender
      orgId {
        id
        name
        bedNum
        patients {
          name
        }
      }
    }
  }
`;
