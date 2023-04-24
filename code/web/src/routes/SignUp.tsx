import { Button, Form, Input } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/Authentication";
import { api } from "../services/axios";

import logo from "../assets/undraw.svg";

interface ISignUpForm {
  username: string;
  password: string;
  email: string;
  password_confirmation: string;
}

export default function SignUp() {
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.user) {
    return <Navigate to="/" />;
  }

  async function handleSubmit(form: ISignUpForm) {
    if (form.password !== form.password_confirmation) return;

    try {
      const response = await api.post("/auth/signup", {
        ...form,
      });

      auth.signIn({
        user: response.data.user,
        token: response.data.token.token,
      });

      navigate(0);
    } catch (error) {}
  }

  return (
    <div className="grid grid-cols-[1.2fr,1fr] min-h-screen">
      <div className="bg-violet-600 flex items-center justify-center">
        <img className="w-3/5" src={logo} alt="" />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-96">
          <h1 className="font-sans font-bold text-2xl text-center mb-6">
            Cadastrar
          </h1>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Username" name="username">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input />
            </Form.Item>
            <Form.Item label="Comfirm Password" name="password_confirmation">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Cadastrar
              </Button>
              <span className="text-center block mt-6">
                Já tem conta? <Link to="/signin">Entre</Link>
              </span>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
