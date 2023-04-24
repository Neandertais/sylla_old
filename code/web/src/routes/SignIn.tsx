import { Button, Form, Input } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";

import logo from "../assets/undraw_2.svg";
import { useAuth } from "../contexts/Authentication";
import { api } from "../services/axios";

interface ISignInForm {
  email: string;
  password: string;
}

export default function SignIn() {
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.user) {
    return <Navigate to="/" />;
  }

  async function handleSubmit(form: ISignInForm) {
    try {
      const response = await api.post("/auth/login", {
        ...form,
      });

      const user = await api.get("/users", {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });

      auth.signIn({
        user: user.data,
        token: response.data.token,
      });

      navigate(0);
    } catch (error) {}
  }

  return (
    <div className="grid grid-cols-[1fr,1.2fr] min-h-screen">
      <div className="flex items-center justify-center">
        <div className="w-96">
          <h1 className="font-sans font-bold text-2xl text-center mb-6">
            Login
          </h1>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Entrar
              </Button>
              <span className="text-center block mt-6">
                Não tem conta? <Link to="/signup">Cadastra-se</Link>
              </span>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="bg-violet-600 flex items-center justify-center">
        <img className="w-5/12" src={logo} alt="" />
      </div>
    </div>
  );
}
