import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
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
    const [loading, setLoading] = useState(true);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    let errMessage = null;

    useEffect(() => {
        onRequest();
    }, []);

    const onRequest = (offset) => {
        setNewItemsLoading(true);
        marvelService.getAllCharacters(offset)
            .then((newCharList) => {
                setCharList(prevCharList => [...prevCharList, ...newCharList]);
                setLoading(false);
                setNewItemsLoading(false);
                setOffset(prevOffset => prevOffset + 9);
                setCharEnded(newCharList.length < 9);
            })
            .catch((err) => {
                errMessage = err.message;
                setError(true);
                setLoading(false);
                setNewItemsLoading(false);
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
            {loading ?
                <Spinner />
                : error ?
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <ErrorMessage />
                        <span style={{ color: 'red', fontSize: '15px', textAlign: 'center' }}>{errMessage}</span>
                    </div>
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
                disabled={newItemsLoading}
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