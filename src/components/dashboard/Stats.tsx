
import React, { useState, useEffect, useMemo } from "react";
import { StatCardProps } from "./types";
import { useNavigate } from "react-router-dom";
import { useClientsStore } from "@/components/clients/hooks/useClientsStore";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { filterClientsByType } from "@/components/clients/utils/clientFilters";
import { getCurrentUserId } from "@/components/clients/store/clientStore";

const StatCard: React.FC<StatCardProps & { onClick?: () => void, isLoading?: boolean }> = ({ 
  count, 
  label, 
  bgColor, 
  onClick,
  isLoading = false 
}) => (
  <div className="flex flex-col items-center">
    <button
      type="button"
      className={
        `flex items-center justify-center rounded-[15px] border border-solid border-[#DADADA] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ` +
        `${bgColor} ` +
        "w-[92px] h-[92px] md:w-[92px] md:h-[92px] sm:w-[72px] sm:h-[72px]"
      }
      tabIndex={0}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Skeleton className="w-10 h-10 rounded-full" />
      ) : (
        <span className="font-bold text-4xl md:text-5xl sm:text-3xl">{count}</span>
      )}
    </button>
    <div className="mt-2 text-base md:text-base sm:text-sm font-semibold text-center text-black w-[92px] md:w-[92px] sm:w-[72px] leading-tight">
      {label}
    </div>
  </div>
);

export const Stats: React.FC = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Get access to the client store
  const { clients, isLoading } = useClientsStore();
  const userId = getCurrentUserId();

  // Memoize the stats calculation to prevent infinite loops
  const stats = useMemo(() => {
    if (!userId || clients.length === 0) {
      return {
        newClients: 0,
        upcomingBirths: 0,
        activeClients: 0
      };
    }

    try {
      console.log("Stats component calculating client statistics...");
      console.log(`Total clients available: ${clients.length}`);
      
      // Filter clients for the current user first
      const userClients = clients.filter(client => client.userId === userId);
      console.log(`User clients: ${userClients.length}`);
      
      // Debug each client's status
      userClients.forEach(client => {
        console.log(`Client ${client.name}: status="${client.status || 'undefined'}"`);
      });
      
      // Use the centralized filtering function to get counts
      const newClientsCount = filterClientsByType(userClients, "new").length;
      const upcomingBirthsCount = filterClientsByType(userClients, "upcoming").length;
      
      // Count active clients - those with active status or no status (default to active)
      const activeClientsCount = userClients.filter(client => {
        const status = client.status;
        const isActive = !status || status === 'active';
        
        console.log(`Client ${client.name}: status="${status || 'undefined'}", isActive=${isActive}`);
        return isActive;
      }).length;
      
      console.log(`Stats calculated: new=${newClientsCount}, upcoming=${upcomingBirthsCount}, active=${activeClientsCount}`);
      
      return {
        newClients: newClientsCount,
        upcomingBirths: upcomingBirthsCount,
        activeClients: activeClientsCount
      };
    } catch (error) {
      console.error("Error calculating client stats:", error);
      toast({
        title: "Error",
        description: "Failed to calculate client statistics",
        variant: "destructive"
      });
      return {
        newClients: 0,
        upcomingBirths: 0,
        activeClients: 0
      };
    }
  }, [clients, userId]);

  const handleNavigateToNewClients = () => {
    if (isNavigating) return;
    
    try {
      console.log("Navigating to new clients");
      setIsNavigating(true);
      navigate("/clients?filter=new", { replace: false });
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Navigation Error",
        description: "Failed to navigate to new clients",
        variant: "destructive"
      });
    } finally {
      // Reset navigation state after a short delay
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  const handleNavigateToUpcomingBirths = () => {
    if (isNavigating) return;
    
    try {
      console.log("Navigating to upcoming births");
      setIsNavigating(true);
      navigate("/clients?filter=upcoming", { replace: false });
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Navigation Error",
        description: "Failed to navigate to upcoming births",
        variant: "destructive"
      });
    } finally {
      // Reset navigation state after a short delay
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  const handleNavigateToAllClients = () => {
    if (isNavigating) return;
    
    try {
      console.log("Navigating to all clients");
      setIsNavigating(true);
      // Navigate to clients without any filter params
      navigate("/clients", { replace: false });
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Navigation Error",
        description: "Failed to navigate to all clients",
        variant: "destructive"
      });
    } finally {
      // Reset navigation state after a short delay
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  return (
    <section className="flex justify-around mx-0 my-5 gap-x-4 md:gap-x-2 sm:gap-x-1">
      <StatCard 
        count={stats.newClients} 
        label="New Clients" 
        bgColor="bg-[#C5E4C7]" 
        isLoading={isLoading || isNavigating}
        onClick={handleNavigateToNewClients}
      />
      <StatCard 
        count={stats.upcomingBirths} 
        label="Upcoming Births" 
        bgColor="bg-[#F7B8B8]" 
        isLoading={isLoading || isNavigating}
        onClick={handleNavigateToUpcomingBirths}
      />
      <StatCard
        count={stats.activeClients}
        label="Active Clients"
        bgColor="bg-[#CDBEF8]"
        onClick={handleNavigateToAllClients}
        isLoading={isLoading || isNavigating}
      />
    </section>
  );
};
