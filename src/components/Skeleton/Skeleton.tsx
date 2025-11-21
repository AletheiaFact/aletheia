/**
 * Skeleton Component
 * Loading placeholder component for better UX during data fetching
 *
 * Based on modern skeleton loading patterns, provides visual feedback
 * while content is loading.
 */

import styled, { keyframes, css } from 'styled-components';
import { semanticColors, borderRadius, spacing } from '../../styles';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

interface SkeletonProps {
  /**
   * Skeleton variant
   */
  variant?: SkeletonVariant;

  /**
   * Width (CSS value)
   */
  width?: string | number;

  /**
   * Height (CSS value)
   */
  height?: string | number;

  /**
   * Animation type
   */
  animation?: SkeletonAnimation;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Number of skeleton lines (for text variant)
   */
  count?: number;
}

const pulseAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

const waveAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const getVariantStyles = (variant: SkeletonVariant) => {
  switch (variant) {
    case 'text':
      return `
        height: 1em;
        border-radius: ${borderRadius.sm};
        transform-origin: 0 60%;
        transform: scale(1, 0.6);
      `;
    case 'circular':
      return `
        border-radius: ${borderRadius.circle};
      `;
    case 'rounded':
      return `
        border-radius: ${borderRadius.lg};
      `;
    case 'rectangular':
    default:
      return `
        border-radius: 0;
      `;
  }
};

const getAnimationStyles = (animation: SkeletonAnimation) => {
  switch (animation) {
    case 'pulse':
      return css`
        animation: ${pulseAnimation} 1.5s ease-in-out infinite;
      `;
    case 'wave':
      return css`
        position: relative;
        overflow: hidden;

        &::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.5),
            transparent
          );
          animation: ${waveAnimation} 1.5s linear infinite;
        }
      `;
    case 'none':
    default:
      return '';
  }
};

const StyledSkeleton = styled.span<{
  variant: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  animation: SkeletonAnimation;
}>`
  display: block;
  background-color: ${semanticColors.surface.tertiary};
  width: ${props => props.width ? (typeof props.width === 'number' ? `${props.width}px` : props.width) : '100%'};
  height: ${props => props.height ? (typeof props.height === 'number' ? `${props.height}px` : props.height) : 'auto'};

  ${props => getVariantStyles(props.variant)}
  ${props => getAnimationStyles(props.animation)}
`;

const SkeletonGroup = styled.div<{ count: number }>`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

/**
 * Skeleton - Loading placeholder component
 *
 * @example
 * // Text skeleton
 * <Skeleton variant="text" width="60%" />
 *
 * @example
 * // Multiple lines
 * <Skeleton variant="text" count={3} />
 *
 * @example
 * // Avatar skeleton
 * <Skeleton variant="circular" width={40} height={40} />
 *
 * @example
 * // Card skeleton
 * <Skeleton variant="rounded" width="100%" height={200} />
 */
const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  count = 1,
}) => {
  if (count > 1) {
    return (
      <SkeletonGroup count={count} className={className}>
        {Array.from({ length: count }).map((_, index) => (
          <StyledSkeleton
            key={index}
            variant={variant}
            width={width}
            height={height}
            animation={animation}
          />
        ))}
      </SkeletonGroup>
    );
  }

  return (
    <StyledSkeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      className={className}
    />
  );
};

export default Skeleton;
