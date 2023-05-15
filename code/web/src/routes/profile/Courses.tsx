import useSWR from "swr";

import { useAuth } from "@contexts/Authentication";
import CourseDisplay from "@components/course/CourseDisplay";

export default function Courses() {
  const { user } = useAuth();
  const { data, isLoading } = useSWR(`/courses?owner=${user?.username}`);

  if (isLoading) {
    return (
      <div className="animate-pulse py-10">
        <div className="bg-gray-200 rounded-sm w-5/12 h-8 mb-2"></div>
        <div className="bg-gray-200 rounded-sm w-10/12 h-12 mb-10"></div>
        <div className="bg-gray-200 rounded-sm w-8/12 h-20"></div>
      </div>
    );
  }

  const courses: Course[] = data.data;

  return (
    <div className="py-10 max-w-5xl mx-auto">
      <h2 className="font-bold text-2xl mb-10">Meus cursos</h2>
      <div className="flex justify-center flex-wrap gap-12">
        {courses.map((course) => (
          <CourseDisplay key={course.id} course={course} showRate={false} showPrice={false} />
        ))}
      </div>
    </div>
  );
}
