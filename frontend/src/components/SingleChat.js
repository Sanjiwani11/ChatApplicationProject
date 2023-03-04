import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import { io } from 'socket.io-client';

const ENDPOINT = "http://localhost:6000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState();
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);

    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();
    
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);
                //console.log(data);
                setMessages([...messages, data]);
            } catch (error) { 
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            };
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        //Typing Indicator Logic
    };

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            //console.log(messages);
            setMessages(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connection", () => setSocketConnected(true));
    }, []);

    return (
        <>{
            selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "24px", md: "28px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center">
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")} />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    < UpdateGroupChatModal fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                                </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden">
                        {loading ? (
                            <Spinner
                                size="sm"
                                w={10}
                                h={10}
                                alignSelf="center"
                                margin=" auto"/>
                        ) : (
                            <div className='messages'>
                                    <ScrollableChat messages={messages} />
                            </div>    
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt="3">
                            <Input variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message.."
                                onChange={typingHandler}
                                value={ newMessage} />
                        </FormControl>
                    </Box>
                </>
            ) : (
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="2xl" pb="3" fontFamily="Work Sans">Click on a user to start Chatting</Text>
            </Box>
            )}
        </>
    );
}

export default SingleChat;
