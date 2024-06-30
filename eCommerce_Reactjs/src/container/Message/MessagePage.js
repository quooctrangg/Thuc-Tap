import React from 'react';
import ChatWindow from './ChatWindow';
import MessageDisscution from './MessageDisscution';
import socketIOClient from "socket.io-client";
import { useEffect, useState, useRef } from 'react'
import { createNewRoom, listRoomOfUser } from '../../services/userService';
import './MessagePage.scss';

require('dotenv').config();

const host = process.env.REACT_APP_BACKEND_URL;

function MessagePage(props) {
    const socketRef = useRef();

    const [dataRoom, setdataRoom] = useState([])
    const [selectedRoom, setselectedRoom] = useState('')
    const [dataUser, setdataUser] = useState({})
    const [setId] = useState();
    const [name, setName] = useState('')

    useEffect(() => {
        socketRef.current = socketIOClient.connect(host)
        const userData = JSON.parse(localStorage.getItem('userData'));
        setdataUser(userData)
        let createRoom = async () => {
            let res = await createNewRoom({
                userId1: userData.id
            })
            if (res && res.errCode) {
                fetchListRoom(userData.id)
            }
        }
        if (userData) {
            socketRef.current.on('getId', data => {
                setId(data)
            })
            createRoom()
            fetchListRoom(userData.id)
            socketRef.current.on('sendDataServer', dataGot => {
                fetchListRoom(userData.id)
            })
            socketRef.current.on('loadRoomServer', dataGot => {
                fetchListRoom(userData.id)
            })
            return () => {
                socketRef.current.disconnect();
            };
        }
    }, [])

    let handleClickRoom = (roomId, nameUser) => {
        socketRef.current.emit('loadRoomClient')
        setName(nameUser)
        setselectedRoom(roomId)
    }

    let fetchListRoom = async (userId) => {
        let res = await listRoomOfUser(userId)
        if (res && res.errCode == 0) {
            setdataRoom(res.data)
        }
    }

    return (
        <div className="container">
            <div className="ks-page-content">
                <div className="ks-page-content-body">
                    <div className="ks-messenger">
                        <MessageDisscution userId={dataUser.id} isAdmin={false} handleClickRoom={handleClickRoom} data={dataRoom} />
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
    );
}

export default MessagePage;