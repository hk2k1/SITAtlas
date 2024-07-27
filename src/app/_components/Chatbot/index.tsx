'use client';
import React, { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { ArrowUpFromLine } from 'lucide-react';

import { GRAPHQL_API_URL } from '../../_api/shared';
import Hour from './Hour';
import Newtons from './Newtons';

import styles from './index.module.scss';

interface Message {
    // id: string;
    message: string;
    sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            message: "Hello, I'm your university campus assistant. How can I help you?",
            sender: 'bot',
        },
    ]);
    const [threadId, setThreadId] = useState(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const newMessage: Message = { message: input, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch(`${GRAPHQL_API_URL}/apiv2/chatbot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
            });
            // console.log('Input data', input, threadId);
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            const data = await response.json();
            // console.log('Output data', data);
            setThreadId(data.threadId);
            setMessages([
                ...messages,
                newMessage,
                { message: data.message.text.value, sender: 'bot' },
            ]);
        } catch (error) {
            // console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     if (isOpen && chatBoxRef.current) {
    //         chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    //     }
    // }, [messages, isOpen]);

    const scrollToBottom = () => {
        chatBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            // console.log('scrolling to bottom');
            scrollToBottom();
        }
    }, [messages, isOpen]);

    return (
        <div className={`${styles.chatbot} ${isOpen ? styles.open : ''}`}>
            <div className={styles.header} onClick={toggleChat}>
                <div className={styles.headerContent}>
                    <div className={styles.statusIndicator} />
                    <span>Campus Maps Chatbot</span>
                </div>
                <span className={styles.toggleIcon}>▼</span>
            </div>
            <div className={styles.chatBox}>
                <div className={styles.messages}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`${styles.message} ${styles[msg.sender]}`}
                            ref={chatBoxRef}
                        >
                            {msg.message}
                        </div>
                    ))}
                    {loading && <Newtons />}
                </div>
                <div className={styles.inputBox}>
                    <TextareaAutosize
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="Write a message..."
                        className={styles.textarea}
                        maxRows={4}
                    />
                    <button
                        onClick={handleSendMessage}
                        className={styles.sendButton}
                        disabled={loading}
                    >
                        {loading ? <Hour /> : <ArrowUpFromLine />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
