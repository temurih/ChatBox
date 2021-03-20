const textarea = document.getElementById('chat-input');
const chatHistory = document.getElementById('chat-history');
const chatSend = document.getElementById('chat-send');

// better to use a library here, that can handle
// the date and time conversion better.
// Also, it can show a proper readable format, such as, 1 minute ago
const convertToReadableTime = (dateTime) => {
    if (typeof dateTime !== 'object') {
        dateTime = new Date(dateTime);
    }
    const time = dateTime.toLocaleTimeString().split(':');
    dateTime = dateTime.toString().split(' ');
    return `${dateTime[1]} ${dateTime[2]}, ${dateTime[3]} | ${time[0]}:${
        time[1]
    } ${time[2]?.slice(-2)}`;
};

const createMessageNode = (chat) => {
    const div = document.createElement('div');
    div.classList.add(chat.from === 'Visitor' ? 'visitor' : 'operator');
    const childDiv = document.createElement('div');
    childDiv.classList.add('chat-wrapper');
    childDiv.classList.add('bottom');
    childDiv.innerHTML = `
    <div class="message-container">
    <div class="message">${chat.message}</div>
    <div class="sent-by">${chat.from}</div>
    </div>
    <div class="message-time">${convertToReadableTime(chat.datetime)}</div>
    `;
    div.appendChild(childDiv);
    chatHistory.appendChild(div);
    // Not a very good user interface
    // If someone is looking at the history,
    // and we are keep scrolling to the bottom.
    chatHistory.scrollTop = chatHistory.scrollHeight; // scroll to see the animation
    childDiv.classList.remove('bottom');
    childDiv.classList.add('top');
    chatHistory.scrollTop = chatHistory.scrollHeight; // scroll after animation is done
};

const loadData = (chats) => {
    chats.forEach((chat) => {
        createMessageNode(chat);
    });
};

const sendChat = () => {
    const value = textarea.value;
    if (value) {
        chat.sendChat(value);
        textarea.value = '';
    }
};

// stopping empty chat being published
const onKeyPressTextArea = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        sendChat();
        return;
    }
};

// disables the send button if the text field empty
const onKeyupTextarea = (e) => {
    if (e.target.value.length > 0) {
        chatSend.disabled = false;
    } else {
        chatSend.disabled = true;
    }
};

const pageLoad = () => {
    if (textarea) {
        textarea.onkeyup = onKeyupTextarea;
        textarea.onkeypress = onKeyPressTextArea;
        textarea.focus();
    }
    chat.getChatHistory(loadData);
    chat.addListener(
        'chatReceived',
        function (e) {
            createMessageNode(e.detail);
        },
        false,
    );
};
