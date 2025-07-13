import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus } from "lucide-react";

const EmptyClientsList: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle>No Clients Yet</CardTitle>
          <CardDescription>
            You haven't added any clients to your practice yet. Start by creating your first client.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link to="/clients/new-page">
            <Button className="w-full" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Client
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Once you add clients, they'll appear here and you can manage their birth plans, notes, and progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyClientsList;