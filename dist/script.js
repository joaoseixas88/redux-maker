"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAll = void 0;
const promises_1 = require("fs/promises");
const generateActionType = (plainText) => {
    const split = plainText.split(' ');
    return split.join('_').toUpperCase();
};
function alterFirstLetter(str, type) {
    if (type === 'lower') {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
    else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
const getCamelCase = (plainText) => {
    const split = plainText.split(' ');
    return split.reduce((acc, word, index) => {
        if (index === 0) {
            acc += alterFirstLetter(word, 'lower');
        }
        else {
            acc += alterFirstLetter(word, 'upper');
        }
        return acc;
    }, '');
};
const actionMaker = ({ camel, upperCase, path }) => __awaiter(void 0, void 0, void 0, function* () {
    const text = `
export const ${camel}Actions = payload => ({
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
	
	`;
    yield (0, promises_1.writeFile)(`${path}/actions/${camel}Action.js`, text);
});
const sagaMaker = ({ camel, path, upperCase }) => __awaiter(void 0, void 0, void 0, function* () {
    const text = `
import axios from 'axios';
import Cookies from 'js-cookie';
import { call, put } from 'redux-saga/effects';
import {
	${camel}Error,
	${camel}Success,
} from '../actions/${camel}Actions';
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
		const match = error.stack.match(/code (\d\d\d)/);
		if (match[1] === '401') yield put(loginUserActionLogout());
		yield put(${camel}Error({ error }));
	}
}
	
	`;
    yield (0, promises_1.writeFile)(`${path}/sagas/${camel}Saga.js`, text);
});
const reducerMaker = ({ camel, upperCase, path }) => __awaiter(void 0, void 0, void 0, function* () {
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
	
	`;
    yield (0, promises_1.writeFile)(`${path}/reducers/${camel}Reducer.js`, text);
});
const generateIndexSaga = ({ camel, path, upperCase }) => __awaiter(void 0, void 0, void 0, function* () {
    const sagaIndexText = `takeEvery('${upperCase}', ${camel}Saga)`;
    yield (0, promises_1.writeFile)(`./index/IndexSAGA.js`, sagaIndexText);
});
const generateIndexReducer = ({ camel, path, upperCase }) => __awaiter(void 0, void 0, void 0, function* () {
    const sagaIndexText = `${camel}: ${camel}Reducer,`;
    yield (0, promises_1.writeFile)(`./index/IndexReducer.js`, sagaIndexText);
});
const makeAll = (plainText, path) => __awaiter(void 0, void 0, void 0, function* () {
    const upperPlainText = generateActionType(plainText);
    const camel = getCamelCase(plainText);
    const params = { camel, upperCase: upperPlainText, path };
    yield (0, promises_1.mkdir)(path, { recursive: true });
    actionMaker(params);
    reducerMaker(params);
    sagaMaker(params);
    generateIndexSaga(params);
    generateIndexReducer(params);
});
exports.makeAll = makeAll;
