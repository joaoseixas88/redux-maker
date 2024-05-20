
const INITIAL_STATE = {
	loading: false,
	loaded: false,
	error: false,
	data: {},
};

export default function getRelatoriosEstratificacaoTelefoneReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case 'LOGIN_USER_LOGOUT':
			return INITIAL_STATE;
		case 'GET_RELATORIOS_ESTRATIFICACAO_TELEFONE': {
			return {
				...state,
				...(action.payload && action.payload),
				loading: true,
				loaded: false,
				error: false,
			};
		}
		case 'GET_RELATORIOS_ESTRATIFICACAO_TELEFONE_SUCCESS': {
			return {
				...state,
				...(action.payload && action.payload),
				loading: false,
				loaded: true,
				error: false,
				errMsg: false,
			};
		}
		case 'GET_RELATORIOS_ESTRATIFICACAO_TELEFONE_ERROR': {
			const result = action.payload;
			return {
				...state,
				...(action.payload && action.payload),
				loading: false,
				loaded: true,
				error: true,
				errMsg: result.msg || 'Ocorreu um erro ao realizar a consulta. Tente novamente mais tarde!',
			};
		}
		case 'GET_RELATORIOS_ESTRATIFICACAO_TELEFONE_CLEAR':
			return INITIAL_STATE;
		default:
			return state;
	}
}
	
	