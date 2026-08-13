export interface BrazilState {
    uf: string;
    name: string;
    region: string;
}

export const BRAZIL_STATES: BrazilState[] = [
    { uf: "AC", name: "Acre", region: "Norte" },
    { uf: "AP", name: "Amapá", region: "Norte" },
    { uf: "AM", name: "Amazonas", region: "Norte" },
    { uf: "PA", name: "Pará", region: "Norte" },
    { uf: "RO", name: "Rondônia", region: "Norte" },
    { uf: "RR", name: "Roraima", region: "Norte" },
    { uf: "TO", name: "Tocantins", region: "Norte" },
    { uf: "AL", name: "Alagoas", region: "Nordeste" },
    { uf: "BA", name: "Bahia", region: "Nordeste" },
    { uf: "CE", name: "Ceará", region: "Nordeste" },
    { uf: "MA", name: "Maranhão", region: "Nordeste" },
    { uf: "PB", name: "Paraíba", region: "Nordeste" },
    { uf: "PE", name: "Pernambuco", region: "Nordeste" },
    { uf: "PI", name: "Piauí", region: "Nordeste" },
    { uf: "RN", name: "Rio Grande do Norte", region: "Nordeste" },
    { uf: "SE", name: "Sergipe", region: "Nordeste" },
    { uf: "DF", name: "Distrito Federal", region: "Centro-Oeste" },
    { uf: "GO", name: "Goiás", region: "Centro-Oeste" },
    { uf: "MT", name: "Mato Grosso", region: "Centro-Oeste" },
    { uf: "MS", name: "Mato Grosso do Sul", region: "Centro-Oeste" },
    { uf: "ES", name: "Espírito Santo", region: "Sudeste" },
    { uf: "MG", name: "Minas Gerais", region: "Sudeste" },
    { uf: "RJ", name: "Rio de Janeiro", region: "Sudeste" },
    { uf: "SP", name: "São Paulo", region: "Sudeste" },
    { uf: "PR", name: "Paraná", region: "Sul" },
    { uf: "RS", name: "Rio Grande do Sul", region: "Sul" },
    { uf: "SC", name: "Santa Catarina", region: "Sul" },
];

export const getRegionByUf = (uf: string): string | undefined =>
    BRAZIL_STATES.find((state) => state.uf === uf)?.region;

export const getStateLabel = (uf: string): string => {
    const state = BRAZIL_STATES.find((item) => item.uf === uf);
    return state ? `${state.uf} — ${state.name}` : uf;
};
