const socket = io('http://localhost:3000');

document.addEventListener('DOMContentLoaded', () => {
    loadGroups();
});

function loadGroups() {
    const token = sessionStorage.getItem('token');
    axios.get('http://localhost:3000/groups', { headers: { "Authorization": token } })
        .then(response => {
            const groups = response.data.groups;
            displayGroups(groups);
        })
        .catch(error => {
            console.error(error);
        });
}

function displayGroups(groups) {
    const groupList = document.getElementById('group-list');
    groupList.innerHTML = ''; 
    groups.forEach(group => {
        const groupElement = document.createElement('div');
        groupElement.classList.add('group');
        groupElement.textContent = group.name;
        groupElement.dataset.groupId = group.id;
        groupElement.addEventListener('click', () => {
            loadGroupMessages(group.id);
            highlightActiveGroup(groupElement);
            showGroupManagement(group.id);
            joinGroupForSocket(group.id);
        });
        groupList.appendChild(groupElement);
    });
}

function joinGroupForSocket(groupId) {
    socket.emit('joinGroup', groupId);
    console.log("emit join group");
}

function highlightActiveGroup(groupElement) {
    const allGroups = document.querySelectorAll('.group');
    allGroups.forEach(group => group.classList.remove('active'));
    groupElement.classList.add('active');
}

socket.on('rec', (groupId) => {
    loadGroupMessages(groupId);
});

function handleSend(event) {
    event.preventDefault();
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();
    const token = sessionStorage.getItem('token');
    const currentGroupId = document.querySelector('.group.active')?.dataset.groupId;


    console.log("Message:", message);
    console.log("Current Group ID:", currentGroupId);
    if (message && currentGroupId) {
        axios.post(`http://localhost:3000/groups/${currentGroupId}/messages`, { message: message }, { headers: { "Authorization": token } })
        .then(response => {
            const sentMessage = response.data.message;
            const storedMessages = getMessagesFromLocalStorage(currentGroupId);
            const updatedMessages = [...storedMessages, sentMessage].slice(-10);
            storeMessagesInLocalStorage(currentGroupId, updatedMessages);
            displayMessages(updatedMessages);
            messageInput.value = ''; 
            socket.emit('send', currentGroupId);
        })
        .catch(error => {
            console.error(error);
            alert("Failed to send message");
        });
    }
}

function displayMessages(messages) {
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.innerHTML = ''; 

    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.textContent = `${msg.name}: ${msg.message}`;
        messagesContainer.appendChild(messageElement);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight; 
}

function createGroup() {
    const groupName = prompt("Enter group name:");
    if (groupName) {
        const token = sessionStorage.getItem('token');
        axios.post('http://localhost:3000/groups', { name: groupName }, { headers: { "Authorization": token } })
            .then(response => {
                alert("Group created successfully!");
                const newGroup = document.createElement('div');
                newGroup.classList.add('group');
                newGroup.textContent = groupName;
                newGroup.dataset.groupId = response.data.group.id;
                document.getElementById('group-list').appendChild(newGroup);
            })
            .catch(error => {
                console.error(error);
            });
    }
}

function joinGroup() {
    const groupName = document.getElementById('join-group-name').value.trim();
    const token = sessionStorage.getItem('token');

    if (groupName) {
        axios.post(`http://localhost:3000/groups/join`, { groupName }, { headers: { "Authorization": token } })
            .then(response => {
                alert(response.data.message);
                loadGroups(); 
            })
            .catch(error => {
                console.error(error);
                alert(error.response.data.error);
            });
    } else {
        alert("Please enter a group name.");
    }
}

function showGroupManagement(groupId) {
    const groupManagement = document.getElementById('group-management');
    groupManagement.style.display = 'block';
    groupManagement.dataset.groupId = groupId;
}

function addMember() {
    const groupId = document.getElementById('group-management').dataset.groupId;
    const memberInfo = prompt("Enter member's email:");
    const token = sessionStorage.getItem('token');

    if (memberInfo) {
        axios.post(`http://localhost:3000/groups/${groupId}/members`, { memberInfo }, { headers: { "Authorization": token } })
            .then(response => {
                alert("Member added successfully!");
            })
            .catch(error => {
                console.error(error);
                alert(error.response.data.error);
            });
    }
}

function promoteToAdmin() {
    const groupId = document.getElementById('group-management').dataset.groupId;
    const email = prompt("Enter the user email to promote:");
    const token = sessionStorage.getItem('token');

    if (email) {
        axios.patch(`http://localhost:3000/groups/${groupId}/admins`, { email: email, isAdmin: true }, { headers: { "Authorization": token } })
            .then(response => {
                alert("User promoted to admin successfully!");
            })
            .catch(error => {
                console.error(error);
                alert(error.response.data.error);
            });
    }
}

function removeMember() {
    const groupId = document.getElementById('group-management').dataset.groupId;
    const email = prompt("Enter the user email to remove:");
    const token = sessionStorage.getItem('token');

    if (email) {
        axios.delete(`http://localhost:3000/groups/${groupId}/members/${email}`, { headers: { "Authorization": token } })
            .then(response => {
                alert("User removed from group successfully!");
            })
            .catch(error => {
                console.error(error);
                alert(error.response.data.error);
            });
    }
}

function storeMessagesInLocalStorage(groupId, messages) {
    const maxMessages = 10;
    const storedMessages = messages.slice(-maxMessages); 
    localStorage.setItem(`chatMessages_${groupId}`, JSON.stringify(storedMessages));
}

function getMessagesFromLocalStorage(groupId) {
    return JSON.parse(localStorage.getItem(`chatMessages_${groupId}`)) || [];
}

function loadGroupMessages(groupId) {
    const storedMessages = getMessagesFromLocalStorage(groupId);
    const token = sessionStorage.getItem('token');
    axios.get(`http://localhost:3000/groups/${groupId}/messages`, { headers: { "Authorization": token }, params: { limit: 10 } })
        .then(response => {
            const messages = response.data.messages;
            messages.reverse();
            const newMessages = messages.filter(msg => !storedMessages.some(storedMsg => storedMsg.id === msg.id));
            const updatedMessages = [...storedMessages, ...newMessages].slice(-10);
            storeMessagesInLocalStorage(groupId, updatedMessages);
            displayMessages(updatedMessages);
        })
        .catch(error => {
            console.error(error);
        });
}
