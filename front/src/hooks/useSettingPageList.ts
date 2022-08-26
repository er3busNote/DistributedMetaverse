import {
	useEffect,
	useState,
	useCallback,
	Dispatch,
	SetStateAction,
} from 'react';
import { ActionCreatorsMapObject } from 'redux';
import { SettingInfoList } from '../store/types';

interface FolderPathPageList {
	actions: ActionCreatorsMapObject;
}

const useSettingPageList = ({
	actions,
}: FolderPathPageList): [SettingInfoList, Dispatch<SetStateAction<number>>] => {
	const [page, setPage] = useState(0);
	const [data, setData] = useState<SettingInfoList>({ datas: [] });

	const fetchAndSetData = useCallback(
		async (page: number) => {
			const data = await actions.list(page);
			setData(data);
		},
		[page]
	);

	useEffect(() => {
		fetchAndSetData(page);
	}, [fetchAndSetData]);

	return [data, setPage];
};

export default useSettingPageList;
