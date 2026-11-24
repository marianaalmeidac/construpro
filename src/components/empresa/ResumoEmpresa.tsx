import type { ReactNode } from 'react';
import BusinessIcon from '@mui/icons-material/BusinessCenterOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailableOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShippingOutlined';
import PercentIcon from '@mui/icons-material/PercentOutlined';
import { alpha, Box, Stack, Typography } from '@mui/material';
import type { CondicoesComerciais } from '../../types/empresa';
import SectionCard from '../common/SectionCard';

interface ResumoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function ResumoItem({ icon, label, value }: ResumoItemProps) {
  return (
    <Stack
      direction="row"
      sx={{ alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: (t) => alpha(t.palette.primary.main, 0.06) }}
    >
      <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function ResumoEmpresa({ condicoes }: { condicoes: CondicoesComerciais }) {
  return (
    <SectionCard title="Resumo da empresa" icon={<BusinessIcon fontSize="small" />}>
      <Stack sx={{ gap: 1.5 }}>
        <ResumoItem icon={<EventAvailableIcon />} label="Condição de pagamento" value={condicoes.prazoPagamento} />
        <ResumoItem icon={<PercentIcon />} label="Desconto padrão" value={`${condicoes.descontoPadrao}%`} />
        <ResumoItem icon={<LocalShippingIcon />} label="Prazo médio de entrega" value={condicoes.prazoEntrega} />
      </Stack>
    </SectionCard>
  );
}