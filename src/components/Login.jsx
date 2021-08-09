import React, {useState, useEffect} from 'react';
import axios from "axios";

const Login = ({loginHandler}) => {
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState(null);

    const refreshRooms = () => {
        setInterval(async () => {
            const data = await axios.get('/rooms');
            setRooms(data);
        }, 1000)
    }

    useEffect(async () => {
     	refreshRooms();
        const data = await axios.get('/rooms');
        setRooms(data);
    }, [])

    const submitHandler = async () => {
        if (!roomId || !userName) {
            return alert('Bad request');
        }
        const obj = {
            roomId,
            userName
        }
        setLoading(true);
        await axios.post('/rooms', obj);
        loginHandler(obj);
    }

    const chooseRoomHandler = (e) => {
        setRoomId(e.target.innerHTML);
    }

    return (
        <div className={'login-block'}>
            <div className="rooms-wrapper">
                {!rooms?.data?.length && <b>No rooms existed yet :(</b>}
                {
                    rooms?.data && rooms?.data?.map((room, idx) =>
                        <button
                            key={idx}
                            className={"btn btn-info room-btn"}
                            onClick={chooseRoomHandler}
                            title={'Choose room'}>
                            {room[0]}
                        </button>)
                }
            </div>
            <input type="text"
                   placeholder={"Room ID"}
                   value={roomId}
                   onChange={e => setRoomId(e.target.value)}
            />
            <input type="text"
                   placeholder={"Your name"}
                   value={userName}
                   onChange={e => setUserName(e.target.value)}
            />
            <button disabled={loading} onClick={submitHandler} className={'btn btn-success submit-btn'}>
                {loading ? 'Entering...' : 'Submit'}
            </button>
        </div>
    )
}

export default Login;
