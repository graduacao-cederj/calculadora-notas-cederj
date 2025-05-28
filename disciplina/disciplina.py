class NotaInvalidaError(Exception):
    """Exceção para notas inválidas."""

    pass


class SemNotaFinalError(Exception):
    """Exceção para quando não é possível calcular a nota final."""

    pass


class Disciplina:
    MENOR_NOTA_ACEITA = 0.0
    MAIOR_NOTA_ACEITA = 10.0

    MEDIA_APROVACAO_DIRETA = 6.0
    MEDIA_APROVACAO_AP3 = 5.0

    SOMA_MINIMA_APROVACAO_DIRETA = 12.0
    SOMA_MINIMA_APROVACAO_AP3 = 10.0

    PESO_AD = 2
    PESO_AP = 8
    SOMA_PESOS = PESO_AD + PESO_AP

    def __init__(self, ad1=None, ap1=None, ad2=None, ap2=None, ap3=None):
        self._ad1 = self._validar_nota(ad1)
        self._ap1 = self._validar_nota(ap1)
        self._ad2 = self._validar_nota(ad2)
        self._ap2 = self._validar_nota(ap2)
        self._ap3 = self._validar_nota(ap3)
        self._aprovado = False

    # --- Validação ---
    def _validar_nota(self, value):
        menor, maior = self.MENOR_NOTA_ACEITA, self.MAIOR_NOTA_ACEITA
        if value is not None and not (menor <= value <= maior):
            raise NotaInvalidaError(f"Nota deve estar entre {menor} e {maior}")
        return value

    # --- Propriedades de entrada ---
    @property
    def ad1(self):
        return self._ad1

    @ad1.setter
    def ad1(self, value):
        self._ad1 = self._validar_nota(value)

    @property
    def ap1(self):
        return self._ap1

    @ap1.setter
    def ap1(self, value):
        self._ap1 = self._validar_nota(value)

    @property
    def ad2(self):
        return self._ad2

    @ad2.setter
    def ad2(self, value):
        self._ad2 = self._validar_nota(value)

    @property
    def ap2(self):
        return self._ap2

    @ap2.setter
    def ap2(self, value):
        self._ap2 = self._validar_nota(value)

    @property
    def ap3(self):
        return self._ap3

    @ap3.setter
    def ap3(self, value):
        self._ap3 = self._validar_nota(value)

    # --- Funções de cálculo ---
    def calcular_nota_parcial(self, ad, ap):
        if ad is None or ap is None:
            return None
        return (ad * self.PESO_AD + ap * self.PESO_AP) / self.SOMA_PESOS

    @staticmethod
    def calcular_media(n1, n2):
        if n1 is None or n2 is None:
            return None
        return (n1 + n2) / 2

    def calcular_nf(self, n, n1, n2, ap3):
        if n is None:
            return None
        if n >= self.MEDIA_APROVACAO_DIRETA:
            return n
        if ap3 is not None:
            return (max(n1 or 0, n2 or 0) + ap3) / 2
        else:
            raise SemNotaFinalError(
                f"Nota final não pode ser calculada sem AP3 se N < 6. A média N é {n:.2f}."  # NoQA
            )

    # --- Propriedades derivadas ---
    @property
    def n1(self):
        return self.calcular_nota_parcial(self.ad1, self.ap1)

    @property
    def n2(self):
        return self.calcular_nota_parcial(self.ad2, self.ap2)

    @property
    def n(self):
        return self.calcular_media(self.n1, self.n2)

    @property
    def nf(self):
        return self.calcular_nf(self.n, self.n1, self.n2, self.ap3)

    @property
    def aprovado(self):
        try:
            self._aprovado = self.nf >= self.MEDIA_APROVACAO_DIRETA or (
                self.nf >= self.MEDIA_APROVACAO_AP3 and self.ap3 is not None
            )
        except (SemNotaFinalError, TypeError):
            self._aprovado = False
        return self._aprovado

    # --- Métodos auxiliares ---
    def nota_necessaria_n2_para_aprovacao(self):
        """
        Retorna a nota mínima (N2) para obter média N >= 6, assumindo N1
        conhecido.
        """
        if self.n1 is None:
            return None
        return max(0, self.SOMA_MINIMA_APROVACAO_DIRETA - self.n1)

    def nota_necessaria_ap2_para_aprovacao(self) -> float | None:
        """Retorna a nota mínima de AP2 para que o aluno seja aprovado sem
        precisar de AP3."""
        if self.n1 is None or self.ad2 is None:
            return None

        n1 = self.n1
        n2_necessaria = self.SOMA_MINIMA_APROVACAO_DIRETA - n1
        nota_ap2 = (
            self.SOMA_PESOS * n2_necessaria - self.PESO_AD * self.ad2
        ) / self.PESO_AP

        return max(0.0, min(nota_ap2, self.MAIOR_NOTA_ACEITA))

    def nota_necessaria_ap3_para_aprovacao(self):
        """
        Retorna a nota mínima na AP3 para obter NF >= 5, assumindo N1 e N2
        conhecidos.
        """
        try:
            if self.nf is not None and self.nf >= self.MEDIA_APROVACAO_DIRETA:
                return 0
        except SemNotaFinalError:
            if self.n1 is None or self.n2 is None:
                return None
            else:
                return max(
                    0, self.SOMA_MINIMA_APROVACAO_AP3 - max(self.n1, self.n2)
                )

    # --- Representação da instância ---
    def __repr__(self):
        def fmt(x):
            return f"{x:.2f}" if x is not None else "None"

        try:
            nota_final = fmt(self.nf)
        except SemNotaFinalError:
            nota_final = "Sem Nota Final"

        return (
            f"Disciplina(N1={fmt(self.n1)}, "
            f"N2={fmt(self.n2)}, "
            f"N={fmt(self.n)}, "
            f"NF={nota_final}, "
            f"Aprovado={self.aprovado})"
        )
