import { useState } from "react";
import {
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

  function abrirModal() {
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
    if (!item.material || !item.quantidade || !item.unidade) {
      return;
    }

    setItens([...itens, item]);
    setOpen(false);
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        Solicitação de compra
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Organize os itens da sua solicitação.
      </Typography>

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
                defaultValue="EVERTON FERNANDES SANTANA DA SILVA"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Obra / Projeto"
                select
                defaultValue="obra-1"
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
                defaultValue="urgente"
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
                defaultValue={new Date().toISOString().split("T")[0]}
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
                defaultValue="VERIFICAR COM URGENCIA!"
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
        <Button variant="outlined">
          Cancelar
        </Button>

        <Button variant="contained">
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
        <DialogTitle>Adicionar item</DialogTitle>

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
            disabled={
              !item.material ||
              !item.quantidade ||
              !item.unidade
            }
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SolicitacaoCompraPage;