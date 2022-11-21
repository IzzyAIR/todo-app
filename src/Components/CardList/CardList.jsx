import React from 'react';
import Card from '../Card/Card';
import styles from './CardList.module.scss';
import { useSelector } from 'react-redux';
import { selectListData } from '../../Redux/Slices/listSlice';

/**
 * Компонент для рендера для рендера объектов из массива List
 * @returns Возвращает HTML
 */
const CardList = () => {
	const { list } = useSelector(selectListData);

	return (
		<div className={styles.container__cardList}>
			{list.map((obj) => (
				<Card key={obj.id ? obj.id : 'tempId'} {...obj} />
			))}
		</div>
	);
};
export default CardList;