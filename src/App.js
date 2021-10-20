import { useEffect, useRef } from 'react';
import useNestedList from './hooks/useNestedList';

function App() {
  const { nestedList, addGroup, removeEntry, addEntry, changeEntryData, renameEntry, getEntry } = useNestedList([]);

  const groupNameRef = useRef(null);
  const groupRouteRef = useRef(null);
  const entryNameRef = useRef(null);
  const entryRouteRef = useRef(null);
  const removeRouteRef = useRef(null);
  const renameNameRef = useRef(null);
  const renameRouteRef = useRef(null);
  const modifyDataRef = useRef(null);
  const modifyRouteRef = useRef(null);

  useEffect(() => {
    console.log(nestedList);
  }, [nestedList])

  const makeGroup = (e) => {
    e.preventDefault();
    const groupName = groupNameRef.current.value;
    const groupRoute = groupRouteRef.current.value.split(",").filter(e => e !== "");
    try {
      addGroup(groupName, groupRoute);
    } catch(e) {
      console.log(e)
    }
  }

  const makeEntry = (e) => {
    e.preventDefault();
    const entryName = entryNameRef.current.value;
    const entryRoute = entryRouteRef.current.value.split(",").filter(e => e !== "");
    try {
      addEntry(entryName, entryRoute);
    } catch (e) {
      console.log(e);
    }
  }

  const deleteEntry = (e) => {
    e.preventDefault()
    removeEntry(removeRouteRef.current.value.split(","))
  }

  const changeEntry = (e) => {
    e.preventDefault();
    console.log(modifyDataRef.current.value)
    changeEntryData(modifyRouteRef.current.value.split(","), JSON.parse(modifyDataRef.current.value))
  }

  const modifyNameEntry = (e) => {
    e.preventDefault();
    renameEntry(renameRouteRef.current.value.split(","), renameNameRef.current.value);
  }

  const updateRoutes = (entryName, route) => {
    const trueRoute = route === "" ? entryName : `${route},${entryName}`
    groupRouteRef.current.value = trueRoute;
    removeRouteRef.current.value = trueRoute;
    modifyRouteRef.current.value = trueRoute;
    entryRouteRef.current.value = trueRoute;
    renameRouteRef.current.value = trueRoute;
  }

  const updateEntrySelection = (entryName, route) => {
    updateRoutes(entryName, route);
    modifyDataRef.current.value = JSON.stringify(getEntry([...route.split(","), entryName]).data, null, 2)
  }

  const renderGroup = (group, route = "") => {
    return <div key={`${route},${group.name}`}>
      <h1 onClick={() => updateRoutes(group.name, route)}>{group.name}</h1>
      <div style={{paddingLeft: "1rem"}}>
        {group.entries.map(e => e.entries ? renderGroup(e, route === "" ? group.name : `${route},${group.name}`) : renderEntry(e, route === "" ? group.name : `${route},${group.name}`))}
      </div>
    </div>
  }

  const renderEntry = (entry, route = "") => {
    return <ul key={`${route},${entry.name}`}>
      <b onClick={() => updateEntrySelection(entry.name, route)}>{entry.name}</b>
      {Object.entries(entry.data).map(([key, value]) => <li key={`${route},${entry.name}:${key}`}>{key}: {value}</li>)}
    </ul>
  }

  return (
    <div style={{display: "flex"}}>
      <div>
        <form onSubmit={makeGroup} style={{ display: "flex", flexDirection: "column", paddingBottom: "1rem" }}>
          <input ref={groupRouteRef} placeholder="Route" />
          <input ref={groupNameRef} placeholder="Name" />
          <button>Add group</button>
        </form>
        <form onSubmit={makeEntry} style={{display: "flex", flexDirection: "column", paddingBottom: "1rem"}}>
          <input ref={entryRouteRef} placeholder="Route" />
          <input ref={entryNameRef} placeholder="Name" />
          <button>Add entry</button>
        </form>
        <form onSubmit={changeEntry} style={{display: "flex", flexDirection: "column", paddingBottom: "1rem"}}>
          <input ref={modifyRouteRef} placeholder="Route" />
          <textarea ref={modifyDataRef} placeholder="{}"></textarea>
          <button>Modify entry</button>
        </form>
        <form onSubmit={modifyNameEntry} style={{display: "flex", flexDirection: "column", paddingBottom: "1rem"}}>
          <input ref={renameRouteRef} placeholder="Route" />
          <input ref={renameNameRef} placeholder="Name" />
          <button>Rename entry</button>
        </form>
        <form onSubmit={deleteEntry} style={{display: "flex", flexDirection: "column", paddingBottom: "1rem"}}>
          <input ref={removeRouteRef} placeholder="Route" />
          <button>Remove entry</button>
        </form>
      </div>
      <div>
        {nestedList.map((group) => renderGroup(group))}
      </div>
    </div>
  );
}

export default App;
