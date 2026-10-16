import React, { useMemo, useState } from 'react';
import InternalAppShell from '../layout/InternalAppShell.jsx';
import { useResourceCrud } from './useResourceCrud';
import './resource-manager.css';

const prettyJson = (value) => JSON.stringify(value, null, 2);

function inferItemId(item) {
  return item?.id || item?.experience_id || item?.opinion_id || item?.post_id || null;
}

export default function ResourceManagerPage({
  title,
  activeNav,
  description,
  listFn,
  createFn,
  updateFn,
  deleteFn,
  payloadHint,
}) {
  const [payloadText, setPayloadText] = useState(payloadHint);
  const [editingId, setEditingId] = useState(null);
  const [localMessage, setLocalMessage] = useState('');

  const {
    items,
    total,
    limit,
    offset,
    isLoading,
    isPageLoading,
    isSaving,
    isDeletingId,
    error,
    refresh,
    loadPage,
    createItem,
    updateItem,
    deleteItem,
  } = useResourceCrud({ listFn, createFn, updateFn, deleteFn });

  const canGoBack = offset > 0;
  const canGoForward = offset + limit < total;

  const parsedPayload = useMemo(() => {
    if (!payloadText.trim()) return null;

    try {
      return { value: JSON.parse(payloadText), error: '' };
    } catch (jsonError) {
      return { value: null, error: jsonError?.message || 'Invalid JSON payload.' };
    }
  }, [payloadText]);

  const onSubmit = async () => {
    if (!parsedPayload || parsedPayload.error || !parsedPayload.value) {
      setLocalMessage('Payload must be valid JSON before saving.');
      return;
    }

    setLocalMessage('');

    try {
      if (editingId) {
        await updateItem(editingId, parsedPayload.value);
        setLocalMessage('Item updated successfully.');
      } else {
        await createItem(parsedPayload.value);
        setLocalMessage('Item created successfully.');
      }

      setEditingId(null);
      setPayloadText(payloadHint);
    } catch (_error) {
      // Surface API errors from hook state.
    }
  };

  const onDelete = async (id) => {
    if (!id) return;

    const confirmed = window.confirm('Delete this record? This action cannot be undone.');
    if (!confirmed) return;

    setLocalMessage('');

    try {
      await deleteItem(id);
      setLocalMessage('Item deleted.');
      if (editingId === id) {
        setEditingId(null);
        setPayloadText(payloadHint);
      }
    } catch (_error) {
      // Surface API errors from hook state.
    }
  };

  const onEdit = (item) => {
    const id = inferItemId(item);
    if (!id) {
      setLocalMessage('This item does not expose an editable id field.');
      return;
    }

    setEditingId(id);
    setPayloadText(prettyJson(item));
    setLocalMessage('Loaded item into editor. Update JSON and save changes.');
  };

  return (
    <InternalAppShell title={title} activeNav={activeNav}>
      <main className="resource-page">
        <header className="resource-hero">
          <p className="resource-kicker">User-scoped data</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </header>

        {(error || localMessage) && (
          <div className={`resource-banner${error ? ' resource-banner--error' : ''}`} role="alert">
            <span>{error || localMessage}</span>
            <button type="button" onClick={refresh} disabled={isLoading || isPageLoading}>
              Refresh
            </button>
          </div>
        )}

        <section className="resource-editor" aria-label="Payload editor">
          <div className="resource-editor__head">
            <h2>{editingId ? 'Update record' : 'Create record'}</h2>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setPayloadText(payloadHint);
                }}
              >
                Cancel edit
              </button>
            )}
          </div>

          <textarea
            value={payloadText}
            onChange={(event) => setPayloadText(event.target.value)}
            className="resource-textarea"
            rows={10}
            spellCheck={false}
          />

          {parsedPayload?.error && <p className="resource-json-error">Invalid JSON: {parsedPayload.error}</p>}

          <div className="resource-editor__actions">
            <button
              type="button"
              className="resource-primary"
              onClick={onSubmit}
              disabled={Boolean(parsedPayload?.error) || isSaving}
            >
              {isSaving ? 'Saving...' : editingId ? 'Save update' : 'Create'}
            </button>
          </div>
        </section>

        <section className="resource-list" aria-label="Records list">
          <div className="resource-list__head">
            <h2>Records</h2>
            <span>
              Showing {items.length} of {total}
            </span>
          </div>

          {isLoading && <p className="resource-muted">Loading records...</p>}
          {!isLoading && items.length === 0 && <p className="resource-muted">No records yet.</p>}

          {!isLoading && items.length > 0 && (
            <div className="resource-cards">
              {items.map((item, index) => {
                const id = inferItemId(item);
                return (
                  <article className="resource-card" key={`${id || 'record'}_${index}`}>
                    <pre>{prettyJson(item)}</pre>
                    <div className="resource-card__actions">
                      <button type="button" onClick={() => onEdit(item)} disabled={!id}>Edit</button>
                      <button
                        type="button"
                        className="resource-danger"
                        onClick={() => onDelete(id)}
                        disabled={!id || isDeletingId === id}
                      >
                        {isDeletingId === id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="resource-pagination">
            <button
              type="button"
              onClick={() => loadPage({ nextLimit: limit, nextOffset: Math.max(offset - limit, 0), withLoader: true })}
              disabled={!canGoBack || isPageLoading}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => loadPage({ nextLimit: limit, nextOffset: offset + limit, withLoader: true })}
              disabled={!canGoForward || isPageLoading}
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </InternalAppShell>
  );
}
