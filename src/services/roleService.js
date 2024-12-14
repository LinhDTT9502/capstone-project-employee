import { 
    getAllRoles, 
    getRoleDetails, 
    addRole, 
    editRole, 
    removeRole 
  } from "../api/apiRole";
  
  // Fetch all roles
  export const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      return response.data.data.$values;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  };
  
  // Fetch role details by ID
  export const fetchRoleDetails = async (roleId) => {
    try {
      const response = await getRoleDetails(roleId);
      return response.data;
    } catch (error) {
      console.error(`Error fetching role details for ID ${roleId}:`, error);
      throw error;
    }
  };
  
  // Add a new role
  export const createRole = async (roleData) => {
    try {
      const response = await addRole(roleData);
      return response.data;
    } catch (error) {
      console.error("Error adding new role:", error);
      throw error;
    }
  };
  
  // Edit an existing role
  export const updateRole = async (roleId, roleData) => {
    try {
      const response = await editRole(roleId, roleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating role with ID ${roleId}:`, error);
      throw error;
    }
  };
  
  // Remove a role by ID
  export const deleteRole = async (roleId) => {
    try {
      const response = await removeRole(roleId);
      return response.data;
    } catch (error) {
      console.error(`Error removing role with ID ${roleId}:`, error);
      throw error;
    }
  };
  