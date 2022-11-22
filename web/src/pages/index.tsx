import { DatePicker, Typography, Spin } from "antd";
import { BsCoin } from "react-icons/bs";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Typography.Title>Sylla</Typography.Title>
      <Typography.Title
        style={{
          display: "flex",
          alignItems: "center",
          columnGap: 15,
          marginTop: 0,
        }}
        level={3}
      >
        Woqs Coin <BsCoin color="#ffff00" size={30} />
      </Typography.Title>
      <Spin
        style={{ marginTop: 80 }}
        indicator={<LoadingOutlined style={{ fontSize: 40 }} />}
      />
    </div>
  );
}
