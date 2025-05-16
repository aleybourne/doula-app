
import { useState, useEffect } from 'react';
import { ClientData } from '../types/ClientTypes';
import { filterClientsByType } from '../utils/clientFilters';

export function useClientFiltering(
  clients: ClientData[],
  searchQuery: string = "",
  filter?: string
) {
  const [filteredClients, setFilteredClients] = useState<ClientData[]>([]);
  const [filterVersion, setFilterVersion] = useState(0);

  // Force a re-filter when clients array changes
  useEffect(() => {
    setFilterVersion(prev => prev + 1);
  }, [clients]);

  useEffect(() => {
    console.log(`useClientFiltering: processing filter: ${filter || "none"} (version ${filterVersion})`);
    console.log("Total clients before filtering:", clients.length);

    // First apply type filter (new, upcoming, etc)
    let filtered = filterClientsByType(clients, filter);
    console.log(`After ${filter || "no"} filter: ${filtered.length} clients remain`);
    
    // Then apply search query filter
    if (searchQuery) {
      const beforeSearch = filtered.length;
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log(`Search "${searchQuery}" reduced clients from ${beforeSearch} to ${filtered.length}`);
    }
    
    console.log("Final filtered clients count:", filtered.length);
    if (filtered.length > 0) {
      console.log("First few filtered clients:", filtered.slice(0, Math.min(3, filtered.length)).map(c => c.name));
    }
    
    setFilteredClients(filtered);
  }, [clients, filter, searchQuery, filterVersion]);

  return filteredClients;
}
