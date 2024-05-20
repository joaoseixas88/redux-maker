
export const getRelatoriosEstratificacaoTelefone = payload => ({
	type: 'GET_RELATORIOS_ESTRATIFICACAO_TELEFONE',
	payload,
});

export const getRelatoriosEstratificacaoTelefoneSuccess = payload => ({
	type: 'GET_RELATORIOS_ESTRATIFICACAO_TELEFONE_SUCCESS',
	payload,
});

export const getRelatoriosEstratificacaoTelefoneError = payload => ({
	type: 'GET_RELATORIOS_ESTRATIFICACAO_TELEFONE_ERROR',
	payload,
});

export const getRelatoriosEstratificacaoTelefoneClear = () => ({
	type: 'GET_RELATORIOS_ESTRATIFICACAO_TELEFONE_CLEAR',
});
	
	