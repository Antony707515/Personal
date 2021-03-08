const TagFilter = (props) => {
  const { tags, searchText, setSearchText, onApplyFilter, onTagSelect, selectedTags } = props;

  return (
    <div className="bookMark-tag">
      <div className="bookMark-tag-filter">
        {tags.map((val) => (
          <span
            style={{
              background: val.color,
              cursor: 'pointer',
              opacity: selectedTags.includes(val.name) ? 1 : 0.1,
            }}
            key={val.id}
            onClick={() => onTagSelect(val.name)}
          >
            {val.name}
          </span>
        ))}
      </div>
      <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      <button onClick={onApplyFilter}>Search</button>
    </div>
  );
}

export default TagFilter;
