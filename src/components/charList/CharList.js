// <div className="char__list">
//     <ul className="char__grid">
//         <li className="char__item">
//             <img src={abyss} alt="abyss" />
//             <div className="char__name">Abyss</div>
//         </li>
//         <li className="char__item char__item_selected">
//             <img src={abyss} alt="abyss" />
//             <div className="char__name">Abyss</div>
//         </li>
//         <li className="char__item">
//             <img src={abyss} alt="abyss" />
//             <div className="char__name">Abyss</div>
//         </li>
//         <li className="char__item">
//             <img src={abyss} alt="abyss" />
//             <div className="char__name">Abyss</div>
//         </li>
//         <li className="char__item">
//             <img src={abyss} alt="abyss" />
//             <div className="char__name">Abyss</div>
//         </li>
//         <li className="char__item">
//             <img src={abyss} alt="abyss" />
//             <div className="char__name">Abyss</div>
//         </li>
//         <li className="char__item">
//             <img src={abyss} alt="abyss" />
//             <div className="char__name">Abyss</div>
//         </li>
//         <li className="char__item">
//             <img src={abyss} alt="abyss" />
//             <div className="char__name">Abyss</div>
//         </li>
//         <li className="char__item">
//             <img src={abyss} alt="abyss" />
//             <div className="char__name">Abyss</div>
//         </li>
//     </ul>
//     <button className="button button__main button__long">
//         <div className="inner">load more</div>
//     </button>
// </div>

import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false
    };

    errMessage = null;
    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService.getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    };

    onCharListLoaded = (charList) => {
        this.setState({
            charList,
            loading: false
        })
    };

    onError = (err) => {
        this.errMessage = err.message;
        this.setState({
            loading: false,
            error: true
        });
    };

    renderItems(arr) {
        const items = arr.map((item) => {
            let imgStyle = item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
                ? { 'objectFit': 'unset' }
                : { 'objectFit': 'cover' };

            return (
                <li className="char__item" key={item.id}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });
        return items;
    };

    render() {
        const { charList, loading, error } = this.state;

        const items = this.renderItems(charList);

        return (
            <div className="char__list">
                {loading ?
                    <Spinner />
                    : error ?
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <ErrorMessage />
                            <span style={{ color: 'red', fontSize: '15px', textAlign: 'center' }}>{this.errMessage}</span>
                        </div>
                        :
                        <ul className="char__grid">
                            {items}
                        </ul>
                }
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    };
};

export default CharList;