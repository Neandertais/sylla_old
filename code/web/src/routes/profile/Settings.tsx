import { Button, Form, Input, Upload } from "antd";
import {
  FacebookOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  GlobalOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

export default function UserPerfil() {
  const user = {
    name: "Alisson Lívio",
    username: "Alivinho",
    biography: "Um otaku perdido",
    profession: "Estudante",
  };

  const onFinish = (values) => {
    console.log("Form values:", values);
  };

  return (
    <div className="max-w-md mx-auto flex flex-col items-center py-12">
      <h1 className="self-start font-bold text-2xl mb-6">Perfil público</h1>
      <div className="mb-6">
        <Upload listType="picture-circle">
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
          {/* <div className="w-full h-full rounded-full overflow-hidden">
            <img src="https://picsum.photos/256/320" className="w-full object-contain"/>
          </div> */}
        </Upload>
      </div>

      <Form
        layout="vertical"
        className="w-full"
        onFinish={onFinish}
        initialValues={user}
      >
        <Form.Item
          label="Name"
          name="name"
          className="font-sans font-bold text-2xl"
        >
          <Input defaultValue={user.name} />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          className="font-sans font-bold text-2xl"
        >
          <Input defaultValue={user.username} />
        </Form.Item>

        <Form.Item
          label="Biography"
          name="biography"
          className="font-sans font-bold text-2xl"
        >
          <TextArea rows={3} defaultValue={user.biography} />
        </Form.Item>

        <Form.Item
          label="Profession"
          name="profession"
          className="font-sans font-bold text-2xl"
        >
          <Input defaultValue={user.profession} />
        </Form.Item>

        <Form.Item
          label="Social Links"
          name="sociaLinks"
          className="font-sans font-bold text-2xl"
        >
          <Input
            addonBefore={<FacebookOutlined />}
            placeholder="Link to social profile"
          />
        </Form.Item>

        <Form.Item name="sociaLinks" className="font-sans font-bold text-2xl">
          <Input
            addonBefore={<LinkedinOutlined />}
            placeholder="Link to social profile"
          />
        </Form.Item>

        <Form.Item name="sociaLinks" className="font-sans font-bold text-2xl">
          <Input
            addonBefore={<InstagramOutlined />}
            placeholder="Link to social profile"
          />
        </Form.Item>

        <Form.Item name="sociaLinks" className="font-sans font-bold text-2xl">
          <Input
            addonBefore={<GlobalOutlined />}
            placeholder="Link to social profile"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
