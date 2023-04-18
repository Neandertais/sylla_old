import { Button, Form, Input } from "antd"
import logo from "../assets/undraw.svg"
import { Link } from "react-router-dom"

export default function SignUp() {
    return (
        <div className="grid grid-cols-[1.2fr,1fr] min-h-screen" >
            <div className="bg-violet-600 flex items-center justify-center">
                <img className="w-3/5" src={logo} alt="" />
            </div>
            <div className="flex items-center justify-center">
                <div className="w-96">
                    <h1 className="font-sans font-bold text-2xl text-center mb-6">Cadastrar</h1>
                    <Form
                        layout="vertical"
                        onFinish={(values) => {
                            console.log(values)
                        }}

                    >
                        <Form.Item label="Username" name="username">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="email">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Password" name="password">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Comfirm Password" name="confirmPassword">
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="w-full">Cadastrar</Button>
                            <span className="text-center block mt-6">Já tem conta? <Link to="/signin">Entre</Link></span>

                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}
