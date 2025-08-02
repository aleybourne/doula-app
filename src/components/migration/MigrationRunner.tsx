import React, { useEffect, useState } from 'react';
import { migrateAllStaticAssets } from '@/utils/assetMigration';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, Download, CheckCircle } from 'lucide-react';

export const MigrationRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const runMigration = async () => {
    setIsRunning(true);
    try {
      console.log('Starting asset migration...');
      await migrateAllStaticAssets();
      setHasRun(true);
      toast({
        title: "Migration Complete",
        description: "All static assets have been migrated to Firebase Storage",
      });
    } catch (error) {
      console.error('Migration failed:', error);
      toast({
        title: "Migration Failed",
        description: "There was an error migrating assets. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Auto-run migration on component mount if not already run
  useEffect(() => {
    const migrationStatus = localStorage.getItem('assets-migrated');
    if (!migrationStatus) {
      runMigration().then(() => {
        localStorage.setItem('assets-migrated', 'true');
      });
    } else {
      setHasRun(true);
    }
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 bg-background/90 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-3">
        {isRunning ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Migrating assets...</span>
          </>
        ) : hasRun ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Assets migrated</span>
          </>
        ) : (
          <>
            <Button
              onClick={runMigration}
              disabled={isRunning}
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Run Migration
            </Button>
          </>
        )}
      </div>
    </div>
  );
};