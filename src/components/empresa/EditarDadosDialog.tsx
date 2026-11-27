import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import type { DadosCadastrais } from '../../types/empresa';
import { formatCnpj, maskPhone, onlyDigits } from '../../utils/format';

interface Props {
  inicial: DadosCadastrais;
  onClose: () => void;
  onSave: (dados: DadosCadastrais) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Renderize só quando o diálogo estiver aberto (o estado reinicia a cada abertura). */
export default function EditarDadosDialog({ inicial, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    nomeFantasia: inicial.nomeFantasia,
    inscricaoEstadual: inicial.inscricaoEstadual,
    telefone: maskPhone(inicial.telefone),
    email: inicial.email,
  });

  const telDigits = onlyDigits(form.telefone).length;
  const nomeOk = form.nomeFantasia.trim() !== '';
  const telOk = telDigits === 0 || telDigits === 10 || telDigits === 11;
  const emailOk = form.email.trim() === '' || EMAIL_REGEX.test(form.email.trim());
  const podeSalvar = nomeOk && telOk && emailOk;

  const salvar = () =>
    onSave({
      ...inicial,
      nomeFantasia: form.nomeFantasia.trim(),
      inscricaoEstadual: form.inscricaoEstadual.trim(),
      telefone: form.telefone,
      email: form.email.trim().toLowerCase(),
    });

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Editar dados cadastrais</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, pt: 1, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } }}>
          <TextField label="Razão social" value={inicial.razaoSocial} disabled sx={{ gridColumn: { sm: '1 / -1' } }} />
          <TextField
            label="CNPJ"
            value={formatCnpj(inicial.cnpj)}
            disabled
            helperText="Dado oficial, não pode ser alterado."
            sx={{ gridColumn: { sm: '1 / -1' } }}
          />
          <TextField
            label="Nome fantasia"
            value={form.nomeFantasia}
            error={!nomeOk}
            helperText={!nomeOk ? 'Informe o nome fantasia.' : undefined}
            onChange={(e) => setForm({ ...form, nomeFantasia: e.target.value })}
            sx={{ gridColumn: { sm: '1 / -1' } }}
          />
          <TextField
            label="Inscrição estadual"
            value={form.inscricaoEstadual}
            onChange={(e) => setForm({ ...form, inscricaoEstadual: e.target.value })}
          />
          <TextField
            label="Telefone"
            value={form.telefone}
            placeholder="(00) 00000-0000"
            error={!telOk}
            helperText={!telOk ? 'Use DDD + número.' : undefined}
            onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })}
          />
          <TextField
            label="E-mail"
            type="email"
            value={form.email}
            error={!emailOk}
            helperText={!emailOk ? 'Digite um e-mail válido.' : undefined}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={{ gridColumn: { sm: '1 / -1' } }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" disabled={!podeSalvar} onClick={salvar}>
          Salvar alterações
        </Button>
      </DialogActions>
    </Dialog>
  );
}