import { useEffect, useState, useCallback } from 'react';
import { ActionCreatorsMapObject } from 'redux';
import { FileInfoList } from '../store/types';
import { KeywordData } from '../services/types';

interface FilePathPageListProps {
	file: ActionCreatorsMapObject;
	keyword: string;
}

const useKeywordPageList = ({
	file,
	keyword,
}: FilePathPageListProps): [
	FileInfoList,
	(page: number, keyword: string) => Promise<void>
] => {
	const [data, setData] = useState<FileInfoList>({ datas: [] });

	const fetchAndSetData = useCallback(
		async (page: number, keyword: string) => {
			const keywordData: KeywordData = {
				page: page,
				keyword: keyword,
			};
			const data = await file.search(keywordData);
			setData(data);
		},
		[keyword]
	);

	useEffect(() => {
		fetchAndSetData(0, keyword);
	}, [fetchAndSetData]);

	return [data, fetchAndSetData];
};

export default useKeywordPageList;
