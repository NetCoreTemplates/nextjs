import { columnVisibilityFeature, flexRender, rowSelectionFeature, tableFeatures, useTable } from '@tanstack/react-table'

import type { ColumnDef as TanStackColumnDef, RowData, TableOptions } from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { cn } from '@/lib/utils'

import { toPascalCase, splitTitleCase } from '@servicestack/client'

// TanStack Table v9 features used by DataTable (the core row model is built-in)
export const features = tableFeatures({ columnVisibilityFeature, rowSelectionFeature })
type Features = typeof features

export type ColumnDef<TData extends RowData, TValue = unknown> = TanStackColumnDef<Features, TData, TValue>

// features is provided by DataTable
type DataTableProps<TData extends RowData, TValue> = Omit<TableOptions<Features, TData>, 'features'> & {
    columns: ColumnDef<TData, TValue>[]
    stripedRows?: boolean
}

export function columnDefs<T extends RowData>(names: string[], configure?: (name: { [name: string]: ColumnDef<T> }) => void): ColumnDef<T>[] {
    const to = names.map((name) => ({
        accessorKey: name,
        header: splitTitleCase(toPascalCase(name)).join(' '),
    }))
    if (configure != null) {
        const map = to.reduce(
            (acc, x) => {
                acc[x.accessorKey] = x
                return acc
            },
            {} as { [name: string]: ColumnDef<T> },
        )
        configure(map)
    }
    return to
}

export function DataTable<TData extends RowData, TValue>(props: DataTableProps<TData, TValue>) {
    const { enableRowSelection } = props
    const stripedRows = props.stripedRows ?? true

    // oxlint-disable-next-line react/incompatible-library -- TanStack Table isn't React Compiler compatible
    const table = useTable({
        ...props,
        features,
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader className="bg-muted/50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className={cn(stripedRows && 'even:bg-muted/40', enableRowSelection && 'cursor-pointer')}
                                data-state={row.getIsSelected() && 'selected'}
                                onClick={row.getToggleSelectedHandler()}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={props.columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
export default DataTable
