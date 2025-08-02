import { useState, useEffect, useCallback } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface QueuedOperation<T = any> {
  id: string;
  operation: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: any) => void;
  retryCount: number;
  maxRetries: number;
  priority: number;
  timestamp: number;
  description: string;
}

interface OfflineQueueState {
  pendingOperations: number;
  isProcessing: boolean;
  lastProcessedAt?: number;
  errors: Array<{ id: string; error: any; timestamp: number }>;
}

export function useOfflineQueue() {
  const { isOnline } = useNetworkStatus();
  const [queue, setQueue] = useState<QueuedOperation[]>([]);
  const [queueState, setQueueState] = useState<OfflineQueueState>({
    pendingOperations: 0,
    isProcessing: false,
    errors: [],
  });

  // Process queue when coming back online
  useEffect(() => {
    if (isOnline && queue.length > 0 && !queueState.isProcessing) {
      processQueue();
    }
  }, [isOnline, queue.length, queueState.isProcessing]);

  const addToQueue = useCallback(<T,>(
    operation: () => Promise<T>,
    options: {
      description: string;
      priority?: number;
      maxRetries?: number;
    } = { description: 'Unknown operation' }
  ): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const queuedOp: QueuedOperation<T> = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        operation,
        resolve,
        reject,
        retryCount: 0,
        maxRetries: options.maxRetries || 3,
        priority: options.priority || 0,
        timestamp: Date.now(),
        description: options.description,
      };

      setQueue(prevQueue => {
        const newQueue = [...prevQueue, queuedOp];
        // Sort by priority (higher first) then by timestamp (older first)
        return newQueue.sort((a, b) => {
          if (a.priority !== b.priority) {
            return b.priority - a.priority;
          }
          return a.timestamp - b.timestamp;
        });
      });

      setQueueState(prev => ({
        ...prev,
        pendingOperations: prev.pendingOperations + 1,
      }));

      // If online, try to process immediately
      if (isOnline) {
        processQueue();
      }
    });
  }, [isOnline]);

  const processQueue = useCallback(async () => {
    if (queueState.isProcessing || queue.length === 0) {
      return;
    }

    setQueueState(prev => ({ ...prev, isProcessing: true }));

    const currentQueue = [...queue];
    const processedIds: string[] = [];
    const failedOperations: Array<{ id: string; error: any; timestamp: number }> = [];

    for (const queuedOp of currentQueue) {
      if (!isOnline) {
        break; // Stop processing if we go offline
      }

      try {
        console.log(`Processing queued operation: ${queuedOp.description}`);
        const result = await queuedOp.operation();
        queuedOp.resolve(result);
        processedIds.push(queuedOp.id);
      } catch (error) {
        queuedOp.retryCount++;
        
        if (queuedOp.retryCount >= queuedOp.maxRetries) {
          console.error(`Failed to process queued operation after ${queuedOp.retryCount} attempts:`, error);
          queuedOp.reject(error);
          processedIds.push(queuedOp.id);
          failedOperations.push({
            id: queuedOp.id,
            error,
            timestamp: Date.now(),
          });
        } else {
          console.warn(`Retrying queued operation (${queuedOp.retryCount}/${queuedOp.maxRetries}): ${queuedOp.description}`);
          // Keep in queue for retry
        }
      }
    }

    // Remove processed operations from queue
    setQueue(prevQueue => prevQueue.filter(op => !processedIds.includes(op.id)));
    
    setQueueState(prev => ({
      ...prev,
      isProcessing: false,
      pendingOperations: Math.max(0, prev.pendingOperations - processedIds.length),
      lastProcessedAt: Date.now(),
      errors: [...prev.errors, ...failedOperations].slice(-10), // Keep last 10 errors
    }));
  }, [queue, isOnline, queueState.isProcessing]);

  const clearQueue = useCallback(() => {
    // Reject all pending operations
    queue.forEach(op => {
      op.reject(new Error('Queue cleared'));
    });
    
    setQueue([]);
    setQueueState({
      pendingOperations: 0,
      isProcessing: false,
      errors: [],
    });
  }, [queue]);

  const retryFailedOperations = useCallback(() => {
    setQueueState(prev => ({
      ...prev,
      errors: [],
    }));
    
    if (isOnline) {
      processQueue();
    }
  }, [isOnline, processQueue]);

  return {
    addToQueue,
    processQueue,
    clearQueue,
    retryFailedOperations,
    queueState,
    isOnline,
    queueLength: queue.length,
  };
}
