import React, {useReducer, useEffect} from 'react';
import Login from "./components/Login";
import socket from "./socket";
import reducer from "./reducer";
import Chat from "./components/Chat";

function App() {
    const [state, dispatch] = useReducer(reducer, {
        joined: false,
        roomId: null,
        userName: null,
        users: [],
        messages: [],
        rooms: null,
    });


    const loginHandler = (obj) => {
        dispatch({
            type: 'JOINED',
            payload: obj,
        });
        socket.emit('ROOM:JOIN', obj);
    };

    const setUsers = (users) => {
        dispatch({
            type: 'SET_USERS',
            payload: users,
        })
    }

    const setMessages = (messages) => {
        dispatch({
            type: 'SET_DATA',
            payload: messages,
        })
    }

    const exitHandler = () => {
        socket.emit('ROOM:EXIT', null)
        dispatch({
            type: 'EXIT',
        })
    }

    useEffect(() => {
        socket.on('ROOM:JOINED', obj => {
            setUsers(obj.users)
        });
        socket.on('ROOM:JOINED', obj => {
            setMessages(obj.messages);
        });
        socket.on('ROOM:SET_USERS', setUsers);
        socket.on('ROOM:NEW_MESSAGE', message => {
            dispatch({
                type: 'NEW_MESSAGE',
                payload: message
            })
        })

        socket.on('ROOM:EXIT', null);
    }, []);

    window.socket = socket;

    return (
        <div className="wrapper">
            <h1 className={'main-title'}>Just simple chat</h1>
            {state.joined && <button className={'btn btn-dark exit-btn'} onClick={exitHandler}>Exit</button>}
            {!state.joined ? <Login loginHandler={loginHandler}/> : <Chat {...state}/>}
        </div>
    );
}

export default App;
