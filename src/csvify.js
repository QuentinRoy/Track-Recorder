export const createCSVRow = (delimiter, columnNames, rowDict) =>
  columnNames
    .map(colName => {
      const val = rowDict[colName];
      // Convert the value into a string
      const strVal = val == null ? '' : rowDict[colName].toString();
      // Resolve conflicts between the column and the column delimiter.
      if (strVal.indexOf(delimiter) !== -1) return `"${strVal}"`;
      return strVal;
    })
    .join(delimiter);

/**
 * Convert a list of row dictionaries to a csv representation.
 *
 * @param {object[]} rows The list of rows.
 * @param {string[]} [columnNames] The list of column names.
 *        Defaults to the keys of the first column (if any).
 * @param {Object} [config]
 * @param {string} [config.delimiter=','] The delimiter to delimit columns.
 * @param {boolean} [config.writeHeader=true] If the headers should be written.
 */
export default (
  rows,
  columnNames = rows[0] ? Object.keys(rows[0]) : [],
  { delimiter = ',', writeHeaders = true } = {}
) =>
  [
    ...(writeHeaders ? [columnNames] : []),
    ...rows.map(row => createCSVRow(delimiter, columnNames, row))
  ].join('\n');
