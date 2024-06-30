import React from 'react';
import ChatWindow from '../../Message/ChatWindow';
import MessageDisscution from '../../Message/MessageDisscution';
import socketIOClient from "socket.io-client";
import { useEffect, useState, useRef } from 'react';
import { listRoomOfAdmin } from '../../../services/userService';

require('dotenv').config();

const host = process.env.REACT_APP_BACKEND_URL;

const Message = () => {
    const [dataUser, setdataUser] = useState({})
    const [dataRoom, setdataRoom] = useState([])
    const [selectedRoom, setselectedRoom] = useState('')
    const socketRef = useRef();
    const [setId] = useState();
    const [name, setName] = useState('')

    useEffect(() => {
        socketRef.current = socketIOClient.connect(host)
        const userData = JSON.parse(localStorage.getItem('userData'));
        setdataUser(userData)
        socketRef.current.on('getId', data => {
            setId(data)
        })
        fetchListRoom()
        socketRef.current.on('sendDataServer', dataGot => {
            fetchListRoom()
        })
        socketRef.current.on('loadRoomServer', dataGot => {
            fetchListRoom(userData.id)
        })
        return () => {
            socketRef.current.disconnect();
        };
    }, [])

    let handleClickRoom = (roomId, nameUser) => {
        socketRef.current.emit('loadRoomClient')
        setName(nameUser)
        setselectedRoom(roomId)
    }
    let fetchListRoom = async () => {
        let res = await listRoomOfAdmin()
        if (res && res.errCode == 0) {
            setdataRoom(res.data)
        }
    }

    return (
        <div className="container">
            <div className="ks-page-content">
                <div className="ks-page-content-body">
                    <div className="ks-messenger">
                        <MessageDisscution userId={dataUser.id} isAdmin={true} handleClickRoom={handleClickRoom} data={dataRoom} />
                        {
                            selectedRoom ? <ChatWindow userId={dataUser.id} roomId={selectedRoom} name={name} />
                                : <div>
                                    <span className='title'>Chưa chọn phòng</span>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message;