import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import { Alert, Box } from '@mui/material';
import type { CondicoesComerciais } from '../../types/empresa';
import { formatCurrency } from '../../utils/format';
import InfoField from '../common/InfoField';
import SectionCard from '../common/SectionCard';

export default function CondicoesComerciaisTab({ condicoes }: { condicoes: CondicoesComerciais }) {
  return (
    <SectionCard
      title="Condições comerciais"
      subtitle="Valores usados nas solicitações de compra desta empresa"
      icon={<LocalOfferIcon fontSize="small" />}
    >
      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, mb: 3 }}>
        <InfoField label="Prazo de pagamento" value={condicoes.prazoPagamento} />
        <InfoField label="Desconto comercial padrão" value={`${condicoes.descontoPadrao}%`} />
        <InfoField label="Prazo estimado de entrega" value={condicoes.prazoEntrega} />
        <InfoField label="Limite de crédito" value={formatCurrency(condicoes.limiteCredito)} />
        <InfoField label="Frete grátis em pedidos acima de" value={formatCurrency(condicoes.freteGratisAcimaDe)} />
      </Box>
      <Alert severity="info">Condições demonstrativas, sem valor comercial real.</Alert>
    </SectionCard>
  );
}