import { useState } from 'react';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box, Card, CardActionArea, Chip, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography,
} from '@mui/material';
import type { Empresa } from '../../types/empresa';
import { formatCnpj } from '../../utils/format';

interface EmpresaCardProps {
  empresa: Empresa;
  selected: boolean;
  /** false quando é a única empresa ativa (não pode inativar nem excluir) */
  podeAlterar: boolean;
  onSelect: (id: string) => void;
  onToggleAtiva: (id: string) => void;
  onExcluir: (id: string) => void;
}

export default function EmpresaCard({ empresa, selected, podeAlterar, onSelect, onToggleAtiva, onExcluir }: EmpresaCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const fecharMenu = () => setAnchorEl(null);
  const bloqueado = empresa.ativa && !podeAlterar;

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        borderRadius: 2.5,
        borderColor: selected ? 'primary.main' : 'divider',
        borderWidth: selected ? 2 : 1,
        bgcolor: empresa.ativa ? undefined : 'action.hover',
      }}
    >
      <CardActionArea
        disabled={!empresa.ativa}
        onClick={() => onSelect(empresa.id)}
        aria-pressed={selected}
        sx={{ p: 2, pr: 6, opacity: empresa.ativa ? 1 : 0.65 }}
      >
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
          <ApartmentIcon color={selected ? 'primary' : 'action'} />
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 700 }}>
              {empresa.dados.nomeFantasia}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              CNPJ {formatCnpj(empresa.dados.cnpj)}
            </Typography>
            {selected && (
              <Chip size="small" color="primary" label="Selecionada" sx={{ display: 'flex', width: 'fit-content', mt: 0.5 }} />
            )}
            {!empresa.ativa && (
              <Chip size="small" variant="outlined" label="Inativa" sx={{ display: 'flex', width: 'fit-content', mt: 0.5 }} />
            )}
          </Box>
        </Stack>
      </CardActionArea>

      <IconButton
        size="small"
        aria-label={`Opções de ${empresa.dados.nomeFantasia}`}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ position: 'absolute', top: 6, right: 6 }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={fecharMenu}>
        <MenuItem
          disabled={bloqueado}
          onClick={() => {
            fecharMenu();
            onToggleAtiva(empresa.id);
          }}
        >
          <ListItemIcon>{empresa.ativa ? <BlockIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}</ListItemIcon>
          <ListItemText>{empresa.ativa ? 'Inativar' : 'Reativar'}</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={bloqueado}
          sx={{ color: 'error.main' }}
          onClick={() => {
            fecharMenu();
            onExcluir(empresa.id);
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}