## Test project
#
#
# Video conference and text chat
#
#
## Set up project
#
# 1. clone repository
#
# 2. install dependencies: 
#   - server: npm i
#   - client: cd/client npm i
#
# 3. run project:
#   - server: npm run dev
#   - client: cd/client npm run start
#
#
## Implemented:
#
# After opening a page, user should enter his name
# After entering the name user should join new chat room
# There can be several chat rooms at the same time
# User can copy link to the room and send to another user to invite him
# User can send text messages to the chat and all users in the chat will see message
# Users should see who sent message to the chat and when
# Video streaming
#
## To be done:
#
# Users should see who is in the chat room right now
#
#
## Comments:
#
# Since the username is saved in localstorage for correct operation in developer mode, several states of the application must be launched in different browsers
#
#
## Technologies used
#
# node.js for the server side
# socket.io for communication between the client and the server
# React JS for UI
# WebRTC for the video chat part
#