import React from 'react';
import styles from './Card.module.scss';

//Импорты FireBase
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

//Импорты MATERIAL UI
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import dayjs, { Dayjs } from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';

//Импорты Redux
import { useDispatch } from 'react-redux';
import { deleteToDo, saveItemChanges } from '../../Redux/Slices/listSlice';
/**
 * Функцинальный компонент принимает массив и рендерит исходя от количества объектов внутри массива
 * @param {Array} props
 * @returns возвращает либо Карту с данными либо панель для редактирования
 */
const Card = (props) => {
	const dispatch = useDispatch();

	const dateFormat = 'DD.MM.YY hh:mm';
	const [editMode, setEditMode] = React.useState(false);

	const [changes, setChanges] = React.useState({
		...props,
		date: dayjs(props.date, dateFormat),
	});

	// проверяем если дата которая пришла до сегодня (если до значит задачка просрочена)
	const isExpired = changes.date.isBefore(dayjs());

	/**
	 * Функция проверяет изменения и добавляет их в useState Changes
	 * @param {object} event
	 */
	const editTodo = (event) => {
		// name or description
		if (event.target) {
			const { name, value } = event.target;
			setChanges({ ...changes, [name]: value });
		} else {
			setChanges({ ...changes, date: event });
		}
	};
	/**
	 * Функция сохряняет все изменения в сервере и в Redux
	 */
	const saveChanges = () => {
		const dataRef = doc(db, 'todos', props.id);
		const formattedItem = { ...changes, date: changes.date.format(dateFormat) };
		setDoc(dataRef, formattedItem);

		dispatch(saveItemChanges(formattedItem));
		setEditMode(!editMode);
	};
	/**
	 * Функция менят состояние карточки от "обычного" к "сделано" и сохраняет сведения о состоянии на сервере и Redux
	 */
	const onClickDone = () => {
		const dataRef = doc(db, 'todos', props.id);
		const status = !props.done;
		const formattedItem = { ...props, done: status };

		setDoc(dataRef, formattedItem);
		dispatch(saveItemChanges(formattedItem));
		setChanges({ ...formattedItem, date: dayjs(formattedItem.date, dateFormat) });
	};
	/**
	 * Функция для удаления данных
	 */
	const onClickDelete = () => {
		dispatch(deleteToDo(props.id));
		deleteDoc(doc(db, 'todos', props.id));
	};

	let backgroundColor = '#fff';

	if (changes.done) {
		backgroundColor = '#7dc775';
	} else if (isExpired) {
		backgroundColor = '#f15454';
	}

	return (
		<>
			{editMode ? (
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<div className={styles.form__container}>
						<div className={styles.container__top}>
							<TextField
								className={styles.input__title}
								id='outlined-basic'
								label='Title of Task...'
								variant='outlined'
								name='title'
								value={changes.title}
								onChange={editTodo}
							/>
							<DateTimePicker
								className={styles.input__date}
								label='Date & Time picker'
								inputFormat={dateFormat}
								value={changes.date}
								name='date'
								onChange={editTodo}
								renderInput={(params) => <TextField {...params} />}
							/>
							<div className={styles.btn__container}>
								<ButtonGroup
									variant='contained'
									color='warning'
									aria-label=' button group'
								>
									<Button
										className={styles.btn__save_cancel}
										color='success'
										onClick={saveChanges}
									>
										S.
									</Button>
									<Button
										className={styles.btn__save_cancel}
										color='warning'
										onClick={() => setEditMode(!editMode)}
									>
										C.
									</Button>
								</ButtonGroup>
							</div>
						</div>
						<TextField
							className={styles.input__text}
							id='outlined-multiline-static'
							label='Description...'
							multiline
							name='description'
							value={changes.description}
							onChange={editTodo}
							rows={5}
						/>
					</div>
				</LocalizationProvider>
			) : (
				<div className={styles.card__container} style={{ background: backgroundColor }}>
					<div className={styles.container__top}>
						<div className={styles.title__date}>
							<div>{props.title}</div>
							<div>{changes.date.format(dateFormat)}</div>
						</div>
						<div className={styles.btn__container}>
							<ButtonGroup
								variant='contained'
								color='warning'
								aria-label=' button group'
							>
								<Button
									className={styles.btn__done}
									color='success'
									onClick={onClickDone}
								>
									D.
								</Button>
								<Button
									className={styles.btn__edit}
									color='warning'
									onClick={() => setEditMode(!editMode)}
								>
									E.
								</Button>
								<Button
									className={styles.btn__delete}
									color='error'
									onClick={onClickDelete}
								>
									D.
								</Button>
							</ButtonGroup>
						</div>
					</div>
					<div className={styles.img__description}>
						<div className={styles.description}>{props.description}</div>
						{props.fileUrl && (
							<img
								className={styles.img}
								onClick={() => window.open(props.fileUrl, '_blank')}
								src={props.fileUrl}
							/>
						)}
					</div>
				</div>
			)}
		</>
	);
};
export default Card;
