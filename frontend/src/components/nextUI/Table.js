import { Table as NextUITable } from "@nextui-org/react";
import { Button } from "./index";

//description (string) = aria label for the table
//headers (array) = table headers
//format: [{key, label}, {key, label}, ...]
//rows (array) = table items
//format: [{key, col1: value, col2: value, col3: value]}, {key, col1, col2, ...}]
//button (object, optional) = button component to add to end of each row
//format: {color (string, optional), text (string), description (string), onPress (function to be called on press), size (string, optional)}
const Table = ({ description, headers, rows, button }) => {
  const { buttonDescription, text, onPress } = button;

  rows = rows.map((row, i) => ({ ...row, key: i }));

  return (
    <NextUITable
      aria-label={description}
      css={{
        minWidth: "30rem",
        maxWidth: "40rem",
        background: "$gray300",
      }}
      shadow={false}
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
                <NextUITable.Cell key={row.key}>{row[key]}</NextUITable.Cell>
              ) : (
                <NextUITable.Cell key={key}>
                  <Button
                    ariaLabel={buttonDescription}
                    text={text}
                    onPress={() => onPress(row)}
                    size="xs"
                    type="button"
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
