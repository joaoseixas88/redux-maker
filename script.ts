import { mkdir, writeFile } from 'fs/promises'

type Action = {
	functionName: string
}

const generateActionType = (plainText: string) => {
	const split = plainText.split(' ')
	return split.join('_').toUpperCase()
}
function alterFirstLetter(str: string, type: 'lower' | 'upper') {
	if (type === 'lower') {
		return str.charAt(0).toLowerCase() + str.slice(1);
	} else {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
}



const getCamelCase = (plainText: string) => {
	const split = plainText.split(' ')
	return split.reduce((acc, word, index) => {
		if (index === 0) {
			acc += alterFirstLetter(word, 'lower')
		} else {
			acc += alterFirstLetter(word, 'upper')
		}
		return acc
	}, '')
}

type Props = {
	camel: string
	upperCase: string
	path: string
}
const actionMaker = async ({ camel, upperCase, path }: Props) => {
	const text = `
export const ${camel} = payload => ({
	type: '${upperCase}',
	payload,
});

export const ${camel}Success = payload => ({
	type: '${upperCase}_SUCCESS',
	payload,
});

export const ${camel}Error = payload => ({
	type: '${upperCase}_ERROR',
	payload,
});

export const ${camel}Clear = () => ({
	type: '${upperCase}_CLEAR',
});
	
	`
	await writeFile(`${path}/actions/${camel}Action.js`, text)
}


const sagaMaker = async ({ camel, path, upperCase }: Props) => {

	const text = `
import axios from 'axios';
import Cookies from 'js-cookie';
import { call, put } from 'redux-saga/effects';
import {
	${camel}Error,
	${camel}Success,
} from '../actions/${camel}Action';
import { loginUserActionLogout } from '../actions/loginAction';

export function* ${camel}Saga({ payload }) {
	try {
		const result = yield call(
			() =>
				new Promise((resolve, reject) => {
					axios({
						headers: {
							Authorization: Cookies.get('token'),
						},
						method: 'GET',
						url: ${"`${process.env.REACT_APP_API}/COMPLETE A URL`"},
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
		if (result.erro) yield put(${camel}Error(result.erro));
		else yield put(${camel}Success({ data: result.data.data  })); // CONFERIR O RESULTADO
	} catch (error) {
		const match = error.stack.match(/code (\\d\\d\\d)/);
		if (match[1] === '401') yield put(loginUserActionLogout());
		yield put(${camel}Error({ error }));
	}
}
	
	`
	await writeFile(`${path}/sagas/${camel}Saga.js`, text)
}





const reducerMaker = async ({ camel, upperCase, path }: Props) => {

	const text = `
const INITIAL_STATE = {
	loading: false,
	loaded: false,
	error: false,
	data: {},
};

export default function ${camel}Reducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case 'LOGIN_USER_LOGOUT':
			return INITIAL_STATE;
		case '${upperCase}': {
			return {
				...state,
				...(action.payload && action.payload),
				loading: true,
				loaded: false,
				error: false,
			};
		}
		case '${upperCase}_SUCCESS': {
			return {
				...state,
				...(action.payload && action.payload),
				loading: false,
				loaded: true,
				error: false,
				errMsg: false,
			};
		}
		case '${upperCase}_ERROR': {
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
		case '${upperCase}_CLEAR':
			return INITIAL_STATE;
		default:
			return state;
	}
}
	
	`

	await writeFile(`${path}/reducers/${camel}Reducer.js`, text)

}

const generateIndexSaga = async ({ camel, path, upperCase }: Props) => {
	const sagaIndexText = `takeEvery('${upperCase}', ${camel}Saga)`
	await writeFile(`./index/IndexSAGA.js`, sagaIndexText)
}
const generateIndexReducer = async ({ camel, path, upperCase }: Props) => {
	const sagaIndexText = `${camel}: ${camel}Reducer,`
	await writeFile(`./index/IndexReducer.js`, sagaIndexText)
}


export const makeAll = async (plainText: string, path: string) => {

	const upperPlainText = generateActionType(plainText)
	const camel = getCamelCase(plainText)
	const params = { camel, upperCase: upperPlainText, path }
	await mkdir(path, { recursive: true })
	actionMaker(params)
	reducerMaker(params)
	sagaMaker(params)
	generateIndexSaga(params)
	generateIndexReducer(params)

}


