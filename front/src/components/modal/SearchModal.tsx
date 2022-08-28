import React, {
	FC,
	useState,
	Dispatch,
	SetStateAction,
	ChangeEvent,
} from 'react';
import { FileInfo } from '../../store/types';
import {
	Box,
	Paper,
	Modal,
	Alert,
	Collapse,
	InputBase,
	IconButton,
	Divider,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableContainer,
	TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchModalProps {
	keyword: string;
	setKeyword: Dispatch<SetStateAction<string>>;
	openSearch: boolean;
	setOpenSearch: Dispatch<SetStateAction<boolean>>;
	data: Array<FileInfo>;
	fetchData: (page: number, keyword: string) => Promise<void>;
}

interface UseKeywordProps {
	page: number;
	datas: Array<FileInfo>;
	changePage: (newPage: number) => void;
}

const UseKeyword: FC<UseKeywordProps> = ({
	page,
	datas,
	changePage,
}): JSX.Element => {
	const [check, setCheck] = useState(false);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handleChangePage = (event: unknown, newPage: number) => {
		console.log(event);
		changePage(newPage);
	};
	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value);
		changePage(0);
	};

	const downloadClick = (fileId: string) => {
		setCheck(true);
		setTimeout(() => {
			setCheck(false);
		}, 2000);
		console.log(fileId);
	};
	return (
		<Box>
			<TableContainer>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>NodeId</TableCell>
							<TableCell align="center">Filename</TableCell>
							<TableCell>Filesize</TableCell>
							<TableCell align="center">Download</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{datas &&
							datas.map((data: FileInfo) => (
								<TableRow key={data.fileId}>
									<TableCell>{data.fileId}</TableCell>
									<TableCell align="center">{data.filename}</TableCell>
									<TableCell>{data.fileSize}</TableCell>
									<TableCell align="center">
										<IconButton
											sx={{ p: 0, '&:hover': { color: 'secondary.main' } }}
											onClick={() => downloadClick(data.fileId)}
										>
											<FileDownloadIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={datas.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
			<Collapse in={check}>
				<Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
					This file is download success — check it out!
				</Alert>
			</Collapse>
		</Box>
	);
};

const NoKeyword: FC = (): JSX.Element => {
	return (
		<Typography sx={{ mt: 2, fontSize: '0.7rem', fontWeight: 'bold' }}>
			키워드를 입력해 주세요
		</Typography>
	);
};

const SearchModal: FC<SearchModalProps> = ({
	keyword,
	setKeyword,
	openSearch,
	setOpenSearch,
	data,
	fetchData,
}): JSX.Element => {
	const [page, setPage] = useState(0);
	const searchClose = () => setOpenSearch(false);
	const searchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		const text = event.currentTarget.value;
		fetchData(0, text); // 초기화
		setKeyword(text);
	};
	const changePage = (newPage: number) => {
		setPage(newPage);
		fetchData(newPage, keyword);
	};

	const cancelClick = () => {
		setKeyword('');
	};
	return (
		<Modal open={openSearch} onClose={searchClose}>
			<Box
				sx={{
					position: 'absolute' as const,
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 600,
					bgcolor: 'background.paper',
					border: '2px solid #000',
					boxShadow: 24,
					p: 4,
				}}
			>
				<Paper
					component="form"
					sx={{
						p: '2px 4px',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<SearchIcon />
					<InputBase
						sx={{ ml: 1, flex: 1 }}
						placeholder="Search"
						value={keyword}
						onChange={searchOnChange}
					/>
					{keyword !== '' && (
						<IconButton onClick={cancelClick} sx={{ p: 0 }}>
							<ClearIcon />
						</IconButton>
					)}
				</Paper>
				<Divider sx={{ mt: 1, borderColor: 'primary.main' }} />
				{keyword !== '' ? (
					<UseKeyword page={page} datas={data} changePage={changePage} />
				) : (
					<NoKeyword />
				)}
			</Box>
		</Modal>
	);
};

export default SearchModal;
