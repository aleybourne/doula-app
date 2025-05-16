
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
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

export const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const todayStr = format(new Date(), "M/d/yyyy");
  const isHomePage = location.pathname === '/home';
  const isClientsPage = location.pathname === '/clients';
  const { user, logout } = useAuth();
  
  const displayName = user?.firstName || "Doula";
  const userInitials = user?.firstName ? user.firstName.charAt(0) : "D";

  const handleBack = () => {
    if (isClientsPage) {
      // From clients page, always go back to home
      navigate("/home");
    } else {
      // From other pages, go back one step
      navigate(-1);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="flex flex-col">
      <div className="text-xl font-light text-center mt-2.5">{todayStr}</div>
      <div className="flex items-center justify-between px-2 mx-0 my-2.5">
        {!isHomePage ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="h-8 w-8"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-8"></div> /* Empty div for balance on home page */
        )}
        <div
          className="font-custom text-[28px] md:text-[36px] font-normal"
          style={{ fontWeight: 400 }}
        >
          Hello, {displayName}!
        </div>
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
    </header>
  );
};
