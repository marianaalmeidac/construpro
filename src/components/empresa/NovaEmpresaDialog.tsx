import { useEffect, useState } from 'react';
import {
  Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography,
} from '@mui/material';
import { buscarCnpj, getErrorMessage, isAbortError } from '../../services/brasilApi';
import type { CnpjData } from '../../types/empresa';
import { formatCnpj, onlyDigits, titleCase } from '../../utils/format';

interface Props {
  onClose: () => void;
  onAdd: (dados: CnpjData) => void;
}

/** Renderize este componente só quando o diálogo estiver aberto. */
export default function NovaEmpresaDialog({ onClose, onAdd }: Props) {
  const [cnpj, setCnpj] = useState('');
  const [dados, setDados] = useState<CnpjData | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const digits = onlyDigits(cnpj);

  useEffect(() => {
    setDados(null);
    setErro(null);
    if (digits.length !== 14) return;
    const controller = new AbortController();
    setBuscando(true);
    buscarCnpj(digits, controller.signal)
      .then(setDados)
      .catch((err) => {
        if (!isAbortError(err)) setErro(getErrorMessage(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setBuscando(false);
      });
    return () => controller.abort();
  }, [digits]);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Cadastrar nova empresa</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>Digite o CNPJ e os dados são preenchidos automaticamente.</DialogContentText>
        <TextField
          autoFocus fullWidth label="CNPJ" placeholder="00.000.000/0000-00" value={formatCnpj(cnpj)}
          onChange={(e) => setCnpj(e.target.value)} error={!!erro}
          slotProps={{ input: { endAdornment: buscando ? <CircularProgress size={18} /> : undefined } }}
        />
        {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
        {dados && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>{titleCase(dados.nome_fantasia) || titleCase(dados.razao_social)}</Typography>
            <Typography variant="body2">
              {titleCase(dados.razao_social)} · {titleCase(dados.municipio)}/{dados.uf}
            </Typography>
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" disabled={!dados} onClick={() => dados && onAdd(dados)}>
          Adicionar empresa
        </Button>
      </DialogActions>
    </Dialog>
  );
}