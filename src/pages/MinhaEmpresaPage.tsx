import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import GroupIcon from '@mui/icons-material/GroupOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import { Alert, Box, Button, Snackbar, Tab, Tabs, Typography } from '@mui/material';
import type { AlertColor } from '@mui/material';
import ConfirmDialog from '../components/common/ConfirmDialog';
import SectionCard from '../components/common/SectionCard';
import CondicoesComerciaisTab from '../components/empresa/CondicoesComerciaisTab';
import DadosCadastraisTab from '../components/empresa/DadosCadastraisTab';
import EditarDadosDialog from '../components/empresa/EditarDadosDialog';
import EmpresaCard from '../components/empresa/EmpresaCard';
import EnderecoDialog from '../components/empresa/EnderecoDialog';
import EnderecoEntregaTab from '../components/empresa/EnderecoEntregaTab';
import NovaEmpresaDialog from '../components/empresa/NovaEmpresaDialog';
import ResumoEmpresa from '../components/empresa/ResumoEmpresa';
import UsuariosAcessosTab from '../components/empresa/UsuariosAcessosTab';
import { CONDICOES_PADRAO, EMPRESAS_INICIAIS } from '../data/empresas';
import { buscarCep, getErrorMessage, isAbortError } from '../services/brasilApi';
import type { CnpjData, DadosCadastrais, Empresa, EnderecoEntrega } from '../types/empresa';
import { formatPhone, onlyDigits, titleCase } from '../utils/format';

interface Aviso {
  message: string;
  severity: AlertColor;
}

