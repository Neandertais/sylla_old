import { Button, Form, Input } from "antd"
import logo from "../assets/undraw_2.svg"
import { Link } from "react-router-dom"

export default function SignIn() {
    return (
        <div className="grid grid-cols-[1fr,1.2fr] min-h-screen" >
            <div className="flex items-center justify-center">
                <div className="w-96">
                    <h1 className="font-sans font-bold text-2xl text-center mb-6">Login</h1>
                    <Form
                        layout="vertical"
                        onFinish={(values) => {
                            console.log(values)
                        }}

                    >
                        <Form.Item label="Email" name="email">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Password" name="password">
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="w-full">Entrar</Button>
                            <span className="text-center block mt-6">Não tem conta? <Link to="/signup">Cadastra-se</Link></span>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className="bg-violet-600 flex items-center justify-center">
                <img className="w-5/12" src={logo} alt="" />
            </div>
        </div>
    )
}
