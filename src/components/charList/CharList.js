import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const CharListItem = ({ item, setRef, onClick, onKeyDown }) => {
    const imgStyle = item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
        ? { objectFit: 'unset' }
        : { objectFit: 'cover' };

    return (
        <li
            className="char__item"
            tabIndex={0}
            ref={(el) => setRef(el)}
            key={item.id}
            onClick={() => onClick(item.id)}
            onKeyDown={(e) => onKeyDown(e, item.id)}>
            <img src={item.thumbnail} alt={item.name} style={imgStyle} />
            <div className="char__name">{item.name}</div>
        </li>
    );
};

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [charEnded, setCharEnded] = useState(false);

    const { loading, error, getAllCharacters } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial = false) => {
        setNewItemsLoading(!initial); // при первом рендере страницы (initial=true) показываем спиннер, при послежующих, по нажатию на кнопку "load more" - не показываем спиннер
        getAllCharacters(offset)
            .then((newCharList) => {
                setCharList(prevCharList => [...prevCharList, ...newCharList]);
                setOffset(prevOffset => prevOffset + 9);
                setCharEnded(newCharList.length < 9);
            })
    };

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    };

    return (
        <div className="char__list">
            {loading && !newItemsLoading ?
                <Spinner />
                : error ?
                    <ErrorMessage />
                    :
                    <ul className="char__grid">
                        {charList.map((item, index) => (
                            <CharListItem
                                key={item.id}
                                item={item}
                                setRef={el => itemRefs.current[index] = el}
                                onClick={(id) => {
                                    props.onCharSelected(id);
                                    focusOnItem(index);
                                }}
                                onKeyDown={(e, id) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        props.onCharSelected(id);
                                        focusOnItem(index);
                                    }
                                }}
                            />
                        ))}
                    </ul>
            }
            <button
                className="button button__main button__long"
                disabled={loading}
                style={{ 'display': !charEnded ? 'block' : 'none' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
};

export default CharList;