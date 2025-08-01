import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  placeholderSrc?: string;
  alt: string;
  className?: string;
  showRetryButton?: boolean;
  showNetworkStatus?: boolean;
  showLoadingOverlay?: boolean;
  retryDelay?: number;
  maxRetries?: number;
}

export const SafeImage = React.forwardRef<HTMLImageElement, SafeImageProps>(
  ({
    src,
    fallbackSrc = '/placeholder.svg',
    placeholderSrc = '/placeholder.svg',
    alt,
    className,
    showRetryButton = true,
    showNetworkStatus = false,
    showLoadingOverlay = true,
    retryDelay = 1000,
    maxRetries = 3,
    ...props
  }, ref) => {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error' | 'retrying'>('loading');
    const [retryCount, setRetryCount] = useState(0);
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    
    const { isOnline } = useNetworkStatus();

    // Reset state when src changes
    useEffect(() => {
      console.log(`🖼️ SafeImage: Loading new image src: "${src}"`);
      setCurrentSrc(src);
      setImageState('loading');
      setRetryCount(0);
      setShowPlaceholder(true);
    }, [src]);

    const handleImageLoad = useCallback(() => {
      console.log(`✅ SafeImage: Successfully loaded image: "${currentSrc}"`);
      setImageState('loaded');
      setShowPlaceholder(false);
    }, []);

    const handleImageError = useCallback(() => {
      console.error(`❌ SafeImage: Failed to load image: "${currentSrc}"`);
      
      if (retryCount < maxRetries && isOnline) {
        setImageState('retrying');
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setCurrentSrc(`${src}?retry=${retryCount + 1}`);
          setImageState('loading');
        }, retryDelay * Math.pow(2, retryCount)); // Exponential backoff
      } else if (currentSrc !== fallbackSrc) {
        // Try fallback
        setCurrentSrc(fallbackSrc);
        setImageState('loading');
        setRetryCount(0);
      } else {
        // Final fallback to placeholder
        setImageState('error');
        setCurrentSrc(placeholderSrc);
      }
    }, [currentSrc, retryCount, maxRetries, isOnline, retryDelay, src, fallbackSrc, placeholderSrc]);

    const handleRetry = useCallback(() => {
      if (!isOnline) return;
      
      setRetryCount(0);
      setCurrentSrc(src);
      setImageState('loading');
      setShowPlaceholder(true);
    }, [src, isOnline]);

    const renderLoadingOverlay = () => {
      if (imageState === 'loaded' || !showLoadingOverlay) return null;

      return (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-muted/80 backdrop-blur-sm transition-opacity duration-300",
          'opacity-100'
        )}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {imageState === 'loading' || imageState === 'retrying' ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs">
                  {imageState === 'retrying' ? `Retrying... (${retryCount}/${maxRetries})` : 'Loading...'}
                </span>
              </>
            ) : imageState === 'error' ? (
              <>
                <div className="flex items-center gap-1 text-xs text-destructive">
                  {!isOnline && <WifiOff className="h-4 w-4" />}
                  <span>{!isOnline ? 'No connection' : 'Failed to load'}</span>
                </div>
                {showRetryButton && isOnline && (
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/80 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Retry
                  </button>
                )}
              </>
            ) : null}
          </div>
        </div>
      );
    };

    const renderNetworkStatus = () => {
      if (!showNetworkStatus) return null;

      return (
        <div className={cn(
          "absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-opacity",
          isOnline 
            ? "bg-green-500/20 text-green-700 dark:text-green-400" 
            : "bg-red-500/20 text-red-700 dark:text-red-400"
        )}>
          {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      );
    };

    return (
      <div className={cn("relative overflow-hidden", className)}>
        <img
          ref={ref}
          src={currentSrc}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            showPlaceholder ? 'opacity-0' : 'opacity-100'
          )}
          {...props}
        />
        
        {/* Show placeholder immediately */}
        {showPlaceholder && (
          <img
            src={placeholderSrc}
            alt={`${alt} placeholder`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {renderLoadingOverlay()}
        {renderNetworkStatus()}
      </div>
    );
  }
);

SafeImage.displayName = 'SafeImage';