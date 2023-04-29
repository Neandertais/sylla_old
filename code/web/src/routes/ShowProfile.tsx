import React from "react"
import { Avatar, Card } from "antd";

import { UserOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import { Button, Form, Input } from "antd";
const { TextArea } = Input;


import{UserPerfil} from "./EditProfile";



export default function ShowUser(){
  const inputStyle = { border: 'none' };

  return(
    <div className="grid">
      <Header/>
      <div className="mt-20 mb-6 ml-6">
        <Avatar size={150} src={<img src="https://picsum.photos/256/320"/>} /> 
    </div>
    <div>
      <Form
        layout="vertical"
        labelCol={{span:8}}
        wrapperCol={{ span: 15 }}
        style={{ maxWidth: 600 }}
        className="ml-6"
       
        
        >
        <Form.Item name="name">
          <Input 
              defaultValue={"Alisson Livio"} 
              style={inputStyle}
              className="font-sans font-bold text-2xl"
          />
           <Input name="username"
            defaultValue={"Livinho"}
            style={inputStyle}
            className="font-sans"
          />

          <TextArea name="biography" rows={3} defaultValue={"Um otaku perdido"} style={inputStyle}/>

        </Form.Item>
      </Form>
    </div>
    </div>
    
  )


}