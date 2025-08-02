import React from 'react';
import { Wifi, WifiOff, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';

interface NetworkStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  showDetails = false,
  className = '',
}) => {
  const { isOnline, connection } = useNetworkStatus();
  const { queueState, queueLength, retryFailedOperations } = useOfflineQueue();

  const getConnectionQuality = () => {
    if (!connection?.effectiveType) return null;
    
    const type = connection.effectiveType;
    if (type === '4g') return 'excellent';
    if (type === '3g') return 'good';
    if (type === '2g') return 'poor';
    return 'unknown';
  };

  const quality = getConnectionQuality();

  if (!showDetails) {
    // Simple indicator
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {isOnline ? (
          <div className="flex items-center gap-1 text-green-600">
            <Wifi className="h-4 w-4" />
            <span className="text-xs">Online</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-600">
            <WifiOff className="h-4 w-4" />
            <span className="text-xs">Offline</span>
          </div>
        )}
        
        {queueLength > 0 && (
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {queueLength} pending
          </Badge>
        )}
      </div>
    );
  }

  // Detailed indicator
  return (
    <div className={`bg-background border rounded-lg p-3 space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
          <span className="font-medium">
            {isOnline ? 'Online' : 'Offline'}
          </span>
          
          {quality && (
            <Badge variant={quality === 'excellent' ? 'default' : quality === 'good' ? 'secondary' : 'destructive'}>
              {quality}
            </Badge>
          )}
        </div>

        {queueState.pendingOperations > 0 && (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            {queueState.pendingOperations} queued
          </Badge>
        )}
      </div>

      {/* Connection details */}
      {isOnline && connection && (
        <div className="text-xs text-muted-foreground space-y-1">
          {connection.effectiveType && (
            <div>Connection: {connection.effectiveType.toUpperCase()}</div>
          )}
          {connection.downlink && (
            <div>Speed: {connection.downlink} Mbps</div>
          )}
          {connection.rtt && (
            <div>Latency: {connection.rtt}ms</div>
          )}
        </div>
      )}

      {/* Queue status */}
      {(queueState.pendingOperations > 0 || queueState.errors.length > 0) && (
        <div className="space-y-2 pt-2 border-t">
          {queueState.isProcessing && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Clock className="h-3 w-3 animate-spin" />
              Processing operations...
            </div>
          )}

          {queueState.lastProcessedAt && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-3 w-3" />
              Last sync: {new Date(queueState.lastProcessedAt).toLocaleTimeString()}
            </div>
          )}

          {queueState.errors.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="h-3 w-3" />
                {queueState.errors.length} failed operations
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={retryFailedOperations}
                className="text-xs"
              >
                Retry Failed
              </Button>
            </div>
          )}
        </div>
      )}

      {!isOnline && (
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Your changes will be saved when you're back online.
        </div>
      )}
    </div>
  );
};