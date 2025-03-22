# KeanUHackThis Project 
By: Anthony Bayate Jr,  David Arosemena, Aboluwarin Songonuga

Overview
This repository contains a web application that hosts an interactive chat bot where users can enter a URL to determine if it’s likely to be phishing or safe. Phishing is a form of social engineering in which attackers trick individuals into revealing sensitive information—like usernames, passwords, or credit card details—or inadvertently installing malware (e.g., viruses, worms, ransomware). This project provides a practical cybersecurity tool to help people identify suspicious websites and protect their personal data.

Features
- Phishing Detection Chat Bot: Users can input a URL into the chat interface, and the bot will respond with a likelihood of the site being malicious or safe.
- Real-Time Feedback: The application provides quick results, allowing users to decide whether a site is safe before clicking.
- User-Friendly Interface: A straightforward chat-like interface built with React that guides users through the checking process without requiring any deep technical knowledge.



Tools Used
- Visual Studio Code (VS Code)
Why we chose it: Easy to set up, has a large ecosystem of extensions, and is popular for JavaScript/React development.

Vite + React
- React is a JavaScript library for building user interfaces with components.
- Vite is a faster, more lightweight alternative to traditional bundlers like Webpack. It offers instant server startup and fast hot-reloads.
- Why we chose React: Its component-based architecture simplifies UI design and updates.
- Why we chose Vite: Extremely fast dev server, zero-config out of the box, and easy to deploy.

🧪 VirusTotal
What It Is: A free service that checks URLs (and files) against dozens of antivirus engines.

How We Use It:

When a user enters a URL, we send it to VirusTotal’s API.

If many antivirus engines identify that URL as unsafe, we show a warning.

Benefits: Provides fast, multi-engine checks for known malware and phishing threats.

🧠 PhishTank
What It Is: A community-based database of reported phishing websites.

How We Use It:

We compare the user-submitted URL to PhishTank’s database.

If it’s listed as a confirmed phishing site, we immediately warn the user.

Benefits: Since it’s crowdsourced, it quickly flags new or trending phishing sites.

🛡️ Google Safe Browsing
What It Is: Google’s service that maintains an updated list of unsafe and deceptive sites.

How We Use It:

We send the URL to the Google Safe Browsing API.

If Google has flagged that site for malware or phishing, we alert the user.

Benefits: Offers up-to-date warnings used by many popular web browsers.


How It Works
- User Input: The user types or pastes a URL into the chatbot interface.
Validation/Detection:
- The input URL is either sent to a phishing detection API, or your code checks the URL against patterns, lists, or basic heuristics.

This might involve:
- Checking domain reputation
- Looking for suspicious URL patterns (extra subdomains, special characters, etc.)
- The application then determines whether the URL is likely malicious or safe.



