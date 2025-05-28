import pytest

from disciplina.disciplina import (
    Disciplina,
    NotaInvalidaError,
    SemNotaFinalError,
)


def test_inicializacao_sem_notas():
    d = Disciplina()
    assert d.n1 is None
    assert d.n2 is None
    assert d.n is None
    assert d.nf is None
    assert d.aprovado is False


def test_calculo_n1_n2_n():
    d = Disciplina(ad1=2.0, ap1=3.0, ad2=1.0, ap2=5.0)
    assert d.ad1 == 2.0
    assert d.ap1 == 3.0
    assert d.ad2 == 1.0
    assert d.ap2 == 5.0
    assert d.n1 == pytest.approx((2 * 2 + 3 * 8) / 10)  # 2.8
    assert d.n2 == pytest.approx((1 * 2 + 5 * 8) / 10)  # 4.6
    assert d.n == pytest.approx((28 / 10 + 42 / 10) / 2)  # 3.7
    with pytest.raises(SemNotaFinalError):
        d.nf
    assert d.aprovado is False


def test_aprovacao_limite():
    d = Disciplina(ad1=6.0, ap1=6.0, ad2=6.0, ap2=6.0)
    assert d.n == pytest.approx(6.0)
    assert d.nf == pytest.approx(6.0)
    assert d.aprovado is True


def test_reprovado_nota_5_sem_ap3():
    d = Disciplina(ad1=5.0, ap1=5.0, ad2=5.0, ap2=5.0)
    assert d.n == pytest.approx(5.0)
    with pytest.raises(SemNotaFinalError):
        d.nf
    assert d.aprovado is False


def test_uso_de_ap3_para_aprovacao():
    d = Disciplina(ad1=5.0, ap1=5.0, ad2=5.0, ap2=5.0)
    assert d.n == pytest.approx(5.0)
    with pytest.raises(SemNotaFinalError):
        d.nf

    d.ap3 = 5.0
    assert d.nf == pytest.approx(5.0)
    assert d.aprovado is True


def test_nota_necessaria_n2_para_aprovacao():
    d = Disciplina()
    assert d.nota_necessaria_n2_para_aprovacao() is None

    d = Disciplina(ad1=1.0, ap1=5.0)
    assert d.n1 == pytest.approx((1 * 2 + 5 * 8) / 10)  # 4.4
    n1 = d.n1
    esperado = max(0, 12 - n1)
    assert d.nota_necessaria_n2_para_aprovacao() == pytest.approx(esperado)


def test_nota_necessaria_ap3_para_aprovacao():
    d = Disciplina()
    assert d.nota_necessaria_ap3_para_aprovacao() is None

    d = Disciplina(ad1=5.0, ap1=5.0)
    assert d.nota_necessaria_ap3_para_aprovacao() is None

    d = Disciplina(ad2=5.0, ap2=5.0)
    assert d.nota_necessaria_ap3_para_aprovacao() is None

    d = Disciplina(ad1=5.0, ap1=5.0, ad2=5.0, ap2=5.0)
    assert d.n == pytest.approx(5.0)
    assert d.nota_necessaria_ap3_para_aprovacao() == pytest.approx(5.0)
    assert d.aprovado is False

    d = Disciplina(ad1=4.0, ap1=4.0, ad2=4.0, ap2=4.0)
    assert d.n == pytest.approx(4.0)
    assert d.nota_necessaria_ap3_para_aprovacao() == pytest.approx(6.0)
    assert d.aprovado is False

    d = Disciplina(ad1=6.0, ap1=6.0, ad2=6.0, ap2=6.0)
    assert d.nota_necessaria_ap3_para_aprovacao() == pytest.approx(0.0)
    assert d.aprovado is True


@pytest.mark.parametrize("campo", ["ad1", "ap1", "ad2", "ap2", "ap3"])
@pytest.mark.parametrize("valor", [-1, 11])
def test_notas_invalidas_lancam_erro(campo, valor):
    with pytest.raises(
        NotaInvalidaError, match="Nota deve estar entre 0.0 e 10.0"
    ):
        kwargs = {campo: valor}
        Disciplina(**kwargs)


def test_setters_funcionam_com_validacao():
    d = Disciplina()
    d.ad1 = 5.0
    d.ap1 = 4.0
    assert d.n1 == pytest.approx((5 * 2 + 4 * 8) / 10)

    with pytest.raises(NotaInvalidaError):
        d.ap2 = 15


def test_repr_retorna_str_formatada():
    d = Disciplina(ad1=2, ap1=3, ad2=1, ap2=2)
    r = repr(d)
    assert isinstance(r, str)
    assert "Disciplina(" in r
    assert "N1=" in r
    assert "Aprovado=" in r
