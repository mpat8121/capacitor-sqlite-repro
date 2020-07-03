type jsonSQLite = {
  database: string;
  encrypted: boolean;
  mode: string;
  tables: Array<jsonTable>;
};
type jsonTable = {
  name: string;
  schema?: Array<jsonColumn>;
  indexes?: Array<jsonIndex>;
  values?: Array<Array<any>>;
};
type jsonColumn = {
  column?: string;
  foreignkey?: string;
  value: string;
};
type jsonIndex = {
  name: string;
  column: string;
};

const tableImport: jsonSQLite = {
  database: "test",
  encrypted: false,
  mode: "partial",
  tables: [
    {
      name: "Projects",
      schema: [
        { column: "Id", value: "INTEGER PRIMARY KEY NOT NULL" },
        { column: "Name", value: "TEXT NOT NULL" },
      ],
    },
    {
      name: "Settings",
      schema: [
        { column: "Id", value: "INTEGER PRIMARY KEY NOT NULL" },
        { column: "Key", value: "TEXT NOT NULL" },
        { column: "Setting", value: "TET NOT NULL" },
      ],
    },
  ],
};

export default {tableImport};