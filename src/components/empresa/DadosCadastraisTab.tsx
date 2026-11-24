import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import { Box, Button, Chip, Typography } from '@mui/material';
import type { DadosCadastrais } from '../../types/empresa';
import { formatCnpj, formatDate } from '../../utils/format';
import InfoField from '../common/InfoField';
import SectionCard from '../common/SectionCard';

interface Props {
  dados: DadosCadastrais;
  onEdit: () => void;
}

export default function DadosCadastraisTab({ dados, onEdit }: Props) {
  const ativa = dados.situacao.toLowerCase() === 'ativa';

  return (
    <SectionCard
      title="Dados cadastrais"
      subtitle="Informações de identificação e contato da empresa"
      icon={<DescriptionIcon fontSize="small" />}
      action={
        <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={onEdit}>
          Editar dados
        </Button>
      }
    >
      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } }}>
        <InfoField label="Nome fantasia" value={dados.nomeFantasia} />
        <InfoField label="Razão social" value={dados.razaoSocial} />
        <InfoField label="CNPJ" value={formatCnpj(dados.cnpj)} />
        <InfoField label="Inscrição estadual" value={dados.inscricaoEstadual} />
        <InfoField
          label="Situação cadastral"
          value={dados.situacao && <Chip size="small" color={ativa ? 'success' : 'warning'} label={dados.situacao} />}
        />
        <InfoField label="Atividade principal" value={dados.atividade} />
        <InfoField label="Porte" value={dados.porte} />
        <InfoField label="Início das atividades" value={formatDate(dados.inicioAtividade)} />
        <InfoField label="Telefone" value={dados.telefone} />
        <InfoField label="E-mail" value={dados.email} />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
        Razão social e CNPJ são dados oficiais e não podem ser alterados. Nome fantasia, inscrição estadual,
        telefone e e-mail podem ser atualizados.
      </Typography>
    </SectionCard>
  );
}