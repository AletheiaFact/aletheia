/**
 * Skeleton Presets
 * Pre-built skeleton patterns for common loading scenarios
 */

import Skeleton from './Skeleton';
import { Box } from '@mui/material';
import { spacing, flexbox } from '../../styles';

/**
 * SkeletonCard - Card loading skeleton
 *
 * @example
 * <SkeletonCard />
 */
export const SkeletonCard: React.FC<{ height?: number }> = ({ height = 200 }) => (
  <Box sx={{ padding: spacing.xl }}>
    <Skeleton variant="rounded" width="100%" height={height} />
  </Box>
);

/**
 * SkeletonAvatar - Avatar loading skeleton
 *
 * @example
 * <SkeletonAvatar size={40} />
 */
export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Skeleton variant="circular" width={size} height={size} />
);

/**
 * SkeletonText - Text loading skeleton with multiple lines
 *
 * @example
 * <SkeletonText lines={3} />
 */
export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 1 }) => (
  <Skeleton variant="text" count={lines} />
);

/**
 * SkeletonProfile - Profile card loading skeleton
 *
 * @example
 * <SkeletonProfile />
 */
export const SkeletonProfile: React.FC = () => (
  <Box sx={{ display: 'flex', gap: spacing.md, padding: spacing.md }}>
    <SkeletonAvatar size={60} />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="40%" height={20} />
      <Skeleton variant="text" width="60%" height={16} />
      <Skeleton variant="text" width="80%" height={14} />
    </Box>
  </Box>
);

/**
 * SkeletonList - List items loading skeleton
 *
 * @example
 * <SkeletonList items={5} />
 */
export const SkeletonList: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
    {Array.from({ length: items }).map((_, index) => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          gap: spacing.md,
          padding: spacing.md,
          border: '1px solid #eeeeee',
          borderRadius: '10px',
        }}
      >
        <SkeletonAvatar size={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={18} />
          <Skeleton variant="text" width="90%" height={14} />
        </Box>
      </Box>
    ))}
  </Box>
);

/**
 * SkeletonReviewCard - Review card loading skeleton (Aletheia specific)
 *
 * @example
 * <SkeletonReviewCard />
 */
export const SkeletonReviewCard: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      gap: spacing.md,
      padding: spacing.xl,
      background: 'white',
      border: '1px solid #eeeeee',
      borderRadius: '10px',
    }}
  >
    {/* Personality avatar */}
    <Box>
      <Skeleton variant="circular" width={120} height={120} />
    </Box>

    {/* Review content */}
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {/* Title */}
      <Skeleton variant="text" width="70%" height={24} />

      {/* Classification and info */}
      <Box sx={{ display: 'flex', gap: spacing.sm }}>
        <Skeleton variant="rounded" width={100} height={32} />
        <Skeleton variant="text" width="40%" height={16} />
      </Box>

      {/* Content */}
      <Skeleton variant="text" count={3} />

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: spacing.sm, marginTop: spacing.md }}>
        <Skeleton variant="rounded" width={80} height={40} />
        <Skeleton variant="rounded" width={80} height={40} />
      </Box>
    </Box>
  </Box>
);

/**
 * SkeletonClaimCard - Claim card loading skeleton (Aletheia specific)
 *
 * @example
 * <SkeletonClaimCard />
 */
export const SkeletonClaimCard: React.FC = () => (
  <Box
    sx={{
      padding: spacing.xl,
      background: 'white',
      border: '1px solid #eeeeee',
      borderRadius: '10px',
    }}
  >
    {/* Header with personality */}
    <Box sx={{ display: 'flex', gap: spacing.md, marginBottom: spacing.md }}>
      <SkeletonAvatar size={48} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="40%" height={18} />
        <Skeleton variant="text" width="30%" height={14} />
      </Box>
    </Box>

    {/* Claim title */}
    <Skeleton variant="text" width="90%" height={24} />
    <Skeleton variant="text" width="70%" height={24} />

    {/* Claim content */}
    <Box sx={{ marginTop: spacing.md }}>
      <Skeleton variant="text" count={2} />
    </Box>

    {/* Footer with stats */}
    <Box sx={{ display: 'flex', gap: spacing.md, marginTop: spacing.md }}>
      <Skeleton variant="text" width={60} height={16} />
      <Skeleton variant="text" width={60} height={16} />
      <Skeleton variant="text" width={60} height={16} />
    </Box>
  </Box>
);

/**
 * SkeletonTable - Table loading skeleton
 *
 * @example
 * <SkeletonTable rows={5} columns={4} />
 */
export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 3,
}) => (
  <Box>
    {/* Header */}
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: spacing.md,
        padding: spacing.md,
        borderBottom: '1px solid #eeeeee',
      }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} variant="text" height={18} />
      ))}
    </Box>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Box
        key={rowIndex}
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: spacing.md,
          padding: spacing.md,
          borderBottom: '1px solid #f5f5f5',
        }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" height={16} />
        ))}
      </Box>
    ))}
  </Box>
);

/**
 * SkeletonImage - Image loading skeleton
 *
 * @example
 * <SkeletonImage width={300} height={200} />
 */
export const SkeletonImage: React.FC<{ width?: number | string; height?: number | string; rounded?: boolean }> = ({
  width = '100%',
  height = 200,
  rounded = false,
}) => (
  <Skeleton
    variant={rounded ? 'rounded' : 'rectangular'}
    width={width}
    height={height}
    animation="wave"
  />
);
