import {
	useEffect,
	useState,
	useCallback,
	Dispatch,
	SetStateAction,
} from 'react';
import { ActionCreatorsMapObject } from 'redux';
import { FileInfo } from '../store/types';
import { PageData } from '../services/types';

interface FilePathPageListProps {
	file: ActionCreatorsMapObject;
	path: string;
	type: string;
}

const useFilePathPageList = ({
	file,
	path,
	type,
}: FilePathPageListProps): [
	Array<FileInfo>,
	Dispatch<SetStateAction<number>>
] => {
	const [page, setPage] = useState(0);
	const [data, setData] = useState<Array<FileInfo>>([]);

	const fetchAndSetData = useCallback(
		async (page: number) => {
			const pageData: PageData = {
				page: page,
				path: path,
				type: type,
				identifier: 'file',
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

export default useFilePathPageList;
