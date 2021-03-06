## Functions

<dl>
<dt><a href="#useNestedList">useNestedList(defaultValue, options)</a></dt>
<dd><p>A hook responsible for holding onto groups of groups/entries. Groups may contain other groups and entries. Entries contain data.</p>
</dd>
</dl>

<a name="errors"></a>

## errors : <code>enum</code>

Enum for errors.

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name                | Type                | Default                                                                |
| ------------------- | ------------------- | ---------------------------------------------------------------------- |
| ENTRY_EXISTS        | <code>string</code> | <code>&quot;Entry already exists in path with given name.&quot;</code> |
| ENTRY_NAME_REQUIRED | <code>string</code> | <code>&quot;Entry name is required.&quot;</code>                       |
| INVALID_PATH        | <code>string</code> | <code>&quot;Invalid path.&quot;</code>                                 |
| INVALID_CHANGE_TYPE | <code>string</code> | <code>&quot;Invalid change type.&quot;</code>                          |

<a name="changeTypes"></a>

## changeTypes : <code>enum</code>

Enum for change types, aka modes.

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name    | Type                | Default                          |
| ------- | ------------------- | -------------------------------- |
| REPLACE | <code>string</code> | <code>&quot;replace&quot;</code> |
| MERGE   | <code>string</code> | <code>&quot;merge&quot;</code>   |

<a name="useNestedList"></a>

## useNestedList(defaultValue, options)

A hook responsible for holding onto groups of groups/entries. Groups may contain other groups and entries. Entries contain data.

**Kind**: global function  
**Requires**: <code>module:useState</code>  
**Author**: Timothy Metcalfe

| Param          | Type                              | Description                                                                                      |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| defaultValue   | <code>Array.&lt;object&gt;</code> | The default value of the nested list. Defaults to an empty array.                                |
| options        | <code>object</code>               | The options for this nested list.                                                                |
| options.unique | <code>boolean</code>              | Whether new entries/groups should have a unique name inside of the same group. Defaults to true. |

- [useNestedList(defaultValue, options)](#useNestedList)
  - [~addEntry(entryName, path, data)](#useNestedList..addEntry)
  - [~changeEntryData(path, data, mode)](#useNestedList..changeEntryData)
  - [~removeEntry(path)](#useNestedList..removeEntry)
  - [~addGroup(groupName, path)](#useNestedList..addGroup)
  - [~renameEntry(path, entryName)](#useNestedList..renameEntry)
  - [~getEntry(path)](#useNestedList..getEntry) ΓçÆ

<a name="useNestedList..addEntry"></a>

### useNestedList~addEntry(entryName, path, data)

Adds a new Entry at the given path with the given name and data.

**Kind**: inner method of [<code>useNestedList</code>](#useNestedList)  
**Throws**:

- Will throw an error if provided with an invalid name.
- Will throw an error if unique is enabled and an Entry exists with the given name.

| Param     | Type                              | Description                                |
| --------- | --------------------------------- | ------------------------------------------ |
| entryName | <code>string</code>               | The name of the Entry to add.              |
| path      | <code>Array.&lt;string&gt;</code> | The path of the Group to add the Entry to. |
| data      | <code>object</code>               | The data to add to the new Entry.          |

<a name="useNestedList..changeEntryData"></a>

### useNestedList~changeEntryData(path, data, mode)

Modifies data in the entry at the given path by overwriting existing properties with the values in the given data object.

**Kind**: inner method of [<code>useNestedList</code>](#useNestedList)  
**Throws**:

- Will throw an error if the path isn't a valid array, if it doesn't have at least one element, or if it doesn't lead to an Entry.
- Will throw an error if an invalid mode is given.

| Param | Type                              | Default                          | Description                                                     |
| ----- | --------------------------------- | -------------------------------- | --------------------------------------------------------------- |
| path  | <code>Array.&lt;string&gt;</code> |                                  | An array of names used to navigate down the tree.               |
| data  | <code>object</code>               |                                  | The data to merge with the existing data.                       |
| mode  | <code>string</code>               | <code>&quot;replace&quot;</code> | The mode of changing the data. @see [changeTypes](#changeTypes) |

<a name="useNestedList..removeEntry"></a>

### useNestedList~removeEntry(path)

Remove a Group/Entry at the given path.

**Kind**: inner method of [<code>useNestedList</code>](#useNestedList)  
**Throw**: Will throw an error if given an invalid path.

| Param | Type                              | Description                            |
| ----- | --------------------------------- | -------------------------------------- |
| path  | <code>Array.&lt;string&gt;</code> | The path of the Group/Entry to remove. |

<a name="useNestedList..addGroup"></a>

### useNestedList~addGroup(groupName, path)

Adds a group to the nested list at the given path.

**Kind**: inner method of [<code>useNestedList</code>](#useNestedList)  
**Throws**:

- Will throw an error if the groupName isn't provided.
- Will throw an error if unique is enabled and group already exists in path with given name.

| Param     | Type                              | Description                                                                  |
| --------- | --------------------------------- | ---------------------------------------------------------------------------- |
| groupName | <code>string</code>               | The name of the new group. An empty entries array is automatically assigned. |
| path      | <code>Array.&lt;string&gt;</code> | An array of names used to navigate down the tree.                            |

<a name="useNestedList..renameEntry"></a>

### useNestedList~renameEntry(path, entryName)

Renames a Group/Entry at the given path.

**Kind**: inner method of [<code>useNestedList</code>](#useNestedList)  
**Throws**:

- Will throw an error if entryName is not provided.
- Will throw an error if an invalid path is provided.

| Param     | Type                              | Description                  |
| --------- | --------------------------------- | ---------------------------- |
| path      | <code>Array.&lt;string&gt;</code> | The path of the Group/Entry. |
| entryName | <code>string</code>               | The new name.                |

<a name="useNestedList..getEntry"></a>

### useNestedList~getEntry(path) ΓçÆ

Gets a Group/Entry at a given path.

**Kind**: inner method of [<code>useNestedList</code>](#useNestedList)  
**Returns**: The Group/Entry at the given path.  
**Throws**:

- Will throw an error if an invalid path is provided.

| Param | Type                              | Description                   |
| ----- | --------------------------------- | ----------------------------- |
| path  | <code>Array.&lt;string&gt;</code> | The path for the Group/Entry. |
