import React, { useState, useEffect } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import VideoChat from '../VideoChat/VideoChat'
import Chat from '../Chat/Chat'

const Container = styled.div`
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const VideoGrid = styled.div`
    width: 65%;
    display: grid;
    padding: 20px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(auto, 1fr);
    grid-gap: 20px;
`;

const ChatBox = styled.div`
    display: flex;
    width: 30%;
`;


const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:8000/';

const Room = (props) => {
    const [name, setName] = useState()
    const [userName, setUsername] = useState()
    const room = props.match.params.room;
    const socket = io.connect(BASE_URL)

    // Join to room with a username stored in localstorage
    useEffect(() => {
        setName(localStorage.getItem('name'))
        socket.emit('join', room, userName);
    }, [socket, room, userName])

    function handleChange(e) {
        e.preventDefault();
        setUsername(e.target.value);
    }

    function create() {
        localStorage.setItem('name', userName)
    }

    return (
        <>
            {name ? (
                <Container>
                    <VideoGrid>
                        <VideoChat room={room} socket={socket} />
                    </VideoGrid>
                    <ChatBox>
                        <Chat room={room} name={name} socket={socket} />
                    </ChatBox>
                </Container >
            ) : (
                    <form onSubmit={create}>
                        <input onChange={handleChange} required placeholder="Enter your name" />
                    </form>

                )
            }

        </>

    )
}

export default Room;
