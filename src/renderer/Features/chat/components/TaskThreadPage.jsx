import React from 'react';
import ChatThread from './ChatThread';

// Use the same tasks as in ActiveTasksPage
const activeTasks = [
    {
        id: 1,
        threadId: 'thread1',
        name: 'Quarterly Report Analysis',
        query: "Summarize the quarterly report and extract key insights for the executive presentation.",
        status: "active"
    },
    {
        id: 2,
        threadId: 'thread2',
        name: 'Data Pipeline Automation',
        query: "Generate a Python script to automate the data processing pipeline for customer analytics.",
        status: "halted"
    },
    {
        id: 3,
        threadId: 'thread3',
        name: 'Client Communication',
        query: "Send follow-up emails to all clients who haven't responded to our latest proposal.",
        status: "userStopped"
    },
    {
        id: 4,
        threadId: 'thread4',
        name: 'Investor Research',
        query: "Research and compile a list of potential investors for our Series A funding round.",
        status: "active"
    },
    {
        id: 5,
        threadId: 'thread5',
        name: 'Marketing Strategy',
        query: "Create a comprehensive marketing strategy for the new product launch next month.",
        status: "halted"
    }
];

const messages = {
    thread1: [
        { sender: 'user', text: 'Can you analyze the quarterly report and extract key insights for our executive presentation?' },
        { sender: 'ai', text: 'I\'ll analyze the quarterly report for you. Let me start by examining the financial metrics and performance indicators.' },
        { sender: 'user', text: 'Focus on revenue growth and customer acquisition costs.' },
        { sender: 'ai', text: 'Perfect! I\'ve identified that revenue grew 23% YoY, but customer acquisition costs increased by 15%. The main driver was increased marketing spend in Q3.' },
    ],
    thread2: [
        { sender: 'user', text: 'I need a Python script to automate our data processing pipeline for customer analytics.' },
        { sender: 'ai', text: 'I\'ll create a comprehensive Python script for your data processing pipeline. What specific data sources and transformations do you need?' },
        { sender: 'user', text: 'We have CSV files from multiple sources that need to be cleaned, merged, and aggregated.' },
        { sender: 'ai', text: 'I\'ve created a script that handles CSV processing, data cleaning, merging, and aggregation. It includes error handling and logging for monitoring.' },
    ],
    thread3: [
        { sender: 'user', text: 'Send follow-up emails to all clients who haven\'t responded to our latest proposal.' },
        { sender: 'ai', text: 'I\'ll help you send follow-up emails. Let me draft a professional follow-up message and identify the clients who haven\'t responded yet.' },
    ],
    thread4: [
        { sender: 'user', text: 'Research and compile a list of potential investors for our Series A funding round.' },
        { sender: 'ai', text: 'I\'ll research potential investors for your Series A round. What industry focus and investment size are you targeting?' },
        { sender: 'user', text: 'We\'re in the SaaS space, looking for $5-10M investment.' },
        { sender: 'ai', text: 'I\'ve compiled a list of 25 potential investors in the SaaS space who typically invest $5-10M in Series A rounds. Each includes their investment thesis and recent deals.' },
    ],
    thread5: [
        { sender: 'user', text: 'Create a comprehensive marketing strategy for the new product launch next month.' },
        { sender: 'ai', text: 'I\'ll develop a comprehensive marketing strategy for your product launch. Let me start by understanding your target audience and key value propositions.' },
    ],
};

const TaskThreadPage = () => {
    // Simple default messages for demonstration
    const defaultMessages = [
        { sender: 'ai', text: 'Welcome to Task Threads! Click on any task from the Active Tasks page to start a conversation.' },
        { sender: 'user', text: 'How do I get started?' },
        { sender: 'ai', text: 'Simply go to the Active Tasks page and click on any task card to open its thread in a modal.' },
    ];

    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: '#000000' }}>
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: '#1C1C1E' }}>
                <h1 
                    className="text-2xl font-light tracking-tight mb-1"
                    style={{ color: '#FFFFFF' }}
                >
                    Task Threads
                </h1>
                <p 
                    className="text-sm"
                    style={{ color: '#8E8E93' }}
                >
                    Review conversations and task progress
                </p>
            </div>

            {/* Chat Interface */}
            <div className="flex-1">
                <ChatThread messages={defaultMessages} />
            </div>
        </div>
    );
};

export default TaskThreadPage;
