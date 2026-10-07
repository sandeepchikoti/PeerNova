import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { MessageSquare, Send, CheckCheck, Clock, User, ShieldCheck, Sparkles, RefreshCw, Search, Circle } from 'lucide-react';

export const Chat = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedConnId, setSelectedConnId] = useState(searchParams.get('conn') ? parseInt(searchParams.get('conn')) : null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [stompConnected, setStompConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find((c) => c.connectionId === selectedConnId);

  // 1. Fetch Conversations
  const fetchConversations = async () => {
    try {
      const data = await api.getChatConversations();
      setConversations(data || []);
      if (!selectedConnId && data && data.length > 0) {
        setSelectedConnId(data[0].connectionId);
      }
    } catch (err) {
      console.error('Failed to fetch chat conversations:', err);
    } finally {
      setLoadingConvs(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // 2. Fetch History when selected connection changes
  const fetchHistory = async (connId) => {
    if (!connId) return;
    setLoadingMessages(true);
    try {
      const data = await api.getChatHistory(connId);
      setMessages(data || []);
      await api.markChatAsRead(connId);
      // Update local unread state
      setConversations((prev) =>
        prev.map((c) => (c.connectionId === connId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedConnId) {
      fetchHistory(selectedConnId);
      setSearchParams({ conn: selectedConnId.toString() });
    }
  }, [selectedConnId]);

  // 3. Auto Scroll to Bottom on Messages Change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 4. Setup WebSocket STOMP Client
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setStompConnected(true);

        // Subscribe to user queue for incoming message notifications
        if (user && user.email) {
          client.subscribe(`/user/${user.email}/queue/messages`, (messageOutput) => {
            try {
              const incomingMsg = JSON.parse(messageOutput.body);
              handleIncomingMessage(incomingMsg);
            } catch (e) {
              console.error('Error parsing incoming WS message:', e);
            }
          });
        }
      },
      onDisconnect: () => {
        setStompConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client) client.deactivate();
    };
  }, [user]);

  // Subscribe to specific connection topic when selected
  useEffect(() => {
    if (!stompClientRef.current || !stompConnected || !selectedConnId) return;

    const topicSub = stompClientRef.current.subscribe(`/topic/connection.${selectedConnId}`, (messageOutput) => {
      try {
        const incomingMsg = JSON.parse(messageOutput.body);
        handleIncomingMessage(incomingMsg);
      } catch (e) {
        console.error('Error parsing connection topic message:', e);
      }
    });

    return () => {
      if (topicSub) topicSub.unsubscribe();
    };
  }, [selectedConnId, stompConnected]);

  const handleIncomingMessage = (msg) => {
    if (msg.connectionId === selectedConnId) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      api.markChatAsRead(msg.connectionId).catch(() => {});
    }

    // Refresh conversation list to show latest snippet
    fetchConversations();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedConnId || !activeConversation) return;

    const payload = {
      connectionId: selectedConnId,
      recipientProfileId: activeConversation.peerProfileId,
      content: newMessageText.trim(),
    };

    setNewMessageText('');

    try {
      if (stompClientRef.current && stompConnected) {
        stompClientRef.current.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify(payload),
        });
      } else {
        // Fallback REST call
        const sentMsg = await api.sendChatMessage(payload);
        setMessages((prev) => [...prev, sentMsg]);
        fetchConversations();
      }
    } catch (err) {
      console.error('Failed to send chat message:', err);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.peerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.peerCollege?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', minHeight: '600px' }}>
      {/* Header Banner */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #1e1b4b, #0f172a)', borderColor: '#3730a3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MessageSquare size={24} style={{ color: '#818cf8' }} />
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>PeerNova Real-Time Chat & Collaboration</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: '999px', backgroundColor: stompConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: stompConnected ? '#34d399' : '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Circle size={8} fill={stompConnected ? '#34d399' : '#fbbf24'} /> {stompConnected ? 'STOMP WebSocket Live' : 'Connecting WebSocket...'}
            </span>
            <button onClick={fetchConversations} className="btn btn-outline btn-sm">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Chat Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1rem', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar: Conversations Directory */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1rem', overflow: 'hidden' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search peer conversations..."
              className="form-input"
              style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {loadingConvs ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '0.85rem' }}>
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '0.85rem' }}>
                No active peer connections found. Connect with peers in Discovery or Skill Matching to start chatting!
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.connectionId === selectedConnId;
                const isVerified = conv.peerVerificationStatus === 'VERIFIED' || conv.peerVerificationStatus === 'APPROVED';

                return (
                  <div
                    key={conv.connectionId}
                    onClick={() => setSelectedConnId(conv.connectionId)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-secondary)',
                      border: `1px solid ${isSelected ? 'rgba(99, 102, 241, 0.5)' : 'transparent'}`,
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {conv.peerName ? conv.peerName.charAt(0).toUpperCase() : 'P'}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conv.peerName}
                        </h4>
                        <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                          {formatTimestamp(conv.lastMessageTimestamp)}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.78rem', color: isSelected ? '#c7d2fe' : '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span
                        style={{
                          backgroundColor: '#ec4899',
                          color: '#fff',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          borderRadius: '999px',
                          padding: '0.15rem 0.45rem',
                          flexShrink: 0,
                        }}
                      >
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Chat Box */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div
                style={{
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(26, 31, 46, 0.95)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                      color: '#fff',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {activeConversation.peerName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                        {activeConversation.peerName}
                      </h3>
                      <span className={`badge ${activeConversation.peerVerificationStatus === 'VERIFIED' || activeConversation.peerVerificationStatus === 'APPROVED' ? 'badge-verified' : 'badge-pending'}`} style={{ fontSize: '0.65rem' }}>
                        {activeConversation.peerVerificationStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                      {activeConversation.peerCollege} • {activeConversation.peerDepartment}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={14} /> Active Peer Collaboration Channel
                </div>
              </div>

              {/* Chat Messages Body */}
              <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'var(--bg-primary)' }}>
                {loadingMessages ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                    Loading message history...
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                    No messages in this chat yet. Send a greeting to start learning together!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMyMessage = msg.senderId !== activeConversation.peerProfileId;

                    return (
                      <div
                        key={msg.id || Math.random()}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMyMessage ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            padding: '0.75rem 1rem',
                            borderRadius: isMyMessage ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            backgroundColor: isMyMessage ? '#4f46e5' : 'var(--bg-card)',
                            color: '#fff',
                            border: `1px solid ${isMyMessage ? 'rgba(99, 102, 241, 0.5)' : 'var(--border-color)'}`,
                            fontSize: '0.9rem',
                            lineHeight: 1.45,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          {msg.content}
                        </div>

                        <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>{formatTimestamp(msg.timestamp)}</span>
                          {isMyMessage && (
                            <CheckCheck size={13} style={{ color: msg.isRead ? '#38bdf8' : '#9ca3af' }} />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Footer */}
              <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder={`Message ${activeConversation.peerName}... (Press Enter to send)`}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  style={{ flex: 1 }}
                />

                <button type="submit" className="btn btn-primary" disabled={!newMessageText.trim()}>
                  <Send size={16} /> Send
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '3rem', color: '#9ca3af', textAlign: 'center' }}>
              <MessageSquare size={48} style={{ color: '#6366f1', marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Select a Peer Conversation</h3>
              <p style={{ maxWidth: '400px', fontSize: '0.9rem' }}>
                Choose an active connected peer from the left sidebar to start real-time STOMP messaging and collaborative skill sharing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
