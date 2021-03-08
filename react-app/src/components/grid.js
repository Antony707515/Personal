import { useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd'
import update from 'immutability-helper';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const MoveBookmarks = (props) => {
  const { id, index, moveCard, val, onFavouriteChange, tags, onTagSelect } = props;
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ }, drag] = useDrag({
    item: { type: 'card', id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));
  return (
    <li ref={ref} key={val.id} data-handler-id={handlerId} className="grid-list">
      <div className="grid-list-wrapper">
        <span className="img-span">
          <img src={val.imgUrl} alt={val.title} />
        </span>
        <span className="desc-span">
          <div style={{ width: '100%', height: '5px' }}>
            <span
              style={{
                fontSize: '20px',
                float: 'right',
                color: val.isFavourite ? 'green' : 'grey',
                opacity: val.isFavourite ? 1 : 0.3,
                cursor: 'pointer'
              }}
              onClick={() => onFavouriteChange(val.isFavourite ? 0 : 1)}
            >
              &#9733;
            </span>
            {Boolean(val.tagName) && <span
              className="tag-border"
              style={{
                marginRight: '5px',
                float: 'right',
                background: val.tagColor,
                cursor: 'pointer',
                boxShadow: '0px 0px 2px #b9b9ba',
              }}
              key={val.id}
            >
              {val.tagName}
              &nbsp;
              <small onClick={() => onTagSelect({ target: { value: null } })}>x</small>
            </span>}
            {!val.tagName &&
              <select
                key={val.id}
                placeholder="Select Tag"
                onChange={onTagSelect}
                value=''
              >
                <option value="" disabled>Select Tag</option>
              {tags.map((obj) => (<option value={obj.name} key={obj.color}>{obj.name}</option>))}
              </select>
            }
          </div>
          <dl>
            <span>
              <dt>Title:</dt>
              <dd>{val.title}</dd>
            </span>
            <span>
              <dt>Description:</dt>
              <dd>{val.description}</dd>
            </span>
          </dl>
        </span>
      </div>
      <span className="url-span">
        URL:
        &nbsp;
        <a href={val.url} target="_blank">{val.url}</a>
      </span>
    </li>
  );
};

const Grid = (props) => {
  const { bookmarks, setFilterBookmarks, updateBookmarkDataStore, setBookmarks, totalBookmarks, tags } = props;

  const moveBookmarks = useCallback((dragIndex, hoverIndex) => {
    const dragCard = bookmarks[dragIndex];
    const rearragedColumns = update(bookmarks, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard],
      ],
    });
    setBookmarks(rearragedColumns);
    setFilterBookmarks(rearragedColumns);
    updateBookmarkDataStore(rearragedColumns);
  }, [bookmarks]);

  const onFavouriteChange = (obj, index) => (value) => {
    const bookmarkIndex = totalBookmarks.findIndex((bookmark) => bookmark.id === obj.id);
    totalBookmarks[bookmarkIndex] = { ...obj, isFavourite: value };
    bookmarks[index] = { ...obj, isFavourite: value };
    setFilterBookmarks(bookmarks);
    setBookmarks(totalBookmarks);
    updateBookmarkDataStore(bookmarks);
  };

  const onTagSelect = (obj, index) => (e) => {
    const { value } = e.target;
    const { color = null } = tags.find((tag) => tag.name === value) || {};
    const bookmarkIndex = totalBookmarks.findIndex((bookmark) => bookmark.id === obj.id);
    totalBookmarks[bookmarkIndex] = { ...obj, tagName: value, tagColor: color };
    bookmarks[index] = { ...obj, tagName: value, tagColor: color };
    setFilterBookmarks(bookmarks);
    setBookmarks(totalBookmarks);
    updateBookmarkDataStore(bookmarks);
  };

  return (
    <div className="bookMark-wrapper-grid">
      <ul className="grid-unordered-list">
        <DndProvider backend={HTML5Backend}>
          {bookmarks.map((val, index) => (
            <MoveBookmarks
              tags={tags}
              key={val.id}
              index={index}
              id={val.id}
              val={val}
              moveCard={moveBookmarks}
              onFavouriteChange={onFavouriteChange(val, index)}
              onTagSelect={onTagSelect(val, index)}
            />
          ))}
        </DndProvider>
      </ul>
    </div>
  );
}

export default Grid;

