import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
//import Toast from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
 import { useToast } from '@chakra-ui/react';


const Login = () => {
    
    const [show, setshow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const toast = useToast();
    const handleClick = () => setshow(!show);
    const history = useHistory();

    const submitHandler = async () => {
        if (!email || !password) {
        toast({
            title: "Please Fill all the Feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        return;
        }
        try {
        const config = {
            headers: {
            "Content-type": "application/json",
            },
        };

        const { data } = await axios.post(
            "/api/user/login",
            { email, password },
            config
        );
        toast({
            title: "Login Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        history.push("/chats");
        } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        }
    };

    return (
        <VStack spacing="5px">
          
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    value={email}
                    placeholder="Enter Your Email"
                    onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
        
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
          
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
            >
                Log In
            </Button>
        
        </VStack>
    )
}; 

export default Login; 
