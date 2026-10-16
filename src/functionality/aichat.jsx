import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Send, Bot, User, Trash2, RefreshCcw } from 'lucide-react';
import './aichat.css';
import InternalAppShell from '../layout/InternalAppShell.jsx';
import { chatService } from '../api/chatService';
import { useSubscriptionData } from '../subscription/useSubscriptionData';

const FALLBACK_ID_PREFIX = 'tmp_chat_';

const buildTimestamp = value => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const extractMessages = chat => {
  const userText =
    chat?.user_message ||
    chat?.message ||
    chat?.prompt ||
    chat?.input ||
    '';
  const assistantText =
    chat?.assistant_message ||
    chat?.ai_message ||
    chat?.response ||
    chat?.output ||
    '';
  const timestamp =
    buildTimestamp(chat?.created_at) ||
    buildTimestamp(chat?.updated_at) ||
    buildTimestamp(chat?.timestamp);

  return {
    userText,
    assistantText,
    timestamp,
  };
};

const createIdempotencyKey = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `idem_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const ChatApp = () => {
  const [chats, setChats] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const {
    tier,
    creditsBalance,
    usageSummary,
    isLoading: isLoadingEntitlements,
    canUseFeature,
  } = useSubscriptionData();

  const isChatLocked = !isLoadingEntitlements && !canUseFeature('ai_chat');

  const canMoveBack = offset > 0;
  const canMoveNext = offset + limit < total;

  const normalizeChat = useCallback(chat => {
    const stableId = chat?.id || chat?.chat_id || `${FALLBACK_ID_PREFIX}${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const { userText, assistantText, timestamp } = extractMessages(chat);

    return {
      id: stableId,
      raw: chat,
      userText,
      assistantText,
      timestamp,
    };
  }, []);

  const loadChatHistory = useCallback(async ({ nextOffset = offset, nextLimit = limit, withLoader = true } = {}) => {
    if (withLoader) {
      setIsLoadingHistory(true);
    }

    setErrorMessage('');
    try {
      const response = await chatService.listChats({ limit: nextLimit, offset: nextOffset });
      setChats(response.chats.map(normalizeChat));
      setTotal(response.total);
      setLimit(response.limit);
      setOffset(response.offset);
    } catch (error) {
      setErrorMessage(error?.message || 'Unable to load chats right now.');
    } finally {
      if (withLoader) {
        setIsLoadingHistory(false);
      }
    }
  }, [limit, normalizeChat, offset]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    if (isLoadingEntitlements || isChatLocked) {
      setIsLoadingHistory(false);
      return;
    }

    loadChatHistory();
  }, [isChatLocked, isLoadingEntitlements, loadChatHistory]);

  const sendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isSubmitting || isChatLocked) return;

    const optimisticChat = {
      id: `${FALLBACK_ID_PREFIX}${Date.now()}`,
      userText: trimmed,
      assistantText: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOptimistic: true,
    };

    setChats(previous => [...previous, optimisticChat]);
    setInputValue('');
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await chatService.createChat({
        userMessage: trimmed,
        idempotencyKey: createIdempotencyKey(),
      });

      await loadChatHistory({ nextOffset: 0, nextLimit: limit, withLoader: false });
    } catch (error) {
      setChats(previous => previous.filter(chat => !chat.isOptimistic));
      setErrorMessage(error?.message || 'Unable to send message right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteOneChat = async chatId => {
    if (!chatId) return;
    setDeletingChatId(chatId);
    setErrorMessage('');

    try {
      await chatService.deleteChat(chatId);
      await loadChatHistory({ nextOffset: offset, nextLimit: limit, withLoader: false });
    } catch (error) {
      setErrorMessage(error?.message || 'Unable to delete that chat right now.');
    } finally {
      setDeletingChatId(null);
    }
  };

  const clearAllChats = async () => {
    if (isClearing) return;

    const shouldClear = window.confirm('Clear your entire chat history? This cannot be undone.');
    if (!shouldClear) return;

    setIsClearing(true);
    setErrorMessage('');

    try {
      await chatService.clearChats();
      await loadChatHistory({ nextOffset: 0, nextLimit: limit, withLoader: false });
    } catch (error) {
      setErrorMessage(error?.message || 'Unable to clear chat history right now.');
    } finally {
      setIsClearing(false);
    }
  };

  const renderedChats = useMemo(() => chats, [chats]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <InternalAppShell title="AI Chat" activeNav="aichat">
      <div className="chat-app">
        <div className="chat-header">
          <div className="chat-header__inner">
            <h1>AI Strategy Assistant</h1>
            <div className="chat-header__actions">
              <button
                type="button"
                className="chat-header__btn"
                onClick={() => loadChatHistory({ withLoader: true })}
                disabled={isLoadingHistory || isSubmitting || isClearing}
              >
                <RefreshCcw />
                Refresh
              </button>
              <button
                type="button"
                className="chat-header__btn chat-header__btn--danger"
                onClick={clearAllChats}
                disabled={isLoadingHistory || isSubmitting || isClearing || renderedChats.length === 0}
              >
                <Trash2 />
                {isClearing ? 'Clearing...' : 'Clear all'}
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="chat-error" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="chat-entitlements" aria-label="Chat limits and plan">
          <span>Tier: <strong>{tier}</strong></span>
          <span>
            Usage: <strong>
              {Number.isFinite(usageSummary.remaining) ? usageSummary.remaining.toLocaleString() : 'N/A'}
              {' / '}
              {Number.isFinite(usageSummary.limit) ? usageSummary.limit.toLocaleString() : 'N/A'}
            </strong>
          </span>
          <span>
            Credits: <strong>{Number.isFinite(creditsBalance) ? creditsBalance.toLocaleString() : 'N/A'}</strong>
          </span>
        </div>

        {isChatLocked && (
          <div className="chat-locked" role="alert">
            AI chat is not available in your current entitlements. Upgrade your plan from the subscription page.
          </div>
        )}

        <div className="chat-messages">
          {isLoadingHistory && (
            <div className="chat-empty">
              <Bot className="chat-empty__icon" />
              <p>Loading your history...</p>
            </div>
          )}

          {!isLoadingHistory && renderedChats.length === 0 && (
            <div className="chat-empty">
              <Bot className="chat-empty__icon" />
              <p>Start a conversation to generate your first chat.</p>
            </div>
          )}

          {!isLoadingHistory && renderedChats.map((chat) => (
            <article key={chat.id} className="chat-thread-card">
              <div className="chat-row chat-row--user">
                <div className="chat-bubble chat-bubble--user">
                  <div className="chat-bubble__inner">
                    <div className="chat-content">
                      <p className="chat-content__text">{chat.userText || 'No prompt content.'}</p>
                      <p className="chat-content__time chat-content__time--user">{chat.timestamp}</p>
                    </div>
                    <User className="chat-icon" />
                  </div>
                </div>
              </div>

              {(chat.assistantText || isSubmitting) && (
                <div className="chat-row chat-row--bot">
                  <div className="chat-bubble chat-bubble--bot">
                    <div className="chat-bubble__inner">
                      <Bot className="chat-icon" />
                      <div className="chat-content">
                        <p className="chat-content__text">{chat.assistantText || 'Generating response...'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!String(chat.id).startsWith(FALLBACK_ID_PREFIX) && (
                <div className="chat-thread-actions">
                  <button
                    type="button"
                    className="chat-thread-delete"
                    onClick={() => deleteOneChat(chat.id)}
                    disabled={deletingChatId === chat.id || isSubmitting || isClearing}
                  >
                    <Trash2 />
                    {deletingChatId === chat.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </article>
          ))}

          {isSubmitting && (
            <div className="chat-row chat-row--bot">
              <div className="chat-bubble chat-bubble--bot">
                <div className="chat-bubble__inner">
                  <Bot className="chat-icon" />
                  <div className="chat-loader" aria-label="Assistant is typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-pagination">
          <button
            type="button"
            onClick={() => loadChatHistory({ nextOffset: Math.max(offset - limit, 0), nextLimit: limit, withLoader: true })}
            disabled={!canMoveBack || isLoadingHistory || isSubmitting || isClearing}
          >
            Previous
          </button>
          <span>
            Showing {renderedChats.length} of {total}
          </span>
          <button
            type="button"
            onClick={() => loadChatHistory({ nextOffset: offset + limit, nextLimit: limit, withLoader: true })}
            disabled={!canMoveNext || isLoadingHistory || isSubmitting || isClearing}
          >
            Next
          </button>
        </div>

        <div className="chat-input-wrap">
          <div className="chat-input-row">
            <div className="chat-input-box">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isChatLocked ? 'Upgrade your plan to send AI messages.' : 'Type a message...'}
                className="chat-textarea"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isChatLocked}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isSubmitting || isClearing || isLoadingHistory || isChatLocked}
              className={`chat-send ${
                inputValue.trim() && !isSubmitting && !isChatLocked
                  ? 'chat-send--active'
                  : 'chat-send--disabled'
              }`}
            >
              <Send />
            </button>
          </div>
        </div>
      </div>
    </InternalAppShell>
  );
};

export default ChatApp;