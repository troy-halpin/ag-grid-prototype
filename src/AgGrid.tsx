import * as React from 'react'
import { Font, Input, Select } from '@procore/core-react'
import { AgGridReact } from '@ag-grid-community/react'
import {
  AllModules,
  GridReadyEvent,
  ColDef,
  ValueSetterParams,
  ValueGetterParams,
  ValueFormatterParams,
} from '@ag-grid-enterprise/all-modules'

const FontCellRenderer = (props: any) => {
  return (
    <Font size="md" weight="bold" variant="primary">
      {props.value}
    </Font>
  )
}

const selectItems = [
  { id: '1', label: 'blue bird' },
  { id: '2', label: 'canary' },
  { id: '3', label: 'eagle' },
  { id: '4', label: 'falcon' },
  { id: '5', label: 'finch' },
  { id: '6', label: 'hawk' },
  { id: '7', label: 'oriole' },
  { id: '8', label: 'owl' },
  { id: '9', label: 'parrot' },
  { id: '10', label: 'penguin' },
  { id: '11', label: 'pigeon' },
  { id: '12', label: 'raven' },
  { id: '13', label: 'sparrow' },
  { id: '14', label: 'toucan' },
  { id: '15', label: 'woodpecker' },
  { id: '16', label: 'wren' },
]

const COLUMN_DEFINITIONS: ColDef[] = [
  {
    headerName: '',
    field: 'foo',
    rowGroup: true,
    hide: true,
    cellRenderer: 'fontCellRenderer',
  },
  {
    headerName: 'Baz',
    field: 'baz',
    rowGroup: true,
    hide: true,
    cellRenderer: 'fontCellRenderer',
  },
  {
    editable: true,
    headerName: 'Bar',
    field: 'bar',
    cellEditor: 'inputCellEditor',
  },
  {
    editable: true,
    headerName: 'Select',
    cellEditor: 'selectCellEditor',
    cellEditorParams: {
      options: selectItems,
    },
    field: 'select',
    valueFormatter: function (params: ValueFormatterParams) {
      if (!params.data) return undefined
      if (params.colDef.field) {
        return params.data[params.colDef.field].label
      } else {
        return undefined
      }
    },
    valueGetter: function (params: ValueGetterParams) {
      // group rows cause empty cells, need to return undefined for those
      if (!params.data) return undefined
      if (params.colDef.field) {
        return params.data[params.colDef.field]
      } else {
        return undefined
      }
    },
    valueSetter: function (params: ValueSetterParams) {
      if (params.oldValue !== params.newValue && params.colDef.field) {
        params.data[params.colDef.field] = params.newValue
        return true
      } else {
        return false
      }
    },
  },
]

const getRowData: () => any[] = () => [
  {
    foo: 'hi',
    baz: 'Nested Level 1',
    bar: 'bye',
    select: '',
  },
  {
    foo: 'hola',
    baz: 'Nested Level 1',
    bar: 'adiós',
    select: '',
  },
]

export const InputCellEditor = React.forwardRef((props: any, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  React.useImperativeHandle(ref, () => {
    return {
      afterGuiAttached: () => {
        inputRef.current?.focus()
      },
      getValue: () => {
        return inputRef.current?.value
      },
    }
  })
  return <Input type="text" ref={inputRef} defaultValue={props.value} />
})

export const SelectCellEditor = React.forwardRef(
  ({ value = { id: null, label: null }, ...props }: any, ref) => {
    const selectRef = React.useRef<HTMLDivElement>(null)

    const [internalValue, setValue] = React.useState(value)

    const onSelect = ({ item }: any) => {
      setValue(item)
    }

    React.useImperativeHandle(ref, () => {
      return {
        afterGuiAttached: () => {
          selectRef.current?.focus()
        },
        getValue: () => {
          return internalValue
        },
      }
    })

    return (
      <Select
        block
        label={internalValue.label}
        onSelect={onSelect}
        ref={selectRef}
        afterHide={() => props.stopEditing()}
        placeholder="select a value"
      >
        {props.options.map((item: any) => (
          <Select.Option
            key={item.id}
            value={item}
            selected={item.id === internalValue.id}
          >
            {item.label}
          </Select.Option>
        ))}
      </Select>
    )
  }
)

export default function AgGrid(props: any) {
  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit()
  }

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
          inputCellEditor: InputCellEditor,
          selectCellEditor: SelectCellEditor,
        }}
        columnDefs={COLUMN_DEFINITIONS}
        rowData={getRowData()}
        modules={AllModules}
        // events
        onGridReady={onGridReady}
      ></AgGridReact>
    </div>
  )
}
