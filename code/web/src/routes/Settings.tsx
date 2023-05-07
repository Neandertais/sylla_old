import LayoutSideBar from "@components/LayoutSideBar";
import { Content } from "antd/es/layout/layout";

export default function Settings() {
  return (
    <LayoutSideBar>
      <Content>
        <h1 className="font-sans font-bold text-2xl ml-16">Configurações</h1>
      </Content>
    </LayoutSideBar>
  );
}
