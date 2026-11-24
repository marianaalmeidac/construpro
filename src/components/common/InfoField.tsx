import type { ReactNode } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

interface InfoFieldProps {
  label: string;
  value?: ReactNode;
  loading?: boolean;
}

export default function InfoField({ label, value, loading = false }: InfoFieldProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      {loading ? (
        <Skeleton width="70%" />
      ) : (
        <Typography variant="body2" component="div" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
          {value || '—'}
        </Typography>
      )}
    </Box>
  );
}