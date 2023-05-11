import { useState } from "react";
import { Button, Form, Input, Upload } from "antd";
import {
  FacebookOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  GlobalOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { useAuth } from "@contexts/Authentication";
import { fetch } from "@services/api";
import { toBase64 } from "@utils/converts";

export default function UserPerfil() {
  const { user } = useAuth();

  const [avatarFile, setAvatarFile] = useState<File>();
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar && "http://localhost:3333/uploads/" + user.avatar
  );

  async function handleUpdateUser(data: any) {
    const form = new FormData();

    const socialLinks: SocialLink[] = [];
    const socialLinksOptions = {
      facebookLink: {
        platform: "Facebook" as Platforms,
      },
      instagramLink: {
        platform: "Instagram" as Platforms,
      },
      linkedinLink: {
        platform: "LinkedIn" as Platforms,
      },
      websiteLink: {
        platform: "Website" as Platforms,
      },
    };

    for (const [key, value] of Object.entries(data)) {
      const socialLink =
        socialLinksOptions[key as keyof typeof socialLinksOptions];

      if (socialLink && value) {
        socialLinks.push({ ...socialLink, link: value as string });
        continue;
      }

      if (key == "username") {
        value !== user?.username && form.set("username", value as string);
        continue;
      }

      value && form.set(key, value as string);
    }
    avatarFile && form.set("avatar", avatarFile);

    if (socialLinks) {
      await fetch.patch(`users/${user?.username}`, {
        social_links: socialLinks,
      });
    }

    await fetch.patch(`users/${user?.username}`, form);
    location.reload();
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col items-center py-12">
      <h2 className="self-start font-bold text-2xl mb-6">Perfil público</h2>
      <div className="mb-6 flex justify-center">
        <Upload
          listType="picture-circle"
          showUploadList={false}
          customRequest={({ file, onSuccess }) => {
            toBase64(file as File).then((url) => {
              setAvatarUrl(url);
            });

            setAvatarFile(file as File);

            onSuccess && onSuccess(file);
          }}
        >
          {avatarUrl ? (
            <div className="w-full h-full flex items-center justify-center rounded-full overflow-hidden relative">
              <img src={avatarUrl} className="w-full object-contain" />
            </div>
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
        {(avatarFile || avatarUrl) && (
          <p
            className="self-center text-xs text-bold text-blue-500 cursor-pointer"
            onClick={() => {
              setAvatarFile(undefined);
              setAvatarUrl(undefined);
            }}
          >
            Remover
          </p>
        )}
      </div>

      <Form
        layout="vertical"
        className="w-full"
        onFinish={handleUpdateUser}
        requiredMark={false}
        initialValues={user}
      >
        <Form.Item
          label="Nome"
          name="name"
          className="font-sans text-2xl"
          rules={[
            {
              type: "string",
              max: 80,
              message: "O nome deve ter no máximo 80 caracteres",
            },
            {
              type: "string",
              min: 16,
              message: "O nome deve ter no mínimo 16 caracteres",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nome de usuário"
          name="username"
          className="font-sans text-2xl"
          rules={[
            {
              required: true,
              message: "Nome de usuário não pode ficar em branco",
            },
            {
              type: "string",
              max: 28,
              message: "O nome de usuário deve ter no máximo 16 caracteres",
            },
            {
              type: "string",
              min: 8,
              message: "O nome de usuário deve ter pelo menos 8 caracteres",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Biografia"
          name="biography"
          className="font-sans text-2xl"
          rules={[
            {
              type: "string",
              max: 360,
              message: "A biografia deve ter no máximo 360 caracteres",
            },
            {
              type: "string",
              min: 32,
              message: "A biografia deve ter pelo menos 32 caracteres",
            },
          ]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Profissão"
          name="profession"
          className="font-sans text-2xl"
          rules={[
            {
              type: "string",
              max: 80,
              message: "A profissão deve ter no máximo 80 caracteres",
            },
            {
              type: "string",
              min: 4,
              message: "A profissão deve ter pelo menos 4 caracteres",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Redes sociais"
          name="facebookLink"
          className="font-sans text-2xl"
          initialValue={
            user?.socialLinks?.find(({ platform }) => platform === "Facebook")
              ?.link
          }
          rules={[
            {
              pattern: /(^https?:\/\/)?(www\.)?facebook.com\/([\w.]+)/,
              message: "O link não corresponde a um link do facebook válido",
            },
          ]}
        >
          <Input
            addonBefore={<FacebookOutlined />}
            placeholder="https://www.facebook.com/username"
          />
        </Form.Item>

        <Form.Item
          name="linkedinLink"
          className="font-sans text-2xl"
          initialValue={
            user?.socialLinks?.find(({ platform }) => platform === "LinkedIn")
              ?.link
          }
          rules={[
            {
              pattern: new RegExp(/(^https?:\/\/)?(www\.)?linkedin.com\/in\//),
              message: "O link não corresponde a um link do linkedin válido",
            },
          ]}
        >
          <Input
            addonBefore={<LinkedinOutlined />}
            placeholder="https://www.linkedin.com/in/username"
          />
        </Form.Item>

        <Form.Item
          name="instagramLink"
          className="font-sans text-2xl"
          initialValue={
            user?.socialLinks?.find(({ platform }) => platform === "Instagram")
              ?.link
          }
          rules={[
            {
              pattern: /(^https?:\/\/)?(www\.)?instagram.com\/([\w.]+)/,
              message: "O link não corresponde a um link do instagram válido",
            },
          ]}
        >
          <Input
            addonBefore={<InstagramOutlined />}
            placeholder="https://www.instagram.com/username"
          />
        </Form.Item>

        <Form.Item
          name="websiteLink"
          className="font-sans text-2xl"
          initialValue={
            user?.socialLinks?.find(({ platform }) => platform === "Website")
              ?.link
          }
          rules={[
            { type: "url", message: "O link não corresponde a um url válido" },
          ]}
        >
          <Input
            addonBefore={<GlobalOutlined />}
            placeholder="https://www.google.com"
          />
        </Form.Item>

        <Form.Item className="mt-12">
          <Button type="primary" htmlType="submit">
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
