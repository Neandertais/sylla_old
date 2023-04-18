import { useRef } from "react";
import CourseDisplay from "./CourseDisplay";

export default function CourseList() {
    const container = useRef<HTMLDivElement>(null)

    function handleNavigateToRight() {
        container.current?.scrollTo(container.current.scrollLeft + 288, 0);
    }

    return (
        <section className="mt-10 px-8 mx-auto max-w-7xl">
            <h2 className="font-bold text-2xl">Novidades</h2>
            <div className="flex mt-8 gap-8 overflow-x-scroll scrollbar-hide scroll-smooth relative" ref={container}>
                <CourseDisplay />
                <CourseDisplay />
                <CourseDisplay />
                <CourseDisplay />
                <CourseDisplay />
                <CourseDisplay />
                <CourseDisplay />
                <CourseDisplay />

                <div onClick={handleNavigateToRight} className="w-10 h-10 bg-blue-500 fixed right-0"></div>
            </div>
        </section>
    )
}