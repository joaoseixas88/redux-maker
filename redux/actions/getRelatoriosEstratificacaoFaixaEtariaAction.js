
export const getRelatoriosEstratificacaoFaixaEtaria = payload => ({
	type: 'GET_RELATORIOS_ESTRATIFICACAO_FAIXA_ETARIA',
	payload,
});

export const getRelatoriosEstratificacaoFaixaEtariaSuccess = payload => ({
	type: 'GET_RELATORIOS_ESTRATIFICACAO_FAIXA_ETARIA_SUCCESS',
	payload,
});

export const getRelatoriosEstratificacaoFaixaEtariaError = payload => ({
	type: 'GET_RELATORIOS_ESTRATIFICACAO_FAIXA_ETARIA_ERROR',
	payload,
});

export const getRelatoriosEstratificacaoFaixaEtariaClear = () => ({
	type: 'GET_RELATORIOS_ESTRATIFICACAO_FAIXA_ETARIA_CLEAR',
});
	
	