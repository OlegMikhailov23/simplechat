import React, {useState, useRef, useEffect} from 'react';
import socket from "../socket";

function Chat({users, messages, roomId, userName}) {
    const [messageValue, setMessageValue] = useState('');
    const messageRef = useRef(null);

    const sendMessageHandler = () => {
        if (!messageValue) return
        socket.emit('ROOM:NEW_MESSAGE', {
            userName,
            roomId,
            text: messageValue,
            time: `${new Date().getHours()}:${new Date().getMinutes()}`,
        })
        setMessageValue('');
    }

    useEffect(() => {
        messageRef.current.scrollTo(0, 99999)
    }, [messages])

    return (
        <div className="chat">
            <div className="chat-users">
                Комната: <b>{roomId}</b>
                <hr/>
                <b>Online: {users.length}</b>
                <ul>
                    {users.map((name, idx) => <li key={name + idx}>{name}</li>)}
                </ul>
            </div>
            <div className="chat-messages">
                <div className="messages"
                     ref={messageRef}>

                    {messages.map((message, idx) => (
                        <div key={idx} className={
                            userName === message.userName ? 'message' : 'message message-right'
                        }>
                            <div>
                                <p>{message.text}</p>
                                <div>
                                    <span className={'message-name'}>{message.userName}</span>
                                    <span className={'message-time'}>{message.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <form>
          <textarea
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              className="form-control"
              minLength={'1'}
              rows="3"/>
                    <button onClick={sendMessageHandler} type="button" className="btn btn-primary">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;
