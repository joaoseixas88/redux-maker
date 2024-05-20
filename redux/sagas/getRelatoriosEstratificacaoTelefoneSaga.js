
import axios from 'axios';
import Cookies from 'js-cookie';
import { call, put } from 'redux-saga/effects';
import {
	getRelatoriosEstratificacaoTelefoneError,
	getRelatoriosEstratificacaoTelefoneSuccess,
} from '../actions/getRelatoriosEstratificacaoTelefoneAction';
import { loginUserActionLogout } from '../actions/loginAction';

export function* getRelatoriosEstratificacaoTelefoneSaga({ payload }) {
	try {
		const result = yield call(
			() =>
				new Promise((resolve, reject) => {
					axios({
						headers: {
							Authorization: Cookies.get('token'),
						},
						method: 'GET',
						url: `${process.env.REACT_APP_API}/COMPLETE A URL`,
						json: false,
					})
						.then(response => {
							resolve(response);
						})
						.catch(ex => {
							return reject(ex);
						});
				}),
		);
		if (result.erro) yield put(getRelatoriosEstratificacaoTelefoneError(result.erro));
		else yield put(getRelatoriosEstratificacaoTelefoneSuccess({ data: result.data.data  })); // CONFERIR O RESULTADO
	} catch (error) {
		const match = error.stack.match(/code (\d\d\d)/);
		if (match[1] === '401') yield put(loginUserActionLogout());
		yield put(getRelatoriosEstratificacaoTelefoneError({ error }));
	}
}
	
	