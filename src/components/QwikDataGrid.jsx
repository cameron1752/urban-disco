import React, { useRef, useState, useMemo, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import postTransaction from '../data/DataPlacer.jsx';
import patchTransaction from '../data/DataUpdater.jsx';
import deleteTransaction from '../data/DataDeleter.jsx';
import { useGlobalData } from '../data/DataContext.jsx';

function normalizeSelection(newSelection) {
    return Array.from(newSelection.ids ?? newSelection);
}

const GridTextInput = ({ cellParams, onValueChange, onCommit, colField, colHeader }) => {
    const displayValue = cellParams.value ?? '';

    return (
        <input
            type="text"
            value={displayValue}
            placeholder={cellParams.row.isPlaceholder ? `Enter ${colHeader}...` : ''}
            onChange={(e) => onValueChange(cellParams.id, colField, e.target.value)}
            onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                    e.preventDefault();
                    onCommit(cellParams.id);
                }
            }}
            style={{
                width: '100%',
                border: 'none',
                color: 'black',
                borderBottom: '1px solid #ccc',
                background: 'transparent',
                padding: '4px 0',
                outline: 'none',
            }}
        />
    );
};

function createEmptyDraft() {
    return {
        id: 'PLACEHOLDER',
        description: '',
        amount: '',
        category: '',
        date: '',
        pending: '',
        isPlaceholder: true,
    };
}
const handleSave = async (draftRow, currentTab, abortControllerRef, onSuccessCallBack) => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
        const result = await patchTransaction(draftRow, currentTab, onSuccessCallBack);
        console.log('Success:', result);
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Previous request safely canceled.');
        } else {
            console.error('Actual network error occurred:', error);
        }
    } finally {
        // 4. Clean up the ref if this was the last request standing
        if (abortControllerRef.current === controller) {
            abortControllerRef.current = null;
        }
    }
};

export default function DessertDataGrid({ rows: initialRows, columns, onSelectionChange, currentTab }) {
    const { refreshAllData } = useGlobalData();
    const abortControllerRef = useRef(null); // Holds our controller reference

    // state for the grid rows
    const [gridRows, setGridRows] = useState(initialRows || []);
    // state for the drafts
    const [draftRow, setDraftRow] = useState(createEmptyDraft());
    // tracks rows the user has changed but not yet saved to the backend
    const [dirtyRowIds, setDirtyRowIds] = useState(new Set());

    React.useEffect(() => {
        if (initialRows) {
            setGridRows(initialRows);
        }
    }, [initialRows]);

    const handleSelectionChange = async (newSelection) => {
        console.log('Selection changed:', newSelection);

        console.log("index of selected row: ", newSelection.ids);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const result = await deleteTransaction(newSelection.ids, currentTab, refreshAllData);
            console.log('Success:', result);
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Previous request safely canceled.');
            } else {
                console.error('Actual network error occurred:', error);
            }
        } finally {
            // 4. Clean up the ref if this was the last request standing
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
        }

        onSelectionChange(normalizeSelection(newSelection));
    };

    const handleInputChange = useCallback((rowId, field, value) => {
        if (rowId === 'PLACEHOLDER') {
            setDraftRow((prev) => ({ ...prev, [field]: value }));
        } else {
            setGridRows((prev) =>
                prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
            );
            setDirtyRowIds((prev) => new Set(prev).add(rowId));
        }
    }, []);

    const commitDraft = useCallback(() => {
        const hasContent = Object.entries(draftRow).some(
            ([key, val]) => key !== 'id' && key !== 'isPlaceholder' && val !== ''
        );
        if (!hasContent) return;

        postTransaction(draftRow, currentTab, refreshAllData);

        setGridRows((prev) => [...prev, { ...draftRow, id: String(Date.now()), isPlaceholder: false }]);
        setDraftRow(createEmptyDraft());
    }, [draftRow, currentTab, refreshAllData]);

    const commitEdit = useCallback(async (rowId) => {
        const editedRow = gridRows.find((row) => row.id === rowId);

        if (editedRow) {
            try {
                await handleSave(editedRow, currentTab, abortControllerRef, refreshAllData);
                console.log("Database updated and global refresh broadcasted successfully.");
            } catch (error) {
                console.error("Failed to commit edit:", error);
            }
        }

        setDirtyRowIds((prev) => {
            const next = new Set(prev);
            next.delete(rowId);
            return next;
        });

    }, [currentTab, gridRows, refreshAllData]);

    const handleCommit = useCallback((rowId) => {
        if (rowId === 'PLACEHOLDER') {
            commitDraft();
        } else {
            commitEdit(rowId);
        }
    }, [commitDraft, commitEdit]);

    const realRows = useMemo(() => {
        return [draftRow, ...gridRows];
    }, [draftRow, gridRows]);

    const columnsWithInputs = useMemo(() => {
        return columns.map((col) => {
            if (col.field === '__check__' || col.field === 'actions') return col;
            return {
                ...col,
                renderCell: (params) => (
                    <GridTextInput
                        cellParams={params}
                        onValueChange={handleInputChange}
                        onCommit={handleCommit}
                        colField={col.field}
                        colHeader={col.headerName}
                    />
                ),
            };
        });
    }, [columns, handleInputChange, handleCommit]);

    const paginationModel = { page: 0, pageSize: 25 };

    return (
        <div style={{ width: '100%', height: 400 }}>
            <DataGrid
                rows={realRows}
                columns={columnsWithInputs}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 25]}
                checkboxSelection
                onRowSelectionModelChange={handleSelectionChange}
                processRowUpdate={(newRow) => newRow}
                disableRowSelectionOnClick
                sx={{ border: 0, color: 'rgba(0, 0, 0, 0.87)', width: '100%', height: '100%' }}
                getRowClassName={(params) => (dirtyRowIds.has(params.id) ? 'row-dirty' : '')}
            />
        </div>
    );
}