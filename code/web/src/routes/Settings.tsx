import SideBar from "@components/SideBar";
import { Content } from "antd/es/layout/layout";

export default function Settings(){
    return(
        <div>
            <SideBar/>
            <Content>
                <h1 className="font-sans font-bold text-2xl ml-16">Configurações</h1>
            </Content>
            

        </div>
        
    )
}