import { useState } from "react";

/**
 * Enum for errors.
 *
 * @readonly
 * @enum {string}
 */
const errors = {
  ENTRY_EXISTS: "Entry already exists in path with given name.",
  ENTRY_NAME_REQUIRED: "Entry name is required.",
  INVALID_PATH: "Invalid path.",
  INVALID_CHANGE_TYPE: "Invalid change type.",
};

/**
 * Enum for change types, aka modes.
 *
 * @readonly
 * @enum {string}
 */
const changeTypes = {
  REPLACE: "replace",
  MERGE: "merge",
};

/**
 * A hook responsible for holding onto groups of groups/entries. Groups may contain other groups and entries. Entries contain data.
 *
 * @param {object[]} defaultValue The default value of the nested list. Defaults to an empty array.
 * @param {object} options The options for this nested list.
 * @param {boolean} options.unique Whether new entries/groups should have a unique name inside of the same group. Defaults to true.
 * @requires useState
 * @author Timothy Metcalfe
 */
function useNestedList(defaultValue = [], { unique = true } = {}) {
  const [nestedList, setNestedList] = useState(defaultValue);

  /**
   * Travels a given path along a given list.
   *
   * @param {Group[]|Entry[]} list The list of Groups/Entries to travel.
   * @param {string[]} path The path to travel along.
   * @returns {Group|Entry} The resultant Group/Entry.
   * @throws Will throw an error if provided with an invalid path.
   * @private
   */
  const travelPath = (list, path) => {
    let pointer = list;
    try {
      path.forEach(
        (pathEntry) =>
          (pointer = pointer.find((entry) => entry.name === pathEntry).entries)
      );
    } catch (e) {
      throw new Error(errors.INVALID_PATH);
    }
    if (pointer === undefined) {
      throw new Error(errors.INVALID_PATH);
    }
    return pointer;
  };

  /**
   * Adds a new Entry at the given path with the given name and data.
   *
   * @param {string} entryName The name of the Entry to add.
   * @param {string[]} path The path of the Group to add the Entry to.
   * @param {object} data The data to add to the new Entry.
   * @throws Will throw an error if provided with an invalid name.
   * @throws Will throw an error if unique is enabled and an Entry exists with the given name.
   */
  const addEntry = (entryName, path = [], data = {}) => {
    if (typeof entryName !== "string" || entryName === "") {
      throw new Error(errors.ENTRY_NAME_REQUIRED);
    }
    const clone = [...nestedList];
    let pointer = travelPath(clone, path);
    if (unique && pointer.some((entry) => entry.name === entryName)) {
      throw new Error(errors.ENTRY_EXISTS);
    }
    pointer.push({
      name: entryName,
      data,
    });
    setNestedList(clone);
  };

  /**
   * Modifies data in the entry at the given path by overwriting existing properties with the values in the given data object.
   *
   * @param {string[]} path An array of names used to navigate down the tree.
   * @param {object} data The data to merge with the existing data.
   * @param {string} mode The mode of changing the data. @see {@link changeTypes}
   * @throws Will throw an error if the path isn't a valid array, if it doesn't have at least one element, or if it doesn't lead to an Entry.
   * @throws Will throw an error if an invalid mode is given.
   */
  const changeEntryData = (path, data, mode = "replace") => {
    if (!Array.isArray(path) || path.length === 0) {
      throw new Error(errors.INVALID_PATH);
    }
    const clone = [...nestedList];
    const entryName = path.pop();
    let pointer = travelPath(clone, path);
    pointer = pointer.find((entry) => entry.name === entryName);
    if (pointer === undefined || pointer.data === undefined) {
      throw new Error(errors.INVALID_PATH);
    }
    switch (mode) {
      case changeTypes.REPLACE:
        pointer.data = data;
        break;
      case changeTypes.MERGE:
        Object.entries(data).forEach(
          ([key, value]) => (pointer.data[key] = value)
        );
        break;
      default:
        throw new Error(errors.INVALID_CHANGE_TYPE);
    }
    setNestedList(clone);
  };

  /**
   * Remove a Group/Entry at the given path.
   *
   * @param {string[]} path The path of the Group/Entry to remove.
   * @throw Will throw an error if given an invalid path.
   */
  const removeEntry = (path = []) => {
    const clone = [...nestedList];
    let entryName = path.pop();
    let pointer = travelPath(clone, path);
    const foundIndex = pointer.findIndex((entry) => entry.name === entryName);
    if (foundIndex === undefined) {
      throw new Error(errors.INVALID_PATH);
    }
    pointer.splice(foundIndex, 1);
    setNestedList(clone);
  };

  /**
   * Adds a group to the nested list at the given path.
   *
   * @param {string} groupName The name of the new group. An empty entries array is automatically assigned.
   * @param {string[]} path An array of names used to navigate down the tree.
   * @throws Will throw an error if the groupName isn't provided.
   * @throws Will throw an error if unique is enabled and group already exists in path with given name.
   */
  const addGroup = (groupName, path = []) => {
    if (groupName === undefined) {
      throw new Error(errors.ENTRY_NAME_REQUIRED);
    }
    const clone = [...nestedList];
    let pointer = travelPath(clone, path);
    if (unique && pointer.some((entry) => entry.name === groupName)) {
      throw new Error(errors.ENTRY_EXISTS);
    }
    pointer.push({
      name: groupName,
      entries: [],
    });
    setNestedList(clone);
  };

  /**
   * Renames a Group/Entry at the given path.
   *
   * @param {string[]} path The path of the Group/Entry.
   * @param {string} entryName The new name.
   * @throws Will throw an error if entryName is not provided.
   * @throws Will throw an error if an invalid path is provided.
   */
  const renameEntry = (path, entryName) => {
    if (entryName === undefined) {
      throw new Error(errors.ENTRY_NAME_REQUIRED);
    }
    const clone = [...nestedList];
    const curGroupName = path.pop();
    let pointer = travelPath(clone, path);
    pointer = pointer.find((entry) => entry.name === curGroupName);
    if (pointer === undefined) {
      throw new Error(errors.INVALID_PATH);
    }
    pointer.name = entryName;
    setNestedList(clone);
  };

  /**
   * Gets a Group/Entry at a given path.
   *
   * @param {string[]} path The path for the Group/Entry.
   * @returns The Group/Entry at the given path.
   * @throws Will throw an error if an invalid path is provided.
   */
  const getEntry = (path) => {
    const entryName = path.pop();
    let pointer = travelPath(nestedList, path);
    pointer = pointer.find((entry) => entry.name === entryName);
    if (pointer === undefined) {
      throw new Error(errors.INVALID_PATH);
    }
    return pointer;
  };

  return {
    nestedList,
    addGroup,
    addEntry,
    renameEntry,
    changeEntryData,
    getEntry,
    removeEntry,
  };
}

export default useNestedList;

export { errors, changeTypes };
