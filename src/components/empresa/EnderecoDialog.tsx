import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
} from '@mui/material';
import { buscarCep, getErrorMessage, isAbortError } from '../../services/brasilApi';
import type { EnderecoEntrega } from '../../types/empresa';
import { formatCep, onlyDigits } from '../../utils/format';

interface Props {
  inicial: EnderecoEntrega | null;
  onClose: () => void;
  onSave: (endereco: EnderecoEntrega) => void;
}

const VAZIO: EnderecoEntrega = { local: '', cep: '', rua: '', bairro: '', cidade: '', uf: '', numero: '', complemento: '' };

/** Renderize este componente só quando o diálogo estiver aberto (o estado reinicia a cada abertura). */
export default function EnderecoDialog({ inicial, onClose, onSave }: Props) {
  const [form, setForm] = useState<EnderecoEntrega>(inicial ?? VAZIO);
  const [cepConsultado, setCepConsultado] = useState(onlyDigits(inicial?.cep ?? ''));
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const cepDigits = onlyDigits(form.cep);

  // Busca o CEP automaticamente quando o usuário completa os 8 dígitos
  useEffect(() => {
    if (cepDigits.length !== 8 || cepDigits === cepConsultado) return;
    const controller = new AbortController();
    setBuscando(true);
    setErro(null);
    buscarCep(cepDigits, controller.signal)
      .then((cep) => {
        setForm((f) => ({ ...f, rua: cep.street ?? '', bairro: cep.neighborhood ?? '', cidade: cep.city, uf: cep.state }));
        setCepConsultado(cepDigits);
      })
      .catch((err) => {
        if (!isAbortError(err)) setErro(getErrorMessage(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setBuscando(false);
      });
    return () => controller.abort();
  }, [cepDigits, cepConsultado]);

  const podeSalvar = cepDigits.length === 8 && cepDigits === cepConsultado && form.numero.trim() !== '' && form.local.trim() !== '';

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Editar endereço de entrega</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, pt: 1, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } }}>
          <TextField
            label="Nome do local" value={form.local} sx={{ gridColumn: { sm: '1 / -1' } }}
            onChange={(e) => setForm({ ...form, local: e.target.value })}
          />
          <TextField
            label="CEP" value={formatCep(form.cep)} placeholder="00000-000" error={!!erro}
            onChange={(e) => setForm({ ...form, cep: e.target.value })}
            slotProps={{ input: { endAdornment: buscando ? <CircularProgress size={18} /> : undefined } }}
          />
          <TextField label="Número" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} />
          <TextField label="Rua" value={form.rua} disabled sx={{ gridColumn: { sm: '1 / -1' } }} />
          <TextField label="Bairro" value={form.bairro} disabled />
          <TextField label="Cidade / UF" value={form.cidade && `${form.cidade} / ${form.uf}`} disabled />
          <TextField
            label="Complemento" value={form.complemento} sx={{ gridColumn: { sm: '1 / -1' } }}
            onChange={(e) => setForm({ ...form, complemento: e.target.value })}
          />
        </Box>
        {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" disabled={!podeSalvar} onClick={() => onSave(form)}>
          Salvar endereço
        </Button>
      </DialogActions>
    </Dialog>
  );
}