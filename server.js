
const express = require('express');
const app = express();
const  path = require('path');

const server = require('http').Server(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const rooms = new Map();

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'build')))

    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
    })
}

app.get('/rooms', (req, res) => {
    const collection = Array.from(rooms);
    res.json(collection);
})

app.post('/rooms', (req, res) => {
    const {roomId, userName} = req.body;
    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            new Map([
                ['users', new Map()],
                ['messages', []],
            ]),
        )
    }
    res.send();
})

io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({ roomId, userName }) => {
        socket.join(roomId);
        rooms.get(roomId).get('users').set(socket.id, userName);
        const users = [...rooms.get(roomId).get('users').values()];
        const messages = [...rooms.get(roomId).get('messages').values()];
        const obj = {
            users,
            messages
        }
        io.in(roomId).emit('ROOM:JOINED', obj);
    });

    socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
        const addZero = (numb) => {
            return (parseInt(numb, 10) < 10 ? '0' : '') + numb;
        }
        const obj = {
            userName,
            text,
            time: `${new Date().getHours()}:${addZero(new Date().getMinutes())}`,
        }
        rooms.get(roomId).get('messages').push(obj);
        io.in(roomId).emit('ROOM:NEW_MESSAGE', obj);
    });

    socket.on('ROOM:EXIT', () => {
        rooms.forEach((value, roomId) => {
            socket.leave(roomId);
            if (value.get('users').delete(socket.id)) {
                const users = [...rooms.get(roomId).get('users').values()];
                io.in(roomId).emit('ROOM:SET_USERS', users);
            }
        })
    })

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...rooms.get(roomId).get('users').values()];
                io.in(roomId).emit('ROOM:SET_USERS', users);
            }
        })
    })
});

server.listen(PORT, (err) => {
    if (err) {
        throw Error(err);
    }
    console.log(`Server has been started on port ${PORT}!`);
});
