import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useCourseData } from "@/contexts/useCourseData";
import { toast } from "react-toastify";
import axios from "axios";

export default function Unpublish() {
    const { course, setCourse } = useCourseData();
    const [loading, setLoading] = useState(false);

    async function unpublish() {
        try {
            setLoading(true);
            const { data } = await axios.post(
                `/api/courses/${course.id}/unpublish`,
            );

            setCourse(data);

            toast.success("Курс снят с публикации");
        } catch (e) {
            console.log(e);
            toast.error("Ошибка при снятии с публикации");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            disabled={loading}
            variant={"outline"}
            onClick={unpublish}
            className="py-0 h-9 mt-4 border-red-500 text-red-500 bg-transparent hover:text-red-700 hover:border-red-700"
        >
            Снять с публикации
        </Button>
    );
}
