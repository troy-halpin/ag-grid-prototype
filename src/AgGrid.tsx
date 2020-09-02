import * as React from 'react'
import { Font, Input, Select, Button } from '@procore/core-react'
import { AgGridReact } from '@ag-grid-community/react'
import {
  AllModules,
  GridReadyEvent,
  ColDef,
  ValueSetterParams,
  ValueGetterParams,
  ValueFormatterParams,
} from '@ag-grid-enterprise/all-modules'

import './theme-overrides.scss'

const KEY_ENTER = 13

export const FontCellRenderer = (props: any) => {
  return (
    <Font size="md" weight="bold" variant="primary">
      {props.value}
    </Font>
  )
}

export const PercentCellRenderer = (props: any) => {
  return (
    <div className="percent-cell">
      <Font size="md" weight="bold" variant="primary">
        {props.value === undefined ? null : `${props.value}%`}
      </Font>
    </div>
  )
}

export const InputCellRenderer = (props: any) => {
  return <Input type="text" defaultValue={props.value} />
}

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
  console.log(props.value)
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

const getColumnDefinitions: (grouped: boolean) => ColDef[] = (grouped) => [
  {
    headerName: 'Group',
    field: 'group',
    rowGroup: grouped,
    hide: grouped,
    cellRenderer: 'fontCellRenderer',
  },
  {
    headerName: 'Baz',
    field: 'baz',
    // hide: true,
    cellRenderer: 'fontCellRenderer',
  },
  {
    headerName: 'Percent',
    field: 'percent',
    // hide: true,
    cellRenderer: 'percentCellRenderer',
  },
  {
    editable: true,
    headerName: 'Input',
    field: 'input',
    cellEditor: 'inputCellEditor',
    // cellRenderer: 'fontCellRenderer',
  },
  {
    editable: true,
    headerName: 'Select',
    cellEditor: 'selectCellEditor',
    cellEditorParams: {
      options: selectItems,
    },
    field: 'select',
    suppressKeyboardEvent: function (params) {
      // return true (to suppress) if editing and user hit up/down keys
      var keyCode = params.event.keyCode
      return params.editing && keyCode === KEY_ENTER
    },
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

const generateRowData = () => {
  let data = []
  for (let i = 0; i < 1000; i++) {
    data.push({
      group: i % 25,
      baz: `row ${i}`,
      percent: i % 100,
      input: 'this is an input',
      select: selectItems[i % 16],
    })
  }
  return data
}

// const getRowData: () => any[] = () => [
//   {
//     group: 'hi',
//     baz: 'Nested Level 1',
//     percent: 20,
//     input: 'bye',
//     select: '',
//   },
//   {
//     group: 'hi',
//     baz: 'Nested Level 1',
//     percent: 30,
//     input: 'adiós',
//     select: '',
//   },
//   {
//     group: 'hola',
//     baz: 'Nested Level 1',
//     percent: 40,
//     input: 'auf wiedersehen',
//     select: selectItems[1],
//   },
//   {
//     group: 'hola',
//     baz: 'Nested Level 1',
//     percent: 50,
//     input: 'sayōnara',
//     select: '',
//   },
// ]

export default function AgGrid(props: any) {
  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit()
  }

  const [grouped, setGrouped] = React.useState(true)

  return (
    <>
      <Button onClick={() => setGrouped(false)}>Toggle Grouping</Button>
      <div
        style={{ height: 400, width: 900, marginTop: 15 }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          // properties
          groupMultiAutoColumn={true}
          frameworkComponents={{
            fontCellRenderer: FontCellRenderer,
            inputCellRenderer: InputCellRenderer,
            percentCellRenderer: PercentCellRenderer,
            inputCellEditor: InputCellEditor,
            selectCellEditor: SelectCellEditor,
          }}
          columnDefs={getColumnDefinitions(grouped)}
          rowData={generateRowData()}
          modules={AllModules}
          suppressContextMenu
          // events
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>
    </>
  )
}
