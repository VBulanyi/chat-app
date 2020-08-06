import React, { useState } from "react";
import { v1 as uuid } from "uuid";

const CreateRoom = (props) => {

    const [name, setName] = useState("")
    // gets username from input
    function handleChange(e) {
        e.preventDefault();
        setName(e.target.value);
    }
    // creates a room with uuid
    function create() {
        localStorage.setItem('name', name)
        const id = uuid();
        props.history.push(`/${id}`);
    }

    return (
        <form onSubmit={create}>
            <input value={name} onChange={handleChange} required placeholder="Enter your name" />
            <button>Create room</button>
        </form>
    );
};

export default CreateRoom;
