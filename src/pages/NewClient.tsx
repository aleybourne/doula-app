import React from "react";
import { Button } from "@/components/ui/button";
import { AddClientForm } from "@/components/clients/AddClientForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NewClient: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/clients">
            <Button variant="ghost" className="mb-4 p-0 h-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Client</h1>
          <p className="text-gray-600 mt-2">
            Add a new client to your doula practice with all their essential information.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <AddClientForm />
        </div>
      </div>
    </div>
  );
};

export default NewClient;