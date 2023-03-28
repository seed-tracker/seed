import { Table as NextUITable } from "@nextui-org/react";
import { Button } from "./index";

//description = aria label for the table
//headers = table headers
//format: [{key, label}, {key, label}, ...]
//rows = table items
//format: [{key, col1: value, col2: value, col3: value]}, {key, col1, col2, ...}]
//button (optional) = button component to add to end of each row
//format: {color (optional), text, description, onPress (function which will pass in the current row's data), size}
const Table = ({ description, headers, rows, button }) => {
  const { buttonDescription, text, onPress } = button;

  rows = rows.map((row, i) => ({ ...row, key: i + 1 }));
  console.log(rows);
  return (
    <NextUITable
      aria-label={description}
      css={{
        minWidth: "20rem",
        height: "3rem",
      }}
    >
      <NextUITable.Header columns={headers}>
        {(header) => (
          <NextUITable.Column key={header.key}>
            {header.label}
          </NextUITable.Column>
        )}
      </NextUITable.Header>
      <NextUITable.Body items={rows}>
        {(row) => (
          <NextUITable.Row key={row.key}>
            {headers.map(({ key }) =>
              key !== "button" ? (
                <NextUITable.Cell>{row[key]}</NextUITable.Cell>
              ) : (
                <NextUITable.Cell>
                  <Button
                    ariaLabel={buttonDescription}
                    text={text}
                    onPress={() => onPress(row)}
                    size="xs"
                  />
                </NextUITable.Cell>
              )
            )}
          </NextUITable.Row>
        )}
      </NextUITable.Body>
    </NextUITable>
  );
};

export default Table;
