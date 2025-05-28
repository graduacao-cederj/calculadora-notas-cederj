from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from disciplina.disciplina import (
    Disciplina,
    NotaInvalidaError,
    SemNotaFinalError,
)

app = FastAPI()


class EntradaNotas(BaseModel):
    ad1: float | None = None
    ap1: float | None = None
    ad2: float | None = None
    ap2: float | None = None
    ap3: float | None = None


@app.post("/avaliar")
def avaliar(notas: EntradaNotas):
    try:
        d = Disciplina(**notas.model_dump())
        return {
            "n1": d.n1,
            "n2": d.n2,
            "n": d.n,
            "nf": d.nf,
            "aprovado": d.aprovado,
            "nota_necessaria_n2": d.nota_necessaria_n2_para_aprovacao(),
            "nota_necessaria_ap3": d.nota_necessaria_ap3_para_aprovacao(),
            "nota_necessaria_ap2": d.nota_necessaria_ap2_para_aprovacao(),
        }
    except NotaInvalidaError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except SemNotaFinalError as e:
        return {
            "n1": d.n1,
            "n2": d.n2,
            "n": d.n,
            "nf": None,
            "erro_nf": str(e),
            "aprovado": d.aprovado,
            "nota_necessaria_ap3": d.nota_necessaria_ap3_para_aprovacao(),
            "nota_necessaria_ap2": d.nota_necessaria_ap2_para_aprovacao(),
        }


# Servir arquivos estáticos
app.mount(
    "/",
    StaticFiles(directory=Path(__file__).parent.parent / "frontend", html=True),
    name="static",
)
