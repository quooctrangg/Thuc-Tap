import React from 'react';
import moment from 'moment';
import { useEffect, useState } from 'react';

function MessageDisscution(props) {
    const [dataRoom, setdataRoom] = useState([])
    const [textSearch, settextSearch] = useState('')
    var count
    let roomList = []

    useEffect(() => {
        if (props.data) {
            loadRoom(props.data)
        }
    }, [props.data])

    let handleClickRoom = (roomId, firstName, lastName) => {
        props.handleClickRoom(roomId, firstName ? firstName : '' + ' ' + lastName ? lastName : '')
    }

    let loadRoom = async (data) => {
        data = data.sort((a, b) => {
            let count1 = 0;
            let count2 = 0;
            a.messageData.forEach((item) => {
                if (item.unRead === 1) count1 = count1 + 1;
            })
            b.messageData.forEach((item) => {
                if (item.unRead === 1) count2 = count2 + 1;
            })
            return count2 - count1;
        })
        setdataRoom(data)
    }

    let handleOnchangeSearch = (e) => {
        settextSearch(e.target.value)
    }

    let handleSearchRoom = (roomList) => {
        dataRoom.forEach((item) => {
            let name = ''
            if (props.isAdmin === true) {
                name = item.userOneData?.firstName + " " + item.userOneData?.lastName
            } else {
                name = item.userTwoData?.firstName + " " + item.userTwoData?.lastName
            }
            if (name.toLowerCase().indexOf(textSearch.toLowerCase()) !== -1) {
                roomList.push(item)
            }
        })
    }

    handleSearchRoom(roomList)

    return (
        <div className="ks-discussions">
            <div className="ks-search">
                <div className="input-icon icon-right icon icon-lg icon-color-primary">
                    <input onChange={(e) => handleOnchangeSearch(e)} value={textSearch} id="input-group-icon-text" type="text" className="form-control" placeholder="Tìm kiếm theo tên" />
                    <span className="icon-addon">
                        <span className="la la-search" />
                    </span>
                </div>
            </div>
            <div className="ks-body ks-scrollable jspScrollable" data-auto-height tabIndex={0}>
                <div className="jspContainer" style={{ width: '339px', height: '550px' }}>
                    <div className="jspPane" style={{ padding: '0px', top: '0px', width: '329px' }}>
                        <ul className="ks-items">
                            {
                                roomList && roomList.length > 0 &&
                                roomList.map((item, index) => {
                                    let userData = {}
                                    count = 0
                                    props.isAdmin === true ? (userData = item.userOneData) : (userData = item.userTwoData)
                                    item.messageData.forEach(element => {
                                        if (element.unRead === 1 && element.userId !== props.userId)
                                            count = count + 1;
                                    });
                                    return (
                                        <li onClick={() => handleClickRoom(item.id, userData?.firstName, userData?.lastName)} key={index} className="ks-item">
                                            <a href="#">
                                                <span className="ks-avatar">
                                                    <img src={userData?.image} width={36} height={36} />
                                                    <span className="badge badge-pill badge-danger ks-badge ks-notify">{count && count > 0 ? count : ''}</span>
                                                </span>
                                                <div className="ks-body">
                                                    <div className="ks-name">
                                                        {userData?.firstName ? userData?.firstName : '' + " " + userData?.lastName ? userData.lastName : ''}
                                                        <span className="ks-datetime">{item.messageData && item.messageData.length > 0 ? moment(item.messageData[item.messageData.length - 1].createdAt).fromNow() : ''}</span>
                                                    </div>
                                                    <div className="ks-message">{item.messageData && item.messageData.length > 0 ? item.messageData[item.messageData.length - 1].text : 'Chưa có tin nhắn'}</div>
                                                </div>
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageDisscution;