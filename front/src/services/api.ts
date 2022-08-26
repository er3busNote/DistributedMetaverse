import axios, { AxiosResponse, AxiosError } from 'axios';
import { Dispatch } from '@reduxjs/toolkit';
import {
	loginSuccess,
	loginFailure,
	logoutSuccess,
	fileSuccess,
	fileProgress,
} from '../store/index';
import {
	JWT_USERNAME,
	JWT_ACCESS_TOKEN,
	JWT_REFRESH_TOKEN,
} from '../utils/jwttoken';
import toastMessage from '../utils/toast';
import { setSessionStorage, clearSessionStorage } from '../utils/storage';
import { setInterceptors } from './common/interceptors';
import { LoginData, SignUpData, PageData, KeywordData } from './types';

// 인스턴스 API 생성
const createInstance = () => {
	const instance = axios.create({
		baseURL: '/api', // proxy: process.env.REACT_APP_API_URL
	});

	return setInterceptors(instance);
};
const instance = createInstance();

const auth = {
	// 로그인 API : <baseURL>/auth/login
	login: (userData: LoginData) => (dispatch: Dispatch) =>
		instance
			.post('auth/login', userData)
			.then((response: AxiosResponse) => {
				const tokenData = {
					username: response.data.username,
					accesstoken: response.data.accesstoken,
					refreshtoken: response.data.refreshtoken,
				};
				toastMessage(response.data, 'success');
				dispatch(loginSuccess(tokenData.accesstoken));
				setSessionStorage(JWT_USERNAME, tokenData.username);
				setSessionStorage(JWT_ACCESS_TOKEN, tokenData.accesstoken);
				setSessionStorage(JWT_REFRESH_TOKEN, tokenData.refreshtoken);
				window.location.replace('/');
			})
			.catch((error: AxiosError) => {
				const { status, data } = error.response as AxiosResponse;
				if (status === 400) {
					toastMessage('올바르지 않은 로그인 형식입니다', 'info');
				} else if (status === 401) {
					toastMessage(data.message, 'warn');
				} else if (status === 504) {
					toastMessage('서버가 닫혀있습니다', 'error');
				} else {
					toastMessage(data, 'error');
				}
				dispatch(loginFailure(error.message));
			}),
	logout: () => (dispatch: Dispatch) => {
		clearSessionStorage(JWT_USERNAME);
		clearSessionStorage(JWT_ACCESS_TOKEN);
		clearSessionStorage(JWT_REFRESH_TOKEN);
		dispatch(logoutSuccess());
		window.location.replace('/');
	},
	// 회원가입 API : <baseURL>/auth/signup
	register: (userData: SignUpData) => () =>
		instance
			.post('auth/signup', userData)
			.then((response: AxiosResponse) => {
				toastMessage(response.data, 'success');
				window.location.replace('/');
			})
			.catch((error: AxiosError) => {
				const { status, data } = error.response as AxiosResponse;
				if (status === 400) {
					toastMessage('올바르지 않은 회원가입 형식입니다', 'info');
				} else if (status === 409) {
					toastMessage(data.message, 'warn');
				} else if (status === 504) {
					toastMessage('서버가 닫혀있습니다', 'error');
				} else {
					toastMessage(data, 'error');
				}
			}),
	// 토큰 재생성 API : <baseURL>/auth/refresh
	refresh: () => (dispatch: Dispatch) =>
		instance
			.get('auth/refresh')
			.then((response: AxiosResponse) => {
				dispatch(response.data);
				return response;
			})
			.catch((error: AxiosError) => {
				dispatch(loginFailure(error.message));
				return error.response;
			}),
};

const file = {
	// 파일 다운로드 API : <baseURL>/file/download/{fileId}
	download: (fileId: number) => (dispatch: Dispatch) =>
		instance
			.get(`file/download/${fileId}`)
			.then((response: AxiosResponse) => {
				dispatch(fileSuccess(response.data));
			})
			.catch((error: AxiosError) => {
				const { data } = error.response as AxiosResponse;
				toastMessage(data.message, 'warn');
			}),
	// 파일 업로드 API : <baseURL>/file/upload
	upload: (formData: HTMLFormElement) => (dispatch: Dispatch) =>
		instance
			.post('file/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress: (progressEvent: ProgressEvent) => {
					const { loaded, total } = progressEvent;
					dispatch(fileProgress(Math.round((loaded / total) * 100)));
				},
			})
			.then((response: AxiosResponse) => {
				dispatch(fileSuccess(response.data));
			})
			.catch((error: AxiosError) => {
				const { data } = error.response as AxiosResponse;
				toastMessage(data.message, 'warn');
			}),
	// 특정경로 파일 리스트 API : <baseURL>/file/list?{file,folder}={path}&type={type}&page={page}
	list: (pageData: PageData) => (dispatch: Dispatch) =>
		instance
			.get(
				`file/list?${pageData.identifier}=${pageData.path}&type=${pageData.type}&page=${pageData.page}`
			)
			.then((response: AxiosResponse) => {
				dispatch(fileSuccess(response.data));
				return response.data;
			}),
	// 파일 세부정보 API : <baseURL>/file/info/{fileId}
	info: (fileId: number) => (dispatch: Dispatch) =>
		instance.get(`file/info/${fileId}`).then((response: AxiosResponse) => {
			dispatch(fileSuccess(response.data));
			return response.data;
		}),
	// 파일 검색 API : <baseURL>/file/search?keyword={keyword}&page={page}
	search: (keywordData: KeywordData) => (dispatch: Dispatch) =>
		instance
			.get(
				`file/search?keyword=${keywordData.keyword}&page=${keywordData.page}`
			)
			.then((response: AxiosResponse) => {
				dispatch(fileSuccess(response.data));
				return response.data;
			}),
};

const status = {
	// 다운로드 갯수 확인 API : <baseURL>/status/download
	download: () => (dispatch: Dispatch) =>
		instance.get(`status/download`).then((response: AxiosResponse) => {
			dispatch(fileSuccess(response.data));
			return response.data;
		}),
	// 폴더 리스트 검색 API : <baseURL>/status/folder?type={type}
	folder: (type: string) => (dispatch: Dispatch) =>
		instance
			.get(`status/folder?type=${type}`)
			.then((response: AxiosResponse) => {
				dispatch(fileSuccess(response.data));
				return response.data;
			}),
};

const setting = {
	// Setting 세부정보 확인 API : <baseURL>/setting/info?id={serverId}
	info: (serverId: number) => (dispatch: Dispatch) =>
		instance
			.get(`setting/info?id=${serverId}`)
			.then((response: AxiosResponse) => {
				dispatch(fileSuccess(response.data));
				return response.data;
			}),
	// Setting 정보 리스트 API : <baseURL>/setting/list/:page
	list: (page: number) => (dispatch: Dispatch) =>
		instance.get(`setting/list/${page}`).then((response: AxiosResponse) => {
			dispatch(fileSuccess(response.data));
			return response.data;
		}),
};

const api = {
	auth,
	file,
	status,
	setting,
};

export default { ...api };
