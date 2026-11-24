import GroupIcon from '@mui/icons-material/GroupOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import { Avatar, Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import type { PerfilUsuario, UsuarioEmpresa } from '../../types/empresa';
import SectionCard from '../common/SectionCard';

const COR_PERFIL: Record<PerfilUsuario, 'primary' | 'secondary' | 'default'> = {
  Administrador: 'primary',
  Editor: 'secondary',
  Visualizador: 'default',
};

interface Props {
  usuarios: UsuarioEmpresa[];
  onInvite: () => void;
}

const iniciais = (nome: string) =>
  nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export default function UsuariosAcessosTab({ usuarios, onInvite }: Props) {
  return (
    <SectionCard
      title="Usuários e acessos"
      subtitle="Quem pode comprar em nome desta empresa"
      icon={<GroupIcon fontSize="small" />}
      action={
        <Button variant="outlined" size="small" startIcon={<PersonAddIcon />} onClick={onInvite}>
          Convidar usuário
        </Button>
      }
    >
      {usuarios.length === 0 ? (
        <Typography color="text.secondary">Nenhum usuário vinculado ainda. Convide alguém para começar.</Typography>
      ) : (
        <Stack divider={<Divider flexItem />} sx={{ gap: 1.5 }}>
          {usuarios.map((u) => (
            <Stack key={u.id} direction="row" sx={{ alignItems: 'center', gap: 2, pt: 1.5, '&:first-of-type': { pt: 0 } }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: 14 }}>{iniciais(u.nome)}</Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 700 }}>{u.nome}</Typography>
                  <Chip size="small" label={u.perfil} color={COR_PERFIL[u.perfil]} variant={u.perfil === 'Visualizador' ? 'outlined' : 'filled'} />
                </Stack>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {u.email} · {u.telefone}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}