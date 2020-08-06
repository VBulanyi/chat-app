import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  background-color: #75c9d1;
  flex-direction: column;
  
`;

const ChatBoard = styled.div`
  display: flex;
  flex-direction: column;
  height: 70%;
  overflow: auto;
  width: 95%;
  border: 1px solid white;
  border-radius: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
`;

const Input = styled.input`
  width: 97%;
  height: 80%;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-top: 10px;
  font-size: 17px;
  background-color: transparent;
  border: 1px solid white;
  outline: none;
  color: #FFF;
  letter-spacing: 1px;
  line-height: 20px;
  ::placeholder {
    color: #FFF;
  }
`;

const Button = styled.button`
  background-color: #FFF;
  width: 100%;
  border: none;
  height: 50px;
  border-radius: 10px;
  color: #46516e;
  font-size: 17px;
`;

const Form = styled.form`
  width: 95%;
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
display: flex;
  width: 45%;
  background-color: #82fc49;
  color: #46516e;
  padding: 10px;
  margin-right: 5px;
  text-align: center;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  width: 45%;
  background-color: transparent;
  color: #FFF;
  border: 1px solid #FFF;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  border-top-left-radius: 10%;
  border-bottom-left-radius: 10%;
`;

function Chat(props) {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // gets user id from server = socket.id
    props.socket.on("your id", id => {
      setYourID(id);
    })

    props.socket.on("message", (message) => {
      receivedMessage(message);
    })
  }, [props.socket]);

  // List of all messages
  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  // Seng current message
  function sendMessage(e) {
    e.preventDefault();
    const messageObject = {
      room: props.room,
      body: message,
      id: yourID,
      name: props.name,
    };
    setMessage("");
    props.socket.emit("send message", messageObject);
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }
  return (
    <Container>
      <ChatBoard>
        {messages.map((message, index) => {
          if (message.id === yourID) {
            return (
              <MyRow key={index}>
                <MyMessage>
                  {`${message.name}: ${message.body}`}
                </MyMessage>
              </MyRow>
            )
          }
          return (
            <PartnerRow key={index}>
              <PartnerMessage>
                {`${message.name}: ${message.body}`}
              </PartnerMessage>
            </PartnerRow>
          )
        })}
      </ChatBoard>
      <Form onSubmit={sendMessage}>
        <Input value={message} onChange={handleChange} placeholder="Type your message..." />
        <Button>Send</Button>
      </Form>
    </Container>
  );
}

export default Chat;
