import { useEffect, useState } from "react";
import { Avatar, Card } from "antd";
import {
  FacebookOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  GlobalOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { Button, Form, Input } from "antd";
import { IUser } from "src/types/user";
import { api } from "src/services/axios";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState<IUser>({} as IUser);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get(`users/${username}`);

        setUser(response.data);
      } catch (error) {}
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto my-12 flex flex-col">
      <div className="flex">
        <div className="flex flex-col flex-1">
          <p className="font-black text-lg text-gray-600">INSTRUTOR</p>
          <h2 className="font-bold text-4xl">
            {user?.name ? user.name : user?.username}
          </h2>
          <p className="mt-2 font-bold text-base">{user?.profession}</p>

          <div className="flex gap-6 mt-auto">
            <div>
              <p className="font-black text-gray-500">Total de alunos</p>
              <p className="font-black text-3xl">5.000</p>
            </div>
            <div>
              <p className="font-black text-gray-500">Avaliações</p>
              <p className="font-black text-3xl">5.000</p>
            </div>
          </div>

          <ul className="flex gap-4 mt-6">
            <li>
              <a href="#">
                <GlobalOutlined style={{ fontSize: 22}} />
              </a>
            </li>
            <li>
              <a href="#">
                <FacebookOutlined style={{ fontSize: 22}}/>
              </a>
            </li>
            <li>
              <a href="#">
                <InstagramOutlined style={{ fontSize: 22}}/>
              </a>
            </li>
            <li>
              <a href="#">
                <LinkedinOutlined style={{ fontSize: 22}}/>
              </a>
            </li>
          </ul>
        </div>
        <Avatar size={180} src={<img src="https://picsum.photos/256/320" />} />
      </div>
      <div>
        <h3 className="mt-6 font-bold text-xl">Sobre</h3>
        <p className="mt-2 text-base">{user?.biography}</p>
      </div>

      <div></div>

      {/* <div className="mt-20 mb-6 ml-6">
      </div>
      <div>
        <Form
          layout="vertical"
          labelCol={{ span: 8 }}
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
            <Input
              name="username"
              defaultValue={"Livinho"}
              style={inputStyle}
              className="font-sans"
            />

            <TextArea
              name="biography"
              rows={3}
              defaultValue={"Um otaku perdido"}
              style={inputStyle}
            />
          </Form.Item>
        </Form>
      </div> */}
    </div>
  );
}
