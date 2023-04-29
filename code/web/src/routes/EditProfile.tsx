import React, {useState} from "react";
import { Avatar, Card } from "antd";
import { Button, Form, Input } from "antd";
import { UserOutlined, FacebookOutlined, LinkedinOutlined, InstagramOutlined, GlobalOutlined} from '@ant-design/icons';

import Header from "../components/Header";
import { values } from "lodash-es";



const { TextArea } = Input;


export default function UserPerfil(){
  const user = {
    name:"Alisson Lívio",
    username:"Alivinho",
    biography:"Um otaku perdido",
    profession:"Estudante",
  };

  const onFinish = (values) =>{
    console.log("Form values:", values);
  };


  return(
    
    <div className="mx-auto ">
      <Header />

      <h1 className="font-sans font-bold text-2xl mb-6 mt-6 ml-6">
        Public Profile
      </h1>
      <div className="mb-6 ml-6">
        <Avatar size={150} src={<img src="https://picsum.photos/256/320"/>} /> 
      </div>

      <div>
        <Form
          layout="vertical"
          labelCol={{span:8}}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          className="ml-6"
          onFinish={onFinish}
          initialValues={user}
        >
          <Form.Item label="Name" name="name" className="font-sans font-bold text-2xl">
            <Input 
              defaultValue={user.name} 
            />
          </Form.Item>

          <Form.Item label="Username" name="username" className="font-sans font-bold text-2xl">
            <Input defaultValue={user.username}/>
          </Form.Item>

          <Form.Item label="Biography" name="biography" className="font-sans font-bold text-2xl">
            <TextArea rows={3} defaultValue={user.biography}/>
          </Form.Item>

          <Form.Item label="Profession" name="profession" className="font-sans font-bold text-2xl">
            <Input defaultValue={user.profession}/>
          </Form.Item>

          <Form.Item label="Social Links" name="sociaLinks" className="font-sans font-bold text-2xl">
            <Input addonBefore={<FacebookOutlined />} placeholder="Link to social profile"  />
          </Form.Item>

          <Form.Item name="sociaLinks" className="font-sans font-bold text-2xl">
            <Input addonBefore={<LinkedinOutlined />} placeholder="Link to social profile" />
          </Form.Item>

          <Form.Item name="sociaLinks" className="font-sans font-bold text-2xl">
            <Input addonBefore={<InstagramOutlined />} placeholder="Link to social profile" />
          </Form.Item>

          <Form.Item name="sociaLinks" className="font-sans font-bold text-2xl">
            <Input addonBefore={<GlobalOutlined />} placeholder="Link to social profile" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">Save</Button>
          </Form.Item>


        </Form>
      </div>
      
    </div>
  )
}


  