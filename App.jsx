import React, { useState } from 'react';
import './App.css';

const App = () => {
  // Example data
  const phishingUrls = [
    'https://badsite1.com',
    'https://phishingsite2.net',
    'http://malicious-domain.org'
  ];
  const safeSites = [
    'https://www.google.com',
    'https://www.microsoft.com',
    'https://www.apple.com'
  ];

  // Tab states: "check-url" or "ask-questions"
  const [activeTab, setActiveTab] = useState('check-url');

  // The default chat for the "Check URL" tab
  const [checkUrlChat, setCheckUrlChat] = useState([
    {
      text: `👋 Welcome to the Phishing Checker! Would you like to try out PhishBait with some example links? (yes/no)`,
      isBot: true
    }
  ]);

  // The default chat for the "Ask Questions" tab
  const [askQuestionsChat, setAskQuestionsChat] = useState([
    {
      text: `👋 Welcome to the Phishing Checker (Questions)! Would you like to see our custom integrated questions? (yes/no)`,
      isBot: true
    }
  ]);

  // The user's current input text
  const [input, setInput] = useState('');

  // Identify which chat array to display and manipulate
  const currentChat = activeTab === 'check-url' ? checkUrlChat : askQuestionsChat;

  // Helper: push a new message to the correct chat array
  const addMessage = (msg, isBot = true) => {
    if (activeTab === 'check-url') {
      setCheckUrlChat(prev => [...prev, { text: msg, isBot }]);
    } else {
      setAskQuestionsChat(prev => [...prev, { text: msg, isBot }]);
    }
  };

  // Simulated checks
  const checkURLWithVirusTotal = async (url) => {
    await new Promise((r) => setTimeout(r, 300));
    return phishingUrls.includes(url) ? 'unsafe' : 'safe';
  };
  const checkURLWithPhishTank = async (url) => {
    await new Promise((r) => setTimeout(r, 300));
    return phishingUrls.includes(url) ? 'unsafe' : 'safe';
  };
  const checkURLWithGoogleSafeBrowsing = async (url) => {
    await new Promise((r) => setTimeout(r, 300));
    if (phishingUrls.includes(url)) return 'unsafe';
    if (safeSites.includes(url)) return 'safe';
    return 'unknown';
  };

  // Main logic for user input
  const processInput = async (message) => {
    // Add user's message
    addMessage(message, false);

    if (activeTab === 'check-url') {
      // === Check URL Tab logic ===
      if (message.toLowerCase() === 'yes') {
        addMessage('Ok!\nSelect any URL to see if the link is safe or malicious.');
        const exampleLinks =
          `**🧪 Example Links**\n\n` +
          `**🚫 Unsafe Sites:**\n- https://badsite1.com\n- https://phishingsite2.net\n- http://malicious-domain.org\n\n` +
          `**✅ Safe Sites:**\n- https://www.google.com\n- https://www.microsoft.com\n- https://www.apple.com`;
        addMessage(exampleLinks);
      } else if (phishingUrls.includes(message) || safeSites.includes(message)) {
        try {
          const [vt, pt, gs] = await Promise.all([
            checkURLWithVirusTotal(message),
            checkURLWithPhishTank(message),
            checkURLWithGoogleSafeBrowsing(message)
          ]);
          const anyUnsafe = [vt, pt, gs].includes('unsafe');
          const final =
            `🔍 URL Scan Result:\n` +
            `- 🧪 VirusTotal: ${vt}\n` +
            `- 🧠 PhishTank: ${pt}\n` +
            `- 🛡️ Google Safe Browsing: ${gs}\n` +
            (anyUnsafe
              ? `\n🔴 This link appears to be unsafe based on the above APIs. Avoid clicking it. ⚠️`
              : `\n🟢 This link appears to be safe based on the above APIs.`);
          addMessage(final);
        } catch {
          addMessage('⚠️ Error retrieving scan results. Please try again later.');
        }
      } else {
        addMessage('❓ Please respond with "yes" to see example links.');
      }

    } else {
      // === Ask Questions Tab logic ===
      if (message.toLowerCase() === 'yes') {
        addMessage(
          `Here are our integrated questions you can ask:\n\n` +
          `1) What is phishing?\n` +
          `2) How to protect from phishing?\n` +
          `3) What is spear phishing?\n` +
          `4) What is vishing?\n` +
          `5) What is smishing?\n\n` +
          `Feel free to type any of these or ask your own.`
        );
      } else if (message.toLowerCase() === 'no') {
        addMessage('Okay, feel free to ask any other question about phishing!');
      } else {
        // Possibly user typed a recognized question or a number 1-5
        let userMsg = message.toLowerCase().trim();
        if (userMsg === '1') userMsg = 'what is phishing';
        else if (userMsg === '2') userMsg = 'how to protect from phishing';
        else if (userMsg === '3') userMsg = 'what is spear phishing';
        else if (userMsg === '4') userMsg = 'what is vishing';
        else if (userMsg === '5') userMsg = 'what is smishing';

        if (/what is phishing/i.test(userMsg)) {
          addMessage('Phishing is a type of cyberattack using deceptive emails or websites to steal personal information.');
        } else if (/protect.*phishing/i.test(userMsg)) {
          addMessage('Avoid clicking suspicious links, enable MFA, and keep software updated.');
        } else if (/spear phishing/i.test(userMsg)) {
          addMessage('Spear phishing is a targeted phishing attempt aimed at specific individuals or organizations.');
        } else if (/vishing/i.test(userMsg)) {
          addMessage('Vishing is “voice phishing,” done via phone calls to trick you into giving away information.');
        } else if (/smishing/i.test(userMsg)) {
          addMessage('Smishing uses text messages to lure users into revealing personal info.');
        } else {
          addMessage('Try asking one of the integrated questions, or type "yes" to see them again.');
        }
      }
    }
  };

  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await processInput(input.trim());
    setInput('');
  };

  // Clears the chat for the current tab
  const handleClearChat = () => {
    if (activeTab === 'check-url') {
      setCheckUrlChat([
        {
          text: `👋 Welcome to the Phishing Checker! Would you like to try out PhishBait with some example links? (yes/no)`,
          isBot: true
        }
      ]);
    } else {
      setAskQuestionsChat([
        {
          text: `👋 Welcome to the Phishing Checker (Questions)! Would you like to see our custom integrated questions? (yes/no)`,
          isBot: true
        }
      ]);
    }
  };

  // Download transcript for current tab
  const handleDownloadTranscript = () => {
    const log = currentChat
      .map(m => (m.isBot ? 'Bot: ' : 'User: ') + m.text)
      .join('\n');
    const blob = new Blob([log], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat_transcript.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      <div className="title-container">
        <h1 className="phishbait-title">PhishBait</h1>
        <div className="chat-actions">
          <button onClick={handleClearChat} className="action-btn">Clear Chat</button>
          <button onClick={handleDownloadTranscript} className="action-btn">Download Transcript</button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'check-url' ? 'active' : ''}`}
          onClick={() => setActiveTab('check-url')}
        >
          Check URL
        </button>
        <button
          className={`tab-btn ${activeTab === 'ask-questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('ask-questions')}
        >
          Ask Questions
        </button>
      </div>

      <div className="chatbox">
        <div className="messages">
          {currentChat.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.isBot ? 'bot' : 'user'}`}>
              {msg.text.split('\n').map((line, idx) => (
                <p key={idx}>
                  {line.startsWith('- ') && (line.includes('http://') || line.includes('https://')) ? (
                    <span
                      onClick={() => processInput(line.replace('- ', '').trim())}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input"
            placeholder="Type your reply or question here"
          />
          <button type="submit" className="send-btn">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
