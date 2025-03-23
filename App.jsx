import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  // Example data
  const phishingUrls = ['https://badsite1.com', 'https://phishingsite2.net', 'http://malicious-domain.org'];
  const safeSites = ['https://www.google.com', 'https://www.microsoft.com', 'https://www.apple.com'];

  // Tabs: "check-url" or "ask-questions"
  const [activeTab, setActiveTab] = useState('check-url');

  // Default chat for "Check URL"
  const [checkUrlChat, setCheckUrlChat] = useState([
    {
      text: `👋 Welcome to the Phishing Checker! Would you like to try out PhishBait with some example links? (yes/no)`,
      isBot: true
    }
  ]);

  // Default chat for "Ask Questions"
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

  // Scroll ref for auto-scroll
  const messagesEndRef = useRef(null);

  // Light/Dark Theme
  const [theme, setTheme] = useState('light');

  // Auto-scroll whenever chat updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [checkUrlChat, askQuestionsChat]);

  // Apply theme to the <body> for the animated gradient
  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Add a message to the correct chat array
  const addMessage = (msg, isBot = true) => {
    if (activeTab === 'check-url') {
      setCheckUrlChat(prev => [...prev, { text: msg, isBot }]);
    } else {
      setAskQuestionsChat(prev => [...prev, { text: msg, isBot }]);
    }
  };

  // Simulated checks
  const checkURLWithVirusTotal = async (url) => {
    await new Promise(r => setTimeout(r, 300));
    return phishingUrls.includes(url) ? 'unsafe' : 'safe';
  };
  const checkURLWithPhishTank = async (url) => {
    await new Promise(r => setTimeout(r, 300));
    return phishingUrls.includes(url) ? 'unsafe' : 'safe';
  };
  const checkURLWithGoogleSafeBrowsing = async (url) => {
    await new Promise(r => setTimeout(r, 300));
    if (phishingUrls.includes(url)) return 'unsafe';
    if (safeSites.includes(url)) return 'safe';
    return 'unknown';
  };

  // Clears current tab’s chat back to default
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

  // Download chat transcript
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

  // Main logic for user input
  const processInput = async (message) => {
    // Add user’s message to the chat
    addMessage(message, false);

    // Lowercase version for checks
    const lowerMsg = message.toLowerCase().trim();

    // If user typed "no" or "end", we reset chat on the active tab
    if (lowerMsg === 'no' || lowerMsg === 'end') {
      handleClearChat();
      // Quick reprompt so they can keep going or not
      addMessage(`Chat cleared. Type "yes" to start again, or "end" to exit.`, true);
      return;
    }

    // --------------------------
    // "Check URL" tab logic
    // --------------------------
    if (activeTab === 'check-url') {
      // If user typed "yes"
      if (lowerMsg === 'yes') {
        addMessage('Ok!\nSelect any URL to see if the link is safe or malicious.');
        // Show example links
        const exampleLinks =
          `**🧪 Example Links**\n\n` +
          `**🚫 Unsafe Sites:**\n- https://badsite1.com\n- https://phishingsite2.net\n- http://malicious-domain.org\n\n` +
          `**✅ Safe Sites:**\n- https://www.google.com\n- https://www.microsoft.com\n- https://www.apple.com`;
        addMessage(exampleLinks);
        return;
      }

      // If user typed or clicked an example URL
      if (phishingUrls.includes(message) || safeSites.includes(message)) {
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

          // After we finish scanning, let's re-prompt them
          addMessage(`Would you like to check another URL? (yes/end)`, true);
        } catch {
          addMessage('⚠️ Error retrieving scan results. Please try again later.');
        }
      } else {
        // Otherwise, user typed something random
        addMessage('❓ Please respond with "yes" to see example links, or "end" to exit.');
      }

    // --------------------------
    // "Ask Questions" tab logic
    // --------------------------
    } else {
      // If user typed "yes"
      if (lowerMsg === 'yes') {
        addMessage(
          `Here are our integrated questions you can ask:\n\n` +
          `1) What is phishing?\n` +
          `2) How to protect from phishing?\n` +
          `3) What is spear phishing?\n` +
          `4) What is vishing?\n` +
          `5) What is smishing?\n\n` +
          `Feel free to type any of these or ask your own.`
        );
        return;
      }

      // Possibly recognized question or numeric ID
      let userMsg = lowerMsg;
      if (userMsg === '1') userMsg = 'what is phishing';
      else if (userMsg === '2') userMsg = 'how to protect from phishing';
      else if (userMsg === '3') userMsg = 'what is spear phishing';
      else if (userMsg === '4') userMsg = 'what is vishing';
      else if (userMsg === '5') userMsg = 'what is smishing';

      if (/what is phishing/i.test(userMsg)) {
        addMessage('Phishing is a type of cyberattack using deceptive emails or websites to steal personal information.');
        addMessage(`Would you like to ask another question? (yes/end)`, true);
      } else if (/protect.*phishing/i.test(userMsg)) {
        addMessage('Avoid clicking suspicious links, enable MFA, and keep software updated.');
        addMessage(`Anything else? (yes/end)`, true);
      } else if (/spear phishing/i.test(userMsg)) {
        addMessage('Spear phishing is a targeted phishing attempt aimed at specific individuals or organizations.');
        addMessage(`Ask more? (yes/end)`, true);
      } else if (/vishing/i.test(userMsg)) {
        addMessage('Vishing is “voice phishing,” done via phone calls to trick you into giving away information.');
        addMessage(`More questions? (yes/end)`, true);
      } else if (/smishing/i.test(userMsg)) {
        addMessage('Smishing uses text messages to lure users into revealing personal info.');
        addMessage(`Any other questions? (yes/end)`, true);
      } else {
        addMessage('Try asking one of the integrated questions, or type "yes" to see them again, or "end" to exit.');
      }
    }
  };

  // Handle user pressing Send
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await processInput(input.trim());
    setInput('');
  };

  return (
    <div className="app-container">
      <div className="title-container">
        <h1 className="phishbait-title">PhishBait</h1>
        <div className="chat-actions">
          <button onClick={handleClearChat} className="action-btn">Clear Chat</button>
          <button onClick={handleDownloadTranscript} className="action-btn">Download Transcript</button>
          <button onClick={toggleTheme} className="action-btn">
            {theme === 'light' ? '🌙 Dark Mode' : '🌞 Light Mode'}
          </button>
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
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input"
            placeholder="Type your reply or question here"
          />
          <button type="submit" className="send-btn">Send</button>
        </form>
      </div>
    </div>
  );
};

export default App;
