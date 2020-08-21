import * as React from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import { AllModules, GridReadyEvent } from '@ag-grid-enterprise/all-modules'

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
        columnDefs={columnDefs}
        rowData={rowData}
        modules={AllModules}
        defaultColDef={{ filter: true }}
        // events
        onGridReady={onGridReady}
      ></AgGridReact>
    </div>
  )
}
