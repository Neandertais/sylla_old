import { AiOutlineBell } from "react-icons/ai"
import { Avatar, Badge, Input } from "antd";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div>
            <header className="shadow-md">
                <div className="flex relative items-center justify-between px-8 py-2 max-w-7xl mx-auto z-10">
                    <h1 className="font-bold font-base">SYLLA</h1>
                    <Input.Search className="absolute left-1/2 -translate-x-1/2 w-80" />
                    <div className="flex gap-6">
                        <Badge count={5} className="flex items-center" size="small" offset={[0, 4]}>
                            <AiOutlineBell size={22} />
                        </Badge>
                        <details className="group">
                            <summary className="list-none group-open:before:content-[''] group-open:before:fixed group-open:before:bottom-0 group-open:before:right-0 group-open:before:top-0 group-open:before:left-0">
                                <Avatar className="cursor-pointer" />
                            </summary>
                            <div className="flex flex-col gap-3 py-3 absolute bg-white shadow-md border w-44 right-4 top-14 rounded-md">
                                <Link className="px-4" to="" >Visualizar Perfil</Link>
                                <Link className="px-4" to="" >Editar Perfil</Link>
                                <div className="border border-t-0 w-full" />
                                <Link className="px-4" to="" >Sair</Link>
                            </div>
                        </details>
                    </div>
                </div>
            </header>
        </div>
    )
}