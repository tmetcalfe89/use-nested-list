import { useState } from "react"

const errors = {
  GROUP_EXISTS: "Group already exists in path with given name.",
  ENTRY_NAME_REQUIRED: "Entry name is required.",
  INVALID_PATH: "Invalid path."
}

/**
 * 
 * 
 * @param {Object[]} defaultValue The default value of the nested list. Defaults to an empty array.
 * @param {Object} options The options for this nested list.
 * @param {boolean} options.unique Whether new entries/groups should have a unique name inside of the same group. Defaults to true.
 * @author Timothy Metcalfe
 */
export default function useNestedList(defaultValue = [], { unique = true } = {}) {
  const [nestedList, setNestedList] = useState(defaultValue);

  const addEntry = (entryName, path = []) => {
    if (entryName === undefined) {
      throw new Error(errors.ENTRY_NAME_REQUIRED);
    }
    const clone = [...nestedList];
    let pointer = clone;
    try {
      path.forEach(pathEntry => pointer = pointer.find(entry => entry.name === pathEntry).entries)
    } catch (e) {
      throw new Error(errors.INVALID_PATH);
    }
    if (pointer === undefined) {
      throw new Error(errors.INVALID_PATH);
    }
    if (unique && pointer.some(entry => entry.name === entryName)) {
      throw new Error(errors.GROUP_EXISTS);
    }
    pointer.push({
      name: entryName,
      data: {}
    });
    setNestedList(clone);
  }

  /**
   * Modifies data in the entry at the given path by overwriting existing properties with the values in the given data object.
   * 
   * @param {string[]} path An array of names used to navigate down the tree.
   * @param {Object} data 
   */
  const changeEntryData = (path, data) => {
    const clone = [...nestedList];
    const entryName = path.pop();
    let pointer = clone;
    path.forEach(pathEntry => pointer = pointer.find(entry => entry.name === pathEntry).entries)
    pointer = pointer.find(entry => entry.name === entryName);
    Object.entries(data).forEach(([key, value]) => pointer.data[key] = value);
    console.log(data);
    setNestedList(clone);
  }

  const removeEntry = (path = []) => {
    const clone = [...nestedList];
    let entryName = path.pop();
    let pointer = clone;
    path.forEach(pathEntry => pointer = pointer.find(entry => entry.name === pathEntry).entries)
    pointer.splice(pointer.findIndex(entry => entry.name === entryName), 1);
    setNestedList(clone);
  }

  /**
   * Adds a group to the nested list at the given path.
   * 
   * @param {string} groupName The name of the new group. An empty entries array is automatically assigned.
   * @param {string[]} path An array of names used to navigate down the tree.
   * @returns undefined
   * @throws Will throw an error if the groupName isn't provided.
   * @throws Will throw an error if unique is enabled and group already exists in path with given name.
   */
  const addGroup = (groupName, path = []) => {
    if (groupName === undefined) {
      throw new Error("Group name is required.");
    }
    const clone = [...nestedList];
    let pointer = clone;
    path.forEach(pathEntry => pointer = pointer.find(entry => entry.name === pathEntry).entries)
    if (unique && pointer.some(entry => entry.name === groupName)) {
      throw new Error("Group already exists in path with given name.");
    }
    pointer.push({
      name: groupName,
      entries: []
    });
    setNestedList(clone);
  }

  const renameEntry = (path, groupName) => {
    const clone = [...nestedList];
    const curGroupName = path.pop();
    let pointer = clone;
    path.forEach(pathEntry => pointer = pointer.find(entry => entry.name === pathEntry).entries);
    pointer = pointer.find(entry => entry.name === curGroupName);
    pointer.name = groupName;
    setNestedList(clone);
  }

  const getEntry = (path) => {
    const clone = [...nestedList];
    const entryName = path.pop();
    let pointer = clone;
    path.forEach(pathEntry => pointer = pointer.find(entry => entry.name === pathEntry).entries);
    pointer = pointer.find(entry => entry.name === entryName);
    return pointer;
  }

  return {
    nestedList,
    addGroup,
    addEntry,
    renameEntry,
    changeEntryData,
    getEntry,
    removeEntry,
  }
}
