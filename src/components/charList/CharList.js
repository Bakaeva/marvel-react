import { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        newItemsLoading: false,
        offset: 0,
        error: false,
        charEnded: false,
        focusedCharId: -1
    };

    selectedCharId = -1;
    errMessage = null;
    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    };

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    };

    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true
        });
    };

    onCharListLoaded = (newCharList) => {
        this.setState(({ charList, offset }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemsLoading: false,
            offset: offset + 9,
            charEnded: newCharList.length < 9
        }));
    };

    onError = (err) => {
        this.errMessage = err.message;
        this.setState({
            loading: false,
            error: true
        });
    };

    onCharSelected = (id) => {
        this.selectedCharId = id;
        this.props.onCharSelected(id);
    };

    onFocus = (id) => {
        this.setState({ focusedCharId: id });
    };

    onBlur = () => {
        this.setState({ focusedCharId: -1 });
    };

    onKeyDown = (e, id) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.onCharSelected(id);
        };
    };

    renderItems(arr) {
        const { focusedCharId } = this.state;

        const items = arr.map((item) => {
            const itemClassName = item.id === focusedCharId ? 'char__item char__item_selected' : 'char__item';
            const imgStyle = item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
                ? { 'objectFit': 'unset' }
                : { 'objectFit': 'cover' };
            const showTooltip = item.id === focusedCharId && item.id !== this.selectedCharId;

            return (
                <li
                    className={itemClassName}
                    key={item.id}
                    tabIndex={0}
                    data-tooltip-id={`tooltip-${item.id}`}
                    onFocus={() => this.onFocus(item.id)}
                    onBlur={this.onBlur}
                    onClick={() => this.onCharSelected(item.id)}
                    onKeyDown={(e) => this.onKeyDown(e, item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                    {showTooltip && (
                        <Tooltip
                            id={`tooltip-${item.id}`}
                            isOpen={true}
                            place="top"
                            content="Press Enter|Space or click on a character to see an information"
                        />
                    )}
                </li>
            );
        });
        return items;
    };

    render() {
        const { charList, loading, newItemsLoading, offset, error, charEnded } = this.state;
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
                <button
                    className="button button__main button__long"
                    disabled={newItemsLoading}
                    style={{ 'display': !charEnded ? 'block' : 'none' }}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    };
};

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
};

export default CharList;