export default function MinhaEmpresaPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>(EMPRESAS_INICIAIS);
  const [empresaId, setEmpresaId] = useState(EMPRESAS_INICIAIS[0].id);
  const [aba, setAba] = useState(0);

  // Endereço de entrega (BrasilAPI - CEP)
  const [entrega, setEntrega] = useState<EnderecoEntrega | null>(null);
  const [carregandoEntrega, setCarregandoEntrega] = useState(true);
  const [erroEntrega, setErroEntrega] = useState<string | null>(null);
  const [tentativaEntrega, setTentativaEntrega] = useState(0);
  const [entregasEditadas, setEntregasEditadas] = useState<Record<string, EnderecoEntrega>>({});

  // UI
  const [editandoDados, setEditandoDados] = useState(false);
  const [editandoEndereco, setEditandoEndereco] = useState(false);
  const [cadastrandoEmpresa, setCadastrandoEmpresa] = useState(false);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);

  const ativas = empresas.filter((e) => e.ativa);
  const empresa = ativas.find((e) => e.id === empresaId) ?? ativas[0];
  const empresaParaExcluir = empresas.find((e) => e.id === excluindoId);
  const entregaEditada = entregasEditadas[empresa.id];
  const { id, cepEntrega, localEntrega, numeroEntrega, complementoEntrega } = empresa;

  // Consulta o CEP de entrega (a menos que o usuário já tenha editado o endereço)
  useEffect(() => {
    if (entregaEditada) {
      setEntrega(entregaEditada);
      setErroEntrega(null);
      setCarregandoEntrega(false);
      return;
    }
    const controller = new AbortController();
    setCarregandoEntrega(true);
    setErroEntrega(null);
    setEntrega(null);
    buscarCep(cepEntrega, controller.signal)
      .then((cep) =>
        setEntrega({
          local: localEntrega,
          cep: cep.cep,
          rua: cep.street ?? '',
          bairro: cep.neighborhood ?? '',
          cidade: cep.city,
          uf: cep.state,
          numero: numeroEntrega,
          complemento: complementoEntrega ?? '',
        }),
      )
      .catch((err) => {
        if (!isAbortError(err)) setErroEntrega(getErrorMessage(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregandoEntrega(false);
      });
    return () => controller.abort();
  }, [id, cepEntrega, localEntrega, numeroEntrega, complementoEntrega, entregaEditada, tentativaEntrega]);

  const avisar = (message: string, severity: AlertColor = 'info') => setAviso({ message, severity });

  const handleSalvarDados = (dados: DadosCadastrais) => {
    setEmpresas((prev) => prev.map((e) => (e.id === empresa.id ? { ...e, dados } : e)));
    setEditandoDados(false);
    avisar('Dados cadastrais atualizados.', 'success');
  };

  const handleSalvarEndereco = (endereco: EnderecoEntrega) => {
    setEntregasEditadas((prev) => ({ ...prev, [empresa.id]: endereco }));
    setEditandoEndereco(false);
    avisar('Endereço de entrega atualizado.', 'success');
  };

  const handleToggleAtiva = (alvoId: string) => {
    const alvo = empresas.find((e) => e.id === alvoId);
    if (!alvo) return;
    if (alvo.ativa && ativas.length <= 1) {
      avisar('Mantenha ao menos uma empresa ativa.', 'warning');
      return;
    }
    setEmpresas((prev) => prev.map((e) => (e.id === alvoId ? { ...e, ativa: !e.ativa } : e)));
    avisar(`${alvo.dados.nomeFantasia} foi ${alvo.ativa ? 'inativada' : 'reativada'}.`, 'success');
  };

  const handleConfirmarExclusao = () => {
    if (!empresaParaExcluir) return;
    if (empresaParaExcluir.ativa && ativas.length <= 1) {
      setExcluindoId(null);
      avisar('Mantenha ao menos uma empresa ativa.', 'warning');
      return;
    }
    setEmpresas((prev) => prev.filter((e) => e.id !== empresaParaExcluir.id));
    setExcluindoId(null);
    avisar(`${empresaParaExcluir.dados.nomeFantasia} foi excluída.`, 'success');
  };

  const handleAdicionarEmpresa = (novo: CnpjData) => {
    const cnpj = onlyDigits(novo.cnpj);
    setCadastrandoEmpresa(false);
    const existente = empresas.find((e) => e.dados.cnpj === cnpj);
    if (existente) {
      setEmpresas((prev) => prev.map((e) => (e.id === existente.id ? { ...e, ativa: true } : e)));
      setEmpresaId(existente.id);
      avisar('Esta empresa já estava cadastrada. Ela foi selecionada.', 'info');
      return;
    }
    const nova: Empresa = {
      id: `empresa-${cnpj}`,
      ativa: true,
      dados: {
        razaoSocial: titleCase(novo.razao_social),
        nomeFantasia: titleCase(novo.nome_fantasia) || titleCase(novo.razao_social),
        cnpj,
        inscricaoEstadual: '',
        atividade: novo.cnae_fiscal_descricao ?? '',
        porte: novo.porte ?? '',
        inicioAtividade: novo.data_inicio_atividade ?? '',
        email: (novo.email ?? '').toLowerCase(),
        telefone: formatPhone(novo.ddd_telefone_1),
        situacao: titleCase(novo.descricao_situacao_cadastral),
      },
      localEntrega: 'Endereço da sede',
      cepEntrega: onlyDigits(novo.cep ?? ''),
      numeroEntrega: novo.numero ?? 'S/N',
      complementoEntrega: novo.complemento ?? '',
      condicoes: CONDICOES_PADRAO,
      usuarios: [],
    };
    setEmpresas((prev) => [...prev, nova]);
    setEmpresaId(nova.id);
    setAba(0);
    avisar(`${nova.dados.nomeFantasia} cadastrada e selecionada.`, 'success');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Minha Empresa
        </Typography>
        <Typography color="text.secondary">
          Gerencie os dados da empresa e escolha em nome de quem você está comprando.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <SectionCard
          title="Selecione a empresa"
          subtitle="A empresa escolhida define preços, condições e endereço das compras. Empresas inativas não podem ser selecionadas."
          icon={<ApartmentIcon fontSize="small" />}
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCadastrandoEmpresa(true)}>
              Cadastrar nova empresa
            </Button>
          }
        >
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' } }}>
            {empresas.map((e) => (
              <EmpresaCard
                key={e.id}
                empresa={e}
                selected={e.id === empresa.id}
                podeAlterar={!e.ativa || ativas.length > 1}
                onSelect={setEmpresaId}
                onToggleAtiva={handleToggleAtiva}
                onExcluir={setExcluindoId}
              />
            ))}
          </Box>
        </SectionCard>
      </Box>

      <Tabs
        value={aba}
        onChange={(_, v: number) => setAba(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab icon={<DescriptionIcon />} iconPosition="start" label="Dados cadastrais" />
        <Tab icon={<LocalOfferIcon />} iconPosition="start" label="Condições comerciais" />
        <Tab icon={<PlaceIcon />} iconPosition="start" label="Endereço de entrega" />
        <Tab icon={<GroupIcon />} iconPosition="start" label="Usuários e acessos" />
      </Tabs>

      <Box sx={{ display: 'grid', gap: 3, alignItems: 'start', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' } }}>
        <Box>
          {aba === 0 && <DadosCadastraisTab dados={empresa.dados} onEdit={() => setEditandoDados(true)} />}
          {aba === 1 && <CondicoesComerciaisTab condicoes={empresa.condicoes} />}
          {aba === 2 && (
            <EnderecoEntregaTab
              entrega={entrega}
              loading={carregandoEntrega}
              error={erroEntrega}
              onRetry={() => setTentativaEntrega((n) => n + 1)}
              onEdit={() => setEditandoEndereco(true)}
            />
          )}
          {aba === 3 && (
            <UsuariosAcessosTab
              usuarios={empresa.usuarios}
              onInvite={() => avisar('Convite demonstrativo: nenhum e-mail real é enviado.', 'info')}
            />
          )}
        </Box>
        <ResumoEmpresa condicoes={empresa.condicoes} />
      </Box>

      {editandoDados && (
        <EditarDadosDialog inicial={empresa.dados} onClose={() => setEditandoDados(false)} onSave={handleSalvarDados} />
      )}
      {editandoEndereco && (
        <EnderecoDialog inicial={entrega} onClose={() => setEditandoEndereco(false)} onSave={handleSalvarEndereco} />
      )}
      {cadastrandoEmpresa && (
        <NovaEmpresaDialog onClose={() => setCadastrandoEmpresa(false)} onAdd={handleAdicionarEmpresa} />
      )}
      {empresaParaExcluir && (
        <ConfirmDialog
          title={`Excluir ${empresaParaExcluir.dados.nomeFantasia}?`}
          message="A empresa será removida da lista. Esta ação não pode ser desfeita. Para apenas pausar o uso, prefira inativar."
          confirmLabel="Excluir empresa"
          destructive
          onConfirm={handleConfirmarExclusao}
          onCancel={() => setExcluindoId(null)}
        />
      )}

      <Snackbar
        open={!!aviso}
        autoHideDuration={4000}
        onClose={() => setAviso(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={aviso?.severity ?? 'info'} variant="filled" onClose={() => setAviso(null)}>
          {aviso?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}