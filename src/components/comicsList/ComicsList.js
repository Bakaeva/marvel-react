import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { loading, error, getAllComics } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial = false) => {
        setNewItemsLoading(!initial); // при первом рендере страницы (initial=true) показываем спиннер, при послежующих, по нажатию на кнопку "load more" - не показываем спиннер
        getAllComics(offset)
            .then((newComicsList) => {
                setComicsList(prevComicsList => [...prevComicsList, ...newComicsList]);
                setOffset(prevOffset => prevOffset + 8);
                setComicsEnded(newComicsList.length < 8);
            });
    };

    function renderItems(arr) {
        return arr.map((item, index) => {
            return (
                <li className="comics__item" key={index}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            );
        });
    };

    return (
        <div className="comics__list">
            {loading && !newItemLoading ?
                <Spinner />
                : error ?
                    <ErrorMessage />
                    :
                    <ul className="comics__grid">
                        {renderItems(comicsList)}
                    </ul>
            }
            <button
                className="button button__main button__long"
                disabled={loading}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div >
    );
};

export default ComicsList;