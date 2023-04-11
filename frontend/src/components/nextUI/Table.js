import { Table as NextUITable, css } from "@nextui-org/react";
import { Button } from "./index";
import { useState } from "react";

//description (string) = aria label for the table
//headers (array) = table headers
//format: [{key, label}, {key, label}, ...]
//rows (array) = table items
//format: [{key, col1: value, col2: value, col3: value]}, {key, col1, col2, ...}]
//button (object, optional) = button component to add to end of each row
//format: {color (string, optional), text (string), description (string), onPress (function to be called on press), size (string, optional)}
const Table = ({ description, headers, rows, button }) => {
  const { buttonDescription, text, onPress } = button;
  const [windowWidth, setWindowWidth] = useState(window.screen.width);
  console.log(window.screen.width);

  window.addEventListener("resize", setWindowWidth);

  rows = rows.map((row, i) => ({ ...row, key: i }));

  return (
    <NextUITable
      aria-label={description}
      headerLined={"true"}
      css={{
        background: "rgba(255, 255, 255, 0.7)",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(11.9px)",
        webkitBackdropFilter: "blur(11.9px)",
        border: "1px solid rgba(41, 124, 76, 0.26)",
        "@xs": {
          margin: 0,
          padding: 0,
        },
        minWidth: "15rem",
        maxWidth: "50vw",
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
                <NextUITable.Cell key={row.key}>
                  {windowWidth < 800 && row[key].length > 16
                    ? row[key].slice(0, 16) + "..."
                    : row[key]}
                </NextUITable.Cell>
              ) : (
                <NextUITable.Cell key={key}>
                  <Button
                    color={"secondary"}
                    ariaLabel={buttonDescription}
                    text={text}
                    onPress={() => onPress(row)}
                    size="xs"
                    type="button"
                  />{" "}
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
