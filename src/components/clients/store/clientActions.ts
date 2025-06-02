
// Re-export all client actions from the focused modules
export { addClient, updateClient, deleteClient } from './actions/clientCrudActions';
export { 
  updateClientStatus, 
  markClientDelivered, 
  archiveClient, 
  restoreClient 
} from './actions/clientStatusActions';
