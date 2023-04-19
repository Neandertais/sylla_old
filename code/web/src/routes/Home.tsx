import { Rate } from "antd";
import Header from "../components/Header";
import CourseList from "../components/CourseList";

export default function Home() {
    return (
        <main>
            <Header />
            <CourseList />
            <CourseList />
        </main>
    )
}
