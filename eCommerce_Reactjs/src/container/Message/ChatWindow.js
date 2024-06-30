import React from 'react';
import socketIOClient from "socket.io-client";
import moment from 'moment';
import { loadMessage } from '../../services/userService'
import { useEffect, useState, useRef } from 'react';

const host = process.env.REACT_APP_BACKEND_URL;

require('dotenv').config();

function ChatWindow(props) {
    const socketRef = useRef();

    const [mess, setMess] = useState([]);
    const [userData, setuserData] = useState({});
    const [message, setMessage] = useState('');
    const [setId] = useState();
    const [user, setUser] = useState({})

    useEffect(() => {
        socketRef.current = socketIOClient.connect(host)
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
        socketRef.current.on('getId', data => {
            setId(data)
        })
        if (props.roomId) {
            fetchMessage()
        }
        socketRef.current.on('sendDataServer', dataGot => {
            fetchMessage()
            let elem = document.getElementById('box-chat');
            if (elem) elem.scrollTop = elem.scrollHeight;
        })
        return () => {
            socketRef.current.disconnect();
        };
    }, [props.roomId]);

    let fetchMessage = async () => {
        let res = await loadMessage(props.roomId, props.userId)
        if (res) {
            setMess(res.data)
            setuserData(res.data?.userData)
        }
    }

    let sendMessage = () => {
        if (message !== null) {
            const msg = {
                text: message,
                userId: user.id,
                roomId: props.roomId,
                userData: userData,
            }
            socketRef.current.emit('sendDataClient', msg)
            setMessage('')
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage()
        }
    }

    return (
        <div className="ks-messages ks-messenger__messages">
            <div className="ks-header">
                <div className="ks-description">
                    <div className="ks-name">{props.name}</div>
                </div>
            </div>
            <div className="ks-body ks-scrollable jspScrollable" data-auto-height data-reduce-height=".ks-footer" data-fix-height={32} style={{ height: '480px', overflow: 'hidden', padding: '0px' }} tabIndex={0}>
                <div className="jspContainer" >
                    <div className="jspPane" style={{ padding: '0px', top: '0px' }}>
                        <ul id="box-chat" className="ks-items" style={{ overflowY: 'auto', maxHeight: '479px' }}>
                            {
                                mess && mess.length > 0 &&
                                mess.map((item, index) => {
                                    if (item.userData) {
                                        return (
                                            <li key={index} className={item.userData.id == user.id ? "ks-item ks-from" : "ks-item ks-self"}>
                                                <span className="ks-avatar ks-offline">
                                                    <img src={item.userData.image} width={36} height={36} className="rounded-circle" />
                                                </span>
                                                <div className="ks-body">
                                                    <div className="ks-header">
                                                        <span className="ks-name">{item.userData.firstName ? item.userData.firstName : '' + " " + item.userData.lastName ? item.userData.lastName : ''}</span>
                                                        <span className="ks-datetime">{moment(item.createdAt).fromNow()}</span>
                                                    </div>
                                                    <div className="ks-message">{item.text}</div>
                                                </div>
                                            </li>
                                        )
                                    }
                                })
                            }
                        </ul>
                    </div>
                    <div className="jspVerticalBar">
                        <div className="jspCap jspCapTop" />
                        <div className="jspTrack" style={{ height: '481px' }}>
                            <div className="jspDrag" style={{ height: '206px' }}>
                                <div className="jspDragTop" />
                                <div className="jspDragBottom" />
                            </div>
                        </div>
                        <div className="jspCap jspCapBottom" />
                    </div>
                </div>
            </div>
            <div className="ks-footer">
                <textarea onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} value={message} className="form-control" placeholder="Nhập tin nhắn..." defaultValue={""} />
                <div className="ks-controls">
                    <button onClick={() => sendMessage()} className="btn btn-primary">Gửi</button>
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;