import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createSampleClient } from "./utils/createSampleClient";
import { getCurrentUserId } from "./store/clientStore";
import { useToast } from "@/hooks/use-toast";

const CreateFirstClient: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [clientName, setClientName] = useState("");

  const handleCreateSampleClient = async () => {
    setIsCreating(true);
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("No authenticated user found");
      }

      const sampleClient = await createSampleClient(userId);
      toast({
        title: "Client created successfully!",
        description: `Sample client "${sampleClient.name}" has been created.`,
      });
      
      // Navigate to the new client
      navigate(`/clients/id/${sampleClient.id}`);
    } catch (error) {
      console.error("Error creating sample client:", error);
      toast({
        title: "Error creating client",
        description: "There was an issue creating the sample client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateCustomClient = async () => {
    if (!clientName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a client name.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("No authenticated user found");
      }

      const customClient = await createSampleClient(userId);
      // Update the client name after creation
      customClient.name = clientName.trim();
      toast({
        title: "Client created successfully!",
        description: `Client "${customClient.name}" has been created.`,
      });
      
      // Navigate to the new client
      navigate(`/clients/id/${customClient.id}`);
    } catch (error) {
      console.error("Error creating custom client:", error);
      toast({
        title: "Error creating client",
        description: "There was an issue creating the client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Your Doula Practice</CardTitle>
          <CardDescription>
            Let's get started by creating your first client
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                type="text"
                placeholder="Enter client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateCustomClient()}
              />
            </div>
            <Button
              onClick={handleCreateCustomClient}
              className="w-full"
              disabled={isCreating || !clientName.trim()}
            >
              {isCreating ? "Creating..." : "Create Client"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleCreateSampleClient}
              variant="outline"
              className="w-full"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Sample Client"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Creates a sample client with pre-filled data for testing
            </p>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={() => navigate("/clients")}
              variant="ghost"
              className="w-full"
            >
              Back to Clients List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFirstClient;