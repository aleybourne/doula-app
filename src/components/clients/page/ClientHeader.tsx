
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientData } from "../types/ClientTypes";
import DeliveryNotesButton from "./DeliveryNotesButton";

interface ClientHeaderProps {
  client?: ClientData;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ client }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const userInitials = user?.firstName ? user.firstName.charAt(0) : "D";

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleDeliveryNotesClick = () => {
    // For now, we'll scroll to or focus on the PostpartumNotes component
    // This could be enhanced to open a dedicated delivery notes modal
    const notesSection = document.querySelector('[data-testid="postpartum-notes"]');
    if (notesSection) {
      notesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="px-3 py-2 flex items-center justify-between">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleBack}
        className="h-8 w-8"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1"></div> {/* Spacer */}
      
      {/* Delivery Notes Button - only shown when client is delivered */}
      {client && (
        <DeliveryNotesButton 
          client={client} 
          onClick={handleDeliveryNotesClick}
        />
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-500 text-white text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ClientHeader;
