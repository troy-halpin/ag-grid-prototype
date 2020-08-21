import * as React from 'react'
import { Font, Button } from '@procore/core-react'
import { AgGridReact } from '@ag-grid-community/react'
import { AllModules, GridReadyEvent, ColSpanParams } from '@ag-grid-enterprise/all-modules'

const FontCellRenderer = (props: any) => {
  return (
    <Button>{props.value}</Button>
  )
}

const COLUMN_DEFINITIONS = [
  {
    headerName: 'Foo', 
    field: 'foo',
    rowGroup: true,
    hide: true,
    cellRenderer: 'fontCellRenderer',
    colSpan: function(params: ColSpanParams) {
      // console.log(params.colDef.rowGroup)
      if (params.node.group) {
        return 10;
      }
      return 1 
    }
  },
  {
    headerName: 'Bar', 
    field: 'bar',
    // rowGroup: true
  },
  {
    headerName: 'Baz', 
    field: 'baz',
    // rowGroup: true
  },
  {
    headerName: 'Qux', 
    field: 'qux',
    // rowGroup: true
  },
  {
    headerName: 'Quxx', 
    field: 'quxx',
    // rowGroup: true
  },
]

const ROW_DATA = [
  { foo: 'hi', bar: 'bye'},
  { foo: 'hola', bar: 'adiós'},
];

export default function AgGrid(props: any) {
  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit()
  }

  // row data will be provided via redux on this.props.rowData
  return (
    <div
      style={{ height: 400, width: 900, marginTop: 15 }}
      className="ag-theme-alpine"
    >
      <AgGridReact
        // properties
        groupMultiAutoColumn={true}
        frameworkComponents={{
          fontCellRenderer: FontCellRenderer,
        }}
        columnDefs={COLUMN_DEFINITIONS}
        rowData={ROW_DATA}
        modules={AllModules}
        defaultColDef={{ filter: true }}
        // events
        onGridReady={onGridReady}
      ></AgGridReact>
    </div>
  )
}
