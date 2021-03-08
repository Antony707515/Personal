const AddUrl = (props) => {
  const { url, setUrl, onAddUrlSubmit, loading } = props;
  const urlOnchage = (e) => setUrl(e.target.value);

  return (
    <div className="bookMark-wrapper-add-url">
      <input placeholder="Enter URL" value={url} onChange={urlOnchage} />
      <button disabled={!url || loading} onClick={onAddUrlSubmit}>Add</button>
    </div>
  )
}

export default AddUrl;
