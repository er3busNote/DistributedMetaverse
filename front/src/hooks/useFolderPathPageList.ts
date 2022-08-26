import {
	useEffect,
	useState,
	useCallback,
	Dispatch,
	SetStateAction,
} from 'react';
import { ActionCreatorsMapObject } from 'redux';
import { FolderInfoList } from '../store/types';
import { PageData } from '../services/types';

interface FolderPathPageList {
	file: ActionCreatorsMapObject;
	path: string;
	type: string;
}

const useFolderPathPageList = ({
	file,
	path,
	type,
}: FolderPathPageList): [FolderInfoList, Dispatch<SetStateAction<number>>] => {
	const [page, setPage] = useState(0);
	const [data, setData] = useState<FolderInfoList>({ datas: [] });

	const fetchAndSetData = useCallback(
		async (page: number) => {
			const pageData: PageData = {
				page: page,
				path: path,
				type: type,
				identifier: 'folder',
			};
			const data = await file.list(pageData);
			setData(data);
		},
		[page]
	);

	useEffect(() => {
		fetchAndSetData(page);
	}, [fetchAndSetData]);

	return [data, setPage];
};

export default useFolderPathPageList;
