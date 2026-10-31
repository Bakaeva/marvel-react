import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';
import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    };

    errMessage = null;
    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    };

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        };
    };

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        });
    };

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    };

    onError = (err) => {
        this.errMessage = err.message;
        this.setState({
            loading: false,
            error: true
        });
    };

    updateChar = () => {
        const { charId } = this.props;
        if (!charId) {
            return;
        };

        this.onCharLoading();
        this.marvelService.getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    };

    render() {
        const { char, loading, error } = this.state;

        return (
            <div className="char__info" >
                {loading ?
                    <Spinner />
                    : error ?
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <ErrorMessage />
                            <span style={{ color: 'red', fontSize: '15px', textAlign: 'center' }}>{this.errMessage}</span>
                        </div>
                        : char ?
                            <View char={char} />
                            : <Skeleton />
                }
            </div>
        );
    };
};

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;

    let imgStyle = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
        ? { 'objectFit': 'contain' }
        : { 'objectFit': 'cover' };

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0
                    ? 'There is no comics with this character'
                    : comics.map((item, index) => {
                        // eslint-disable-next-line
                        if (index > 9) return;
                        return (
                            <li className="char__comics-item" key={index}>
                                {item}
                            </li>
                        );
                    })
                }
            </ul>
        </>
    );
};

export default CharInfo;