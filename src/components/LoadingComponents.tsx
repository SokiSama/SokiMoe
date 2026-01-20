import React, { useState, useEffect, useRef } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

export function Skeleton({ 
  className = '', 
  variant = 'text',
  width,
  height,
  animated = true 
}: SkeletonProps) {
  const baseClasses = animated ? 'shimmer' : 'skeleton';
  
  const variantClasses = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  showAvatar?: boolean;
  showImage?: boolean;
  lines?: number;
  className?: string;
}

export function SkeletonCard({ 
  showAvatar = false, 
  showImage = false, 
  lines = 3,
  className = ''
}: SkeletonCardProps) {
  return (
    <div className={`card p-6 card-loading ${className}`}>
      {showImage && (
        <Skeleton className="w-full h-48 mb-4" variant="rectangular" />
      )}
      
      <div className="space-y-4">
        {showAvatar && (
          <div className="flex items-center space-x-3">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        )}
        
        <Skeleton className="h-6 w-2/3" />
        <SkeletonText lines={lines} />
        
        <div className="flex space-x-2 pt-2">
          <Skeleton className="h-6 w-16" variant="rectangular" />
          <Skeleton className="h-6 w-20" variant="rectangular" />
        </div>
      </div>
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingDots({ className = '', size = 'md' }: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg'
  };

  return (
    <span className={`loading-dots ${sizeClasses[size]} ${className}`} />
  );
}

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export function LoadingSpinner({ className = '', size = 24 }: LoadingSpinnerProps) {
  return (
    <div 
      className={`animate-spin border-2 border-current border-r-transparent rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

interface FadeTransitionProps {
  children: React.ReactNode;
  show: boolean;
  className?: string;
  delay?: number;
}

export function FadeTransition({ 
  children, 
  show, 
  className = '',
  delay = 0 
}: FadeTransitionProps) {
  if (!show) return null;

  return (
    <div 
      className={`fade-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerContainer({ children, className = '' }: StaggerContainerProps) {
  return (
    <div className={`stagger-children ${className}`}>
      {children}
    </div>
  );
}

interface LoadingTransitionProps {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  appearDelay?: number;
}

export function LoadingTransition({ 
  loading, 
  skeleton, 
  children, 
  className = '',
  delay = 300,
  appearDelay = 120
}: LoadingTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showContent, setShowContent] = useState(!loading);
  const appearTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
      setShowContent(false);
      if (appearTimerRef.current) {
        clearTimeout(appearTimerRef.current);
      }
      appearTimerRef.current = window.setTimeout(() => {
        if (loading) {
          setShowSkeleton(true);
        }
      }, appearDelay);
    } else {
      if (appearTimerRef.current) {
        clearTimeout(appearTimerRef.current);
        appearTimerRef.current = null;
      }
      if (showSkeleton) {
        setShowContent(true);
        setIsTransitioning(true);
        const timer = setTimeout(() => {
          setShowSkeleton(false);
          setIsTransitioning(false);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setShowContent(true);
      }
    }
  }, [loading, showSkeleton, delay, appearDelay]);

  return (
    <div className={`loading-container ${className}`}>
      {/* 骨架屏背景层 */}
      {showSkeleton && (
        <div 
          className={`loading-overlay ${isTransitioning ? 'cross-fade-out' : ''}`}
        >
          {skeleton}
        </div>
      )}
      
      {/* 内容前景层 */}
      {showContent && (
        <div className={`content-layer ${!loading ? 'cross-fade-in' : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
}
