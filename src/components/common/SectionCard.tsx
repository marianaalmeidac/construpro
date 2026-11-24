import type { ReactNode } from 'react';
import { alpha, Box, Paper, Stack, Typography } from '@mui/material';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}

export default function SectionCard({ title, subtitle, icon, action, children }: SectionCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5, mb: 2.5 }}
      >
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
          {icon && (
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 36,
                height: 36,
                borderRadius: 2,
                color: 'primary.main',
                bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
              }}
            >
              {icon}
            </Box>
          )}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
        {action}
      </Stack>
      {children}
    </Paper>
  );
}