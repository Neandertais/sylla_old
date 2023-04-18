import { Avatar, Input } from "antd";

export default function Home() {
    return (
        <div>
            <header className="flex relative items-center justify-between px-8 py-2 shadow-md">
                    <h1>SYLLA</h1>
                    <Input.Search  className="absolute left-1/2 -translate-x-1/2 w-80"/>
                <div className="flex gap-2">
                    <Avatar/>
                    <Avatar/>
                </div>
            </header>
        </div>
    )
}