import { useState, useEffect } from 'react';
import { get } from 'lodash';

import AddUrlComponent from './components/add-url';
import FilterTagComponent from './components/filter-tag';
import Grid from './components/grid';
import { getAll, post, put } from './fetch-hanlder';
import './bookmark.scss';

const Bookmark = () => {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [filterBookmarks, setFilterBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterText, setFilterText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const setFilterBookmarksData = (data, filter = null) => {
    let finalFilterData = [...data];
    const text = filter === null ? filterText : filter;
    if (text) {
      finalFilterData = data.filter((obj) => {
        const values = ['title', 'imgUrl', 'url'].map((field) => obj[field]).filter(i => i).join('');
        return values.includes(text) && (!obj.tagName || (obj.tagName && selectedTags.includes(obj.tagName)));
      });
    } else {
      finalFilterData = finalFilterData.filter((obj) => (!obj.tagName || (obj.tagName && selectedTags.includes(obj.tagName))));
    }
    setFilterBookmarks(finalFilterData);
  };

  const getBookmarksAndTags = (shouldDoFilter) => {
    Promise.all([getAll('bookmarks'), getAll('tags')])
      .then((data) => {
        setBookmarks(get(data, '[0].data', []));
        setTags(get(data, '[1].data', []));
        setSelectedTags(get(data, '[1].data', []).map((obj) => obj.name));
        if (shouldDoFilter) {
          setFilterBookmarksData(get(data, '[0].data', []));
        }
      })
      .catch((error) => {
        console.log('The error in getBookmarksAndTags', error);
      });
  };

  useEffect(() => {
    getBookmarksAndTags();
  }, []);

  useEffect(() => {
    setFilterBookmarksData(bookmarks);
  }, [selectedTags]);
  
  useEffect(() => {
    if (!loading && url) {
      setUrl('');
      getBookmarksAndTags(true);
    }
  }, [loading]);

  const onApplyFilter = () => {
    setFilterText(searchText);
    setFilterBookmarksData(bookmarks, searchText);
  };

  const onTagSelect = (tagName) => {
    const tagIndex = selectedTags.findIndex((tag) => tag === tagName);
    let newTags = [...selectedTags];
    if (tagIndex === -1) {
      newTags.push(tagName);
    } else {
      newTags.splice(tagIndex, 1);
    }
    setSelectedTags(newTags);
  };

  const onAddUrlSubmit = () => {
    setLoading(true);
    post('bookmarks', { url }).then((data) => {
      setLoading(false);
    }).catch((error) => {
      console.log('The onAddUrlSubmit error', error);
    })
  };

  const updateBookmarkDataStore = (data) => {
    setLoading(true);
    put('bookmarks', { data }).then((data) => {
      setLoading(false);
    }).catch((error) => {
      console.log('The onAddUrlSubmit error', error);
    })
  };

  const isFilterExists = tags.length === selectedTags.length && !filterText;
  return (
    <div className="bookMark-wrapper">
      <AddUrlComponent url={url} setUrl={setUrl} loading={loading} onAddUrlSubmit={onAddUrlSubmit} />
      <FilterTagComponent
        tags={tags}
        searchText={searchText}
        selectedTags={selectedTags}
        setSearchText={setSearchText}
        onApplyFilter={onApplyFilter}
        onTagSelect={onTagSelect}
      />
      <Grid
        tags={tags}
        bookmarks={filterBookmarks}
        totalBookmarks={bookmarks}
        setFilterBookmarks={setFilterBookmarks}
        setBookmarks={setBookmarks}
        isFilterExists={isFilterExists}
        updateBookmarkDataStore={updateBookmarkDataStore}
      />
    </div>
  )
}

export default Bookmark;
