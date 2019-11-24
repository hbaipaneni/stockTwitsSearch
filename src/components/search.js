import { useState } from 'react';
import { useAsync } from 'react-async-hook';
import useConstant from 'use-constant'
import axios from 'axios';

import AwesomeDebouncePromise from 'awesome-debounce-promise';



const getTweets = (text) => {
  const symbols = text.split(',').filter(symbol => !!symbol.trim());
  if (!symbols.length) {
    return Promise.resolve([]);
  }
  return new Promise((resolve, reject) => {
    const promises = symbols.map((symbol) => {
      const promise = new Promise((res, rej) => {
        axios.get(`https://api.stocktwits.com/api/2/streams/symbol/${symbol.trim()}.json`).then((response) => {
          res(response.data)
        }, (err) => {
          rej(err)
        })
      });
      return promise;
    })

    Promise.allSettled(promises).then((data) => {
      const response = data.filter(res => !!res.value).map(res => res.value);
      resolve(response);
    });
  });


}
export const useSearchArtist = () => {
  const [inputText, setInputText] = useState('');
  const debouncedSearchArtist = useConstant(() =>
    AwesomeDebouncePromise(getTweets, 1000)
  );

  const search = useAsync(
    async text => {
      if (text.length === 0) {
        return [];
      } else {
        return debouncedSearchArtist(text);
      }
    },
    [inputText]
  );
  return {
    inputText,
    setInputText,
    search,
  };
};

