import React from 'react';
import './App.scss';
import Panel from './Components/Panel/Panel';
import CardList from './Components/CardList/CardList';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { getData } from './Redux/Slices/listSlice';
import { useDispatch } from 'react-redux';

function App() {
	const dispatch = useDispatch();

	/**
	 * При вызове этой функции запрашиваются все данный из FireBase.
	 * После добавляются с помощью специальных функции из React-Redux, Добавляется в State List
	 * @component
	 * Функция ничего не возвращает и не принимает
	 */
	const getAllData = () => {
		getDocs(collection(db, 'todos')).then((res) =>
			dispatch(getData(res.docs.map((el) => ({ ...el.data(), id: el.id })))),
		);
	};

	React.useEffect(() => {
		getAllData();
	}, []);

	return (
		<div className='App'>
			<div className='container'>
				<div className='header__title'>To Do List! Create your Tasks...</div>
				<div className='panel__form'>
					<Panel />
				</div>
				<div className='cardList'>
					<CardList />
				</div>
			</div>
		</div>
	);
}

export default App;
