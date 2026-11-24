import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const corRoxa = "#673DE6";

function dataLocal() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
}

function dadosIniciais() {
  return { solicitante: "", obra: "obra-1", prioridade: "media", data: dataLocal(), observacoes: "" };
}

interface ItemCompra {
  material: string;
  descricao: string;
  quantidade: string;
  unidade: string;
  observacao: string;
}

function SolicitacaoCompraPage() {
  const [open, setOpen] = useState(false);

  const [item, setItem] = useState<ItemCompra>({
    material: "",
    descricao: "",
    quantidade: "",
    unidade: "",
    observacao: "",
  });

  const [itens, setItens] = useState<ItemCompra[]>([]);

  const [dados, setDados] = useState(dadosIniciais);
  const [editando, setEditando] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);
  const quantidadeValida = Number.isFinite(Number(item.quantidade)) && Number(item.quantidade) > 0;
  const itemValido = Boolean(item.material.trim() && item.unidade && quantidadeValida);

  function editarItem(index: number) {
    setItem({ ...itens[index] });
    setEditando(index);
    setOpen(true);
  }

  function excluirItem(index: number) {
    if (window.confirm("Deseja excluir este material?")) {
      setItens(atuais => atuais.filter((_, i) => i !== index));
      setMensagem(null);
    }
  }

  function cancelarSolicitacao() {
    if (window.confirm("Deseja limpar a solicitação atual?")) {
      setDados(dadosIniciais());
      setItens([]);
      setMensagem(null);
    }
  }

  function salvarSolicitacao() {
    if (!dados.solicitante.trim() || !dados.data || itens.length === 0) {
      setMensagem({ tipo: "error", texto: "Informe o solicitante, a data e adicione pelo menos um material." });
      return;
    }
    try {
      const chave = "construpro:solicitacoes";
      const anteriores = JSON.parse(localStorage.getItem(chave) ?? "[]");
      if (!Array.isArray(anteriores)) throw new Error("Dados inválidos");
      localStorage.setItem(chave, JSON.stringify([...anteriores, {
        id: crypto.randomUUID(), ...dados, itens,
      }]));
      setDados(dadosIniciais());
      setItens([]);
      setMensagem({ tipo: "success", texto: "Solicitação salva neste navegador." });
    } catch {
      setMensagem({ tipo: "error", texto: "Não foi possível salvar a solicitação localmente." });
    }
  }

  function abrirModal() {
    setEditando(null);
    setItem({
      material: "",
      descricao: "",
      quantidade: "",
      unidade: "",
      observacao: "",
    });

    setOpen(true);
  }

  function fecharModal() {
    setOpen(false);
  }

  function adicionarItem() {
    if (!itemValido) return;
    const novoItem = { ...item, material: item.material.trim() };
    setItens(atuais => editando === null
      ? [...atuais, novoItem]
      : atuais.map((atual, index) => index === editando ? novoItem : atual));
    setMensagem(null);
    setOpen(false);
  }

  return (
    <Box sx={{ p: 4, "& .MuiButton-contained": { backgroundColor: corRoxa, "&:hover": { backgroundColor: "#512BC4" } }, "& .MuiButton-outlined:not(.MuiButton-colorError)": { color: corRoxa, borderColor: corRoxa } }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        Solicitação de compra
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Organize os itens da sua solicitação.
      </Typography>

      {mensagem && <Alert severity={mensagem.tipo} sx={{ mb: 2 }}>{mensagem.texto}</Alert>}

      {/* DADOS DA SOLICITAÇÃO */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Dados da solicitação
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Solicitante"
                value={dados.solicitante}
                onChange={(e) => setDados({ ...dados, solicitante: e.target.value })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Obra / Projeto"
                select
                value={dados.obra}
                onChange={(e) => setDados({ ...dados, obra: e.target.value })}
              >
                <MenuItem value="obra-1">Obra 1</MenuItem>
                <MenuItem value="obra-2">Obra 2</MenuItem>
                <MenuItem value="obra-3">Obra 3</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Prioridade"
                select
                value={dados.prioridade}
                onChange={(e) => setDados({ ...dados, prioridade: e.target.value })}
              >
                <MenuItem value="baixa">Baixa</MenuItem>
                <MenuItem value="media">Média</MenuItem>
                <MenuItem value="alta">Alta</MenuItem>
                <MenuItem value="urgente">Urgente</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Data da solicitação"
                type="date"
                value={dados.data}
                onChange={(e) => setDados({ ...dados, data: e.target.value })}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={3}
                value={dados.observacoes}
                onChange={(e) => setDados({ ...dados, observacoes: e.target.value })}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ITENS DA COMPRA */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Itens da compra
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={abrirModal}
            >
              Adicionar item
            </Button>
          </Box>

          {itens.length === 0 ? (
            <Typography color="text.secondary">
              Nenhum item foi adicionado à solicitação.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {itens.map((item, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          Material
                        </Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          {item.material}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Quantidade
                        </Typography>
                        <Typography>
                          {item.quantidade} {item.unidade}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Descrição
                        </Typography>
                        <Typography>
                          {item.descricao || "—"}
                        </Typography>
                      </Grid>

                      {item.observacao && (
                        <Grid size={{ xs: 12 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Observação
                          </Typography>

                          <Typography>
                            {item.observacao}
                          </Typography>
                        </Grid>
                      )}
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                          <Button variant="outlined" onClick={() => editarItem(index)}>Editar</Button>
                          <Button variant="outlined" color="error" onClick={() => excluirItem(index)}>Excluir</Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* BOTÕES */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mt: 3,
        }}
      >
        <Button variant="outlined" onClick={cancelarSolicitacao}>
          Cancelar
        </Button>

        <Button variant="contained" onClick={salvarSolicitacao}>
          Salvar solicitação
        </Button>
      </Box>

      {/* MODAL */}
      <Dialog
        open={open}
        onClose={fecharModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editando === null ? "Adicionar item" : "Editar item"}</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Material"
                placeholder="Ex.: Cimento CP-II"
                value={item.material}
                onChange={(e) =>
                  setItem({
                    ...item,
                    material: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Descrição"
                placeholder="Ex.: Cimento 50 kg"
                value={item.descricao}
                onChange={(e) =>
                  setItem({
                    ...item,
                    descricao: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                error={item.quantidade !== "" && !quantidadeValida}
                helperText={item.quantidade !== "" && !quantidadeValida ? "Informe uma quantidade maior que zero." : undefined}
                value={item.quantidade}
                onChange={(e) =>
                  setItem({
                    ...item,
                    quantidade: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Unidade"
                select
                value={item.unidade}
                onChange={(e) =>
                  setItem({
                    ...item,
                    unidade: e.target.value,
                  })
                }
              >
                <MenuItem value="Unidade">Unidade</MenuItem>
                <MenuItem value="Saco">Saco</MenuItem>
                <MenuItem value="Kg">Kg</MenuItem>
                <MenuItem value="Tonelada">Tonelada</MenuItem>
                <MenuItem value="Metro">Metro</MenuItem>
                <MenuItem value="m²">m²</MenuItem>
                <MenuItem value="m³">m³</MenuItem>
                <MenuItem value="Litro">Litro</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Observação"
                multiline
                rows={3}
                placeholder="Alguma informação adicional..."
                value={item.observacao}
                onChange={(e) =>
                  setItem({
                    ...item,
                    observacao: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={fecharModal}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={adicionarItem}
            disabled={!itemValido}
            sx={{ backgroundColor: corRoxa, "&:hover": { backgroundColor: "#512BC4" } }}
          >
            {editando === null ? "Adicionar" : "Salvar alteração"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SolicitacaoCompraPage;