import { useState } from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import isEmail from "validator/es/lib/isEmail";

import { useAuth } from "@contexts/Authentication";
import { fetch } from "@services/api";

import logo from "@assets/undraw_2.svg";

interface ISignInForm {
  emailOrUsername: string;
  password: string;
}

export default function SignIn() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<string>();

  async function handleSubmit(form: ISignInForm) {
    try {
      const { emailOrUsername, password } = form;

      const email = isEmail(emailOrUsername) ? emailOrUsername : null;
      const username = !email ? emailOrUsername : null;

      console.log(email)

      const response = await fetch.post("/auth/login", {
        email,
        username,
        password,
      });

      auth.signIn({
        token: response.data.token,
      });

      navigate(0);
    } catch (error) {
      setErrors("Email ou senha inválidos");
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr,1.2fr]">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <h1 className="font-sans font-bold text-2xl text-center mb-6">
            Login
          </h1>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Nome de usuário ou email"
              name="emailOrUsername"
              validateStatus={errors && "error"}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Senha"
              name="password"
              validateStatus={errors && "error"}
              help={errors}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full mt-4">
                Entrar
              </Button>
              <span className="text-center block mt-6">
                Não tem conta?{" "}
                <Link className="text-cyan-600" to="/auth/signup">
                  Cadastra-se
                </Link>
              </span>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="bg-violet-600 hidden items-center justify-center lg:flex">
        <img className="w-5/12" src={logo} alt="" />
      </div>
    </div>
  );
}
