import React from "react";
import { Button, Form, Input, Upload } from "antd";

import { UploadOutlined } from '@ant-design/icons';

import SideBar from "@components/SideBar";


const { TextArea } = Input;



export default function CreateCourse(){
    return(
        <div className="flex flex-col py-10">
            <h1 className="font-sans font-bold text-2xl ml-16">Criar Curso</h1>



            <Form
                layout="vertical"
                className="w-full ml-32 mt-10"
                style={{ maxWidth: 600 }}


            >
                <Form.Item
                    label="Dê um nome para o curso"
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Adicione uma pequena descrição sobre o curso"
                >
                    <TextArea rows={3} ></TextArea>
                </Form.Item>

                <Form.Item
                    label="Adicione uma descrição detalhada sobre o curso"
                >
                    <TextArea rows={3}></TextArea>
                </Form.Item>

                <Form.Item
                    label="O que você vai ensinar no curso"
                >
                    <TextArea rows={3}></TextArea>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" className="mt-8">
                        Criar e adicionar videos
                    </Button>
                </Form.Item>

                <Form.Item label="Adicionar uma capa" className="">
                    <Upload>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </div>
    )
}