import EditIcon from '@mui/icons-material/EditOutlined';
import MapIcon from '@mui/icons-material/MapOutlined';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import { Box, Button, Chip, Stack } from '@mui/material';
import type { EnderecoEntrega } from '../../types/empresa';
import { formatCep } from '../../utils/format';
import ErrorState from '../common/ErrorState';
import InfoField from '../common/InfoField';
import SectionCard from '../common/SectionCard';

interface Props {
  entrega: EnderecoEntrega | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: () => void;
}

export default function EnderecoEntregaTab({ entrega, loading, error, onRetry, onEdit }: Props) {
  const mapsUrl = entrega
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${entrega.rua}, ${entrega.numero}, ${entrega.cidade} - ${entrega.uf}`,
      )}`
    : '#';

  return (
    <SectionCard
      title="Endereço de entrega padrão"
      subtitle="Usado nas solicitações de compra, preenchido pelo CEP"
      icon={<PlaceIcon fontSize="small" />}
      action={
        <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={onEdit} disabled={loading || !entrega}>
          Editar endereço
        </Button>
      }
    >
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : (
        <>
          <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } }}>
            <InfoField loading={loading} label="Local" value={entrega && <>{entrega.local} <Chip size="small" label="Padrão" color="primary" variant="outlined" sx={{ ml: 0.5 }} /></>} />
            <InfoField loading={loading} label="CEP" value={entrega && formatCep(entrega.cep)} />
            <InfoField loading={loading} label="Rua" value={entrega && `${entrega.rua}, ${entrega.numero}`} />
            <InfoField loading={loading} label="Complemento" value={entrega?.complemento} />
            <InfoField loading={loading} label="Bairro" value={entrega?.bairro} />
            <InfoField loading={loading} label="Cidade / UF" value={entrega && `${entrega.cidade} / ${entrega.uf}`} />
          </Box>
          <Stack direction="row" sx={{ mt: 3 }}>
            <Button
              size="small"
              startIcon={<MapIcon />}
              component="a"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!entrega}
            >
              Ver no mapa
            </Button>
          </Stack>
        </>
      )}
    </SectionCard>
  );
}