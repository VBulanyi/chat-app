import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import styled from "styled-components";


const StyledVideo = styled.video`
    height: 100%;
    width: 100%;
`;

// Gets an array of peers and renders video
const Video = (props) => {
    const ref = useRef();
    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}

const VideoChat = (props) => {
    const [peers, setPeers] = useState([]);
    const userVideo = useRef();
    const peersRef = useRef([]);

    // Stream handler
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            props.socket.emit("get_users", props.room);
            props.socket.on("all users", users => {
                const peers = [];
                users.forEach(user => {
                    const peer = createPeer(user[0], props.socket.id, stream);
                    peersRef.current.push({
                        peerID: user[0],
                        peer,
                    })
                    peers.push({
                        peer,
                    });
                })
                setPeers(peers);
            })

            props.socket.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })
                setPeers(users => [...users, peer]);
            });

            props.socket.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });

        })
    }, [])

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            props.socket.emit("sending signal", { userToSignal, callerID, signal })
        })
        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            props.socket.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <>
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            {peersRef.current.map((peer, index) => {
                return (
                    <Video key={index} peer={peer.peer} />
                );
            })}
        </>
    )
}

export default VideoChat;
