import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
  const { loading, error, request, clearError } = useHttp();

  //const _apiBase = 'https://marvel-server-zeta.vercel.app/';
  const _apiBase = '/'; // в package.json добавлен proxy: "https://marvel-server-zeta.vercel.app", чтобы браузер не применял в запросах CORS
  const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
  const _baseOffset = 0;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getAllComics = async (offset = 0) => {
    const res = await request(
      `${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformComics);
  };

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  };

  const _transformCharacter = (character) => {
    return {
      id: character.id,
      name: character.name,
      description: character.description,
      thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
      homepage: character.urls[0].url,
      wiki: character.urls[1].url,
      comics: character.comics.items
    };
  };

  const _transformComics = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      description: comic.description || "There is no description",
      pageCount: comic.pageCount
        ? `${comic.pageCount} p.`
        : "No information about the number of pages",
      thumbnail: comic.thumbnail.path + "." + comic.thumbnail.extension,
      language: comic.textObjects.languages || "en-us",
      price: comic.prices[0]?.price
        ? `${comic.prices[0].price}$`
        : "not available",
    };
  };

  return { loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic };
};

export default useMarvelService;