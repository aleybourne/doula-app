
import { useState, useEffect } from 'react';
import { ClientData } from '../types/ClientTypes';
import { sortAndFilterClients } from '../utils/clientFilters';

export function useClientFiltering(
  clients: ClientData[] = [],
  searchQuery: string = "",
  filter?: string
) {
  const [filteredClients, setFilteredClients] = useState<ClientData[]>([]);
  const [filterVersion, setFilterVersion] = useState(0);

  // Force a re-filter when clients array changes
  useEffect(() => {
    console.log(`useClientFiltering: Clients array changed, forcing re-filter`);
    setFilterVersion(prev => prev + 1);
  }, [clients]);

  useEffect(() => {
    console.log(`=== useClientFiltering: PROCESSING FILTER ===`);
    console.log(`Filter: ${filter || "none"}`);
    console.log(`Search query: "${searchQuery}"`);
    console.log(`Input clients count: ${clients?.length || 0}`);
    console.log(`Filter version: ${filterVersion}`);

    if (!clients || clients.length === 0) {
      console.log(`useClientFiltering: No clients to filter`);
      setFilteredClients([]);
      return;
    }

    // Log all input clients
    console.log(`Input clients:`);
    clients.forEach((client, index) => {
      console.log(`  ${index + 1}. ${client.name} (ID: ${client.id}, userId: ${client.userId})`);
    });

    // First apply type filter and sorting (new, upcoming, due date, etc)
    let filtered = sortAndFilterClients(clients, filter);
    console.log(`After ${filter || "no"} filter/sort: ${filtered.length} clients remain`);
    
    // Then apply search query filter
    if (searchQuery) {
      const beforeSearch = filtered.length;
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log(`Search "${searchQuery}" reduced clients from ${beforeSearch} to ${filtered.length}`);
    }
    
    console.log(`=== FINAL RESULT ===`);
    console.log(`Final filtered clients count: ${filtered.length}`);
    if (filtered.length > 0) {
      console.log(`Final filtered clients:`);
      filtered.forEach((client, index) => {
        console.log(`  ${index + 1}. ${client.name} (ID: ${client.id})`);
      });
    } else {
      console.log(`No clients match the current filter and search criteria`);
    }
    console.log(`=== useClientFiltering: END ===`);
    
    setFilteredClients(filtered);
  }, [clients, filter, searchQuery, filterVersion]);

  return filteredClients;
}
